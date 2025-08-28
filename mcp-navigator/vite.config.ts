import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  // 設定 GitHub Pages 的 base URL
  base: process.env.NODE_ENV === 'production' ? '/MCP-Navigator/' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 確保輸出目錄為 dist
    outDir: 'dist',
    // 生成 source map 以便除錯
    sourcemap: true,
    // 清理輸出目錄
    emptyOutDir: true,
  },
  server: {
    // 開發伺服器配置
    port: 5173,
    open: true,
  },
})

