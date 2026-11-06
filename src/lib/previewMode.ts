// PREVIEW_MODE=1 (set on the team preview deployment): the full flow works but nothing is saved.
// Remove it once Supabase is connected for launch.
export const isPreviewMode = process.env.PREVIEW_MODE === "1";
