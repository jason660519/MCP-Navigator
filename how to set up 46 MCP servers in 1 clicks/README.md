# 🚀 一鍵安裝 46 個 MCP 伺服器

這個資料夾包含了完整的 MCP (Model Context Protocol) 伺服器自動化安裝解決方案，讓您可以輕鬆安裝和配置 46 個不同的 MCP 伺服器。

## 📁 文件說明

| 文件名 | 描述 |
|--------|------|
| `quick_start.py` | **🎯 一鍵開始腳本** - 推薦使用 |
| `install_mcp_servers.py` | 自動化安裝腳本 |
| `test_mcp_servers.py` | 測試驗證腳本 |
| `setup_environment.py` | 環境變數管理腳本 |
| `mcp-servers-config.json` | 46 個伺服器的配置信息 |
| `vscode-mcp-settings-template.json` | VS Code 配置模板 |
| `MCP_Installation_Guide.md` | 詳細使用指南 |

## 🚀 快速開始

### 方法一：一鍵安裝（推薦）

```bash
python quick_start.py
```

這個腳本會自動執行以下步驟：
1. 🔧 環境變數設置
2. 📦 安裝 MCP 伺服器
3. 🧪 測試驗證
4. ⚙️ VS Code 整合

### 方法二：分步執行

```bash
# 1. 設置環境變數（API 密鑰等）
python setup_environment.py

# 2. 安裝 MCP 伺服器
python install_mcp_servers.py

# 3. 測試驗證
python test_mcp_servers.py
```

## 📋 系統要求

- **Python**: 3.8 或更高版本
- **Node.js**: 18 或更高版本（用於 npm 包）
- **Git**: 最新版本
- **Go**: 1.19 或更高版本（可選）
- **操作系統**: Windows 10/11, macOS, Linux

## 🔑 環境變數

某些 MCP 伺服器需要 API 密鑰，包括：
- OpenAI API Key
- GitHub Token
- Google API Key
- AWS Credentials
- 等等...

運行 `python setup_environment.py` 會引導您設置這些變數。

## 📚 支援的 MCP 伺服器

本解決方案支援 46 個 MCP 伺服器，涵蓋以下類別：

- 🤖 **AI Services**: OpenAI, Anthropic, HuggingFace
- 💾 **Databases**: PostgreSQL, MongoDB, Redis
- 📝 **Productivity**: Notion, Linear, Jira
- 🛠️ **Development**: GitHub, GitLab, Docker
- 🌐 **Web Scraping**: Puppeteer, Playwright
- ☁️ **Cloud Services**: AWS, Google Cloud
- 📊 **Analytics**: Google Analytics
- 🎵 **Media**: Spotify, YouTube
- 🗺️ **Location**: Google Maps
- 💰 **Finance**: Stripe

## 🆘 故障排除

如果遇到問題：

1. 檢查 Python 版本：`python --version`
2. 檢查 Node.js 版本：`node --version`
3. 查看詳細日誌：`~/.mcp/config/install-log.txt`
4. 參考完整指南：`MCP_Installation_Guide.md`

## 📞 支援

- 📖 詳細文檔：查看 `MCP_Installation_Guide.md`
- 🐛 問題回報：請提供錯誤日誌和系統信息
- 💡 功能建議：歡迎提出改進建議

---

**🎉 享受使用 MCP 伺服器的強大功能！**