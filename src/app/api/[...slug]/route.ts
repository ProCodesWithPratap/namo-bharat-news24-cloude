import { handleRequest } from "@payloadcms/next/handlers";
import configPromise from "@payload-config";

export const GET = handleRequest(configPromise);
export const POST = handleRequest(configPromise);
export const PATCH = handleRequest(configPromise);
export const PUT = handleRequest(configPromise);
export const DELETE = handleRequest(configPromise);
