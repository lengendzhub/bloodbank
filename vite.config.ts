import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '/bloodbank/',
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://glcnyificwdcdzwfzcnn.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY255aWZpY3dkY2R6d2Z6Y25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDY5MTMsImV4cCI6MjA3NzgyMjkxM30.j5Wy5tczcujbq6alo62BJtIgCUWXzvSz08_X5BpXXMg'),
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
