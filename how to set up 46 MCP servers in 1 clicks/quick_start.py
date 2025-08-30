#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 伺服器快速開始腳本
一鍵完成 MCP 伺服器的安裝、配置和測試

作者: MCP Navigator Project
版本: 1.0.0
日期: 2025-01-20
"""

import os
import sys
import subprocess
import time
from pathlib import Path
from typing import List, Optional
import argparse


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


class QuickStart:
    """MCP 伺服器快速開始類"""
    
    def __init__(self):
        """初始化快速開始"""
        self.project_dir = Path.cwd()
        self.steps_completed = []
        self.steps_failed = []
        
        # 檢查必要文件是否存在
        self.required_files = [
            "mcp-servers-config.json",
            "install_mcp_servers.py",
            "test_mcp_servers.py",
            "setup_environment.py",
            "vscode-mcp-settings-template.json"
        ]
    
    def print_colored(self, message: str, color: str = Color.WHITE, bold: bool = False) -> None:
        """彩色輸出函數"""
        prefix = Color.BOLD if bold else ""
        print(f"{prefix}{color}{message}{Color.RESET}")
    
    def print_banner(self) -> None:
        """打印歡迎橫幅"""
        banner = """
╔══════════════════════════════════════════════════════════════╗
║                    MCP Navigator 快速開始                     ║
║                                                              ║
║  🚀 一鍵安裝和配置 46 個 MCP 伺服器                           ║
║  ⚙️  自動生成 VS Code 配置                                   ║
║  🧪 完整的測試和驗證                                          ║
║  📚 詳細的使用指南                                            ║
╚══════════════════════════════════════════════════════════════╝
"""
        self.print_colored(banner, Color.CYAN, True)
    
    def check_prerequisites(self) -> bool:
        """檢查先決條件"""
        self.print_colored("\n📋 檢查先決條件...", Color.YELLOW, True)
        
        # 檢查必要文件
        missing_files = []
        for file in self.required_files:
            if not (self.project_dir / file).exists():
                missing_files.append(file)
        
        if missing_files:
            self.print_colored("❌ 缺少必要文件:", Color.RED)
            for file in missing_files:
                self.print_colored(f"   - {file}", Color.RED)
            return False
        
        self.print_colored("✅ 所有必要文件存在", Color.GREEN)
        
        # 檢查 Python 版本
        python_version = sys.version_info
        if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
            self.print_colored(f"❌ Python 版本過低: {python_version.major}.{python_version.minor}", Color.RED)
            self.print_colored("   需要 Python 3.8 或更高版本", Color.RED)
            return False
        
        self.print_colored(f"✅ Python 版本: {python_version.major}.{python_version.minor}.{python_version.micro}", Color.GREEN)
        
        return True
    
    def run_command(self, command: List[str], description: str, timeout: int = 300) -> bool:
        """運行命令並顯示結果"""
        self.print_colored(f"\n🔄 {description}...", Color.YELLOW)
        self.print_colored(f"   命令: {' '.join(command)}", Color.GRAY)
        
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=self.project_dir
            )
            
            if result.returncode == 0:
                self.print_colored(f"✅ {description} 完成", Color.GREEN)
                self.steps_completed.append(description)
                return True
            else:
                self.print_colored(f"❌ {description} 失敗", Color.RED)
                if result.stderr:
                    self.print_colored(f"   錯誤: {result.stderr[:200]}...", Color.RED)
                self.steps_failed.append(description)
                return False
        
        except subprocess.TimeoutExpired:
            self.print_colored(f"⏰ {description} 超時", Color.MAGENTA)
            self.steps_failed.append(description)
            return False
        except Exception as e:
            self.print_colored(f"❌ {description} 異常: {e}", Color.RED)
            self.steps_failed.append(description)
            return False
    
    def step_1_environment_setup(self, servers: Optional[List[str]] = None) -> bool:
        """步驟 1: 環境變量設置"""
        self.print_colored("\n🔧 步驟 1: 環境變量設置", Color.BLUE, True)
        
        response = input("是否要設置環境變量？(Y/n): ").strip().lower()
        if response in ['n', 'no']:
            self.print_colored("⏭️ 跳過環境變量設置", Color.YELLOW)
            return True
        
        command = ["python", "setup_environment.py"]
        if servers:
            command.extend(["--servers", ",".join(servers)])
        
        return self.run_command(command, "環境變量設置", timeout=600)
    
    def step_2_install_servers(self, method: Optional[str] = None, servers: Optional[List[str]] = None) -> bool:
        """步驟 2: 安裝 MCP 伺服器"""
        self.print_colored("\n📦 步驟 2: 安裝 MCP 伺服器", Color.BLUE, True)
        
        command = ["python", "install_mcp_servers.py"]
        
        if method:
            command.extend(["--method", method])
        
        if servers:
            command.extend(["--servers", ",".join(servers)])
        
        return self.run_command(command, "MCP 伺服器安裝", timeout=1800)  # 30 分鐘超時
    
    def step_3_test_servers(self, servers: Optional[List[str]] = None) -> bool:
        """步驟 3: 測試 MCP 伺服器"""
        self.print_colored("\n🧪 步驟 3: 測試 MCP 伺服器", Color.BLUE, True)
        
        response = input("是否要運行測試？(Y/n): ").strip().lower()
        if response in ['n', 'no']:
            self.print_colored("⏭️ 跳過伺服器測試", Color.YELLOW)
            return True
        
        command = ["python", "test_mcp_servers.py"]
        
        if servers:
            command.extend(["--servers", ",".join(servers)])
        
        return self.run_command(command, "MCP 伺服器測試", timeout=600)
    
    def step_4_vscode_integration(self) -> bool:
        """步驟 4: VS Code 整合指導"""
        self.print_colored("\n⚙️ 步驟 4: VS Code 整合", Color.BLUE, True)
        
        config_file = Path.home() / ".mcp" / "config" / "vscode-mcp-settings.json"
        
        if config_file.exists():
            self.print_colored("✅ VS Code 配置文件已生成", Color.GREEN)
            self.print_colored(f"   位置: {config_file}", Color.CYAN)
            
            self.print_colored("\n📋 下一步操作:", Color.YELLOW, True)
            self.print_colored("1. 打開 VS Code", Color.WHITE)
            self.print_colored("2. 按 Ctrl+Shift+P (Windows/Linux) 或 Cmd+Shift+P (Mac)", Color.WHITE)
            self.print_colored("3. 輸入 'Preferences: Open Settings (JSON)'", Color.WHITE)
            self.print_colored("4. 將以下配置添加到 settings.json:", Color.WHITE)
            
            # 顯示配置預覽
            try:
                import json
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                self.print_colored("\n配置預覽 (前 3 個伺服器):", Color.CYAN)
                count = 0
                for server_key, server_config in config.get('mcpServers', {}).items():
                    if count >= 3:
                        break
                    self.print_colored(f"  {server_key}: {server_config.get('command', 'N/A')}", Color.GRAY)
                    count += 1
                
                if len(config.get('mcpServers', {})) > 3:
                    remaining = len(config.get('mcpServers', {})) - 3
                    self.print_colored(f"  ... 還有 {remaining} 個伺服器", Color.GRAY)
            
            except Exception as e:
                self.print_colored(f"無法讀取配置文件: {e}", Color.RED)
            
            response = input("\n是否要打開配置文件？(Y/n): ").strip().lower()
            if response not in ['n', 'no']:
                try:
                    if os.name == 'nt':  # Windows
                        os.startfile(config_file)
                    elif os.name == 'posix':  # macOS and Linux
                        subprocess.run(['open', config_file] if sys.platform == 'darwin' else ['xdg-open', config_file])
                    self.print_colored("✅ 配置文件已打開", Color.GREEN)
                except Exception as e:
                    self.print_colored(f"無法打開文件: {e}", Color.RED)
            
            self.steps_completed.append("VS Code 整合指導")
            return True
        else:
            self.print_colored("❌ VS Code 配置文件不存在", Color.RED)
            self.print_colored("   請先運行安裝腳本", Color.RED)
            self.steps_failed.append("VS Code 整合指導")
            return False
    
    def print_summary(self) -> None:
        """打印完成摘要"""
        self.print_colored("\n" + "=" * 60, Color.YELLOW)
        self.print_colored("🎉 快速開始完成摘要", Color.YELLOW, True)
        self.print_colored("=" * 60, Color.YELLOW)
        
        if self.steps_completed:
            self.print_colored("\n✅ 已完成的步驟:", Color.GREEN, True)
            for step in self.steps_completed:
                self.print_colored(f"   ✓ {step}", Color.GREEN)
        
        if self.steps_failed:
            self.print_colored("\n❌ 失敗的步驟:", Color.RED, True)
            for step in self.steps_failed:
                self.print_colored(f"   ✗ {step}", Color.RED)
        
        # 顯示重要文件位置
        self.print_colored("\n📁 重要文件位置:", Color.CYAN, True)
        
        config_dir = Path.home() / ".mcp" / "config"
        files_to_check = [
            ("VS Code 配置", config_dir / "vscode-mcp-settings.json"),
            ("環境變量配置", config_dir / "mcp-environment.json"),
            ("測試報告", config_dir / "test-report.json"),
            ("安裝日誌", config_dir / "install-log.txt"),
            ("環境變量腳本 (Windows)", config_dir / "set_mcp_env.bat"),
            ("環境變量腳本 (PowerShell)", config_dir / "set_mcp_env.ps1"),
            ("環境變量腳本 (Unix)", config_dir / "set_mcp_env.sh")
        ]
        
        for description, file_path in files_to_check:
            if file_path.exists():
                self.print_colored(f"   ✓ {description}: {file_path}", Color.CYAN)
            else:
                self.print_colored(f"   ✗ {description}: 不存在", Color.GRAY)
        
        # 下一步建議
        self.print_colored("\n🚀 下一步建議:", Color.YELLOW, True)
        
        if not self.steps_failed:
            self.print_colored("1. 重新啟動 VS Code 以載入新配置", Color.WHITE)
            self.print_colored("2. 在 VS Code 中測試 MCP 伺服器功能", Color.WHITE)
            self.print_colored("3. 查看使用指南: MCP_Installation_Guide.md", Color.WHITE)
            self.print_colored("4. 根據需要調整環境變量和配置", Color.WHITE)
        else:
            self.print_colored("1. 檢查失敗步驟的錯誤信息", Color.WHITE)
            self.print_colored("2. 查看安裝日誌和測試報告", Color.WHITE)
            self.print_colored("3. 參考故障排除指南", Color.WHITE)
            self.print_colored("4. 重新運行失敗的步驟", Color.WHITE)
        
        # 成功率
        total_steps = len(self.steps_completed) + len(self.steps_failed)
        if total_steps > 0:
            success_rate = len(self.steps_completed) / total_steps * 100
            color = Color.GREEN if success_rate >= 80 else Color.YELLOW if success_rate >= 50 else Color.RED
            self.print_colored(f"\n📊 成功率: {success_rate:.1f}%", color, True)
    
    def run_quick_start(self, method: Optional[str] = None, servers: Optional[List[str]] = None, skip_env: bool = False, skip_test: bool = False) -> None:
        """運行快速開始流程"""
        self.print_banner()
        
        # 檢查先決條件
        if not self.check_prerequisites():
            self.print_colored("\n❌ 先決條件檢查失敗，無法繼續", Color.RED)
            return
        
        self.print_colored("\n🚀 開始快速安裝流程...", Color.GREEN, True)
        
        # 顯示安裝計劃
        self.print_colored("\n📋 安裝計劃:", Color.CYAN, True)
        if method:
            self.print_colored(f"   安裝方法: {method}", Color.WHITE)
        else:
            self.print_colored("   安裝方法: 全部", Color.WHITE)
        
        if servers:
            self.print_colored(f"   指定伺服器: {', '.join(servers)}", Color.WHITE)
        else:
            self.print_colored("   伺服器範圍: 全部 (46 個)", Color.WHITE)
        
        self.print_colored(f"   跳過環境設置: {'是' if skip_env else '否'}", Color.WHITE)
        self.print_colored(f"   跳過測試: {'是' if skip_test else '否'}", Color.WHITE)
        
        # 確認開始
        response = input("\n是否要繼續？(Y/n): ").strip().lower()
        if response in ['n', 'no']:
            self.print_colored("❌ 用戶取消安裝", Color.YELLOW)
            return
        
        # 執行步驟
        success = True
        
        # 步驟 1: 環境變量設置
        if not skip_env:
            if not self.step_1_environment_setup(servers):
                success = False
        
        # 步驟 2: 安裝伺服器
        if not self.step_2_install_servers(method, servers):
            success = False
        
        # 步驟 3: 測試伺服器
        if not skip_test:
            if not self.step_3_test_servers(servers):
                success = False
        
        # 步驟 4: VS Code 整合
        if not self.step_4_vscode_integration():
            success = False
        
        # 打印摘要
        self.print_summary()
        
        if success and not self.steps_failed:
            self.print_colored("\n🎉 快速開始完成！所有步驟都成功執行。", Color.GREEN, True)
        else:
            self.print_colored("\n⚠️ 快速開始完成，但有一些步驟失敗。請檢查上面的錯誤信息。", Color.YELLOW, True)


def main():
    """主函數"""
    parser = argparse.ArgumentParser(description="MCP 伺服器快速開始腳本")
    parser.add_argument("--method", choices=["npm", "pip", "git", "go", "unity"], 
                       help="指定安裝方法")
    parser.add_argument("--servers", help="指定要安裝的伺服器列表，用逗號分隔")
    parser.add_argument("--skip-env", action="store_true", help="跳過環境變量設置")
    parser.add_argument("--skip-test", action="store_true", help="跳過伺服器測試")
    
    args = parser.parse_args()
    
    # 解析伺服器列表
    servers = None
    if args.servers:
        servers = [s.strip() for s in args.servers.split(",")]
    
    # 創建快速開始實例
    quick_start = QuickStart()
    
    try:
        quick_start.run_quick_start(
            method=args.method,
            servers=servers,
            skip_env=args.skip_env,
            skip_test=args.skip_test
        )
    except KeyboardInterrupt:
        quick_start.print_colored("\n❌ 快速開始被用戶中斷", Color.YELLOW)
        sys.exit(1)
    except Exception as e:
        quick_start.print_colored(f"\n❌ 快速開始過程中發生錯誤: {e}", Color.RED)
        sys.exit(1)


if __name__ == "__main__":
    main()