import { RootLayout } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./admin/importMap";
import { serverFunctions } from "./admin/serverFunctions";
import "@payloadcms/next/css";
import "@/payload/admin/styles/admin-theme.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction: serverFunctions,
  });
}
