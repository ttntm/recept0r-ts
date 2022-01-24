import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      // Disabled Hashing as Netlify Does Hashing for us using Etag.
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  optimizeDeps: {
    include: [
      'gotrue-js',
      'secure-ls',
      'vue',
      'vue-router',
      'vuex',
      'vuex-multi-tab-state',
      'vuex-persistedstate',
      '@vueup/vue-quill',
      'body-scroll-lock',
      'vuedraggable'
    ]
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // https://github.com/vuejs/vue-next/issues/2064#issuecomment-797365133
    dedupe: ['vue']
  }
})
