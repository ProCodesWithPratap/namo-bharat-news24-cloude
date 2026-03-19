import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

import { requireAdminSession } from "@/lib/admin-auth";

const ALLOWED_STATUSES = ["draft", "in-review", "ready", "published", "unpublished"] as const;

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request.headers);

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown) => typeof id === "string" && id.trim()) : [];
    const status = typeof body?.status === "string" ? body.status : "";

    if (!ids.length) {
      return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    let succeeded = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await payload.update({
          collection: "articles",
          id,
          data: {
            status,
            ...(status === "published" ? { publishDate: new Date().toISOString() } : {}),
          },
          req: {
            headers: request.headers,
            user: session.user,
          } as any,
        });
        succeeded += 1;
      } catch {
        failed += 1;
      }
    }

    return NextResponse.json({ succeeded, failed, total: ids.length });
  } catch {
    return NextResponse.json({ error: "Unable to update article statuses" }, { status: 500 });
  }
}
