// Local design preview of one screen, bypassing the age cookie. 404s in production.
import { notFound } from "next/navigation";
import { AgeGate } from "@/components/AgeGate";
import { BenchForm } from "@/components/BenchForm";
import { Shell } from "@/components/Shell";
import { Success } from "@/components/Success";
import { SAMPLE, isDev } from "@/lib/devPreview";
import { ScrollTop } from "./ScrollTop";

export default async function ScreenPreview({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!isDev) notFound();

  const screens: Record<string, React.ReactNode> = {
    age: <AgeGate />,
    form: <BenchForm src="preview" box={null} />,
    success: <Success existing={false} reserve={{ number: SAMPLE.reserveNumber, firstName: SAMPLE.firstName }} />,
  };
  if (!(name in screens)) notFound();
  return (
    <Shell>
      <ScrollTop />
      {screens[name]}
    </Shell>
  );
}
