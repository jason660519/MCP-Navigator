/**
 * =============================================================================
 *                    MCP Navigator - Vite 構建配置
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 專案的 Vite 構建工具配置檔案，定義了開發服務器、
 *     構建選項、插件配置和路徑別名等設置，用於優化開發體驗和構建性能。
 * 
 * 主要功能：
 *     • 配置 React 插件支援 JSX/TSX
 *     • 設置路徑別名簡化導入語句
 *     • 配置開發服務器端口
 *     • 優化構建和開發體驗
 *     • 支援 TypeScript 和現代 JavaScript
 * 
 * 必要依賴項：
 *     Node.js 18+ 及以下套件：
 *     - vite: 構建工具核心
 *     - @vitejs/plugin-react: React 插件
 *     - path: Node.js 內建路徑模組
 *     - typescript: TypeScript 支援
 * 
 * 安裝步驟：
 *     1. 確保 Node.js 18+ 已安裝
 *     2. 安裝依賴：pnpm install
 *     3. 開發模式：pnpm dev
 *     4. 構建生產版本：pnpm build
 *     5. 預覽構建結果：pnpm preview
 * 
 * 重要配置說明：
 *     • plugins: [react()] - 啟用 React 插件
 *       - 支援 JSX/TSX 語法
 *       - 支援 React Fast Refresh
 *       - 自動處理 React 相關優化
 * 
 *     • resolve.alias: 路徑別名配置
 *       - "@": 指向 "./src" 目錄
 *       - 簡化導入語句，如：import Component from '@/components/Component'
 * 
 *     • server.port: 開發服務器端口
 *       - 設置為 5173（Vite 預設端口）
 *       - 可在此修改開發服務器端口
 * 
 * 開發特性：
 *     • 熱模組替換（HMR）
 *     • 快速冷啟動
 *     • TypeScript 原生支援
 *     • ES 模組原生支援
 *     • 自動依賴預構建
 * 
 * 構建特性：
 *     • Rollup 為基礎的生產構建
 *     • 代碼分割和樹搖優化
 *     • 資源壓縮和優化
 *     • 現代瀏覽器目標
 * 
 * 使用範例：
 *     // 開發模式
 *     pnpm dev
 *     
 *     // 構建生產版本
 *     pnpm build
 *     
 *     // 在組件中使用路徑別名
 *     import { Button } from '@/components/ui/button';
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
})

