"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const path = window.location.pathname;

      if (url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com")) {
        track("demo_click", { path });
      }

      if (url.hash === "#pricing") {
        track("pricing_click", { path });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
