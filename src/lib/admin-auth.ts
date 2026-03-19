import configPromise from "@payload-config";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";

export async function getAdminSession(headers?: Headers) {
  const payload = await getPayload({ config: configPromise });
  const authHeaders = headers ?? new Headers(await nextHeaders());
  const result = await payload.auth({ headers: authHeaders });

  return {
    payload,
    permissions: result.permissions,
    user: result.user,
  };
}

export async function requireAdminSession(headers?: Headers) {
  const session = await getAdminSession(headers);

  if (!session.user || session.user.isActive === false) {
    return null;
  }

  return session;
}
