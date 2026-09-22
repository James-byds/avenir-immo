// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Utilisé pour les URL canoniques (BaseLayout) et le sitemap.
  site: 'https://www.lavenir-immobilier.be',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});