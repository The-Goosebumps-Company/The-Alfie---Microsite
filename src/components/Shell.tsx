import Image from "next/image";
import Link from "next/link";
import { config } from "@/config";
import { copy } from "@/copy";
import { asset } from "@/lib/staticDemo";

// Confirmed partner lockup, shown under The Alfie: Heineken ★ × Marble Hospitality × G&G,
// in forest green on the ivory page. Heights are tuned by eye so the three carry equal weight.
const PARTNERS = [
  { src: "/partners/heineken-green.png", alt: "Heineken", width: 751, height: 160, className: "h-[16px]" },
  { src: "/partners/marble-green.png", alt: "Marble Hospitality", width: 620, height: 160, className: "h-[20px]" },
  { src: "/partners/gg-green.png", alt: "G&G The Goosebumps Company", width: 493, height: 160, className: "h-[22px]" },
];

function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="h-[8px] w-[8px] shrink-0 text-forest/70">
      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

function Partners() {
  return (
    <div aria-label={copy.footer.partners} role="group" className="mt-6 flex items-center justify-center gap-3.5">
      {PARTNERS.map((p, i) => (
        <span key={p.src} className="flex items-center gap-3.5">
          {i > 0 && <Cross />}
          <Image src={asset(p.src)} alt={p.alt} width={p.width} height={p.height} className={`w-auto ${p.className}`} />
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 text-center font-body text-[12px] leading-relaxed text-slate">
      <p>{copy.footer.responsible}</p>
      <p className="mt-2">
        <Link href={config.privacyUrl} className="underline decoration-forest/30 underline-offset-4 hover:text-forest">
          {copy.footer.privacy}
        </Link>
        <span className="mx-2 text-forest/40">·</span>
        <Link href={config.termsUrl} className="underline decoration-forest/30 underline-offset-4 hover:text-forest">
          {copy.footer.terms}
        </Link>
      </p>
    </footer>
  );
}

// The brand introduction on every screen: The Alfie lockup with the partners beneath it.
export function Logo({ className = "w-[118px]" }: { className?: string }) {
  return (
    <div>
      <Image
        src={asset("/alfie-lockup-green.png")}
        alt="The Alfie"
        width={704}
        height={520}
        priority
        className={`mx-auto h-auto ${className}`}
      />
      <Partners />
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ivory">
      <div className="mx-auto flex min-h-dvh max-w-[30rem] flex-col px-5 pb-8 pt-8">
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
