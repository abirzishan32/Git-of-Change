import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      // In development the API is reached through this proxy, so the browser
      // only ever talks to one origin and VITE_API_URL can stay empty.
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: false,
    },
  };
});
