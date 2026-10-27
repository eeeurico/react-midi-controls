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
          fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
          cssFileName: "style",
        },
        rollupOptions: {
          // Match subpaths too, so react/jsx-runtime isn't bundled
          external: [/^react($|\/)/, /^react-dom($|\/)/],
          output: {
            // Hooks and context need to run on the client in React Server Components apps
            banner: '"use client";',
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
