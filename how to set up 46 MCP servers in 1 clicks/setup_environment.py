#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 伺服器環境變量設置助手
幫助用戶輕鬆設置和管理 MCP 伺服器所需的環境變量

作者: MCP Navigator Project
版本: 1.0.0
日期: 2025-01-20
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List, Optional
import argparse
from getpass import getpass
import platform


class Color:
    """終端顏色輸出類"""
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    GRAY = '\033[90m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


class EnvironmentManager:
    """環境變量管理器"""
    
    def __init__(self):
        """初始化環境變量管理器"""
        self.config_dir = Path.home() / ".mcp" / "config"
        self.env_file = self.config_dir / "mcp-environment.json"
        self.system = platform.system().lower()
        
        # 確保配置目錄存在
        self.config_dir.mkdir(parents=True, exist_ok=True)
        
        # 預定義的環境變量配置
        self.env_configs = {
            # AI Services
            "OPENAI_API_KEY": {
                "description": "OpenAI API 密鑰",
                "url": "https://platform.openai.com/api-keys",
                "required_for": ["openai"],
                "sensitive": True
            },
            "ANTHROPIC_API_KEY": {
                "description": "Anthropic API 密鑰",
                "url": "https://console.anthropic.com/",
                "required_for": ["anthropic"],
                "sensitive": True
            },
            "HUGGINGFACE_API_TOKEN": {
                "description": "HuggingFace API Token",
                "url": "https://huggingface.co/settings/tokens",
                "required_for": ["huggingface"],
                "sensitive": True
            },
            "LLAMA_CLOUD_API_KEY": {
                "description": "LlamaCloud API 密鑰",
                "url": "https://cloud.llamaindex.ai/",
                "required_for": ["llamacloud"],
                "sensitive": True
            },
            
            # Development Tools
            "GITHUB_PERSONAL_ACCESS_TOKEN": {
                "description": "GitHub 個人訪問令牌",
                "url": "https://github.com/settings/tokens",
                "required_for": ["github"],
                "sensitive": True
            },
            "GITLAB_PERSONAL_ACCESS_TOKEN": {
                "description": "GitLab 個人訪問令牌",
                "url": "https://gitlab.com/-/profile/personal_access_tokens",
                "required_for": ["gitlab"],
                "sensitive": True
            },
            
            # Productivity
            "NOTION_API_KEY": {
                "description": "Notion API 密鑰",
                "url": "https://www.notion.so/my-integrations",
                "required_for": ["notion"],
                "sensitive": True
            },
            "SLACK_BOT_TOKEN": {
                "description": "Slack Bot Token",
                "url": "https://api.slack.com/apps",
                "required_for": ["slack"],
                "sensitive": True
            },
            "LINEAR_API_KEY": {
                "description": "Linear API 密鑰",
                "url": "https://linear.app/changelog/2025-05-01-mcp",
                "required_for": ["linear"],
                "sensitive": True
            },
            "GOOGLE_DRIVE_CREDENTIALS": {
                "description": "Google Drive 憑證 JSON 文件路徑",
                "url": "https://console.cloud.google.com/apis/credentials",
                "required_for": ["google-drive", "gdrive"],
                "sensitive": True
            },
            
            # Cloud Services
            "AWS_ACCESS_KEY_ID": {
                "description": "AWS 訪問密鑰 ID",
                "url": "https://console.aws.amazon.com/iam/",
                "required_for": ["aws-kb-retrieval", "s3"],
                "sensitive": True
            },
            "AWS_SECRET_ACCESS_KEY": {
                "description": "AWS 秘密訪問密鑰",
                "url": "https://console.aws.amazon.com/iam/",
                "required_for": ["aws-kb-retrieval", "s3"],
                "sensitive": True
            },
            "AWS_REGION": {
                "description": "AWS 區域",
                "url": "https://docs.aws.amazon.com/general/latest/gr/rande.html",
                "required_for": ["aws-kb-retrieval", "s3"],
                "sensitive": False,
                "default": "us-east-1"
            },
            "CLOUDFLARE_API_TOKEN": {
                "description": "Cloudflare API Token",
                "url": "https://dash.cloudflare.com/profile/api-tokens",
                "required_for": ["cloudflare"],
                "sensitive": True
            },
            
            # Database
            "POSTGRES_CONNECTION_STRING": {
                "description": "PostgreSQL 連接字符串",
                "url": "https://www.postgresql.org/docs/current/libpq-connect.html",
                "required_for": ["postgres"],
                "sensitive": True,
                "example": "postgresql://user:password@localhost:5432/database"
            },
            "MONGODB_URI": {
                "description": "MongoDB 連接 URI",
                "url": "https://docs.mongodb.com/manual/reference/connection-string/",
                "required_for": ["mongodb"],
                "sensitive": True,
                "example": "mongodb://localhost:27017/database"
            },
            "REDIS_URL": {
                "description": "Redis 連接 URL",
                "url": "https://redis.io/docs/manual/clients/",
                "required_for": ["redis"],
                "sensitive": True,
                "example": "redis://localhost:6379"
            },
            
            # Other Services
            "STRIPE_SECRET_KEY": {
                "description": "Stripe 秘密密鑰",
                "url": "https://dashboard.stripe.com/apikeys",
                "required_for": ["stripe"],
                "sensitive": True
            },
            "BRAVE_API_KEY": {
                "description": "Brave Search API 密鑰",
                "url": "https://api.search.brave.com/",
                "required_for": ["brave-search"],
                "sensitive": True
            },
            "BROWSERBASE_API_KEY": {
                "description": "Browserbase API 密鑰",
                "url": "https://www.browserbase.com/",
                "required_for": ["browserbase"],
                "sensitive": True
            },
            "E2B_API_KEY": {
                "description": "E2B API 密鑰",
                "url": "https://e2b.dev/",
                "required_for": ["e2b"],
                "sensitive": True
            },
            "EVERART_API_KEY": {
                "description": "EverArt API 密鑰",
                "url": "https://everart.ai/",
                "required_for": ["everart"],
                "sensitive": True
            },
            "SENTRY_AUTH_TOKEN": {
                "description": "Sentry 認證令牌",
                "url": "https://sentry.io/settings/auth-tokens/",
                "required_for": ["sentry"],
                "sensitive": True
            },
            "SPOTIFY_CLIENT_ID": {
                "description": "Spotify 客戶端 ID",
                "url": "https://developer.spotify.com/dashboard/applications",
                "required_for": ["spotify"],
                "sensitive": False
            },
            "SPOTIFY_CLIENT_SECRET": {
                "description": "Spotify 客戶端密鑰",
                "url": "https://developer.spotify.com/dashboard/applications",
                "required_for": ["spotify"],
                "sensitive": True
            },
            "TIKTOK_ACCESS_TOKEN": {
                "description": "TikTok 訪問令牌",
                "url": "https://developers.tiktok.com/",
                "required_for": ["tiktok"],
                "sensitive": True
            },
            
            # Optional configurations
            "CHROMA_HOST": {
                "description": "Chroma 伺服器主機",
                "url": "https://docs.trychroma.com/",
                "required_for": ["chroma"],
                "sensitive": False,
                "default": "localhost"
            },
            "CHROMA_PORT": {
                "description": "Chroma 伺服器端口",
                "url": "https://docs.trychroma.com/",
                "required_for": ["chroma"],
                "sensitive": False,
                "default": "8000"
            }
        }
    
    def print_colored(self, message: str, color: str = Color.WHITE, bold: bool = False) -> None:
        """彩色輸出函數"""
        prefix = Color.BOLD if bold else ""
        print(f"{prefix}{color}{message}{Color.RESET}")
    
    def load_existing_env(self) -> Dict[str, str]:
        """載入現有的環境變量配置"""
        if self.env_file.exists():
            try:
                with open(self.env_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return {}
        return {}
    
    def save_env_config(self, env_vars: Dict[str, str]) -> None:
        """保存環境變量配置到文件"""
        with open(self.env_file, 'w', encoding='utf-8') as f:
            json.dump(env_vars, f, indent=2, ensure_ascii=False)
    
    def get_env_var_input(self, var_name: str, config: Dict) -> Optional[str]:
        """獲取用戶輸入的環境變量值"""
        self.print_colored(f"\n配置 {var_name}:", Color.CYAN, True)
        self.print_colored(f"描述: {config['description']}", Color.WHITE)
        self.print_colored(f"獲取地址: {config['url']}", Color.BLUE)
        self.print_colored(f"用於伺服器: {', '.join(config['required_for'])}", Color.GRAY)
        
        if 'example' in config:
            self.print_colored(f"示例: {config['example']}", Color.YELLOW)
        
        if 'default' in config:
            self.print_colored(f"默認值: {config['default']}", Color.YELLOW)
        
        # 檢查是否已設置
        current_value = os.getenv(var_name)
        if current_value:
            if config.get('sensitive', False):
                display_value = "*" * min(len(current_value), 8)
            else:
                display_value = current_value
            self.print_colored(f"當前值: {display_value}", Color.GREEN)
        
        # 獲取用戶輸入
        if config.get('sensitive', False):
            prompt = f"請輸入 {var_name} (輸入將被隱藏): "
            value = getpass(prompt)
        else:
            prompt = f"請輸入 {var_name}: "
            if 'default' in config:
                prompt += f"(默認: {config['default']}) "
            value = input(prompt).strip()
        
        # 使用默認值
        if not value and 'default' in config:
            value = config['default']
        
        return value if value else None
    
    def interactive_setup(self, servers: List[str] = None) -> None:
        """交互式設置環境變量"""
        self.print_colored("MCP 伺服器環境變量設置助手", Color.YELLOW, True)
        self.print_colored("=" * 40, Color.YELLOW)
        
        # 載入現有配置
        existing_env = self.load_existing_env()
        
        # 確定需要設置的環境變量
        required_vars = set()
        
        if servers:
            # 只設置指定伺服器需要的環境變量
            for var_name, config in self.env_configs.items():
                if any(server in config['required_for'] for server in servers):
                    required_vars.add(var_name)
        else:
            # 設置所有環境變量
            required_vars = set(self.env_configs.keys())
        
        self.print_colored(f"\n需要設置 {len(required_vars)} 個環境變量", Color.WHITE)
        
        # 詢問用戶是否要設置每個變量
        env_vars = existing_env.copy()
        
        for var_name in sorted(required_vars):
            config = self.env_configs[var_name]
            
            # 詢問是否要設置這個變量
            if var_name in existing_env:
                response = input(f"\n{var_name} 已設置，是否要更新？ (y/N): ").strip().lower()
                if response not in ['y', 'yes']:
                    continue
            else:
                response = input(f"\n是否要設置 {var_name}？ (Y/n): ").strip().lower()
                if response in ['n', 'no']:
                    continue
            
            # 獲取變量值
            value = self.get_env_var_input(var_name, config)
            if value:
                env_vars[var_name] = value
                self.print_colored(f"✓ {var_name} 已設置", Color.GREEN)
            else:
                self.print_colored(f"⚠ 跳過 {var_name}", Color.YELLOW)
        
        # 保存配置
        self.save_env_config(env_vars)
        self.print_colored(f"\n配置已保存到: {self.env_file}", Color.GREEN)
        
        # 生成系統特定的環境變量設置腳本
        self.generate_env_scripts(env_vars)
    
    def generate_env_scripts(self, env_vars: Dict[str, str]) -> None:
        """生成系統特定的環境變量設置腳本"""
        self.print_colored("\n生成環境變量設置腳本...", Color.YELLOW)
        
        # Windows 批次文件
        bat_file = self.config_dir / "set_mcp_env.bat"
        with open(bat_file, 'w', encoding='utf-8') as f:
            f.write("@echo off\n")
            f.write("REM MCP 伺服器環境變量設置腳本\n")
            f.write("REM 運行此腳本設置環境變量\n\n")
            
            for var_name, value in env_vars.items():
                f.write(f'set "{var_name}={value}"\n')
            
            f.write("\necho MCP 環境變量已設置\n")
            f.write("echo 請重新啟動 VS Code 以使變量生效\n")
        
        # Unix shell 腳本
        sh_file = self.config_dir / "set_mcp_env.sh"
        with open(sh_file, 'w', encoding='utf-8') as f:
            f.write("#!/bin/bash\n")
            f.write("# MCP 伺服器環境變量設置腳本\n")
            f.write("# 運行: source set_mcp_env.sh\n\n")
            
            for var_name, value in env_vars.items():
                f.write(f'export {var_name}="{value}"\n')
            
            f.write("\necho \"MCP 環境變量已設置\"\n")
            f.write("echo \"請重新啟動 VS Code 以使變量生效\"\n")
        
        # 設置執行權限
        if self.system != 'windows':
            os.chmod(sh_file, 0o755)
        
        # PowerShell 腳本
        ps1_file = self.config_dir / "set_mcp_env.ps1"
        with open(ps1_file, 'w', encoding='utf-8') as f:
            f.write("# MCP 伺服器環境變量設置腳本\n")
            f.write("# 運行: .\\set_mcp_env.ps1\n\n")
            
            for var_name, value in env_vars.items():
                f.write(f'$env:{var_name} = "{value}"\n')
            
            f.write("\nWrite-Host \"MCP 環境變量已設置\"\n")
            f.write("Write-Host \"請重新啟動 VS Code 以使變量生效\"\n")
        
        self.print_colored(f"\n環境變量設置腳本已生成:", Color.GREEN)
        self.print_colored(f"  Windows: {bat_file}", Color.CYAN)
        self.print_colored(f"  PowerShell: {ps1_file}", Color.CYAN)
        self.print_colored(f"  Unix/Linux: {sh_file}", Color.CYAN)
    
    def apply_env_vars(self) -> None:
        """應用保存的環境變量到當前會話"""
        env_vars = self.load_existing_env()
        
        if not env_vars:
            self.print_colored("沒有找到保存的環境變量配置", Color.YELLOW)
            return
        
        self.print_colored("應用環境變量到當前會話...", Color.YELLOW)
        
        for var_name, value in env_vars.items():
            os.environ[var_name] = value
            self.print_colored(f"✓ {var_name}", Color.GREEN)
        
        self.print_colored(f"\n已應用 {len(env_vars)} 個環境變量", Color.GREEN)
    
    def list_env_vars(self) -> None:
        """列出所有配置的環境變量"""
        env_vars = self.load_existing_env()
        
        if not env_vars:
            self.print_colored("沒有找到保存的環境變量配置", Color.YELLOW)
            return
        
        self.print_colored("已配置的環境變量:", Color.YELLOW, True)
        self.print_colored("=" * 30, Color.YELLOW)
        
        for var_name, value in env_vars.items():
            config = self.env_configs.get(var_name, {})
            
            if config.get('sensitive', False):
                display_value = "*" * min(len(value), 8)
            else:
                display_value = value
            
            self.print_colored(f"{var_name}: {display_value}", Color.WHITE)
            
            if 'required_for' in config:
                self.print_colored(f"  用於: {', '.join(config['required_for'])}", Color.GRAY)
    
    def remove_env_var(self, var_name: str) -> None:
        """移除指定的環境變量"""
        env_vars = self.load_existing_env()
        
        if var_name in env_vars:
            del env_vars[var_name]
            self.save_env_config(env_vars)
            self.print_colored(f"已移除環境變量: {var_name}", Color.GREEN)
        else:
            self.print_colored(f"環境變量不存在: {var_name}", Color.YELLOW)


def main():
    """主函數"""
    parser = argparse.ArgumentParser(description="MCP 伺服器環境變量設置助手")
    parser.add_argument("--servers", help="指定要設置環境變量的伺服器列表，用逗號分隔")
    parser.add_argument("--list", action="store_true", help="列出已配置的環境變量")
    parser.add_argument("--apply", action="store_true", help="應用環境變量到當前會話")
    parser.add_argument("--remove", help="移除指定的環境變量")
    
    args = parser.parse_args()
    
    manager = EnvironmentManager()
    
    try:
        if args.list:
            manager.list_env_vars()
        elif args.apply:
            manager.apply_env_vars()
        elif args.remove:
            manager.remove_env_var(args.remove)
        else:
            # 交互式設置
            servers = None
            if args.servers:
                servers = [s.strip() for s in args.servers.split(",")]
            
            manager.interactive_setup(servers)
    
    except KeyboardInterrupt:
        manager.print_colored("\n設置被用戶中斷", Color.YELLOW)
        sys.exit(1)
    except Exception as e:
        manager.print_colored(f"\n設置過程中發生錯誤: {e}", Color.RED)
        sys.exit(1)


if __name__ == "__main__":
    main()