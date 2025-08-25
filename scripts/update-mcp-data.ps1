# =============================================================================
#                    MCP Navigator - 一鍵數據更新腳本 (PowerShell)
# =============================================================================
#
# 檔案用途：
#     這是 MCP Navigator 專案的自動化數據更新腳本 (Windows PowerShell 版本)，
#     用於一鍵執行完整的 MCP 數據收集、驗證和部署流程。
#
# 主要功能：
#     • 自動執行 Python 數據收集腳本
#     • 驗證收集到的數據完整性
#     • 更新網站前端數據檔案
#     • 自動提交變更到 Git 倉庫
#     • 推送到 GitHub 觸發網站更新
#
# 使用方法：
#     PowerShell -ExecutionPolicy Bypass -File scripts\update-mcp-data.ps1
#     或者：.\scripts\update-mcp-data.ps1
#
# 必要條件：
#     • Python 3.7+ 已安裝
#     • Git 已配置
#     • 具有 GitHub 推送權限
#
# =============================================================================

# 設定錯誤處理
$ErrorActionPreference = "Stop"

Write-Host "MCP Navigator Data Update Starting..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Yellow

# Check required tools
Write-Host "Checking required tools..." -ForegroundColor Cyan

try {
    py --version | Out-Null
    Write-Host "Python is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

try {
    git --version | Out-Null
    Write-Host "Git is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Tool check completed" -ForegroundColor Green

# Set working directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

Write-Host "Working directory: $ProjectRoot" -ForegroundColor Cyan

# Step 1: Execute data collection
Write-Host "`nStep 1: Executing MCP data collection..." -ForegroundColor Cyan
if (Test-Path "code\comprehensive_mcp_collector.py") {
    try {
        py code\comprehensive_mcp_collector.py
        Write-Host "Data collection completed" -ForegroundColor Green
    } catch {
        Write-Host "Error: Data collection failed - $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: Data collection script not found" -ForegroundColor Red
    exit 1
}

# Step 2: Validate data integrity
Write-Host "`nStep 2: Validating data integrity..." -ForegroundColor Cyan
if (Test-Path "code\data_validation.py") {
    try {
        py code\data_validation.py
        Write-Host "Data validation completed" -ForegroundColor Green
    } catch {
        Write-Host "Error: Data validation failed - $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: Data validation script not found" -ForegroundColor Red
    exit 1
}

# Step 3: Update frontend data files
Write-Host "`nStep 3: Updating frontend data files..." -ForegroundColor Cyan
if (Test-Path "data\comprehensive_mcp_directory.json") {
    try {
        # 確保目標目錄存在
        if (!(Test-Path "mcp-navigator\public\data")) {
            New-Item -ItemType Directory -Path "mcp-navigator\public\data" -Force | Out-Null
        }
        
        # 複製到前端 public 目錄
        Copy-Item "data\comprehensive_mcp_directory.json" "mcp-navigator\public\data\" -Force
        Write-Host "Frontend data files update completed" -ForegroundColor Green
    } catch {
        Write-Host "Error: File copy failed - $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: Data file not found" -ForegroundColor Red
    exit 1
}

# Step 4: Check Git status
Write-Host "`nStep 4: Checking changes..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Host "No file changes, no commit needed" -ForegroundColor Yellow
    Write-Host "Update completed!" -ForegroundColor Green
    exit 0
}

Write-Host "Found the following changes:" -ForegroundColor Yellow
git status --short

# Step 5: Commit changes
Write-Host "`nStep 5: Committing changes to Git..." -ForegroundColor Cyan
try {
    $CurrentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git add .
    git commit -m "Auto-update MCP data - $CurrentDate"
    Write-Host "Git commit completed" -ForegroundColor Green
} catch {
    Write-Host "Error: Git commit failed - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Push to GitHub
Write-Host "`nStep 6: Pushing to GitHub..." -ForegroundColor Cyan
try {
    git push origin master
    Write-Host "GitHub push completed" -ForegroundColor Green
} catch {
    Write-Host "Error: GitHub push failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check network connection and GitHub permissions" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nMCP Navigator data update completed successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Yellow
Write-Host "Update Summary:" -ForegroundColor Cyan
Write-Host "   - Data Collection: Completed" -ForegroundColor White
Write-Host "   - Data Validation: Completed" -ForegroundColor White
Write-Host "   - Frontend Update: Completed" -ForegroundColor White
Write-Host "   - Git Commit: Completed" -ForegroundColor White
Write-Host "   - GitHub Push: Completed" -ForegroundColor White
Write-Host "`nWebsite will be updated automatically in a few minutes" -ForegroundColor Green
Write-Host "   Preview: http://localhost:5173/" -ForegroundColor Blue
Write-Host "   Online: https://github.com/jason660519/MCP-Navigator" -ForegroundColor Blue

# Pause to view results
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")