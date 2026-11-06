// Page for "/" and "/bench" in the static demo; scripts/build-demo.mjs copies it into place.
import { DemoBench } from "@/components/DemoBench";
import { Shell } from "@/components/Shell";

export default function DemoBenchPage() {
  return (
    <Shell>
      <DemoBench />
    </Shell>
  );
}
