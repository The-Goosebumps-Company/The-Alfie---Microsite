import { copy } from "@/copy";
import { Logo } from "./Shell";

export function Underage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Logo />
      <p role="status" className="mt-12 max-w-[18rem] font-heading text-[28px] leading-tight text-forest">
        {copy.ageGate.underage}
      </p>
    </div>
  );
}
