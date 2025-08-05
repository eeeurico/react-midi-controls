import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: "src/index.ts",
          name: "UseMidi",
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
