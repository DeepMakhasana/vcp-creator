import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist", // Default output folder
    rollupOptions: {
      input: "/index.html", // Ensure your entry file is correctly referenced
    },
  },
  resolve: {
    alias: {
      "@": "/src", // Set alias for the 'src' folder
    },
  },
});
