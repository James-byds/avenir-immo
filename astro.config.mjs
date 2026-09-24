// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Utilisé pour les URL canoniques (BaseLayout) et le sitemap.
  site: 'https://www.lavenir-immobilier.be',

  integrations: [react()],

  // Corps Markdown rendus tels qu'écrits (vague D) : la recette compare les
  // articles à leur référence par points de code — pas de guillemets ni
  // d'apostrophes « intelligents » substitués à la copie validée.
  markdown: { smartypants: false },

  vite: {
    plugins: [tailwindcss()],
  },
});