import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    environment: "node",
    globals: true,
    setupFiles: [],
    cache: false,
  },
});
