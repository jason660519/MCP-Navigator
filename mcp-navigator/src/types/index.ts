/**
 * =============================================================================
 *                    MCP Navigator - TypeScript 類型定義
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 應用程式的核心類型定義檔案，定義了整個應用程式
 *     中使用的 TypeScript 介面和類型。確保數據結構的一致性和類型安全。
 * 
 * 主要功能：
 *     • 定義 MCP 服務器的完整數據結構
 *     • 定義分類系統的類型結構
 *     • 定義 MCP 目錄的整體數據格式
 *     • 提供流行度指標的類型定義
 *     • 確保整個應用程式的類型安全
 * 
 * 必要依賴項：
 *     TypeScript 4.5+ - 無額外依賴，純類型定義檔案
 * 
 * 安裝步驟：
 *     1. 確保 TypeScript 已配置在專案中
 *     2. 此檔案會被其他 TypeScript 檔案自動引用
 *     3. 無需單獨安裝或執行
 * 
 * 重要類型說明：
 *     • MCP: 單個 MCP 服務器的完整資料結構
 *       - name: 服務器名稱
 *       - description: 功能描述
 *       - category: 分類標籤
 *       - repository_link: GitHub 倉庫連結
 *       - creator_maintainer: 創建者/維護者
 *       - installation_instructions: 安裝指南
 *       - documentation_links: 文檔連結陣列
 *       - popularity_indicators: 流行度指標物件
 *       - last_updated: 最後更新時間
 *       - source: 數據來源
 *       - use_cases: 使用案例陣列
 *       - examples: 範例陣列
 * 
 *     • Category: 分類資訊結構
 *       - name: 分類名稱
 *       - count: 該分類下的服務器數量
 *       - description: 分類描述
 *       - icon: 分類圖標
 *       - color: 分類顏色
 *       - servers: 該分類下的服務器列表
 * 
 *     • MCPDirectory: 完整目錄結構
 *       - metadata: 元數據資訊
 *       - categories: 分類陣列
 *       - servers: 服務器字典（以名稱為鍵）
 * 
 * 流行度等級：
 *     'high' | 'medium' | 'low' - 三級流行度分類
 * 
 * 使用範例：
 *     import { MCP, Category, MCPDirectory } from './types';
 *     
 *     const server: MCP = {
 *       name: 'Example Server',
 *       description: 'An example MCP server',
 *       // ... 其他必要屬性
 *     };
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

export interface MCP {
  name: string;
  description: string;
  category: string;
  repository_link: string;
  creator_maintainer: string;
  installation_instructions: string;
  documentation_links: string[];
  popularity_indicators: {
    level: 'high' | 'medium' | 'low';
    github_stars: number | null;
    npm_downloads: number | null;
    community_mentions: number;
  };
  last_updated: string;
  source: string;
  use_cases: string[];
  examples: string[];
}

export interface Category {
  name: string;
  count: number;
  description: string;
  icon: string;
  color: string;
  servers: string[];
}

export interface MCPDirectory {
  metadata: {
    title: string;
    description: string;
    total_servers: number;
    total_categories: number;
    collection_date: string;
    version: string;
    sources: string[];
  };
  categories: Category[];
  servers: Record<string, MCP>;
}