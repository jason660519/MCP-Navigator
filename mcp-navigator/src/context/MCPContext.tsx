/**
 * =============================================================================
 *                    MCP Navigator - 全域狀態管理上下文
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 應用程式的全域狀態管理組件，使用 React Context
 *     提供 MCP 數據的集中式管理和分發。負責從 API 獲取數據並在整個
 *     應用程式中共享 MCP 服務器資訊。
 * 
 * 主要功能：
 *     • 提供全域 MCP 數據狀態管理
 *     • 處理數據載入和錯誤狀態
 *     • 從 JSON 檔案異步獲取 MCP 目錄數據
 *     • 為所有子組件提供統一的數據訪問介面
 *     • 管理載入狀態和錯誤處理
 * 
 * 必要依賴項：
 *     React 18+ 及以下模組：
 *     - react: createContext, useContext, useEffect, useState, ReactNode
 *     - ../types: MCPDirectory 類型定義
 * 
 * 安裝步驟：
 *     1. 確保 React 18+ 已安裝
 *     2. 確保類型定義檔案存在於 ../types
 *     3. 確保數據檔案存在於 /public/data/comprehensive_mcp_directory.json
 * 
 * 重要參數說明：
 *     • MCPContextType: 上下文類型定義
 *       - loading: 數據載入狀態（boolean）
 *       - error: 錯誤訊息（string | null）
 *       - mcpData: MCP 目錄數據（MCPDirectory | null）
 *     • MCPProvider: 上下文提供者組件
 *     • useMCP: 自定義 Hook 用於訪問上下文數據
 * 
 * 數據來源：
 *     /data/comprehensive_mcp_directory.json - 包含完整 MCP 服務器目錄
 * 
 * 狀態管理：
 *     1. 初始狀態：loading = true, error = null, mcpData = null
 *     2. 載入中：loading = true
 *     3. 載入成功：loading = false, mcpData = 數據
 *     4. 載入失敗：loading = false, error = 錯誤訊息
 * 
 * 使用範例：
 *     // 在 App.tsx 中包裝應用程式
 *     <MCPProvider>
 *       <App />
 *     </MCPProvider>
 *     
 *     // 在組件中使用數據
 *     const { loading, error, mcpData } = useMCP();
 *     if (loading) return <div>載入中...</div>;
 *     if (error) return <div>錯誤：{error}</div>;
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MCPDirectory } from '../types';

interface MCPContextType {
  loading: boolean;
  error: string | null;
  mcpData: MCPDirectory | null;
}

const MCPContext = createContext<MCPContextType>({
  loading: true,
  error: null,
  mcpData: null,
});

export function MCPProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mcpData, setMcpData] = useState<MCPDirectory | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/comprehensive_mcp_directory.json');
        if (!response.ok) {
          throw new Error('Failed to fetch MCP data');
        }
        const data = await response.json();
        setMcpData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <MCPContext.Provider value={{ loading, error, mcpData }}>
      {children}
    </MCPContext.Provider>
  );
}

export function useMCP() {
  return useContext(MCPContext);
}