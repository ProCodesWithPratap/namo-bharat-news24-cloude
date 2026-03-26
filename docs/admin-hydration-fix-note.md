# Admin hydration fix note

The `/admin` route is crashing with React hydration error #418 because the classic custom admin shell is rendered through SSR and then hydrated against browser-normalized HTML.

## Intended code change

Update `src/app/admin/page.tsx` so `ClassicAdminClient` is loaded with `next/dynamic` and `ssr: false`.

Conceptually, the page should:
- keep `requireAdminSession()` on the server
- redirect unauthenticated users to `/payload-admin/login?redirect=/admin`
- render the classic admin client only on the browser side

## Why

`ClassicAdminClient` injects a large static HTML string with `dangerouslySetInnerHTML`, and the classic admin markup contains table structures that the browser normalizes differently during hydration. Loading that shell without SSR avoids the mismatch.
