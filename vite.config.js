import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/llm-assist-signal-app/' : '/',
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL'
    },
    strictPort: false,
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 12000,
    host: '0.0.0.0',
    allowedHosts: true
  }
})
