import Link from "next/link";
import { Logo, Shell } from "./Shell";

export function Placeholder({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <Logo className="w-[96px]" />
      <h1 className="mt-10 font-heading text-[40px] leading-tight text-cream">{title}</h1>
      <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-muted">{children}</div>
      <Link href="/bench" className="mt-8 inline-flex min-h-12 items-center font-label uppercase tracking-[0.18em] text-gold">
        ← Back to The Bench
      </Link>
    </Shell>
  );
}
