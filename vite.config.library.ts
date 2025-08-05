import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "library") {
    // Library build configuration
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: "src/midi-hooks.ts",
          name: "MidiHooks",
          fileName: (format) => `midi-hooks.${format}.js`,
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
      },
    }
  }

  // Demo/development configuration
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
  }
})
