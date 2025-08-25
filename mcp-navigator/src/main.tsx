/**
 * =============================================================================
 *                    MCP Navigator - 應用程式入口點
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 應用程式的主要入口點，負責初始化 React 應用程式
 *     並將其掛載到 DOM 中。設置了應用程式的根級配置，包括嚴格模式和
 *     錯誤邊界處理。
 * 
 * 主要功能：
 *     • 初始化 React 18 的根渲染器
 *     • 啟用 React StrictMode 進行開發時檢查
 *     • 設置全域錯誤邊界處理
 *     • 載入全域 CSS 樣式
 *     • 掛載主應用程式組件到 DOM
 * 
 * 必要依賴項：
 *     React 18+ 及以下模組：
 *     - react: StrictMode
 *     - react-dom/client: createRoot
 *     - ./components/ErrorBoundary: 錯誤邊界組件
 *     - ./index.css: 全域樣式檔案
 *     - ./App: 主應用程式組件
 * 
 * 安裝步驟：
 *     1. 確保 Node.js 18+ 已安裝
 *     2. 安裝依賴：pnpm install
 *     3. 確保 public/index.html 中存在 id="root" 的元素
 *     4. 啟動開發服務器：pnpm dev
 * 
 * 重要參數說明：
 *     • StrictMode: React 嚴格模式，啟用額外的開發時檢查
 *     • createRoot: React 18 的新根 API，替代舊的 ReactDOM.render
 *     • ErrorBoundary: 捕獲和處理 React 組件錯誤
 *     • root 元素: HTML 中 id="root" 的 DOM 元素
 * 
 * 渲染層次結構：
 *     StrictMode
 *     ↓
 *     ErrorBoundary
 *     ↓
 *     App（主應用程式）
 * 
 * 開發特性：
 *     • StrictMode 啟用雙重渲染檢測
 *     • 錯誤邊界提供優雅的錯誤處理
 *     • 支援熱模組替換（HMR）
 *     • TypeScript 嚴格類型檢查
 * 
 * 使用範例：
 *     // 此檔案通常不需要修改，由 Vite 自動載入
 *     // 如需自定義，可以修改渲染配置或添加全域提供者
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
