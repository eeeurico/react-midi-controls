import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ["src/**/*"],
          exclude: ["src/**/*.test.*", "src/**/*.spec.*"],
          tsconfigPath: "./tsconfig.app.json",
          compilerOptions: {
            noEmit: false,
            declaration: true,
            emitDeclarationOnly: true,
          },
        }),
      ],
      build: {
        lib: {
          entry: "src/index.ts",
          name: "ReactMidiControls",
          formats: ["es", "cjs"],
          fileName: (format) => `index.${format === "es" ? "es" : "cjs"}.js`,
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
    }
  }

  // Default dev config
  return {
    plugins: [react()],
  }
})
