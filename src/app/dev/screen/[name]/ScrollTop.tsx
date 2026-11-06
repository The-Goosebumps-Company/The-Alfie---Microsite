"use client";

import { useEffect } from "react";

// Previews always open at the top instead of where the last reload left them.
export function ScrollTop() {
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  return null;
}
