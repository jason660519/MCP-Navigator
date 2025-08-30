# MCP 伺服器自動化安裝指南

本指南將幫助您使用自動化腳本安裝和配置 46 個 MCP (Model Context Protocol) 伺服器，並將它們整合到 VS Code 中。

## 📋 目錄

- [系統要求](#系統要求)
- [文件說明](#文件說明)
- [安裝步驟](#安裝步驟)
- [環境變量配置](#環境變量配置)
- [VS Code 配置](#vs-code-配置)
- [測試驗證](#測試驗證)
- [故障排除](#故障排除)
- [進階使用](#進階使用)

## 🔧 系統要求

在開始之前，請確保您的系統已安裝以下工具：

### 必需工具
- **Node.js** (v16 或更高版本)
- **npm** (通常隨 Node.js 一起安裝)
- **Python** (v3.8 或更高版本)
- **pip** (Python 包管理器)
- **Git** (版本控制系統)

### 可選工具
- **Go** (v1.19 或更高版本) - 用於 Go 語言的 MCP 伺服器
- **Unity** - 用於 Unity 相關的 MCP 伺服器

### 檢查工具版本
```bash
# 檢查 Node.js 版本
node --version

# 檢查 npm 版本
npm --version

# 檢查 Python 版本
python --version

# 檢查 pip 版本
pip --version

# 檢查 Git 版本
git --version

# 檢查 Go 版本（可選）
go version
```

## 📁 文件說明

本專案包含以下主要文件：

| 文件名 | 說明 |
|--------|------|
| `mcp-servers-config.json` | MCP 伺服器配置文件，包含所有 46 個伺服器的詳細信息 |
| `install_mcp_servers.py` | Python 安裝腳本，自動安裝所有 MCP 伺服器 |
| `test_mcp_servers.py` | Python 測試腳本，驗證已安裝的伺服器是否正常工作 |
| `vscode-mcp-settings-template.json` | VS Code 配置模板，包含所有伺服器的配置 |
| `MCP_Installation_Guide.md` | 本使用指南 |

## 🚀 安裝步驟

### 步驟 1: 準備工作

1. **克隆或下載專案**
   ```bash
   git clone <repository-url>
   cd MCP-Navigator
   ```

2. **檢查系統先決條件**
   ```bash
   python install_mcp_servers.py --skip-check
   ```

### 步驟 2: 運行安裝腳本

#### 安裝所有伺服器
```bash
python install_mcp_servers.py
```

#### 按安裝方法分類安裝
```bash
# 只安裝 npm 包
python install_mcp_servers.py --method npm

# 只安裝 pip 包
python install_mcp_servers.py --method pip

# 只安裝 Git 倉庫
python install_mcp_servers.py --method git

# 只安裝 Go 包
python install_mcp_servers.py --method go
```

#### 安裝特定伺服器
```bash
# 安裝指定的伺服器
python install_mcp_servers.py --servers "openai,github,notion"
```

### 步驟 3: 檢查安裝結果

安裝完成後，腳本會生成以下文件：

- `~/.mcp/config/vscode-mcp-settings.json` - VS Code 配置文件
- `~/.mcp/config/environment-template.sh` - Linux/Mac 環境變量模板
- `~/.mcp/config/environment-template.bat` - Windows 環境變量模板
- `~/.mcp/config/install-log.txt` - 安裝日誌

## 🔐 環境變量配置

許多 MCP 伺服器需要 API 密鑰或其他配置信息。請按照以下步驟設置環境變量：

### Windows 系統

1. **編輯環境變量模板**
   ```bash
   notepad %USERPROFILE%\.mcp\config\environment-template.bat
   ```

2. **設置環境變量**
   - 打開「系統屬性」→「進階」→「環境變量」
   - 或使用命令行：
   ```cmd
   set OPENAI_API_KEY=your_openai_api_key_here
   set GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
   set NOTION_API_KEY=your_notion_api_key_here
   ```

### Linux/Mac 系統

1. **編輯環境變量模板**
   ```bash
   nano ~/.mcp/config/environment-template.sh
   ```

2. **設置環境變量**
   ```bash
   # 添加到 ~/.bashrc 或 ~/.zshrc
   export OPENAI_API_KEY="your_openai_api_key_here"
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"
   export NOTION_API_KEY="your_notion_api_key_here"
   
   # 重新載入配置
   source ~/.bashrc
   ```

### 常用環境變量

| 服務 | 環境變量 | 獲取方式 |
|------|----------|----------|
| OpenAI | `OPENAI_API_KEY` | [OpenAI API Keys](https://platform.openai.com/api-keys) |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | [GitHub Settings](https://github.com/settings/tokens) |
| Notion | `NOTION_API_KEY` | [Notion Integrations](https://www.notion.so/my-integrations) |
| Anthropic | `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) |
| Slack | `SLACK_BOT_TOKEN` | [Slack API](https://api.slack.com/apps) |
| Linear | `LINEAR_API_KEY` | [Linear MCP Server](https://linear.app/changelog/2025-05-01-mcp) |
| Stripe | `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |

## ⚙️ VS Code 配置

### 方法 1: 自動配置（推薦）

安裝腳本會自動生成 VS Code 配置文件。您只需要將其內容複製到 VS Code 的 settings.json 中：

1. **打開 VS Code 設置**
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
   - 輸入 "Preferences: Open Settings (JSON)"

2. **複製配置**
   ```bash
   # 查看生成的配置
   cat ~/.mcp/config/vscode-mcp-settings.json
   ```

3. **合併到 settings.json**
   將 `mcpServers` 部分添加到您的 VS Code settings.json 文件中。

### 方法 2: 使用模板

您也可以使用提供的模板文件：

1. **打開模板文件**
   ```bash
   code vscode-mcp-settings-template.json
   ```

2. **自定義配置**
   - 移除不需要的伺服器
   - 修改環境變量引用
   - 調整命令參數

3. **應用配置**
   將配置複製到 VS Code settings.json 中。

### 配置示例

```json
{
  "mcpServers": {
    "openai": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-openai"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

## 🧪 測試驗證

使用測試腳本驗證安裝的伺服器是否正常工作：

### 運行所有測試
```bash
python test_mcp_servers.py
```

### 運行特定類型的測試
```bash
# 只測試啟動
python test_mcp_servers.py --test-type startup

# 只測試健康狀態
python test_mcp_servers.py --test-type health
```

### 測試特定伺服器
```bash
python test_mcp_servers.py --servers "openai,github,notion"
```

### 測試結果解讀

測試腳本會顯示以下結果：

- ✅ **PASS**: 伺服器啟動成功且運行正常
- ❌ **FAIL**: 伺服器啟動失敗或運行異常
- ⏭️ **SKIP**: 跳過測試（通常因為缺少依賴或環境變量）
- ⏰ **TIMEOUT**: 測試超時
- 🚫 **ERROR**: 測試過程中發生錯誤

測試報告會保存到 `~/.mcp/config/test-report.json`。

## 🔧 故障排除

### 常見問題

#### 1. 安裝失敗

**問題**: npm 包安裝失敗
```
✗ 安裝失敗 openai: npm ERR! 404 Not Found
```

**解決方案**:
```bash
# 清理 npm 緩存
npm cache clean --force

# 更新 npm
npm install -g npm@latest

# 重新安裝
python install_mcp_servers.py --method npm
```

#### 2. 權限問題

**問題**: 權限被拒絕
```
PermissionError: [Errno 13] Permission denied
```

**解決方案**:
```bash
# Windows: 以管理員身份運行
# Linux/Mac: 使用 sudo 或修改權限
sudo python install_mcp_servers.py
```

#### 3. 環境變量未設置

**問題**: 伺服器啟動失敗，提示缺少 API 密鑰
```
✗ 安裝失敗 openai: Error: Missing OPENAI_API_KEY
```

**解決方案**:
1. 檢查環境變量是否正確設置
2. 重新啟動終端或 VS Code
3. 驗證 API 密鑰的有效性

#### 4. 端口衝突

**問題**: 伺服器無法啟動，端口被占用
```
Error: listen EADDRINUSE: address already in use :::8000
```

**解決方案**:
```bash
# 查找占用端口的進程
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# 終止進程或使用不同端口
```

### 日誌檢查

查看詳細的安裝和測試日誌：

```bash
# 安裝日誌
cat ~/.mcp/config/install-log.txt

# 測試報告
cat ~/.mcp/config/test-report.json
```

## 🔬 進階使用

### 自定義配置

#### 修改配置文件

您可以編輯 `mcp-servers-config.json` 來：
- 添加新的 MCP 伺服器
- 修改現有伺服器的配置
- 調整安裝參數

```json
{
  "servers": {
    "custom-server": {
      "name": "Custom MCP Server",
      "package": "@company/custom-mcp-server",
      "installation_method": "npm",
      "category": "Custom",
      "description": "自定義 MCP 伺服器",
      "repository": "https://github.com/company/custom-mcp-server",
      "requires_api_key": true,
      "config_required": ["CUSTOM_API_KEY"]
    }
  }
}
```

#### 創建自定義安裝腳本

```python
from install_mcp_servers import MCPInstaller

# 創建自定義安裝器
installer = MCPInstaller("custom-config.json")

# 只安裝特定類別的伺服器
installer.load_config()
for server_key, server in installer.servers.items():
    if server.category == "AI Services":
        installer.install_server(server_key, server)
```

### 批次管理

#### 批次安裝腳本

創建 `batch_install.py`：

```python
#!/usr/bin/env python3
import subprocess
import sys

# 定義安裝組
install_groups = {
    "essential": ["openai", "github", "filesystem", "git"],
    "productivity": ["notion", "google-drive", "slack", "linear"],
    "development": ["docker", "kubernetes", "gitlab", "puppeteer"],
    "ai_services": ["anthropic", "huggingface", "llamacloud", "chroma"]
}

def install_group(group_name):
    if group_name not in install_groups:
        print(f"未知的安裝組: {group_name}")
        return False
    
    servers = ",".join(install_groups[group_name])
    cmd = ["python", "install_mcp_servers.py", "--servers", servers]
    
    result = subprocess.run(cmd)
    return result.returncode == 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python batch_install.py <group_name>")
        print(f"可用組: {list(install_groups.keys())}")
        sys.exit(1)
    
    group = sys.argv[1]
    success = install_group(group)
    sys.exit(0 if success else 1)
```

使用方法：
```bash
python batch_install.py essential
python batch_install.py productivity
```

### 監控和維護

#### 定期健康檢查

創建定期檢查腳本 `health_check.py`：

```python
#!/usr/bin/env python3
import schedule
import time
import subprocess
from datetime import datetime

def run_health_check():
    print(f"[{datetime.now()}] 開始健康檢查...")
    result = subprocess.run(["python", "test_mcp_servers.py", "--test-type", "health"])
    
    if result.returncode == 0:
        print("健康檢查通過")
    else:
        print("健康檢查失敗，請檢查日誌")

# 每小時檢查一次
schedule.every().hour.do(run_health_check)

while True:
    schedule.run_pending()
    time.sleep(60)
```

#### 自動更新腳本

```bash
#!/bin/bash
# update_mcp_servers.sh

echo "更新 MCP 伺服器..."

# 更新 npm 包
npm update -g @modelcontextprotocol/*

# 更新 pip 包
pip list --outdated | grep mcp | cut -d' ' -f1 | xargs pip install --upgrade

# 更新 Git 倉庫
find ~/.mcp/servers -type d -name ".git" -exec git -C {} pull \;

echo "更新完成"
```

## 📞 支援和貢獻

### 獲取幫助

- **GitHub Issues**: [提交問題](https://github.com/your-repo/issues)
- **文檔**: [查看完整文檔](https://github.com/your-repo/wiki)
- **社群**: [加入討論](https://github.com/your-repo/discussions)

### 貢獻指南

歡迎貢獻新的 MCP 伺服器或改進現有腳本：

1. Fork 本專案
2. 創建功能分支
3. 提交更改
4. 創建 Pull Request

### 許可證

本專案採用 MIT 許可證。詳見 [LICENSE](LICENSE) 文件。

---

**注意**: 本指南會持續更新。如果您發現任何問題或有改進建議，請提交 Issue 或 Pull Request。