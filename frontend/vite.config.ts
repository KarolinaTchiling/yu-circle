import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

const env = loadEnv('', process.cwd()); // mode is left as an empty string

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/profiles': {
        target: env.VITE_PROFILES_URL,
        changeOrigin: true,
        secure: false,
      },
      '/messages': {
        target: env.VITE_MESSAGES_URL,
        changeOrigin: true,
        secure: false,
      },
      '/messages/send': {
        target: env.VITE_MESSAGES_URL,
        changeOrigin: true,
        secure: false,
      },
      '/messages/get': {
        target: env.VITE_MESSAGES_URL,
        changeOrigin: true,
        secure: false,
      },
      '/messages/delete': {
        target: env.VITE_MESSAGES_URL,
        changeOrigin: true,
        secure: false,
      },
      '/notificationProxy': {
        target: env.VITE_NOTIFICATIONS_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/notificationProxy/, '/notification'),
      },
    },
  },
});