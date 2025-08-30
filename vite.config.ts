/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: "default",
          include: ["src/test/*.test.ts"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
