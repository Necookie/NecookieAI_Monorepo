import type { APIRoute } from "astro";
import release from "../../../data/android-release.json";

export const GET: APIRoute = () => {
  if (!release.available) {
    return new Response("The Android release is being prepared. Please try again shortly.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }
  return new Response(null, {
    status: 302,
    headers: { Location: release.url, "Cache-Control": "no-store" },
  });
};
