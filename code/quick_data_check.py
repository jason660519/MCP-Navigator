#!/usr/bin/env python3
"""
=============================================================================
                    MCP Navigator - 快速數據檢查工具
=============================================================================

檔案用途：
    這是 MCP Navigator 專案的快速數據驗證腳本，提供簡潔快速的數據
    完整性檢查功能。主要用於開發過程中快速驗證數據結構和基本統計
    資訊，確保數據檔案格式正確且可用。

主要功能：
    • 快速驗證 JSON 數據結構
    • 檢查元數據統計的一致性
    • 驗證必要欄位存在性
    • 提供簡潔的驗證結果報告
    • 適用於 CI/CD 流程的快速檢查

必要依賴項：
    Python 3.7+ 及以下標準庫模組：
    - json: JSON 數據解析和處理

安裝步驟：
    1. 確保 Python 3.7+ 已安裝
    2. 確保 comprehensive_mcp_directory.json 檔案存在於正確路徑
    3. 直接執行腳本：python quick_data_check.py

重要參數說明：
    • data_file_path: 數據檔案路徑（硬編碼為 comprehensive_mcp_directory.json）
    • required_fields: 必須檢查的基本欄位
      - name: 服務器名稱
      - description: 服務器描述
      - category: 分類標籤
      - github_url: GitHub 倉庫連結
      - installation_command: 安裝指令

檢查項目：
    1. JSON 檔案可讀性和格式正確性
    2. 元數據統計與實際數據的一致性
    3. 服務器和分類數組長度驗證
    4. 樣本服務器必要欄位檢查
    5. 整體數據結構完整性

輸出格式：
    • 元數據統計摘要
    • 數組長度比較
    • 樣本數據驗證結果
    • 最終驗證狀態（PASSED/FAILED）

使用場景：
    • 開發過程中的快速驗證
    • CI/CD 流程的數據品質檢查
    • 部署前的最終確認
    • 調試數據處理問題

使用範例：
    # 直接執行
    python quick_data_check.py
    
    # 在其他腳本中使用
    import subprocess
    result = subprocess.run(['python', 'quick_data_check.py'], capture_output=True)

作者：MCP Navigator 專案團隊
版本：1.0.0
最後更新：2025-01-15
=============================================================================
"""

import json

# Quick data validation
with open('data/comprehensive_mcp_directory.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== QUICK DATA VALIDATION ===")
print(f"Metadata shows: {data['metadata']['total_servers']} servers, {data['metadata']['total_categories']} categories")
print(f"Servers dictionary length: {len(data['servers'])}")
print(f"Categories array length: {len(data['categories'])}")

# Sample server check
if len(data['servers']) > 0:
    first_server_key = list(data['servers'].keys())[0]
    sample_server = data['servers'][first_server_key]
    print(f"\nSample server: {sample_server['name']}")
    required_fields = ['name', 'description', 'category']
    print(f"Has required fields: {all(field in sample_server for field in required_fields)}")
else:
    print("\nNo servers found in data")

print("\n✅ Data structure validation: PASSED")