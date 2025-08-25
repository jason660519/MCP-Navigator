/**
 * =============================================================================
 *                    MCP Navigator - Tailwind CSS 配置
 * =============================================================================
 * 
 * 檔案用途：
 *     這是 MCP Navigator 專案的 Tailwind CSS 配置檔案，定義了自定義主題、
 *     顏色系統、響應式斷點、動畫效果和插件設置，用於統一整個應用程式
 *     的視覺設計系統。
 * 
 * 主要功能：
 *     • 配置深色模式支援（class 策略）
 *     • 定義自定義顏色調色板
 *     • 設置響應式容器和斷點
 *     • 配置邊框圓角系統
 *     • 定義動畫和關鍵幀
 *     • 整合 Radix UI 組件樣式
 * 
 * 必要依賴項：
 *     Node.js 18+ 及以下套件：
 *     - tailwindcss: 核心 CSS 框架
 *     - tailwindcss-animate: 動畫插件
 *     - autoprefixer: CSS 前綴處理
 *     - postcss: CSS 後處理器
 * 
 * 安裝步驟：
 *     1. 確保 Node.js 18+ 已安裝
 *     2. 安裝 Tailwind CSS：pnpm add -D tailwindcss
 *     3. 安裝動畫插件：pnpm add -D tailwindcss-animate
 *     4. 配置 PostCSS（通常由 Vite 自動處理）
 *     5. 在 CSS 中引入 Tailwind 指令
 * 
 * 重要配置說明：
 *     • darkMode: ['class'] - 基於 class 的深色模式切換
 *     • content: 指定需要掃描的檔案路徑
 *     • theme.extend: 擴展預設主題
 * 
 * 顏色系統：
 *     • primary: #2B5D3A (深綠色) - 主要品牌色
 *     • secondary: #4A90E2 (藍色) - 次要強調色
 *     • accent: #F5A623 (橙色) - 強調色
 *     • 支援 HSL CSS 變數系統
 *     • 每個顏色都有對應的前景色
 * 
 * 響應式設計：
 *     • container: 居中容器，最大寬度 1400px
 *     • 2xl 斷點: 1400px
 *     • 預設 padding: 2rem
 * 
 * 動畫效果：
 *     • accordion-down/up: 手風琴展開/收起動畫
 *     • 0.2s ease-out 過渡效果
 *     • 支援 Radix UI 組件動畫
 * 
 * 使用範例：
 *     // 在 CSS 中引入
 *     @tailwind base;
 *     @tailwind components;
 *     @tailwind utilities;
 *     
 *     // 在組件中使用
 *     <div className="bg-primary text-primary-foreground p-4 rounded-lg">
 *       內容
 *     </div>
 * 
 * 作者：MCP Navigator 專案團隊
 * 版本：1.0.0
 * 最後更新：2025-01-15
 * =============================================================================
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2B5D3A',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#4A90E2',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}