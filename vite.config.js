import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    proxy: {
      "/api/chat": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/analyze-room": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/projects": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/orders": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/appointments": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/quotes": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/admin": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
