import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the built assets resolve under a GitHub Pages project
  // subpath (e.g. /elevenlabs-agent-qa-dashboard/) as well as at a domain root.
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
