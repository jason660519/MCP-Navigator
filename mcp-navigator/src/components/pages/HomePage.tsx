import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify, truncateText } from '../../lib/utils';

import { Category, MCP } from '../../types';

export default function HomePage() {
  const { mcpData, loading, error } = useMCP();
  const [searchQuery, setSearchQuery] = useState('');

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

  // Get featured MCPs (high popularity)
  const featuredMCPs: [string, MCP][] = Object.entries(mcpData.servers)
    .filter(([_, mcp]) => mcp.popularity_indicators.level === 'high')
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Model Context Protocol Navigator</h1>
          <p className="text-xl opacity-90 mb-8">
            Discover and explore the ecosystem of MCP servers for enhanced AI capabilities
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search MCP servers..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link 
                to={`/browse?q=${encodeURIComponent(searchQuery)}`} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-indigo-700 px-4 py-1 rounded-md font-medium hover:bg-opacity-90 transition"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured MCPs */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured MCP Servers</h2>
          <Link to="/browse" className="text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMCPs.map(([id, mcp]) => (
            <Link 
              to={`/mcp/${slugify(mcp.name)}`} 
              key={id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{mcp.name}</h3>
              <p className="text-gray-600 mb-3">{truncateText(mcp.description, 100)}</p>
              <div className="flex items-center text-sm">
                <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                  {mcp.category}
                </span>
                <span className="ml-auto text-gray-500">
                  {mcp.popularity_indicators.level === 'high' && '⭐⭐⭐'}
                  {mcp.popularity_indicators.level === 'medium' && '⭐⭐'}
                  {mcp.popularity_indicators.level === 'low' && '⭐'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mcpData.categories.map((category: Category) => (
            <Link
              to={`/category/${slugify(category.name)}`}
              key={category.name}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition text-center"
              style={{ 
                backgroundColor: `${category.color}10`,
                borderColor: `${category.color}30` 
              }}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} servers</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}