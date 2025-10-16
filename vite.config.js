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
    globals: true,                       // habilita describe/test/expect como globals
    environment: 'jsdom',                // simula DOM para React Testing Library
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'], // patrones de test comunes
  },
})
