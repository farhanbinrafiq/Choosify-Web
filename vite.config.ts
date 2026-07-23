import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return { 
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'apple-touch-icon.png',
          'masked-icon.svg',
          'brand/choosify-logo-icon.svg',
          'brand/choosify-logo-icon-app.png',
          'og/og-image-v2.png',
          'og/default.png',
        ],
        manifest: {
          name: 'Choosify.bd — Verified Brand Discovery',
          short_name: 'Choosify',
          description: 'Bangladesh\'s only verified brand and product discovery platform. Buy with confidence — every brand on Choosify is verified.',
          theme_color: '#000435',
          background_color: '#000435',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icons/icon-48x48.png',
              sizes: '48x48',
              type: 'image/png'
            },
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png'
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png'
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/icons/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Browse Products',
              short_name: 'Products',
              description: 'Browse all verified products',
              url: '/products',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            },
            {
              name: 'Browse Brands',
              short_name: 'Brands',
              description: 'Explore verified brands',
              url: '/brands',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            },
            {
              name: 'Deals',
              short_name: 'Deals',
              description: 'Today\'s best deals',
              url: '/deals',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            }
          ],
          categories: ['shopping', 'lifestyle', 'business'],
          lang: 'en-BD'
        },
        workbox: {
          // Cache strategy: app shell + static assets
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'
          ],
          
          // Runtime caching rules
          runtimeCaching: [
            {
              // Cache Google Fonts stylesheet
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache Google Fonts files
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache Unsplash images (product/brand images)
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'unsplash-images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache CDN assets (Swiper, etc.)
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 90 // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Document navigations only — never cache hashed JS/CSS as "pages"
              // (a broad domain NetworkFirst was serving stale shells after deploys).
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 1 day
                },
                networkTimeoutSeconds: 3,
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ],

          // Skip waiting — activate new service worker immediately
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,

          // Offline fallback page — never fall back for APIs or file extensions
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/assets\//, /\/[^/?]+\.[^/]+$/]
        },
        
        // Dev options — enable PWA in development for testing
        devOptions: {
          enabled: false,
          type: 'module'
        }
      })
    ],


    resolve: {
      alias: {
        '@': path.resolve("./src"),
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },

    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch:
        process.env.DISABLE_HMR === 'true'
          ? undefined
          : {
              // Large hero videos / temp icon dumps can lock on Windows and crash Vite's FS watcher.
              ignored: ['**/public/hero/**/*.mp4', '**/tmp-svg-icons/**'],
            },
    },
  };
});
