"use client";

import dynamic from "next/dynamic";

const ClassicAdminClient = dynamic(() => import("@/components/admin/ClassicAdminClient"), {
  ssr: false,
  loading: () => null,
});

export default function ClassicAdminClientNoSSR() {
  return <ClassicAdminClient />;
}
