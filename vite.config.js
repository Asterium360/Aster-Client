import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // === Configuración de Vitest integrada ===
  test: {
    globals: true,                       // habilita describe/test/expect como globals (estilo Jest)
    environment: 'jsdom',                // simula DOM para React Testing Library
    setupFiles: 'src/test/setupTests.js',// archivo que se ejecuta antes de los tests
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'], // patrones de test comunes
    // opcional: timeout por test (ms)
    // testTimeout: 5000,
  },
})
