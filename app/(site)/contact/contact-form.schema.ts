export const ENQUIRY_TYPES = [
  "Project enquiry",
  "Professional opportunity",
  "Collaboration",
  "General message",
] as const;

export type ContactFieldName =
  | "name"
  | "email"
  | "subject"
  | "message"
  | "privacyAccepted";

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactForm(formData: FormData): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = textValue(formData, "name");
  const email = textValue(formData, "email");
  const subject = textValue(formData, "subject");
  const message = textValue(formData, "message");

  if (!name) {
    errors.name = "Enter your name.";
  } else if (name.length < 2 || name.length > 100) {
    errors.name = "Name must be between 2 and 100 characters.";
  }

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!subject) {
    errors.subject = "Enter a subject.";
  } else if (subject.length < 3 || subject.length > 150) {
    errors.subject = "Subject must be between 3 and 150 characters.";
  }

  if (!message) {
    errors.message = "Enter a message.";
  } else if (message.length < 20 || message.length > 3000) {
    errors.message = "Message must be between 20 and 3000 characters.";
  }

  if (formData.get("privacyAccepted") !== "accepted") {
    errors.privacyAccepted = "Confirm that your details may be used to respond to your enquiry.";
  }

  return errors;
}
