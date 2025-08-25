#!/bin/bash

# =============================================================================
#                    MCP Navigator - 一鍵數據更新腳本
# =============================================================================
#
# 檔案用途：
#     這是 MCP Navigator 專案的自動化數據更新腳本，用於一鍵執行完整的
#     MCP 數據收集、驗證和部署流程。簡化手動更新過程，確保數據的
#     及時性和準確性。
#
# 主要功能：
#     • 自動執行 Python 數據收集腳本
#     • 驗證收集到的數據完整性
#     • 更新網站前端數據檔案
#     • 自動提交變更到 Git 倉庫
#     • 推送到 GitHub 觸發網站更新
#
# 使用方法：
#     chmod +x scripts/update-mcp-data.sh
#     ./scripts/update-mcp-data.sh
#
# 必要條件：
#     • Python 3.7+ 已安裝
#     • Git 已配置
#     • 具有 GitHub 推送權限
#
# =============================================================================

set -e  # 遇到錯誤立即退出

echo "🚀 MCP Navigator 數據更新開始..."
echo "======================================"

# 檢查必要工具
echo "📋 檢查必要工具..."
if ! command -v python &> /dev/null; then
    echo "❌ 錯誤：Python 未安裝或不在 PATH 中"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ 錯誤：Git 未安裝或不在 PATH 中"
    exit 1
fi

echo "✅ 工具檢查完成"

# 設定工作目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📂 工作目錄：$PROJECT_ROOT"

# 步驟 1：執行數據收集
echo "\n🔍 步驟 1：執行 MCP 數據收集..."
if [ -f "code/comprehensive_mcp_collector.py" ]; then
    python code/comprehensive_mcp_collector.py
    echo "✅ 數據收集完成"
else
    echo "❌ 錯誤：找不到數據收集腳本"
    exit 1
fi

# 步驟 2：驗證數據完整性
echo "\n🔍 步驟 2：驗證數據完整性..."
if [ -f "code/data_validation.py" ]; then
    python code/data_validation.py
    echo "✅ 數據驗證完成"
else
    echo "❌ 錯誤：找不到數據驗證腳本"
    exit 1
fi

# 步驟 3：更新前端數據檔案
echo "\n📋 步驟 3：更新前端數據檔案..."
if [ -f "data/comprehensive_mcp_directory.json" ]; then
    # 複製到前端 public 目錄
    cp "data/comprehensive_mcp_directory.json" "mcp-navigator/public/data/"
    echo "✅ 前端數據檔案更新完成"
else
    echo "❌ 錯誤：找不到數據檔案"
    exit 1
fi

# 步驟 4：檢查 Git 狀態
echo "\n📋 步驟 4：檢查變更..."
git status --porcelain
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  沒有檔案變更，無需提交"
    echo "🎉 更新完成！"
    exit 0
fi

# 步驟 5：提交變更
echo "\n💾 步驟 5：提交變更到 Git..."
CURRENT_DATE=$(date +"%Y-%m-%d %H:%M:%S")
git add .
git commit -m "Auto-update MCP data - $CURRENT_DATE"
echo "✅ Git 提交完成"

# 步驟 6：推送到 GitHub
echo "\n🚀 步驟 6：推送到 GitHub..."
git push origin master
echo "✅ GitHub 推送完成"

echo "\n🎉 MCP Navigator 數據更新完成！"
echo "======================================"
echo "📊 更新摘要："
echo "   • 數據收集：完成"
echo "   • 數據驗證：完成"
echo "   • 前端更新：完成"
echo "   • Git 提交：完成"
echo "   • GitHub 推送：完成"
echo "\n🌐 網站將在幾分鐘內自動更新"
echo "   預覽：http://localhost:5173/"
echo "   線上：https://github.com/jason660519/MCP-Navigator"