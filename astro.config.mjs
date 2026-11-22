import { defineConfig } from 'astro/config';

const githubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: 'https://chegom.github.io',
  base: githubPages ? '/ai-soop' : '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
