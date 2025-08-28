import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify } from '../../lib/utils';
import { Category } from '../../types';

/**
 * Categories overview page: displays grid view of all categories
 */
export default function CategoriesPage() {
  const { mcpData, loading, error } = useMCP();

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore MCP servers organized by category. Find the perfect tools for your specific needs.
        </p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{mcpData.categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{mcpData.metadata.total_servers}</div>
            <div className="text-gray-600">Total Servers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(mcpData.metadata.total_servers / mcpData.categories.length)}
            </div>
            <div className="text-gray-600">Avg per Category</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mcpData.categories
          .sort((a, b) => b.count - a.count) // Sort by server count
          .map((category: Category) => (
            <Link
              to={`/category/${slugify(category.name)}`}
              key={category.name}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-gray-300"
              style={{ 
                backgroundColor: `${category.color}08`,
                borderLeftColor: category.color,
                borderLeftWidth: '4px'
              }}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
                
                {/* Server Count */}
                <div className="flex items-center justify-center space-x-2">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color
                    }}
                  >
                    {category.count} {category.count === 1 ? 'server' : 'servers'}
                  </span>
                </div>
                
                {/* Top Servers Preview */}
                {category.servers && category.servers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Featured:</div>
                    <div className="text-xs text-gray-700">
                      {category.servers.slice(0, 3).join(', ')}
                      {category.servers.length > 3 && '...'}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-blue-100 mb-6">
          Browse all MCP servers or use our search functionality to find specific tools.
        </p>
        <div className="space-x-4">
          <Link
            to="/browse"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Browse All Servers
          </Link>
          <Link
            to="/browse?q="
            className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-300 transition"
          >
            Search Servers
          </Link>
        </div>
      </div>
    </div>
  );
}