import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // This workspace can have many sibling projects. Polling avoids exhausting
      // the host's inotify watcher limit while keeping local HMR available.
      usePolling: true,
      interval: 1000,
    },
  },
})
