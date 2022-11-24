import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "typed-value-provider",
      fileName(format, entryName) {
        return `index.${format}.js`;
      },
    },
  },
  plugins: [dts()],
});
