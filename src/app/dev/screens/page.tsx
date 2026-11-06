// Local design board: the three screens side by side at phone size. 404s in production.
import { notFound } from "next/navigation";
import { isDev } from "@/lib/devPreview";
import { ScreensBoard } from "./ScreensBoard";

export const metadata = { title: "Screens · The Bench" };

export default function Screens() {
  if (!isDev) notFound();
  return <ScreensBoard />;
}
