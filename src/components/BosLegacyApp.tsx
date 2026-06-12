"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LoadingOverlay from "./app/LoadingOverlay";
import LoginPanel from "./app/LoginPanel";
import MainAppShell from "./app/MainAppShell";
import ModalRoot from "./app/ModalRoot";
import ToastRoot from "./app/ToastRoot";

declare global {
  interface Window {
    __BOS_CONFIG__?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
    supabase?: unknown;
    jspdf?: unknown;
  }
}

export default function BosLegacyApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    window.__BOS_CONFIG__ = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    window.supabase = { createClient };

    let cancelled = false;

    const loadAppScript = () => {
      if (cancelled || document.getElementById("bos-app-script")) return;

      if (!window.supabase) {
        window.setTimeout(loadAppScript, 50);
        return;
      }

      const script = document.createElement("script");
      script.id = "bos-app-script";
      script.src = `/bos-app.js?v=${Date.now()}`;
      script.async = false;
      document.body.appendChild(script);
    };

    loadAppScript();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <img id="bos-pdf-logo" src="/bos-logo.jpeg" alt="" style={{ display: "none" }} aria-hidden="true" />
      <img id="blake-pdf-logo" src="/blake-hydraulics-logo.png" alt="" style={{ display: "none" }} aria-hidden="true" />
      <img id="kpi-pdf-logo" src="/blake-hydraulics-logo.png" alt="" style={{ display: "none" }} aria-hidden="true" />
      <LoadingOverlay />
      <ToastRoot />
      <LoginPanel />
      <MainAppShell />
      <ModalRoot />
    </>
  );
}
