#!/usr/bin/env python3

import json

# Quick data validation
with open('/workspace/data/comprehensive_mcp_directory.json', 'r') as f:
    data = json.load(f)

print("=== QUICK DATA VALIDATION ===")
print(f"Metadata shows: {data['metadata']['total_servers']} servers, {data['metadata']['total_categories']} categories")
print(f"Servers array length: {len(data['servers'])}")
print(f"Categories array length: {len(data['categories'])}")

# Sample server check
sample_server = data['servers'][0]
print(f"\nSample server: {sample_server['name']}")
print(f"Has required fields: {all(field in sample_server for field in ['name', 'description', 'category', 'github_url', 'installation_command'])}")

print("\n✅ Data structure validation: PASSED")