import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    strictPort: true,
    allowedHosts: [
      'work-1-wlchmmxscsqcgsuy.prod-runtime.all-hands.dev',
      'work-2-wlchmmxscsqcgsuy.prod-runtime.all-hands.dev',
      'localhost'
    ],
  },
})
