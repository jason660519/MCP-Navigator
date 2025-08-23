import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify, unslugify } from '../../lib/utils';
import { MCP } from '../../types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function MCPDetailPage() {
  const { mcpSlug } = useParams<{ mcpSlug: string }>();
  const { mcpData, loading, error } = useMCP();
  const [mcp, setMcp] = useState<MCP | null>(null);
  const [mcpId, setMcpId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [relatedMCPs, setRelatedMCPs] = useState<[string, MCP][]>([]);

  useEffect(() => {
    if (!mcpData || !mcpSlug) return;

    // 使用 slug 比較而不是依賴 unslugify
    const foundMcpEntry = Object.entries(mcpData.servers).find(
      ([_, m]) => slugify(m.name) === mcpSlug
    );

    if (foundMcpEntry) {
      const [id, foundMcp] = foundMcpEntry;
      setMcp(foundMcp);
      setMcpId(id);

      // Find related MCPs (same category)
      const category = foundMcp.category;
      const related = Object.entries(mcpData.servers)
        .filter(([_, m]) => 
          m.category === category && 
          m.name !== foundMcp.name
        )
        .slice(0, 3);
      
      setRelatedMCPs(related);
    }
  }, [mcpData, mcpSlug]);

  // Handle copy button
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !mcpData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Failed to load MCP data</h2>
        <p className="mt-4">{error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  if (!mcp) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">MCP not found</h2>
        <p className="mt-4">The MCP server you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs">
        <ul className="flex space-x-2">
          <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
          <li><span className="text-gray-500">/</span></li>
          <li>
            <Link 
              to={`/category/${slugify(mcp.category)}`} 
              className="text-gray-500 hover:text-gray-700"
            >
              {mcp.category}
            </Link>
          </li>
          <li><span className="text-gray-500">/</span></li>
          <li className="text-gray-900 font-medium">{mcp.name}</li>
        </ul>
      </div>

      {/* MCP Header */}
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-blue-600">
        <div className="flex flex-col md:flex-row md:items-center">
          <div>
            <div className="flex items-center mb-3">
              <h1 className="text-3xl font-bold mr-3">{mcp.name}</h1>
              <Link
                to={`/category/${slugify(mcp.category)}`}
                className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full"
              >
                {mcp.category}
              </Link>
            </div>
            <p className="text-lg text-gray-700 mb-4">{mcp.description}</p>
            <div className="text-sm text-gray-600 mb-6">
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">Maintained by:</span>
                <span>{mcp.creator_maintainer}</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">Last Updated:</span>
                <span>{mcp.last_updated}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Popularity:</span>
                <span>
                  {mcp.popularity_indicators.level === 'high' && '⭐⭐⭐ High'}
                  {mcp.popularity_indicators.level === 'medium' && '⭐⭐ Medium'}
                  {mcp.popularity_indicators.level === 'low' && '⭐ Low'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="ml-auto mt-4 md:mt-0 flex flex-col space-y-3">
            {mcp.repository_link && (
              <a 
                href={mcp.repository_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-2 px-4 rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub Repository
              </a>
            )}
            
            {mcp.documentation_links && mcp.documentation_links.length > 0 && (
              <a 
                href={mcp.documentation_links[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Installation Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Installation</h2>
            <div className="bg-gray-900 rounded-md overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-400 text-sm">
                <span>Terminal</span>
                <CopyToClipboard text={mcp.installation_instructions} onCopy={handleCopy}>
                  <button className="text-gray-400 hover:text-white">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </CopyToClipboard>
              </div>
              <div className="p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                {mcp.installation_instructions}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
            <ul className="space-y-2">
              {mcp.use_cases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Examples</h2>
            <div className="space-y-4">
              {mcp.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="text-gray-800">{example}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Related MCPs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Related MCPs</h2>
            {relatedMCPs.length > 0 ? (
              <div className="space-y-4">
                {relatedMCPs.map(([id, relatedMcp]) => (
                  <Link
                    key={id}
                    to={`/mcp/${slugify(relatedMcp.name)}`}
                    className="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                  >
                    <h3 className="font-medium">{relatedMcp.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{relatedMcp.description.substring(0, 60)}...</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No related MCPs found.</p>
            )}
          </div>

          {/* Add Your MCP */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-2">Add Your MCP</h2>
            <p className="text-gray-700 mb-4">
              Have you created an MCP server? Add it to our directory to increase visibility.
            </p>
            <a 
              href="https://github.com/modelcontextprotocol/servers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Submit Your MCP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}