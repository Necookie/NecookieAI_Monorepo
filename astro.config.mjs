import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  output: 'server',

  integrations: [react(), clerk()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          '**/*.db', 
          '**/*.db-*', 
          '**/*.sqlite', 
          '**/*.sqlite-*', 
          '**/.data/**', 
          '**/.data', 
          './.data/**', 
          '.data/**', 
          '.data'
        ]
      }
    }
  },
});