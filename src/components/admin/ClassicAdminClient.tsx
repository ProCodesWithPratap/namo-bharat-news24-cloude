"use client";

import { useEffect, useRef } from "react";
import { classicAdminMarkup } from "@/admin/classic-admin-markup";
import { initClassicAdminPanel } from "@/admin/classic-admin-init";
import "@/admin/classic-admin.css";

export default function ClassicAdminClient() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initClassicAdminPanel();
  }, []);

  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: classicAdminMarkup }} />;
}
