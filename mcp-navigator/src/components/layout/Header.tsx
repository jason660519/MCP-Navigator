import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify } from '../../lib/utils';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { mcpData } = useMCP();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              MCP Navigator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link to="/browse" className="text-gray-300 hover:text-white transition">
              Browse All
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button 
                className="text-gray-300 hover:text-white transition flex items-center"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              >
                Categories
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                  {/* View All Categories Link */}
                  <Link
                    to="/categories"
                    className="block px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 border-b border-gray-100"
                    onClick={() => setCategoriesDropdownOpen(false)}
                  >
                    📋 View All Categories
                  </Link>
                  
                  {/* Individual Category Links */}
                    {mcpData?.categories.slice(0, 12).map((category) => (
                      <Link
                        key={category.name}
                        to={`/category/${slugify(category.name)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{category.count}</span>
                      </Link>
                    ))}
                    {mcpData && mcpData.categories.length > 12 && (
                      <Link
                        to="/categories"
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-center border-t border-gray-100"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        View all {mcpData.categories.length} categories →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition">
              Contact Us
            </Link>
          </nav>

          {/* Search Box (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search MCPs..."
                className="w-64 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search MCPs..."
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="text-gray-300 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse All
              </Link>
              <details className="group">
                <summary className="text-gray-300 hover:text-white transition py-2 cursor-pointer list-none flex justify-between items-center">
                  Categories
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-2 space-y-1 ml-4">
                  {mcpData?.categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/category/${slugify(category.name)}`}
                      className="block py-2 text-sm text-gray-400 hover:text-white flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-gray-500">{category.count}</span>
                    </Link>
                  ))}
                </div>
              </details>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}