<#
.SYNOPSIS
    MCP Servers 自動化安裝腳本
.DESCRIPTION
    此腳本會自動安裝所有 46 個 MCP 伺服器，支持 npm、pip、git 和 go 安裝方法
.PARAMETER ConfigFile
    MCP 伺服器配置文件路徑，默認為 mcp-servers-config.json
.PARAMETER InstallMethod
    指定安裝方法：all, npm, pip, git, go
.PARAMETER ServerList
    指定要安裝的伺服器列表，用逗號分隔
.PARAMETER SkipPrerequisites
    跳過先決條件檢查
.EXAMPLE
    .\install-mcp-servers.ps1
    安裝所有 MCP 伺服器
.EXAMPLE
    .\install-mcp-servers.ps1 -InstallMethod npm
    只安裝 npm 包
.EXAMPLE
    .\install-mcp-servers.ps1 -ServerList "filesystem,git,github"
    只安裝指定的伺服器
#>

param(
    [string]$ConfigFile = "mcp-servers-config.json",
    [ValidateSet("all", "npm", "pip", "git", "go", "unity")]
    [string]$InstallMethod = "all",
    [string]$ServerList = "",
    [switch]$SkipPrerequisites
)

# 設置錯誤處理
$ErrorActionPreference = "Stop"

# 顏色輸出函數
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 檢查先決條件
function Test-Prerequisites {
    Write-ColorOutput "檢查先決條件..." "Yellow"
    
    $prerequisites = @{
        "Node.js" = { node --version }
        "npm" = { npm --version }
        "Python" = { python --version }
        "pip" = { pip --version }
        "Git" = { git --version }
        "Go" = { go version }
    }
    
    $missing = @()
    
    foreach ($tool in $prerequisites.Keys) {
        try {
            $version = & $prerequisites[$tool] 2>$null
            if ($version) {
                Write-ColorOutput "✓ $tool: $version" "Green"
            } else {
                $missing += $tool
            }
        } catch {
            $missing += $tool
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-ColorOutput "缺少以下工具: $($missing -join ', ')" "Red"
        Write-ColorOutput "請安裝缺少的工具後重新運行腳本" "Yellow"
        return $false
    }
    
    return $true
}

# 讀取配置文件
function Get-MCPConfig {
    param([string]$ConfigPath)
    
    if (-not (Test-Path $ConfigPath)) {
        Write-ColorOutput "配置文件不存在: $ConfigPath" "Red"
        exit 1
    }
    
    try {
        $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
        Write-ColorOutput "成功讀取配置文件" "Green"
        return $config
    } catch {
        Write-ColorOutput "無法解析配置文件: $($_.Exception.Message)" "Red"
        exit 1
    }
}

# 安裝 npm 包
function Install-NpmPackage {
    param(
        [string]$PackageName,
        [string]$ServerName
    )
    
    Write-ColorOutput "安裝 npm 包: $PackageName" "Cyan"
    
    try {
        $result = npm install -g $PackageName 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ 成功安裝 $ServerName" "Green"
            return $true
        } else {
            Write-ColorOutput "✗ 安裝失敗 $ServerName`: $result" "Red"
            return $false
        }
    } catch {
        Write-ColorOutput "✗ 安裝異常 $ServerName`: $($_.Exception.Message)" "Red"
        return $false
    }
}

# 安裝 pip 包
function Install-PipPackage {
    param(
        [string]$PackageName,
        [string]$ServerName
    )
    
    Write-ColorOutput "安裝 pip 包: $PackageName" "Cyan"
    
    try {
        $result = pip install $PackageName 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ 成功安裝 $ServerName" "Green"
            return $true
        } else {
            Write-ColorOutput "✗ 安裝失敗 $ServerName`: $result" "Red"
            return $false
        }
    } catch {
        Write-ColorOutput "✗ 安裝異常 $ServerName`: $($_.Exception.Message)" "Red"
        return $false
    }
}

# 克隆 Git 倉庫
function Install-GitRepository {
    param(
        [string]$Repository,
        [string]$ServerName
    )
    
    Write-ColorOutput "克隆 Git 倉庫: $Repository" "Cyan"
    
    $cloneDir = "mcp-servers\$ServerName"
    
    try {
        if (Test-Path $cloneDir) {
            Write-ColorOutput "目錄已存在，更新倉庫..." "Yellow"
            Set-Location $cloneDir
            git pull
            Set-Location ..\..
        } else {
            New-Item -ItemType Directory -Path "mcp-servers" -Force | Out-Null
            git clone $Repository $cloneDir
        }
        
        Write-ColorOutput "✓ 成功克隆 $ServerName" "Green"
        return $true
    } catch {
        Write-ColorOutput "✗ 克隆失敗 $ServerName`: $($_.Exception.Message)" "Red"
        return $false
    }
}

# 安裝 Go 包
function Install-GoPackage {
    param(
        [string]$PackageName,
        [string]$ServerName
    )
    
    Write-ColorOutput "安裝 Go 包: $PackageName" "Cyan"
    
    try {
        $result = go install $PackageName 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ 成功安裝 $ServerName" "Green"
            return $true
        } else {
            Write-ColorOutput "✗ 安裝失敗 $ServerName`: $result" "Red"
            return $false
        }
    } catch {
        Write-ColorOutput "✗ 安裝異常 $ServerName`: $($_.Exception.Message)" "Red"
        return $false
    }
}

# 安裝單個伺服器
function Install-MCPServer {
    param(
        [object]$Server,
        [string]$ServerKey
    )
    
    $serverName = $Server.name
    $installMethod = $Server.installation_method
    $package = $Server.package
    $repository = $Server.repository
    
    Write-ColorOutput "\n開始安裝: $serverName ($ServerKey)" "Magenta"
    Write-ColorOutput "類別: $($Server.category)" "Gray"
    Write-ColorOutput "描述: $($Server.description)" "Gray"
    
    switch ($installMethod) {
        "npm" {
            return Install-NpmPackage -PackageName $package -ServerName $serverName
        }
        "pip" {
            return Install-PipPackage -PackageName $package -ServerName $serverName
        }
        "git" {
            return Install-GitRepository -Repository $repository -ServerName $ServerKey
        }
        "go" {
            return Install-GoPackage -PackageName $package -ServerName $serverName
        }
        "unity" {
            Write-ColorOutput "Unity 包需要手動安裝: $repository" "Yellow"
            return $true
        }
        default {
            Write-ColorOutput "不支援的安裝方法: $installMethod" "Red"
            return $false
        }
    }
}

# 主安裝函數
function Start-Installation {
    param(
        [object]$Config,
        [string]$Method,
        [array]$Servers
    )
    
    $totalServers = 0
    $successCount = 0
    $failedServers = @()
    
    Write-ColorOutput "\n開始安裝 MCP 伺服器..." "Yellow"
    Write-ColorOutput "安裝方法: $Method" "Gray"
    
    foreach ($serverKey in $Config.servers.PSObject.Properties.Name) {
        $server = $Config.servers.$serverKey
        
        # 檢查是否符合安裝條件
        if ($Method -ne "all" -and $server.installation_method -ne $Method) {
            continue
        }
        
        if ($Servers.Count -gt 0 -and $serverKey -notin $Servers) {
            continue
        }
        
        $totalServers++
        
        if (Install-MCPServer -Server $server -ServerKey $serverKey) {
            $successCount++
        } else {
            $failedServers += $server.name
        }
    }
    
    # 安裝結果摘要
    Write-ColorOutput "\n=== 安裝結果摘要 ===" "Yellow"
    Write-ColorOutput "總計伺服器: $totalServers" "White"
    Write-ColorOutput "成功安裝: $successCount" "Green"
    Write-ColorOutput "安裝失敗: $($failedServers.Count)" "Red"
    
    if ($failedServers.Count -gt 0) {
        Write-ColorOutput "\n失敗的伺服器:" "Red"
        foreach ($failed in $failedServers) {
            Write-ColorOutput "  - $failed" "Red"
        }
    }
    
    Write-ColorOutput "\n安裝完成！" "Green"
}

# 創建環境變數設置腳本
function New-EnvironmentScript {
    param([object]$Config)
    
    $envScript = @"
# MCP 伺服器環境變數設置腳本
# 請根據需要設置以下環境變數

# === API Keys ===
# set GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
# set BRAVE_API_KEY=your_brave_api_key_here
# set OPENAI_API_KEY=your_openai_api_key_here
# set STRIPE_API_KEY=your_stripe_api_key_here
# set NOTION_API_KEY=your_notion_api_key_here
# set YOUTUBE_API_KEY=your_youtube_api_key_here
# set GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
# set SLACK_BOT_TOKEN=your_slack_bot_token_here
# set SENTRY_DSN=your_sentry_dsn_here
# set CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
# set LINEAR_API_KEY=your_linear_api_key_here
# set SPOTIFY_CLIENT_ID=your_spotify_client_id_here
# set SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
# set HUGGINGFACE_API_KEY=your_huggingface_api_key_here
# set LLAMACLOUD_API_KEY=your_llamacloud_api_key_here
# set BROWSERBASE_API_KEY=your_browserbase_api_key_here
# set E2B_API_KEY=your_e2b_api_key_here
# set EVERART_API_KEY=your_everart_api_key_here

# === AWS Configuration ===
# set AWS_ACCESS_KEY_ID=your_aws_access_key_here
# set AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
# set AWS_REGION=us-east-1

# === Database URLs ===
# set DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# set MONGODB_URI=mongodb://localhost:27017/dbname
# set REDIS_URL=redis://localhost:6379

# === File Paths ===
# set ALLOWED_DIRECTORIES=C:\\path\\to\\allowed\\directory
# set DATABASE_PATH=C:\\path\\to\\sqlite\\database.db
# set OBSIDIAN_VAULT_PATH=C:\\path\\to\\obsidian\\vault
# set APPLE_BOOKS_PATH=C:\\path\\to\\apple\\books
# set QGIS_PATH=C:\\path\\to\\qgis

# === Other Configuration ===
# set CHROMA_HOST=localhost
# set CHROMA_PORT=8000
# set KUBECONFIG=C:\\path\\to\\kubeconfig

echo "環境變數設置完成！"
echo "請重新啟動 VS Code 以使環境變數生效"
"@
    
    $envScript | Out-File -FilePath "set-mcp-environment.bat" -Encoding UTF8
    Write-ColorOutput "已創建環境變數設置腳本: set-mcp-environment.bat" "Green"
}

# 主程序
try {
    Write-ColorOutput "MCP Servers 自動化安裝腳本" "Magenta"
    Write-ColorOutput "================================" "Magenta"
    
    # 檢查先決條件
    if (-not $SkipPrerequisites) {
        if (-not (Test-Prerequisites)) {
            exit 1
        }
    }
    
    # 讀取配置
    $config = Get-MCPConfig -ConfigPath $ConfigFile
    
    # 解析伺服器列表
    $serverArray = @()
    if ($ServerList) {
        $serverArray = $ServerList -split "," | ForEach-Object { $_.Trim() }
    }
    
    # 開始安裝
    Start-Installation -Config $config -Method $InstallMethod -Servers $serverArray
    
    # 創建環境變數設置腳本
    New-EnvironmentScript -Config $config
    
    Write-ColorOutput "\n下一步:" "Yellow"
    Write-ColorOutput "1. 編輯 set-mcp-environment.bat 設置必要的環境變數" "White"
    Write-ColorOutput "2. 運行 .\test-mcp-servers.ps1 測試安裝" "White"
    Write-ColorOutput "3. 運行 .\update-vscode-config.ps1 更新 VS Code 配置" "White"
    
} catch {
    Write-ColorOutput "腳本執行失敗: $($_.Exception.Message)" "Red"
    exit 1
}