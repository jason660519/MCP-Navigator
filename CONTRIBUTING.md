# Contributing to MCP Navigator

[English](#english) | [繁體中文](#繁體中文)

## English

Thank you for your interest in contributing to MCP Navigator! We welcome contributions from the community to help improve this comprehensive MCP server directory.

### Ways to Contribute

#### 1. Report Issues
- Found a bug? Please open an issue with detailed steps to reproduce
- Have a feature request? We'd love to hear your ideas
- Notice incorrect information about an MCP server? Let us know

#### 2. Submit MCP Server Information
- Know of an MCP server that's not listed? Help us add it!
- Found updated information about existing servers? Submit corrections
- Please provide:
  - Server name and description
  - GitHub repository URL
  - Installation instructions
  - Category and tags
  - Any special requirements or dependencies

#### 3. Code Contributions
- Fix bugs or implement new features
- Improve documentation
- Enhance UI/UX
- Optimize performance

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/jason660519/MCP-Navigator.git
   cd MCP-Navigator
   ```

2. **Set Up Development Environment**
   ```bash
   cd mcp-navigator
   npm install
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Submit a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Ensure all tests pass

### Development Guidelines

#### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent formatting

#### Data Updates
- MCP server data is stored in `/data/` directory
- Follow the existing JSON schema when adding new servers
- Validate data before submitting

#### Testing
- Test your changes in both development and production builds
- Verify responsive design on different screen sizes
- Check accessibility compliance

### Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Questions?

Feel free to open an issue for any questions about contributing!

---

## 繁體中文

感謝您對 MCP Navigator 的貢獻興趣！我們歡迎社群的貢獻，幫助改善這個全面的 MCP 服務器目錄。

### 貢獻方式

#### 1. 回報問題
- 發現錯誤？請開啟問題並提供詳細的重現步驟
- 有功能建議？我們很樂意聽到您的想法
- 注意到 MCP 服務器的錯誤資訊？請告訴我們

#### 2. 提交 MCP 服務器資訊
- 知道未列出的 MCP 服務器？幫助我們添加它！
- 發現現有服務器的更新資訊？提交更正
- 請提供：
  - 服務器名稱和描述
  - GitHub 倉庫 URL
  - 安裝說明
  - 類別和標籤
  - 任何特殊要求或依賴項

#### 3. 程式碼貢獻
- 修復錯誤或實現新功能
- 改善文檔
- 增強 UI/UX
- 優化性能

### 開始貢獻

1. **Fork 倉庫**
   ```bash
   git clone https://github.com/jason660519/MCP-Navigator.git
   cd MCP-Navigator
   ```

2. **設置開發環境**
   ```bash
   cd mcp-navigator
   npm install
   npm run dev
   ```

3. **創建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **進行更改**
   - 遵循現有的程式碼風格
   - 為複雜邏輯添加註釋
   - 徹底測試您的更改

5. **提交拉取請求**
   - 提供清晰的更改描述
   - 引用任何相關問題
   - 確保所有測試通過

### 開發指南

#### 程式碼風格
- 使用 TypeScript 確保類型安全
- 遵循 React 最佳實踐
- 使用 Tailwind CSS 進行樣式設計
- 保持一致的格式

#### 資料更新
- MCP 服務器資料存儲在 `/data/` 目錄中
- 添加新服務器時遵循現有的 JSON 架構
- 提交前驗證資料

#### 測試
- 在開發和生產構建中測試您的更改
- 驗證不同螢幕尺寸的響應式設計
- 檢查無障礙合規性

### 回報問題

回報問題時，請包含：
- 問題的清晰描述
- 重現步驟
- 預期與實際行為
- 瀏覽器和作業系統資訊
- 如適用，請提供螢幕截圖

### 有問題？

對於任何關於貢獻的問題，請隨時開啟問題！