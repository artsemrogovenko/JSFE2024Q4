import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  server: {
    open: '/src/index.html',
  },
  root: './src/',
  build: {
    minify: false,
    sourcemap: 'inline',
    outDir: "../dist",
  },
})
