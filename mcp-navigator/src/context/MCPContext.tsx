import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MCPDirectory } from '../types';

interface MCPContextType {
  loading: boolean;
  error: string | null;
  mcpData: MCPDirectory | null;
}

const MCPContext = createContext<MCPContextType>({
  loading: true,
  error: null,
  mcpData: null,
});

export function MCPProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mcpData, setMcpData] = useState<MCPDirectory | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/comprehensive_mcp_directory.json');
        if (!response.ok) {
          throw new Error('Failed to fetch MCP data');
        }
        const data = await response.json();
        setMcpData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <MCPContext.Provider value={{ loading, error, mcpData }}>
      {children}
    </MCPContext.Provider>
  );
}

export function useMCP() {
  return useContext(MCPContext);
}