import Link from "next/link";
import { Logo, Shell } from "./Shell";

export function Placeholder({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <Logo className="w-[96px]" />
      <h1 className="script-heading mt-12 text-center text-[52px] text-forest">{title}</h1>
      <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-slate">{children}</div>
      <Link href="/bench" className="eyebrow mt-8 inline-flex min-h-12 items-center text-emerald">
        ← Back to The Bench
      </Link>
    </Shell>
  );
}
