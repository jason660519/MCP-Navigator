import React from 'react';
import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import DataSources from '../common/DataSources';
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * DataSourcesPage component - Dedicated data source transparency page
 * Provides detailed data collection methods, source verification and quality assurance information
 */
export default function DataSourcesPage() {
  const { mcpData } = useMCP();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title and Navigation */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <Link 
            to="/about" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to About
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Data Sources & Transparency</h1>
        <p className="text-lg text-gray-600 mb-6">
          MCP Navigator is committed to providing the most accurate and up-to-date Model Context Protocol server information.
          We believe transparency is the foundation of trust, so we provide detailed explanations of our data collection methods and quality assurance processes.
        </p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Data Verification</h3>
            <p className="text-green-800 text-sm">Multi-source cross-verification ensures accuracy</p>
          </div>
          
          <div className="bg-ferrari-black/5 border border-ferrari-red/20 rounded-lg p-6 text-center">
            <Info className="h-8 w-8 text-ferrari-red mx-auto mb-3" />
            <h3 className="font-semibold text-ferrari-red mb-2">Real-time Updates</h3>
            <p className="text-ferrari-gray-dark text-sm">Regular scanning and manual review keep data current</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-yellow-900 mb-2">Quality Control</h3>
            <p className="text-yellow-800 text-sm">Strict quality review and error correction mechanisms</p>
          </div>
        </div>
      </div>

      {/* Detailed Data Source Information */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <DataSources 
          sources={mcpData?.metadata.sources} 
          showDetails={true} 
        />
      </div>

      {/* Data Collection Process */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Data Collection Process</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Automated Data Collection</h3>
              <p className="text-gray-600">
                Our system regularly scans official MCP repositories, documentation websites, and community resources to automatically extract new server information and updates.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Multi-source Verification</h3>
              <p className="text-gray-600">
                Information for each MCP server is cross-verified through multiple independent sources to ensure data accuracy and completeness.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Manual Review</h3>
              <p className="text-gray-600">
                All automatically collected data undergoes manual review to check description accuracy, categorization correctness, and link validity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Continuous Monitoring</h3>
              <p className="text-gray-600">
                We continuously monitor included MCP servers to promptly identify and correct outdated information, ensuring the directory remains current.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Directory Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mcpData?.metadata.total_servers || 0}
            </div>
            <div className="text-gray-600">Total MCP Servers</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mcpData?.metadata.total_categories || 0}
            </div>
            <div className="text-gray-600">Service Categories</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mcpData?.metadata.sources?.length || 0}
            </div>
            <div className="text-gray-600">Data Sources</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {mcpData?.metadata.collection_date ? new Date(mcpData.metadata.collection_date).toLocaleDateString('en-US') : 'N/A'}
            </div>
            <div className="text-gray-600">Last Updated</div>
          </div>
        </div>
      </div>

      {/* Contact and Feedback */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Data Quality Feedback</h2>
        <p className="text-gray-600 mb-6">
          If you discover any data errors or have new MCP servers that need to be included, please contact us through the following methods:
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/jason660519/MCP-Navigator/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Issue
          </a>
          
          <a
            href="https://github.com/jason660519/MCP-Navigator/blob/master/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Contributing Guide
          </a>
        </div>
      </div>
    </div>
  );
}