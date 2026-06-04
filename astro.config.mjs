// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Node adapter required for server-rendered API routes
  adapter: node({ mode: 'standalone' }),
  output: 'server',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        // Allow 'unsafe-eval' so Vite's HMR & source maps work in dev.
        // In production, serve behind a reverse proxy with a stricter CSP.
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data:",
          "connect-src 'self' ws: wss:",
        ].join('; '),
      },
    },
  },
});