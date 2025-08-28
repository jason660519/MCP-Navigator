import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify, unslugify, truncateText, getCategoryColor } from '../../lib/utils';
import { Category, MCP } from '../../types';

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { mcpData, loading, error } = useMCP();
  const [category, setCategory] = useState<Category | null>(null);
  const [mcps, setMcps] = useState<[string, MCP][]>([]);

  useEffect(() => {
    if (!mcpData || !categorySlug) return;

    // Use slug comparison instead of relying on unslugify
    const foundCategory = mcpData.categories.find(
      (cat) => slugify(cat.name) === categorySlug
    );

    if (foundCategory) {
      setCategory(foundCategory);
      
      // Get all MCPs for this category
      const categoryMcps = Object.entries(mcpData.servers).filter(
        ([_, mcp]) => mcp.category.toLowerCase() === foundCategory.name.toLowerCase()
      );
      
      setMcps(categoryMcps);
    }
  }, [mcpData, categorySlug]);

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

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Category not found</h2>
        <p className="mt-4">The category you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
          Back to Home
        </Link>
      </div>
    );
  }

  const categoryColors = getCategoryColor(category.color);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs">
        <ul className="flex space-x-2">
          <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
          <li><span className="text-gray-500">/</span></li>
          <li><Link to="/browse" className="text-gray-500 hover:text-gray-700">Categories</Link></li>
          <li><span className="text-gray-500">/</span></li>
          <li className="text-gray-900 font-medium">{category.name}</li>
        </ul>
      </div>

      {/* Category Header */}
      <div 
        className="bg-white rounded-lg shadow-md p-6 border-l-4"
        style={{ 
          backgroundColor: categoryColors.bg,
          borderLeftColor: category.color 
        }}
      >
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-gray-600 mt-1">{category.description}</p>
          </div>
          <div className="ml-auto text-center">
            <span className="text-2xl font-bold block">{mcps.length}</span>
            <span className="text-gray-500 text-sm">MCP Servers</span>
          </div>
        </div>
      </div>

      {/* MCPs in this category */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available MCP Servers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mcps.map(([id, mcp]) => (
            <Link 
              to={`/mcp/${slugify(mcp.name)}`} 
              key={id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{mcp.name}</h3>
              <p className="text-gray-600 mb-3">{truncateText(mcp.description, 100)}</p>
              <div className="flex items-center justify-between text-sm mt-auto">
                <div>
                  <span className="text-gray-500">Maintained by: </span>
                  <span className="font-medium">{mcp.creator_maintainer}</span>
                </div>
                <span className="text-gray-500">
                  {mcp.popularity_indicators.level === 'high' && '⭐⭐⭐'}
                  {mcp.popularity_indicators.level === 'medium' && '⭐⭐'}
                  {mcp.popularity_indicators.level === 'low' && '⭐'}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        {mcps.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600">No MCP servers found in this category</h3>
            <Link to="/browse" className="mt-4 inline-block text-blue-600 hover:underline">
              Browse all MCPs
            </Link>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Explore Other Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mcpData.categories
            .filter(cat => cat.name !== category.name)
            .slice(0, 4)
            .map((cat) => (
              <Link
                to={`/category/${slugify(cat.name)}`}
                key={cat.name}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition text-center"
                style={{ 
                  backgroundColor: `${cat.color}10`,
                  borderColor: `${cat.color}30` 
                }}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <h3 className="font-medium text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-600">{cat.count} servers</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}