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
    plugins: [tailwindcss()]
  }
});