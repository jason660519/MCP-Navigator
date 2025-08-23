#!/usr/bin/env python3
"""
MCP Data Collector
Systematically collects and organizes MCP server information from multiple sources
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Set, Any
import re

class MCPDataCollector:
    def __init__(self):
        self.mcp_servers = {}
        self.categories = set()
        self.sources = {}
        
    def load_browser_extracted_data(self):
        """Load data from browser extracted content"""
        browser_file = "/workspace/browser/extracted_content/mcp_servers_complete_list.md"
        if os.path.exists(browser_file):
            with open(browser_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract server information from the markdown content
                self._parse_browser_content(content)
                
    def load_examples_data(self):
        """Load official examples data"""
        examples_file = "/workspace/docs/mcp_examples.md"
        if os.path.exists(examples_file):
            try:
                with open(examples_file, 'r', encoding='utf-8') as f:
                    import json
                    content = f.read()
                    # Try to extract JSON data if present
                    if '{' in content:
                        start = content.find('{')
                        end = content.rfind('}') + 1
                        json_data = json.loads(content[start:end])
                        if 'servers' in json_data:
                            for server in json_data['servers']:
                                self._add_server(
                                    name=server['name'],
                                    description=server['description'],
                                    category='Official Reference',
                                    repository_link=server.get('repository_link', ''),
                                    source='modelcontextprotocol.io/examples'
                                )
            except Exception as e:
                print(f"Error loading examples data: {e}")
    
    def _parse_browser_content(self, content: str):
        """Parse browser extracted content for server information"""
        lines = content.split('\n')
        current_category = None
        
        for line in lines:
            line = line.strip()
            
            # Detect category headers
            if line.startswith('##') and ('servers' in line.lower() or 'integrations' in line.lower()):
                current_category = self._extract_category_from_header(line)
                continue
                
            # Look for server entries (numbered lists or bullet points)
            if re.match(r'^\d+\.\s+', line) or line.startswith('- '):
                server_info = self._extract_server_from_line(line, current_category)
                if server_info:
                    self._add_server(**server_info)
    
    def _extract_category_from_header(self, header: str) -> str:
        """Extract category name from header"""
        if 'reference' in header.lower():
            return 'Official Reference'
        elif 'official' in header.lower():
            return 'Official Integration'
        elif 'community' in header.lower():
            return 'Community'
        else:
            return 'Other'
    
    def _extract_server_from_line(self, line: str, category: str) -> Dict:
        """Extract server information from a line"""
        # Remove numbering and bullet points
        line = re.sub(r'^\d+\.\s*', '', line)
        line = re.sub(r'^-\s*', '', line)
        
        # Extract name and description
        parts = line.split(' - ', 1)
        if len(parts) >= 2:
            name = parts[0].strip()
            description = parts[1].strip()
            
            return {
                'name': name,
                'description': description,
                'category': category or 'Uncategorized',
                'repository_link': '',
                'source': 'github.com/modelcontextprotocol/servers'
            }
        return None
    
    def _add_server(self, name: str, description: str, category: str, 
                   repository_link: str = '', source: str = '', **kwargs):
        """Add a server to the collection"""
        # Create unique key
        key = name.lower().replace(' ', '_').replace('-', '_')
        
        # Add to categories
        self.categories.add(category)
        
        # Store server data
        server_data = {
            'name': name,
            'description': description,
            'category': category,
            'repository_link': repository_link,
            'source': source,
            'installation_method': self._determine_installation_method(repository_link),
            'popularity_indicators': {
                'github_stars': None,
                'npm_downloads': None,
                'community_mentions': 0
            },
            'last_updated': None,
            'creator_maintainer': self._extract_creator_from_repo(repository_link),
            'documentation_links': [],
            'usage_examples': [],
            **kwargs
        }
        
        # If server already exists, merge information
        if key in self.mcp_servers:
            existing = self.mcp_servers[key]
            # Keep the most detailed description
            if len(description) > len(existing.get('description', '')):
                existing['description'] = description
            # Collect all sources
            if source and source not in existing.get('sources', []):
                if 'sources' not in existing:
                    existing['sources'] = [existing.get('source', '')]
                existing['sources'].append(source)
        else:
            self.mcp_servers[key] = server_data
    
    def _determine_installation_method(self, repo_link: str) -> str:
        """Determine installation method based on repository"""
        if not repo_link:
            return 'unknown'
        if 'npm' in repo_link.lower():
            return 'npm'
        elif 'github.com' in repo_link:
            return 'git_clone'
        elif 'pypi' in repo_link.lower():
            return 'pip'
        else:
            return 'manual'
    
    def _extract_creator_from_repo(self, repo_link: str) -> str:
        """Extract creator/organization from repository link"""
        if not repo_link or 'github.com' not in repo_link:
            return 'unknown'
        
        try:
            # Extract organization/user from GitHub URL
            parts = repo_link.replace('https://github.com/', '').split('/')
            if len(parts) >= 1:
                return parts[0]
        except:
            pass
        return 'unknown'
    
    def generate_categories(self) -> List[Dict]:
        """Generate suggested categories for website organization"""
        category_mapping = {
            'File Systems': ['filesystem', 'file', 'storage', 'drive'],
            'Databases': ['database', 'sql', 'postgres', 'mysql', 'mongo', 'redis'],
            'Development Tools': ['git', 'github', 'ide', 'code', 'development'],
            'Cloud Services': ['aws', 'azure', 'cloudflare', 'cloud'],
            'Communication': ['slack', 'discord', 'email', 'chat', 'messaging'],
            'Web & Search': ['search', 'web', 'browser', 'scraping', 'crawl'],
            'AI & ML': ['ai', 'ml', 'openai', 'model', 'llm'],
            'Productivity': ['notion', 'todoist', 'calendar', 'task'],
            'Finance & Crypto': ['crypto', 'bitcoin', 'payment', 'finance', 'stripe'],
            'Security & Monitoring': ['security', 'monitoring', 'sentry', 'logging'],
            'API & Integration': ['api', 'integration', 'webhook'],
            'Media & Content': ['image', 'video', 'audio', 'media', 'content']
        }
        
        categories = []
        for category_name, keywords in category_mapping.items():
            count = 0
            servers = []
            
            for server_key, server_data in self.mcp_servers.items():
                server_text = f"{server_data['name']} {server_data['description']}".lower()
                if any(keyword in server_text for keyword in keywords):
                    count += 1
                    servers.append(server_key)
            
            categories.append({
                'name': category_name,
                'count': count,
                'description': f"MCPs for {category_name.lower()}",
                'icon': self._get_category_icon(category_name),
                'servers': servers[:10]  # Top 10 for preview
            })
        
        return sorted(categories, key=lambda x: x['count'], reverse=True)
    
    def _get_category_icon(self, category_name: str) -> str:
        """Get icon suggestion for category"""
        icon_map = {
            'File Systems': '📁',
            'Databases': '🗄️',
            'Development Tools': '⚒️',
            'Cloud Services': '☁️',
            'Communication': '💬',
            'Web & Search': '🔍',
            'AI & ML': '🤖',
            'Productivity': '📋',
            'Finance & Crypto': '💰',
            'Security & Monitoring': '🔒',
            'API & Integration': '🔗',
            'Media & Content': '🎬'
        }
        return icon_map.get(category_name, '📦')
    
    def add_manual_servers(self):
        """Add manually curated popular servers"""
        popular_servers = [
            {
                'name': 'Filesystem',
                'description': 'Secure file operations with configurable access controls',
                'category': 'File Systems',
                'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
                'source': 'official'
            },
            {
                'name': 'PostgreSQL',
                'description': 'Read-only database access with schema inspection capabilities',
                'category': 'Databases',
                'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
                'source': 'official'
            },
            {
                'name': 'GitHub',
                'description': 'Repository management, file operations, and GitHub API integration',
                'category': 'Development Tools',
                'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
                'source': 'official'
            },
            {
                'name': 'Slack',
                'description': 'Channel management and messaging capabilities',
                'category': 'Communication',
                'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
                'source': 'official'
            },
            {
                'name': 'Google Drive',
                'description': 'File access and search capabilities for Google Drive',
                'category': 'Cloud Services',
                'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive',
                'source': 'official'
            }
        ]
        
        for server in popular_servers:
            self._add_server(**server)
    
    def export_to_json(self, output_file: str):
        """Export collected data to JSON"""
        export_data = {
            'metadata': {
                'total_servers': len(self.mcp_servers),
                'categories': list(self.categories),
                'collection_date': '2025-05-26',
                'sources': list(set(server.get('source', '') for server in self.mcp_servers.values()))
            },
            'categories': self.generate_categories(),
            'servers': self.mcp_servers
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"Exported {len(self.mcp_servers)} servers to {output_file}")
        return export_data

def main():
    """Main execution function"""
    collector = MCPDataCollector()
    
    # Load data from various sources
    print("Loading browser extracted data...")
    collector.load_browser_extracted_data()
    
    print("Loading examples data...")
    collector.load_examples_data()
    
    print("Adding manually curated servers...")
    collector.add_manual_servers()
    
    # Add some well-known servers manually to ensure completeness
    well_known_servers = [
        {
            'name': 'SQLite',
            'description': 'Database interaction and business intelligence features',
            'category': 'Databases',
            'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
            'source': 'official'
        },
        {
            'name': 'Brave Search',
            'description': 'Web and local search using Brave\'s Search API',
            'category': 'Web & Search',
            'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
            'source': 'official'
        },
        {
            'name': 'Puppeteer',
            'description': 'Browser automation and web scraping capabilities',
            'category': 'Web & Search',
            'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
            'source': 'official'
        },
        {
            'name': 'Memory',
            'description': 'Knowledge graph-based persistent memory system',
            'category': 'AI & ML',
            'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
            'source': 'official'
        },
        {
            'name': 'Fetch',
            'description': 'Web content fetching and conversion optimized for LLM usage',
            'category': 'Web & Search',
            'repository_link': 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
            'source': 'official'
        }
    ]
    
    for server in well_known_servers:
        collector._add_server(**server)
    
    # Export data
    output_file = '/workspace/data/mcp_servers_database.json'
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    export_data = collector.export_to_json(output_file)
    
    # Generate summary report
    print(f"\n=== MCP Collection Summary ===")
    print(f"Total Servers Collected: {len(collector.mcp_servers)}")
    print(f"Categories Found: {len(collector.categories)}")
    print(f"Top Categories:")
    
    categories = collector.generate_categories()
    for i, cat in enumerate(categories[:10]):
        print(f"  {i+1}. {cat['name']}: {cat['count']} servers")
    
    return export_data

if __name__ == "__main__":
    main()