import Image from "next/image";
import Link from "next/link";
import { config } from "@/config";
import { copy } from "@/copy";

function Touchline() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-[10px] z-0 border border-gold/70">
      <span className="absolute -left-[4px] top-[46%] h-[7px] w-[7px] rounded-full bg-gold" />
      <span className="absolute -left-[4px] top-[54%] h-[7px] w-[7px] rounded-full bg-gold" />
      <span className="absolute -right-[4px] top-[46%] h-[7px] w-[7px] rounded-full bg-gold" />
      <span className="absolute -right-[4px] top-[54%] h-[7px] w-[7px] rounded-full bg-gold" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 text-center font-body text-[12px] leading-relaxed text-muted">
      <p>{copy.footer.responsible}</p>
      <p className="mt-2">
        <Link href={config.privacyUrl} className="underline underline-offset-4 hover:text-cream">
          {copy.footer.privacy}
        </Link>
        <span className="mx-2 text-gold">·</span>
        <Link href={config.termsUrl} className="underline underline-offset-4 hover:text-cream">
          {copy.footer.terms}
        </Link>
      </p>
    </footer>
  );
}

export function Logo({ className = "w-[120px]" }: { className?: string }) {
  return (
    <Image
      src="/alfie-lockup-white.png"
      alt="The Alfie"
      width={600}
      height={520}
      priority
      className={`mx-auto h-auto ${className}`}
    />
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pitch relative min-h-dvh">
      <Touchline />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-[30rem] flex-col px-7 pb-8 pt-9">
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
