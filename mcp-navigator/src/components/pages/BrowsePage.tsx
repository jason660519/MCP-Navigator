import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify, truncateText } from '../../lib/utils';
import { MCP } from '../../types';

export default function BrowsePage() {
  const { mcpData, loading, error } = useMCP();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [popularityFilter, setPopularityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name');
  
  // Filtered MCPs
  const [filteredMCPs, setFilteredMCPs] = useState<[string, MCP][]>([]);
  
  // Apply filters
  useEffect(() => {
    if (!mcpData) return;
    
    let results = Object.entries(mcpData.servers);
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(([_, mcp]) => 
        mcp.name.toLowerCase().includes(query) || 
        mcp.description.toLowerCase().includes(query) ||
        mcp.category.toLowerCase().includes(query) ||
        mcp.use_cases.some(useCase => useCase.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(([_, mcp]) => 
        mcp.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Apply popularity filter
    if (popularityFilter !== 'all') {
      results = results.filter(([_, mcp]) => 
        mcp.popularity_indicators.level === popularityFilter
      );
    }
    
    // Apply sorting
    if (sortBy === 'name') {
      results.sort((a, b) => a[1].name.localeCompare(b[1].name));
    } else if (sortBy === 'popularity') {
      const popularityValue = (level: string): number => {
        return level === 'high' ? 3 : level === 'medium' ? 2 : 1;
      };
      
      results.sort((a, b) => 
        popularityValue(b[1].popularity_indicators.level) - 
        popularityValue(a[1].popularity_indicators.level)
      );
    }
    
    setFilteredMCPs(results);
  }, [mcpData, searchQuery, categoryFilter, popularityFilter, sortBy]);
  
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Browse All MCPs</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            List
          </button>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search MCP servers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {mcpData.categories.map((category) => (
                <option key={category.name} value={category.name.toLowerCase()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Popularity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popularity</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={popularityFilter}
              onChange={(e) => setPopularityFilter(e.target.value)}
            >
              <option value="all">All Popularity Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'popularity')}
            >
              <option value="name">Name (A-Z)</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredMCPs.length} {filteredMCPs.length === 1 ? 'server' : 'servers'}
      </div>
      
      {/* MCP Grid/List */}
      {filteredMCPs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">No MCP servers found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMCPs.map(([id, mcp]) => (
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
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator/Maintainer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMCPs.map(([id, mcp]) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/mcp/${slugify(mcp.name)}`} className="text-blue-600 hover:underline font-medium">
                      {mcp.name}
                    </Link>
                    <p className="text-sm text-gray-500">{truncateText(mcp.description, 60)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {mcp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mcp.popularity_indicators.level === 'high' && '⭐⭐⭐'}
                    {mcp.popularity_indicators.level === 'medium' && '⭐⭐'}
                    {mcp.popularity_indicators.level === 'low' && '⭐'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mcp.creator_maintainer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}