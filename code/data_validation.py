#!/usr/bin/env python3

import json

def validate_mcp_data():
    # Load and analyze the comprehensive MCP directory
    with open('/workspace/data/comprehensive_mcp_directory.json', 'r') as f:
        data = json.load(f)

    print('=== DATA VALIDATION REPORT ===')
    print(f'Total MCP servers in database: {len(data)}')

    # Count categories
    categories = {}
    for server in data:
        category = server.get('category', 'Unknown')
        categories[category] = categories.get(category, 0) + 1

    print(f'Total categories: {len(categories)}')
    print('\nCategory breakdown:')
    for category, count in sorted(categories.items()):
        print(f'  {category}: {count} servers')

    # Validate required fields
    print('\n=== FIELD VALIDATION ===')
    required_fields = ['name', 'description', 'category', 'github_url', 'installation_command']
    missing_fields = {}

    for server in data:
        for field in required_fields:
            if field not in server or not server[field]:
                if field not in missing_fields:
                    missing_fields[field] = []
                missing_fields[field].append(server.get('name', 'Unknown'))

    if missing_fields:
        print('Missing or empty fields found:')
        for field, servers in missing_fields.items():
            print(f'  {field}: {len(servers)} servers affected - {servers[:3]}...')
    else:
        print('✅ All required fields present and populated')

    # Sample few servers for verification
    print('\n=== SAMPLE SERVERS ===')
    for i, server in enumerate(data[:3]):
        print(f'{i+1}. {server["name"]}')
        print(f'   Category: {server.get("category", "N/A")}')
        print(f'   GitHub: {server.get("github_url", "N/A")}')
        print(f'   Install: {server.get("installation_command", "N/A")}')
        print()

    # Verify GitHub URL format
    print('\n=== GITHUB URL VALIDATION ===')
    github_issues = []
    for server in data:
        github_url = server.get('github_url', '')
        if github_url and not github_url.startswith('https://github.com/'):
            github_issues.append(f"{server['name']}: {github_url}")
    
    if github_issues:
        print(f'GitHub URL format issues: {len(github_issues)}')
        for issue in github_issues[:3]:
            print(f'  {issue}')
    else:
        print('✅ All GitHub URLs properly formatted')

    return len(data), len(categories)

if __name__ == "__main__":
    total_servers, total_categories = validate_mcp_data()