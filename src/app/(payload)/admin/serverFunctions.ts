"use server";

import { handleServerFunctions } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./importMap";

export async function serverFunctions(args: { name: string; args: Record<string, unknown> }) {
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
}
