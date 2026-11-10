"use client";

// Static demo only: the /bench flow without a server. The age pass lives in sessionStorage,
// so closing the tab brings the age gate back.
import { useEffect, useState } from "react";
import { DEMO_AGE_KEY as KEY } from "@/lib/client/api";
import { AgeGate } from "./AgeGate";
import { BenchForm } from "./BenchForm";


export function DemoBench() {
  const [passed, setPassed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setPassed(sessionStorage.getItem(KEY) === "ok");
    } catch {
      setPassed(false);
    }
  }, []);

  if (passed === null) return null; // avoid flashing the age gate before storage is read
  if (!passed) {
    return (
      <AgeGate
        onPassed={() => {
          try {
            sessionStorage.setItem(KEY, "ok");
          } catch {}
          setPassed(true);
        }}
      />
    );
  }
  const src = new URLSearchParams(window.location.search).get("src") ?? "demo";
  return <BenchForm src={src} box={null} />;
}
