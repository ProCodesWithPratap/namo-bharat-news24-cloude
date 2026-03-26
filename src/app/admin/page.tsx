import { redirect } from "next/navigation";

import ClassicAdminClientNoSSR from "@/components/admin/ClassicAdminClientNoSSR";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/payload-admin/login?redirect=/admin");
  }

  return <ClassicAdminClientNoSSR />;
}
