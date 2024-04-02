import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,

    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 2113, // you can replace this port with any port
  }
})
