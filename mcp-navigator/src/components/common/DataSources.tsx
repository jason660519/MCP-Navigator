import React from 'react';
import { ExternalLink, Shield, Clock, Database } from 'lucide-react';

interface DataSource {
  name: string;
  url?: string;
  type: 'official' | 'community' | 'research';
  reliability: 'high' | 'medium' | 'low';
  description: string;
}

interface DataSourcesProps {
  sources?: string[];
  showDetails?: boolean;
}

/**
 * DataSources 組件 - 展示 MCP 數據的來源信息
 * 提供數據透明度和可信度信息
 */
export default function DataSources({ sources = [], showDetails = true }: DataSourcesProps) {
  // 預定義的數據來源信息
  const dataSources: DataSource[] = [
    {
      name: 'Anthropic 官方 MCP 服務器倉庫',
      url: 'https://github.com/modelcontextprotocol/servers',
      type: 'official',
      reliability: 'high',
      description: 'Anthropic 維護的官方 MCP 服務器參考實現和示例'
    },
    {
      name: 'MCP 官方文檔和示例',
      url: 'https://modelcontextprotocol.io/examples',
      type: 'official',
      reliability: 'high',
      description: '官方文檔中提供的 MCP 服務器示例和最佳實踐'
    },
    {
      name: '社區精選列表',
      type: 'community',
      reliability: 'medium',
      description: '來自開發者社區的精選 MCP 服務器列表和推薦'
    },
    {
      name: 'GitHub 倉庫分析',
      type: 'research',
      reliability: 'medium',
      description: '通過分析 GitHub 上的 MCP 相關項目收集的數據'
    }
  ];

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return '🏛️';
      case 'community': return '👥';
      case 'research': return '🔬';
      default: return '📄';
    }
  };

  const getReliabilityText = (reliability: string) => {
    switch (reliability) {
      case 'high': return '高可信度';
      case 'medium': return '中等可信度';
      case 'low': return '低可信度';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 數據收集概述 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">數據收集方法</h3>
        </div>
        <p className="text-blue-800 mb-4">
          我們的 MCP 服務器目錄通過多源數據收集和驗證流程構建，確保信息的準確性和完整性。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">多重來源驗證</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">定期更新維護</span>
          </div>
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">標準化數據結構</span>
          </div>
        </div>
      </div>

      {/* 詳細數據來源列表 */}
      {showDetails && (
        <div>
          <h3 className="text-lg font-semibold mb-4">數據來源詳情</h3>
          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(source.type)}</span>
                      <h4 className="font-medium text-gray-900">
                        {source.url ? (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            {source.name}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        ) : (
                          source.name
                        )}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{source.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getReliabilityColor(source.reliability)}`}>
                    {getReliabilityText(source.reliability)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 簡化版本 - 僅顯示來源鏈接 */}
      {!showDetails && sources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">主要數據來源</h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {source.startsWith('http') ? (
                  <a 
                    href={source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {source}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                ) : (
                  <span className="text-gray-700">{source}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 數據質量保證 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">數據質量保證</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>驗證流程：</strong>
            <ul className="mt-1 space-y-1">
              <li>• 多源交叉驗證</li>
              <li>• 官方文檔確認</li>
              <li>• 社區反饋整合</li>
            </ul>
          </div>
          <div>
            <strong>更新機制：</strong>
            <ul className="mt-1 space-y-1">
              <li>• 定期自動掃描</li>
              <li>• 手動質量審核</li>
              <li>• 即時錯誤修正</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}