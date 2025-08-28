import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import DataSources from '../common/DataSources';

export default function AboutPage() {
  const { mcpData } = useMCP();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">About MCP Navigator</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg">
            MCP Navigator is a comprehensive resource for discovering, exploring, and implementing
            Model Context Protocol (MCP) servers in your projects.
          </p>
          
          <h2>What are MCPs?</h2>
          <p>
            Model Context Protocol (MCP) servers enable AI models to interact with external tools and services,
            extending their capabilities beyond the training data. MCPs serve as bridges between AI models
            and various applications, databases, APIs, and services.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a centralized hub for the MCP ecosystem, making it easier for developers
            to find, compare, and implement MCP servers in their applications. We aim to foster innovation and
            collaboration in the AI community by showcasing the diverse range of MCPs available.
          </p>
          
          <h2>Data Sources & Transparency</h2>
          <p className="mb-6">
            我們致力於提供透明、可靠的 MCP 服務器信息。以下是我們數據收集和驗證的詳細說明：
          </p>
          <DataSources 
            sources={mcpData?.metadata.sources} 
            showDetails={true} 
          />
          
          <h2>Contribute</h2>
          <p>
            MCP Navigator is an open community resource. If you've developed an MCP server or found one that's not
            listed in our directory, we encourage you to contribute.
          </p>
          <p>
            Visit the{' '}
            <a
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              official MCP repository
            </a>{' '}
            to learn more about contributing to the MCP ecosystem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-xl font-bold mb-4">Explore MCPs</h2>
          <p className="mb-4">
            Browse our comprehensive collection of MCP servers organized by category and functionality.
          </p>
          <Link
            to="/browse"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Browse All MCPs
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">MCP Statistics</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Total MCP Servers:</span>{' '}
              <span className="font-bold">{mcpData?.metadata.total_servers || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Categories:</span>{' '}
              <span className="font-bold">{mcpData?.metadata.total_categories || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>{' '}
              <span className="font-bold">{mcpData?.metadata.collection_date || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}