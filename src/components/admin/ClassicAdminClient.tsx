"use client";

import { useEffect } from "react";
import { classicAdminMarkup } from "@/admin/classic-admin-markup";
import { initClassicAdminPanel } from "@/admin/classic-admin-init";
import "@/admin/classic-admin.css";

export default function ClassicAdminClient() {
  useEffect(() => {
    initClassicAdminPanel();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: classicAdminMarkup }} />;
}
