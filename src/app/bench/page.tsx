import { cookies } from "next/headers";
import { AgeGate } from "@/components/AgeGate";
import { BenchForm } from "@/components/BenchForm";
import { Shell } from "@/components/Shell";
import { Underage } from "@/components/Underage";
import { AGE_COOKIE, BLOCK_COOKIE, readAgeCookie } from "@/lib/ageCookie";
import { cleanSource, cleanTag } from "@/lib/source";

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function BenchPage({ searchParams }: { searchParams: Search }) {
  const [jar, params] = await Promise.all([cookies(), searchParams]);

  if (jar.get(BLOCK_COOKIE)) {
    return <Shell><Underage /></Shell>;
  }
  if (!readAgeCookie(jar.get(AGE_COOKIE)?.value)) {
    return <Shell><AgeGate /></Shell>;
  }
  return (
    <Shell>
      <BenchForm src={cleanSource(params.src)} box={cleanTag(params.box)} />
    </Shell>
  );
}
