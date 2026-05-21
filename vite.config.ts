import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const jujurisApiTarget = env.VITE_JUJURIS_PROXY_TARGET ?? 'http://localhost:3001'

  return {
    base: command === 'build' ? '/ju-juris-front/' : '/',
    plugins: [react()],
    server: {
      proxy: {
        '/datajud': {
          target: 'https://api-publica.datajud.cnj.jus.br',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/datajud/, ''),
        },
        '/api': {
          target: jujurisApiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
