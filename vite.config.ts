import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/fishball-workbench/',
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '渔宝源鱼丸店 · AI工作台',
        short_name: '鱼丸工作台',
        description: '渔宝源鱼丸店AI智能工作台，支持多人协作管理采购、生产、销售、配送、财务、内容创作',
        theme_color: '#E85D3C',
        background_color: '#FEF3EF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/fishball-workbench/',
        start_url: '/fishball-workbench/',
        lang: 'zh-CN',
        dir: 'ltr',
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          { src: '/fishball-workbench/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/fishball-workbench/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/fishball-workbench/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
