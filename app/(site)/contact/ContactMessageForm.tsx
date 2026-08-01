"use client";

import { useForm } from "@formspree/react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ContactFieldErrors,
  ContactFieldName,
  ENQUIRY_TYPES,
  validateContactForm,
} from "./contact-form.schema";

const FAILURE_MESSAGE =
  "Your message could not be sent. Please review the form or try again later.";
const MISSING_CONFIGURATION_MESSAGE =
  "Online messaging is temporarily unavailable.";
const SUCCESS_MESSAGE = "Thank you. Your message has been sent.";

type ContactMessageFormProps = {
  formId: string;
};

type ContactFormViewProps = {
  configured: boolean;
  failed?: boolean;
  onValidSubmit?: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitting?: boolean;
  succeeded?: boolean;
};

const fieldOrder: ContactFieldName[] = [
  "name",
  "email",
  "subject",
  "message",
  "privacyAccepted",
];

const fieldLabels: Record<ContactFieldName, string> = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
  privacyAccepted: "Privacy acknowledgement",
};

const fieldClassName =
  "mt-2 min-h-11 w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-[rgb(var(--color-fg))]";

function describedBy(
  field: ContactFieldName,
  errors: ContactFieldErrors,
  hintId?: string,
) {
  return [hintId, errors[field] ? `${field}-error` : undefined]
    .filter(Boolean)
    .join(" ") || undefined;
}

function ContactFormView({
  configured,
  failed = false,
  onValidSubmit,
  submitting = false,
  succeeded = false,
}: ContactFormViewProps) {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const submissionLock = useRef(false);

  useEffect(() => {
    if (succeeded) {
      formRef.current?.reset();
      statusRef.current?.focus();
    } else if (failed) {
      statusRef.current?.focus();
    }
  }, [failed, succeeded]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured || submitting || submissionLock.current || !onValidSubmit) {
      return;
    }

    const nextErrors = validateContactForm(new FormData(event.currentTarget));
    const invalidFields = fieldOrder.filter((field) => nextErrors[field]);
    setErrors(nextErrors);

    if (invalidFields.length > 0) {
      window.requestAnimationFrame(() => {
        if (invalidFields.length > 1) {
          summaryRef.current?.focus();
        } else {
          document.getElementById(invalidFields[0])?.focus();
        }
      });
      return;
    }

    submissionLock.current = true;
    try {
      await onValidSubmit(event);
    } finally {
      submissionLock.current = false;
    }
  }

  const errorEntries = fieldOrder.flatMap((field) =>
    errors[field] ? [[field, errors[field]] as const] : [],
  );
  const statusMessage = !configured
    ? MISSING_CONFIGURATION_MESSAGE
    : submitting
      ? "Sending message…"
      : succeeded
        ? SUCCESS_MESSAGE
        : failed
          ? FAILURE_MESSAGE
          : "";

  return (
    <div className="space-y-5">
      {errorEntries.length > 1 ? (
        <div
          aria-labelledby="contact-error-summary-title"
          className="rounded-md border border-red-700 bg-red-50 p-4 text-red-950 dark:bg-red-950/30 dark:text-red-100"
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
        >
          <h3 className="font-semibold" id="contact-error-summary-title">
            There is a problem
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a className="underline" href={`#${field}`}>
                  {fieldLabels[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        aria-live="polite"
        className={statusMessage ? "rounded-md border border-[rgb(var(--color-border))] p-4 text-[rgb(var(--color-fg))]" : "sr-only"}
        ref={statusRef}
        role="status"
        tabIndex={statusMessage ? -1 : undefined}
      >
        {statusMessage}
      </div>

      <form className="contact-message-form space-y-5" noValidate onSubmit={handleSubmit} ref={formRef}>
        <div>
          <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="name">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            aria-describedby={describedBy("name", errors)}
            aria-invalid={errors.name ? "true" : undefined}
            autoComplete="name"
            className={fieldClassName}
            disabled={submitting}
            id="name"
            maxLength={100}
            minLength={2}
            name="name"
            required
            type="text"
          />
          {errors.name ? <p className="mt-2 text-sm text-red-700 dark:text-red-300" id="name-error">{errors.name}</p> : null}
        </div>

        <div>
          <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            aria-describedby={describedBy("email", errors)}
            aria-invalid={errors.email ? "true" : undefined}
            autoComplete="email"
            className={fieldClassName}
            disabled={submitting}
            id="email"
            name="email"
            required
            type="email"
          />
          {errors.email ? <p className="mt-2 text-sm text-red-700 dark:text-red-300" id="email-error">{errors.email}</p> : null}
        </div>

        <div>
          <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="enquiryType">
            Enquiry type
          </label>
          <select className={fieldClassName} defaultValue="General message" disabled={submitting} id="enquiryType" name="enquiryType">
            {ENQUIRY_TYPES.map((enquiryType) => (
              <option key={enquiryType} value={enquiryType}>{enquiryType}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="subject">
            Subject <span aria-hidden="true">*</span>
          </label>
          <input
            aria-describedby={describedBy("subject", errors, "subject-hint")}
            aria-invalid={errors.subject ? "true" : undefined}
            className={fieldClassName}
            disabled={submitting}
            id="subject"
            maxLength={150}
            minLength={3}
            name="subject"
            required
            type="text"
          />
          <p className="mt-2 text-sm text-[rgb(var(--color-fg-muted))]" id="subject-hint">3 to 150 characters.</p>
          {errors.subject ? <p className="mt-2 text-sm text-red-700 dark:text-red-300" id="subject-error">{errors.subject}</p> : null}
        </div>

        <div>
          <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="message">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            aria-describedby={describedBy("message", errors, "message-hint")}
            aria-invalid={errors.message ? "true" : undefined}
            className={`${fieldClassName} min-h-40 resize-y`}
            disabled={submitting}
            id="message"
            maxLength={3000}
            minLength={20}
            name="message"
            required
          />
          <p className="mt-2 text-sm text-[rgb(var(--color-fg-muted))]" id="message-hint">20 to 3000 characters.</p>
          {errors.message ? <p className="mt-2 text-sm text-red-700 dark:text-red-300" id="message-error">{errors.message}</p> : null}
        </div>

        <div className="flex items-start gap-3">
          <input
            aria-describedby={describedBy("privacyAccepted", errors, "privacy-hint")}
            aria-invalid={errors.privacyAccepted ? "true" : undefined}
            className="mt-1 h-5 w-5 shrink-0"
            disabled={submitting}
            id="privacyAccepted"
            name="privacyAccepted"
            required
            type="checkbox"
            value="accepted"
          />
          <div>
            <label className="font-medium text-[rgb(var(--color-fg))]" htmlFor="privacyAccepted">
              Privacy acknowledgement <span aria-hidden="true">*</span>
            </label>
            <p className="mt-1 text-sm text-[rgb(var(--color-fg-muted))]" id="privacy-hint">
              I understand that my details will be used only to respond to this enquiry.
            </p>
            {errors.privacyAccepted ? <p className="mt-2 text-sm text-red-700 dark:text-red-300" id="privacyAccepted-error">{errors.privacyAccepted}</p> : null}
          </div>
        </div>

        <div aria-hidden="true" className="hidden" hidden>
          <label htmlFor="_gotcha">Leave this field empty</label>
          <input autoComplete="off" id="_gotcha" name="_gotcha" tabIndex={-1} type="text" />
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[rgb(var(--color-fg))] px-5 py-2 font-medium text-[rgb(var(--color-bg))] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!configured || submitting}
          type="submit"
        >
          {submitting ? "Sending message…" : "Send message"}
        </button>
      </form>
    </div>
  );
}

function ConfiguredContactMessageForm({ formId }: ContactMessageFormProps) {
  const [state, submit] = useForm(formId);

  return (
    <ContactFormView
      configured
      failed={Boolean(state.errors)}
      onValidSubmit={submit}
      submitting={state.submitting}
      succeeded={state.succeeded}
    />
  );
}

export default function ContactMessageForm({ formId }: ContactMessageFormProps) {
  if (!formId) {
    return <ContactFormView configured={false} />;
  }

  return <ConfiguredContactMessageForm formId={formId} />;
}
