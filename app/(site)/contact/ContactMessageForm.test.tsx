import { readFileSync } from "node:fs";
import { join } from "node:path";
import { useForm } from "@formspree/react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import ContactMessageForm from "./ContactMessageForm";

jest.mock("@formspree/react", () => ({
  useForm: jest.fn(),
}));

const mockedUseForm = jest.mocked(useForm);

function mockFormspreeState(
  overrides: Partial<ReturnType<typeof useForm>[0]> = {},
) {
  const submit = jest.fn().mockResolvedValue(undefined);
  mockedUseForm.mockReturnValue([
    {
      errors: null,
      result: null,
      submitting: false,
      succeeded: false,
      ...overrides,
    },
    submit,
    jest.fn(),
  ]);
  return submit;
}

async function completeValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email/i), "ada@example.test");
  await user.selectOptions(screen.getByLabelText(/enquiry type/i), "Collaboration");
  await user.type(screen.getByLabelText(/subject/i), "Accessible portfolio form");
  await user.type(
    screen.getByLabelText(/message/i),
    "I would like to discuss this accessible contact form.",
  );
  await user.click(screen.getByLabelText(/privacy acknowledgement/i));
}

beforeEach(() => {
  mockedUseForm.mockReset();
});

test("renders the required fields with visible labels and autocomplete attributes", () => {
  mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);

  expect(screen.getByLabelText(/name/i)).toHaveAttribute("required");
  expect(screen.getByLabelText(/name/i)).toHaveAttribute("autocomplete", "name");
  expect(screen.getByLabelText(/email/i)).toHaveAttribute("required");
  expect(screen.getByLabelText(/email/i)).toHaveAttribute("autocomplete", "email");
  expect(screen.getByLabelText(/subject/i)).toHaveAttribute("required");
  expect(screen.getByLabelText(/message/i)).toHaveAttribute("required");
  expect(screen.getByLabelText(/privacy acknowledgement/i)).toHaveAttribute("required");
  expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
});

test("renders every enquiry option", () => {
  mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);

  expect(
    within(screen.getByLabelText(/enquiry type/i)).getAllByRole("option").map((option) => option.textContent),
  ).toEqual([
    "Project enquiry",
    "Professional opportunity",
    "Collaboration",
    "General message",
  ]);
});

test("shows linked field errors and an accessible summary for empty required fields", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);

  await user.click(screen.getByRole("button", { name: "Send message" }));

  const summary = await screen.findByRole("alert");
  expect(summary).toHaveTextContent("There is a problem");
  expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-describedby", "name-error");
  expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Enter a subject.")).toHaveAttribute("id", "subject-error");
  expect(screen.getByText("Enter a message.")).toHaveAttribute("id", "message-error");
  expect(summary).toHaveFocus();
  expect(submit).not.toHaveBeenCalled();
});

test("rejects an invalid email address", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);
  await user.clear(screen.getByLabelText(/email/i));
  await user.type(screen.getByLabelText(/email/i), "not-an-email");

  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  await waitFor(() => expect(screen.getByLabelText(/email/i)).toHaveFocus());
  expect(submit).not.toHaveBeenCalled();
});

test("rejects a message shorter than 20 characters", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);
  await user.clear(screen.getByLabelText(/message/i));
  await user.type(screen.getByLabelText(/message/i), "Too short");

  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(await screen.findByText("Message must be between 20 and 3000 characters.")).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

test("requires the privacy acknowledgement", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);
  await user.click(screen.getByLabelText(/privacy acknowledgement/i));

  await user.click(screen.getByRole("button", { name: "Send message" }));

  expect(
    await screen.findByText("Confirm that your details may be used to respond to your enquiry."),
  ).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

test("submits from the keyboard after local validation passes", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);

  screen.getByRole("button", { name: "Send message" }).focus();
  await user.keyboard("{Enter}");

  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
});

test("announces pending state and blocks duplicate submission", async () => {
  const user = userEvent.setup();
  let finishSubmission: (() => void) | undefined;
  const submit = jest.fn(
    () => new Promise<void>((resolve) => {
      finishSubmission = resolve;
    }),
  );
  mockedUseForm.mockReturnValue([
    { errors: null, result: null, submitting: false, succeeded: false },
    submit,
    jest.fn(),
  ]);
  const { rerender } = render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);

  await user.click(screen.getByRole("button", { name: "Send message" }));
  fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);
  expect(submit).toHaveBeenCalledTimes(1);

  mockedUseForm.mockReturnValue([
    { errors: null, result: null, submitting: true, succeeded: false },
    submit,
    jest.fn(),
  ]);
  rerender(<ContactMessageForm formId="configured-id" />);
  expect(screen.getByRole("status")).toHaveTextContent("Sending message…");
  expect(screen.getByRole("button", { name: "Sending message…" })).toBeDisabled();

  finishSubmission?.();
});

test("confirmed success resets values and moves focus to the success status", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  const { rerender } = render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);

  mockedUseForm.mockReturnValue([
    { errors: null, result: { kind: "success", next: "" }, submitting: false, succeeded: true },
    submit,
    jest.fn(),
  ]);
  rerender(<ContactMessageForm formId="configured-id" />);

  const status = await screen.findByRole("status");
  expect(status).toHaveTextContent("Thank you. Your message has been sent.");
  await waitFor(() => expect(status).toHaveFocus());
  expect(screen.getByLabelText(/name/i)).toHaveValue("");
  expect(screen.getByLabelText(/privacy acknowledgement/i)).not.toBeChecked();
});

test("service failure preserves values and moves focus to a safe failure status", async () => {
  const user = userEvent.setup();
  const submit = mockFormspreeState();
  const { rerender } = render(<ContactMessageForm formId="configured-id" />);
  await completeValidForm(user);

  mockedUseForm.mockReturnValue([
    {
      errors: {} as ReturnType<typeof useForm>[0]["errors"],
      result: null,
      submitting: false,
      succeeded: false,
    },
    submit,
    jest.fn(),
  ]);
  rerender(<ContactMessageForm formId="configured-id" />);

  const status = screen.getByRole("status");
  expect(status).toHaveTextContent(
    "Your message could not be sent. Please review the form or try again later.",
  );
  await waitFor(() => expect(status).toHaveFocus());
  expect(screen.getByLabelText(/name/i)).toHaveValue("Ada Lovelace");
  expect(screen.getByLabelText(/message/i)).toHaveValue(
    "I would like to discuss this accessible contact form.",
  );
});

test("missing configuration renders the form but disables submission truthfully", () => {
  render(<ContactMessageForm formId="" />);

  expect(screen.getByLabelText(/name/i)).toBeEnabled();
  expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Online messaging is temporarily unavailable.",
  );
  expect(mockedUseForm).not.toHaveBeenCalled();
});

test("includes a hidden honeypot outside the normal tab order", () => {
  const { container } = render(<ContactMessageForm formId="" />);
  const honeypot = container.querySelector<HTMLInputElement>('input[name="_gotcha"]');

  expect(honeypot).toBeInTheDocument();
  expect(honeypot).not.toBeVisible();
  expect(honeypot).toHaveAttribute("tabindex", "-1");
});

test("has no automated accessibility violations in the unconfigured state", async () => {
  const { container } = render(<ContactMessageForm formId="" />);

  expect(await axe(container)).toHaveNoViolations();
});

test("does not introduce a public email, secret, or placeholder form ID", () => {
  const sourceFiles = [
    "app/(site)/contact/page.tsx",
    "app/(site)/contact/ContactMessageForm.tsx",
    ".env.example",
  ].map((path) => readFileSync(join(process.cwd(), path), "utf8")).join("\n");

  expect(sourceFiles).not.toMatch(/mailto:/i);
  expect(sourceFiles).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  expect(sourceFiles).not.toMatch(/your[_-]?form[_-]?id|placeholder[_-]?form|<real-id>/i);
  expect(readFileSync(join(process.cwd(), ".env.example"), "utf8")).toMatch(
    /NEXT_PUBLIC_FORMSPREE_FORM_ID=\s*$/,
  );
});
