// Sample data for the local design previews under /dev. Never served in production.
export const isDev = process.env.NODE_ENV !== "production";

export const SAMPLE_TICKET_ID = "sample";

export const SAMPLE = {
  firstName: "Thandi",
  surname: "Mokoena",
  squadNumber: 427,
  fanType: "passionate" as const,
};
