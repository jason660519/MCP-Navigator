import { Link } from 'react-router-dom';
import { useMCP } from '../../context/MCPContext';
import { slugify } from '../../lib/utils';
import { useState, useEffect } from 'react';

export default function Footer() {
  const { mcpData } = useMCP();
  const currentYear = new Date().getFullYear();
  const [lastUpdated, setLastUpdated] = useState<string>('2025-08-24');

  // 獲取 git 最後提交時間
  useEffect(() => {
    const getLastCommitDate = async () => {
      try {
        // 嘗試從 GitHub API 獲取最後提交時間
        const response = await fetch('https://api.github.com/repos/jason660519/MCP-Navigator/commits/master');
        if (response.ok) {
          const data = await response.json();
          const commitDate = new Date(data.commit.committer.date);
          setLastUpdated(commitDate.toISOString().split('T')[0]);
        }
      } catch (error) {
        console.log('無法獲取最後提交時間，使用預設值');
        // 保持預設值
      }
    };

    getLastCommitDate();
  }, []);

  // Get some featured categories
  const featuredCategories = mcpData?.categories.slice(0, 6) || [];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MCP Navigator</h3>
            <p className="text-gray-400 mb-4">
              A comprehensive directory of Model Context Protocol servers for AI model integration.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/modelcontextprotocol/servers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                <span>MCP server github</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white transition">
                  Browse All MCPs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/modelcontextprotocol/servers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contribute
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <ul className="space-y-2">
              {featuredCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={`/category/${slugify(category.name)}`}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {category.icon} {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="font-medium">Total MCPs:</span>{' '}
                {mcpData?.metadata.total_servers || 0}
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Categories:</span>{' '}
                {mcpData?.metadata.total_categories || 0}
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Last Updated:</span>{' '}
                {lastUpdated}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} MCP Navigator. All rights reserved.</p>
          <p className="mt-2">
            MCP Navigator is not affiliated with the official Model Context Protocol project.
            This is a community-created resource.
          </p>
        </div>
      </div>
    </footer>
  );
}