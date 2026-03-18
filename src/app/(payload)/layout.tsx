import { RootLayout } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./admin/importMap";
import { serverFunctions } from "./admin/serverFunctions";
import "@payloadcms/next/css";
import "@/payload/admin/styles/admin-theme.css";

const isAdminConfigured = Boolean(process.env.DATABASE_URI?.trim());

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!isAdminConfigured && process.env.NODE_ENV !== "production") {
    return (
      <html lang="en">
        <body className="min-h-screen bg-slate-950 text-white">
          <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Admin setup required</p>
              <h1 className="mt-3 text-3xl font-bold">Payload admin is unavailable until a database is configured.</h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Set the <code className="rounded bg-black/30 px-2 py-1 text-sm">DATABASE_URI</code> environment variable and
                restart the app to enable the admin panel and API collections.
              </p>
            </div>
          </main>
        </body>
      </html>
    );
  }

  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction: serverFunctions,
  });
}
