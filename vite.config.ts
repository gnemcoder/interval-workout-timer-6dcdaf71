
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: "", // Empty string to ensure assets are loaded from the current path
  build: {
    outDir: "dist",
    emptyOutDir: true, // Clean the output directory before building
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Disable code splitting for simpler output
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
