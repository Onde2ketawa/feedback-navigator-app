
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Import conditionally to avoid errors if package is not fully resolved
// This prevents the build from failing due to the peer dependency issue
let componentTagger;
try {
  // Only attempt to load in development mode to prevent build errors
  if (process.env.NODE_ENV === 'development') {
    const taggerModule = require("lovable-tagger");
    componentTagger = taggerModule.componentTagger;
  }
} catch (e) {
  console.warn("Lovable tagger not available, skipping component tagging");
  componentTagger = () => null;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add optimizeDeps configuration to help with dependency resolution
  optimizeDeps: {
    exclude: ['lovable-tagger'],
  },
  // Add special handling for peer dependencies
  build: {
    commonjsOptions: {
      // This helps with some peer dependency issues
      transformMixedEsModules: true,
    },
  }
}));
