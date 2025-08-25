#!/usr/bin/env python3
"""
=============================================================================
                    MCP Navigator - 數據驗證工具
=============================================================================

檔案用途：
    這是 MCP Navigator 專案的數據品質驗證腳本，用於檢查和驗證收集到的
    MCP 服務器數據的完整性、一致性和正確性。確保網站顯示的數據符合
    預期格式和品質標準。

主要功能：
    • 驗證 JSON 數據結構完整性
    • 檢查必要欄位是否存在且非空
    • 統計分類分佈和服務器數量
    • 生成詳細的驗證報告
    • 識別數據品質問題和缺失資訊

必要依賴項：
    Python 3.7+ 及以下標準庫模組：
    - json: JSON 數據解析和處理

安裝步驟：
    1. 確保 Python 3.7+ 已安裝
    2. 確保 comprehensive_mcp_directory.json 檔案存在
    3. 直接執行腳本：python data_validation.py

重要參數說明：
    • required_fields: 必須存在的欄位列表
      - name: 服務器名稱
      - description: 服務器描述
      - category: 分類標籤
      - github_url: GitHub 倉庫連結
      - installation_command: 安裝指令
    • data_file_path: 待驗證的 JSON 數據檔案路徑

驗證項目：
    1. 數據檔案存在性和可讀性
    2. JSON 格式正確性
    3. 必要欄位完整性檢查
    4. 分類統計和分佈分析
    5. 樣本數據展示和驗證

輸出報告：
    • 總服務器數量統計
    • 分類分佈詳情
    • 缺失欄位警告
    • 樣本數據預覽
    • 數據品質評估結果

使用範例：
    # 基本驗證
    python data_validation.py
    
    # 程式化使用
    from data_validation import validate_mcp_data
    total_servers, total_categories = validate_mcp_data()

作者：MCP Navigator 專案團隊
版本：1.0.0
最後更新：2025-01-15
=============================================================================
"""

import json

def validate_mcp_data():
    # Load and analyze the comprehensive MCP directory
    with open('data/comprehensive_mcp_directory.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print('=== DATA VALIDATION REPORT ===')
    print(f'Total MCP servers in database: {len(data["servers"])}')

    # Count categories
    categories = {}
    for server_key, server in data['servers'].items():
        category = server.get('category', 'Unknown')
        categories[category] = categories.get(category, 0) + 1

    print(f'Total categories: {len(categories)}')
    print('\nCategory breakdown:')
    for category, count in sorted(categories.items()):
        print(f'  {category}: {count} servers')

    # Validate required fields
    print('\n=== FIELD VALIDATION ===')
    required_fields = ['name', 'description', 'category', 'repository_link', 'installation_instructions']
    missing_fields = {}

    for server_key, server in data['servers'].items():
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
    server_items = list(data['servers'].items())[:3]
    for i, (server_key, server) in enumerate(server_items):
        print(f'{i+1}. {server["name"]}')
        print(f'   Category: {server.get("category", "N/A")}')
        print(f'   GitHub: {server.get("repository_link", "N/A")}')
        print(f'   Install: {server.get("installation_instructions", "N/A")}')
        print()

    # Verify GitHub URL format
    print('\n=== GITHUB URL VALIDATION ===')
    github_issues = []
    for server_key, server in data['servers'].items():
        github_url = server.get('repository_link', '')
        if github_url and not github_url.startswith('https://github.com/'):
            github_issues.append(f"{server['name']}: {github_url}")
    
    if github_issues:
        print(f'GitHub URL format issues: {len(github_issues)}')
        for issue in github_issues[:3]:
            print(f'  {issue}')
    else:
        print('✅ All GitHub URLs properly formatted')

    return len(data['servers']), len(categories)

if __name__ == "__main__":
    total_servers, total_categories = validate_mcp_data()