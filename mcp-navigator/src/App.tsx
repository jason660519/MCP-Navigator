/**
 * =============================================================================
 *                    MCP Navigator - 主應用程式組件
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 網站的根組件，負責設置應用程式的整體結構、
 *     路由配置和全域狀態管理。定義了網站的主要導航結構和頁面佈局。
 * 
 * 主要功能：
 *     • 配置 React Router 路由系統
 *     • 提供全域 MCP 數據上下文
 *     • 設置應用程式的整體佈局結構
 *     • 管理頁面間的導航和重定向
 *     • 整合頁首、頁尾和主要內容區域
 * 
 * 必要依賴項：
 *     React 18+ 及以下 npm 套件：
 *     - react-router-dom: 客戶端路由管理
 *     - 自定義組件：MCPProvider, Header, Footer, 各頁面組件
 * 
 * 安裝步驟：
 *     1. 確保 Node.js 18+ 已安裝
 *     2. 安裝依賴：pnpm install
 *     3. 啟動開發服務器：pnpm dev
 * 
 * 重要參數說明：
 *     • Router: 提供瀏覽器路由功能
 *     • MCPProvider: 全域 MCP 數據狀態管理
 *     • Routes: 定義應用程式的路由結構
 *     • Navigate: 處理路由重定向
 * 
 * 路由結構：
 *     / - 首頁（HomePage）
 *     /browse - 瀏覽所有 MCP 服務器（BrowsePage）
 *     /categories - 分類總覽（CategoriesPage）
 *     /category/:categorySlug - 特定分類頁面（CategoryPage）
 *     /mcp/:mcpSlug - MCP 服務器詳情頁（MCPDetailPage）
 *     /about - 關於頁面（AboutPage）
 *     /contact - 聯絡頁面（ContactPage）
 * 
 * 佈局結構：
 *     Header（導航欄）
 *     ↓
 *     Main（主要內容區域）
 *     ↓
 *     Footer（頁尾）
 * 
 * 使用範例：
 *     // 在 main.tsx 中使用
 *     import App from './App'
 *     ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MCPProvider } from './context/MCPContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import BrowsePage from './components/pages/BrowsePage';
import CategoriesPage from './components/pages/CategoriesPage';
import CategoryPage from './components/pages/CategoryPage';
import MCPDetailPage from './components/pages/MCPDetailPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import './App.css';

function App() {
  return (
    <MCPProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/Categories" element={<Navigate to="/categories" replace />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/mcp/:mcpSlug" element={<MCPDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </MCPProvider>
  );
}

export default App;
