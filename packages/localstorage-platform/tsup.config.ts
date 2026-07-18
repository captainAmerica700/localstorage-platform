import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/react/index.ts"],

  format: ["esm", "cjs"],

  dts: true,

  clean: true,

  minify: true,

  treeshake: true,

  sourcemap: false,

  target: "es2022",

  splitting: false,

  cjsInterop: true,

  keepNames: false,
});