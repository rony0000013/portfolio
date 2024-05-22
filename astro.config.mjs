import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  markdown: {},
  integrations: [solidJs(), tailwind(), icon(), mdx(), sitemap(), partytown()]
});