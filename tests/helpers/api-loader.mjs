// Run the real API handlers against an isolated local libSQL database.
// Clerk is tested separately on a device; handlers receive explicit test identities.
export async function resolve(specifier, context, nextResolve) {
  if (context.parentURL && specifier.startsWith('.')) {
    const url = new URL(specifier, context.parentURL);
    if (/\/src\/lib\/db\/client(?:\.ts)?$/.test(url.pathname)) {
      return nextResolve(new URL('./database.ts', import.meta.url).href, context);
    }
    if (url.pathname.includes('/src/') && !/\.[a-z]+$/i.test(url.pathname)) {
      return nextResolve(`${specifier}.ts`, context);
    }
  }
  return nextResolve(specifier, context);
}
