import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/plate-planner/',
  plugins: [react()],
  server: {
    port: 3000,
  },
})
