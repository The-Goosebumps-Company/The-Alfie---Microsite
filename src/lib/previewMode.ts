// PREVIEW_MODE=1 (set on the team preview deployment): the full flow works but nothing is saved.
// Remove it once Supabase is connected for launch.
// The static demo is always a preview too.
export const isPreviewMode = process.env.PREVIEW_MODE === "1" || process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
