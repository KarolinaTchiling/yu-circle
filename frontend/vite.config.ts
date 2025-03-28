import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // proxies any api requests to database, prevents direct code exposure (and makes it easier to point elsewhere)
      '/profiles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/messages': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/messages/send': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/messages/get': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/messages/delete': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      
         '/notificationProxy': {
          target: 'http://localhost:8085',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/notificationProxy/, '/notification')
        },
    },
  },
});
