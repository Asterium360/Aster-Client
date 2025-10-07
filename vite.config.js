import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
<<<<<<< HEAD

  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },

  test:{
    globals:true,
    environment: 'jsdom'
  }
=======
  plugins: [
    react(),
    tailwindcss(),
  ],
>>>>>>> 67da99468c255a1a24629be3db8f6219102194f8
})
