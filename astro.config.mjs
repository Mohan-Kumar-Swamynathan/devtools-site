import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://devtool.site',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
      serialize: (item) => {
        if (item.url === 'https://devtool.site/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Higher priority for tool pages
        if (item.url.includes('/json-formatter') || 
            item.url.includes('/base64') || 
            item.url.includes('/jwt')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        return { ...item, priority: 0.8, changefreq: 'weekly' };
      }
    })
  ],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild', // Use esbuild instead of terser (faster, no extra dependency)
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'prism-vendor': ['prism-react-renderer'],
            'reactflow-vendor': ['reactflow']
          }
        },
        onwarn(warning, warn) {
          // Suppress eval warnings from onnxruntime-web (transitive dependency of @xenova/transformers)
          if (warning.code === 'EVAL' && warning.id?.includes('onnxruntime-web')) {
            return;
          }
          warn(warning);
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'prism-react-renderer', 'reactflow']
    }
  },
  image: {
    domains: ['devtool.site']
  }
});


