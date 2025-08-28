import React from 'react';
import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import DataSources from '../common/DataSources';
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * DataSourcesPage 組件 - 專門的數據來源透明度頁面
 * 提供詳細的數據收集方法、來源驗證和質量保證信息
 */
export default function DataSourcesPage() {
  const { mcpData } = useMCP();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 頁面標題和導航 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <Link 
            to="/about" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            返回 About
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">數據來源與透明度</h1>
        <p className="text-lg text-gray-600 mb-6">
          MCP Navigator 致力於提供最準確、最新的 Model Context Protocol 服務器信息。
          我們相信透明度是建立信任的基礎，因此詳細說明我們的數據收集方法和質量保證流程。
        </p>
        
        {/* 關鍵指標 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">數據驗證</h3>
            <p className="text-green-800 text-sm">多重來源交叉驗證確保準確性</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Info className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">實時更新</h3>
            <p className="text-blue-800 text-sm">定期掃描和手動審核保持最新</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-yellow-900 mb-2">質量控制</h3>
            <p className="text-yellow-800 text-sm">嚴格的質量審核和錯誤修正機制</p>
          </div>
        </div>
      </div>

      {/* 詳細數據來源信息 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <DataSources 
          sources={mcpData?.metadata.sources} 
          showDetails={true} 
        />
      </div>

      {/* 數據收集流程 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">數據收集流程</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">自動化數據收集</h3>
              <p className="text-gray-600">
                我們的系統定期掃描官方 MCP 倉庫、文檔網站和社區資源，自動提取新的服務器信息和更新。
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">多源驗證</h3>
              <p className="text-gray-600">
                每個 MCP 服務器的信息都會通過多個獨立來源進行交叉驗證，確保數據的準確性和完整性。
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">手動審核</h3>
              <p className="text-gray-600">
                所有自動收集的數據都會經過人工審核，檢查描述準確性、分類正確性和鏈接有效性。
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">持續監控</h3>
              <p className="text-gray-600">
                我們持續監控已收錄的 MCP 服務器，及時發現和修正過時信息，確保目錄的時效性。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 數據統計 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">目錄統計</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mcpData?.metadata.total_servers || 0}
            </div>
            <div className="text-gray-600">MCP 服務器總數</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mcpData?.metadata.total_categories || 0}
            </div>
            <div className="text-gray-600">服務類別</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mcpData?.metadata.sources?.length || 0}
            </div>
            <div className="text-gray-600">數據來源</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {mcpData?.metadata.collection_date ? new Date(mcpData.metadata.collection_date).toLocaleDateString('zh-TW') : 'N/A'}
            </div>
            <div className="text-gray-600">最後更新</div>
          </div>
        </div>
      </div>

      {/* 聯繫和反饋 */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">數據質量反饋</h2>
        <p className="text-gray-600 mb-6">
          如果您發現任何數據錯誤或有新的 MCP 服務器需要收錄，歡迎通過以下方式聯繫我們：
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/jason660519/MCP-Navigator/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            提交 Issue
          </a>
          
          <a
            href="https://github.com/jason660519/MCP-Navigator/blob/master/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            貢獻指南
          </a>
        </div>
      </div>
    </div>
  );
}