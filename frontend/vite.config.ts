import path from "path"
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'jsvectormap': '/node_modules/jsvectormap'

    },
  },
  server:{
    port:3000
  }
})
