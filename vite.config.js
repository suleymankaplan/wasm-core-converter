import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postCssPxToRem from 'postcss-pxtorem'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      devOptions: {
        enabled: false,
        type: 'module'
      },
      manifest: {
        name: 'Wasm Universal Converter',
        short_name: 'WasmConv',
        description: 'Güvenli ve İstemci Taraflı Dosya Dönüştürücü',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: [
          'index.html',
            '**/*.{js,css,html,wasm,png,svg,ico,json}'
        ],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        navigateFallback: '/wasm-core-converter/index.html',
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globDirectory: 'dist', 
      }
    })
  ],

  base: '/wasm-core-converter/',
  build:{
    outDir:'dist',
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },  
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 16,
          propList: ['*'],
          minPixelValue: 2,
        })
      ]
    }
  },
})
