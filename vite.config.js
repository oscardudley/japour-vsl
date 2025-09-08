import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Optimize for VSL performance
  optimizeDeps: {
    include: []
  },
  // Handle environment variables properly
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  }
})