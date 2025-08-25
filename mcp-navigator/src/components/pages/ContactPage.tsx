import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          Have questions about MCP Navigator or want to contribute? Feel free to reach out to us.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Email</h3>
            <a 
              href="mailto:jason660519@gmail.com"
              className="text-blue-600 hover:text-blue-800 transition"
            >
              jason660519@gmail.com
            </a>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">GitHub</h3>
            <a
              href="https://github.com/jason660519/MCP-Navigator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              MCP Navigator
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About MCP Navigator</h2>
        <p className="text-gray-600 mb-4">
          MCP Navigator is a community-driven directory of Model Context Protocol servers. 
          We aim to make it easier for developers to discover and integrate MCP servers into their AI applications.
        </p>
        <p className="text-gray-600">
          This is an open-source project and we welcome contributions from the community.
        </p>
      </div>
    </div>
  );
}