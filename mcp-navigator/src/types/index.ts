export interface MCP {
  name: string;
  description: string;
  category: string;
  repository_link: string;
  creator_maintainer: string;
  installation_instructions: string;
  documentation_links: string[];
  popularity_indicators: {
    level: 'high' | 'medium' | 'low';
    github_stars: number | null;
    npm_downloads: number | null;
    community_mentions: number;
  };
  last_updated: string;
  source: string;
  use_cases: string[];
  examples: string[];
}

export interface Category {
  name: string;
  count: number;
  description: string;
  icon: string;
  color: string;
  servers: string[];
}

export interface MCPDirectory {
  metadata: {
    title: string;
    description: string;
    total_servers: number;
    total_categories: number;
    collection_date: string;
    version: string;
    sources: string[];
  };
  categories: Category[];
  servers: Record<string, MCP>;
}