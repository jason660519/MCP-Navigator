/**
 * =============================================================================
 *                    MCP Navigator - React 錯誤邊界組件
 * =============================================================================
 * 
 * 檔案用途：
 *     這是一個 React 錯誤邊界組件，用於捕獲和處理應用程式中發生的 JavaScript
 *     錯誤，防止整個應用程式崩潰，並為用戶提供友好的錯誤提示界面。
 * 
 * 主要功能：
 *     • 捕獲子組件樹中的 JavaScript 錯誤
 *     • 記錄錯誤詳細信息到控制台
 *     • 顯示用戶友好的錯誤回退 UI
 *     • 提供錯誤詳細信息的展開/收起功能
 *     • 提供重新載入頁面的選項
 *     • 序列化錯誤對象以便顯示
 * 
 * 必要依賴項：
 *     React 16.0+ 及以下模組：
 *     - react: React 核心庫（Component, ErrorInfo）
 *     - Tailwind CSS: 用於樣式設計
 * 
 * 安裝步驟：
 *     1. 確保 React 16+ 已安裝
 *     2. 確保 Tailwind CSS 已配置
 *     3. 在應用程式根組件中包裹此錯誤邊界
 *     4. 無需額外安裝，使用 React 內建功能
 * 
 * 重要參數說明：
 *     • children: React.ReactNode - 被保護的子組件
 *     • hasError: boolean - 錯誤狀態標記
 *     • error: any - 捕獲的錯誤對象
 *     • serializeError: 錯誤序列化函數
 * 
 * 錯誤處理流程：
 *     1. getDerivedStateFromError: 更新狀態以顯示錯誤 UI
 *     2. componentDidCatch: 記錄錯誤信息
 *     3. render: 根據錯誤狀態渲染適當的 UI
 * 
 * 錯誤 UI 特性：
 *     • 響應式設計，適配各種螢幕尺寸
 *     • 清晰的錯誤圖標和提示信息
 *     • 可展開的錯誤詳細信息
 *     • 重新載入頁面按鈕
 *     • 優雅的卡片式佈局
 * 
 * 使用範例：
 *     import { ErrorBoundary } from './components/ErrorBoundary';
 *     
 *     function App() {
 *       return (
 *         <ErrorBoundary>
 *           <YourAppComponents />
 *         </ErrorBoundary>
 *       );
 *     }
 * 
 * 注意事項：
 *     • 錯誤邊界無法捕獲事件處理器中的錯誤
 *     • 無法捕獲異步代碼中的錯誤
 *     • 無法捕獲服務器端渲染期間的錯誤
 *     • 無法捕獲錯誤邊界自身的錯誤
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

import React from 'react';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    return error.message + '\n' + error.stack;
  }
  return JSON.stringify(error, null, 2);
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while trying to display this content. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="text-left bg-gray-100 p-3 rounded mb-4 overflow-auto max-h-32 text-sm text-gray-800">
                <pre className="font-mono">{serializeError(this.state.error)}</pre>
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}