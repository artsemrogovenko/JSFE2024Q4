import { defineConfig ,loadEnv} from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');

export default defineConfig({
  base: env.VITE_BASE || '/',
  define: {
    'import.meta.env.VITE_BASE': JSON.stringify(env.VITE_BASE),
  },
  server: {
    open: '/',
  },
  root: './src/',
  build: {
    minify: false,
    outDir: '../dist',
    assetsDir: './assets/',
    assetsInclude: ['**/*.*'],
  },
});