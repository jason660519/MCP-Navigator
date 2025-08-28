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
 * DataSources component - Display MCP data source information
 * Provides data transparency and reliability information
 */
export default function DataSources({ sources = [], showDetails = true }: DataSourcesProps) {
  // Predefined data source information
  const dataSources: DataSource[] = [
    {
      name: 'Official Anthropic MCP Server Repository',
      url: 'https://github.com/modelcontextprotocol/servers',
      type: 'official',
      reliability: 'high',
      description: 'Official MCP server reference implementations and examples maintained by Anthropic'
    },
    {
      name: 'Official MCP Documentation and Examples',
      url: 'https://modelcontextprotocol.io/examples',
      type: 'official',
      reliability: 'high',
      description: 'MCP server examples and best practices provided in official documentation'
    },
    {
      name: 'Community Curated Lists',
      type: 'community',
      reliability: 'medium',
      description: 'Curated MCP server lists and recommendations from the developer community'
    },
    {
      name: 'GitHub Repository Analysis',
      type: 'research',
      reliability: 'medium',
      description: 'Data collected through analysis of MCP-related projects on GitHub'
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
      case 'high': return 'High Reliability';
      case 'medium': return 'Medium Reliability';
      case 'low': return 'Low Reliability';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Collection Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Data Collection Methods</h3>
        </div>
        <p className="text-blue-800 mb-4">
          Our MCP server directory is built through multi-source data collection and verification processes, ensuring information accuracy and completeness.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">Multi-source Verification</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">Regular Updates</span>
          </div>
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">Standardized Data Structure</span>
          </div>
        </div>
      </div>

      {/* Detailed Data Sources List */}
      {showDetails && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Data Source Details</h3>
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

      {/* Simplified Version - Show Source Links Only */}
      {!showDetails && sources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Primary Data Sources</h3>
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

      {/* Data Quality Assurance */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Data Quality Assurance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Verification Process:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Multi-source cross-verification</li>
              <li>• Official documentation confirmation</li>
              <li>• Community feedback integration</li>
            </ul>
          </div>
          <div>
            <strong>Update Mechanism:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Regular automated scanning</li>
              <li>• Manual quality review</li>
              <li>• Real-time error correction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}