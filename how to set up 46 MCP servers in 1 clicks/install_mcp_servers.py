#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 伺服器自動化安裝腳本
使用環境變量管理配置，支持 VS Code 集成

作者: MCP Navigator Project
版本: 1.0.0
日期: 2025-01-20
"""

import os
import sys
import json
import subprocess
import platform
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse
from dataclasses import dataclass
from enum import Enum


class InstallMethod(Enum):
    """安裝方法枚舉"""
    NPM = "npm"
    PIP = "pip"
    GIT = "git"
    GO = "go"
    UNITY = "unity"


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


@dataclass
class MCPServer:
    """MCP 伺服器配置數據類"""
    name: str
    package: str
    installation_method: InstallMethod
    category: str
    description: str
    repository: str
    requires_api_key: bool
    config_required: List[str]
    env_vars: Dict[str, str] = None


class MCPInstaller:
    """MCP 伺服器安裝器主類"""
    
    def __init__(self, config_file: str = "mcp-servers-config.json"):
        """初始化安裝器"""
        self.config_file = config_file
        self.servers: Dict[str, MCPServer] = {}
        self.install_log: List[str] = []
        self.failed_installs: List[str] = []
        self.success_count = 0
        self.total_count = 0
        
        # 創建必要的目錄
        self.mcp_dir = Path.home() / ".mcp"
        self.servers_dir = self.mcp_dir / "servers"
        self.config_dir = self.mcp_dir / "config"
        
        for directory in [self.mcp_dir, self.servers_dir, self.config_dir]:
            directory.mkdir(exist_ok=True)
    
    def print_colored(self, message: str, color: str = Color.WHITE, bold: bool = False) -> None:
        """彩色輸出函數"""
        prefix = Color.BOLD if bold else ""
        print(f"{prefix}{color}{message}{Color.RESET}")
    
    def check_prerequisites(self) -> bool:
        """檢查系統先決條件"""
        self.print_colored("檢查系統先決條件...", Color.YELLOW, True)
        
        prerequisites = {
            "Node.js": ["node", "--version"],
            "npm": ["npm", "--version"],
            "Python": ["python", "--version"],
            "pip": ["pip", "--version"],
            "Git": ["git", "--version"],
            "Go": ["go", "version"]
        }
        
        missing = []
        
        for tool, command in prerequisites.items():
            try:
                result = subprocess.run(command, capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    version = result.stdout.strip().split('\n')[0]
                    self.print_colored(f"✓ {tool}: {version}", Color.GREEN)
                else:
                    missing.append(tool)
            except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
                missing.append(tool)
        
        if missing:
            self.print_colored(f"缺少以下工具: {', '.join(missing)}", Color.RED)
            self.print_colored("請安裝缺少的工具後重新運行腳本", Color.YELLOW)
            return False
        
        self.print_colored("所有先決條件檢查通過！", Color.GREEN, True)
        return True
    
    def load_config(self) -> bool:
        """載入 MCP 伺服器配置"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            for server_key, server_data in config_data['servers'].items():
                self.servers[server_key] = MCPServer(
                    name=server_data['name'],
                    package=server_data['package'],
                    installation_method=InstallMethod(server_data['installation_method']),
                    category=server_data['category'],
                    description=server_data['description'],
                    repository=server_data['repository'],
                    requires_api_key=server_data['requires_api_key'],
                    config_required=server_data['config_required']
                )
            
            self.print_colored(f"成功載入 {len(self.servers)} 個 MCP 伺服器配置", Color.GREEN)
            return True
            
        except FileNotFoundError:
            self.print_colored(f"配置文件不存在: {self.config_file}", Color.RED)
            return False
        except json.JSONDecodeError as e:
            self.print_colored(f"配置文件格式錯誤: {e}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"載入配置失敗: {e}", Color.RED)
            return False
    
    def install_npm_package(self, server: MCPServer) -> bool:
        """安裝 npm 包"""
        try:
            self.print_colored(f"安裝 npm 包: {server.package}", Color.CYAN)
            
            # 使用全域安裝
            cmd = ["npm", "install", "-g", server.package]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                self.print_colored(f"✓ 成功安裝 {server.name}", Color.GREEN)
                return True
            else:
                self.print_colored(f"✗ 安裝失敗 {server.name}: {result.stderr}", Color.RED)
                return False
                
        except subprocess.TimeoutExpired:
            self.print_colored(f"✗ 安裝超時 {server.name}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"✗ 安裝異常 {server.name}: {e}", Color.RED)
            return False
    
    def install_pip_package(self, server: MCPServer) -> bool:
        """安裝 pip 包"""
        try:
            self.print_colored(f"安裝 pip 包: {server.package}", Color.CYAN)
            
            cmd = ["pip", "install", server.package]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                self.print_colored(f"✓ 成功安裝 {server.name}", Color.GREEN)
                return True
            else:
                self.print_colored(f"✗ 安裝失敗 {server.name}: {result.stderr}", Color.RED)
                return False
                
        except subprocess.TimeoutExpired:
            self.print_colored(f"✗ 安裝超時 {server.name}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"✗ 安裝異常 {server.name}: {e}", Color.RED)
            return False
    
    def install_git_repository(self, server: MCPServer, server_key: str) -> bool:
        """克隆 Git 倉庫"""
        try:
            self.print_colored(f"克隆 Git 倉庫: {server.repository}", Color.CYAN)
            
            clone_dir = self.servers_dir / server_key
            
            if clone_dir.exists():
                self.print_colored("目錄已存在，更新倉庫...", Color.YELLOW)
                cmd = ["git", "-C", str(clone_dir), "pull"]
            else:
                cmd = ["git", "clone", server.repository, str(clone_dir)]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                self.print_colored(f"✓ 成功克隆 {server.name}", Color.GREEN)
                return True
            else:
                self.print_colored(f"✗ 克隆失敗 {server.name}: {result.stderr}", Color.RED)
                return False
                
        except subprocess.TimeoutExpired:
            self.print_colored(f"✗ 克隆超時 {server.name}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"✗ 克隆異常 {server.name}: {e}", Color.RED)
            return False
    
    def install_go_package(self, server: MCPServer) -> bool:
        """安裝 Go 包"""
        try:
            self.print_colored(f"安裝 Go 包: {server.package}", Color.CYAN)
            
            cmd = ["go", "install", server.package]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                self.print_colored(f"✓ 成功安裝 {server.name}", Color.GREEN)
                return True
            else:
                self.print_colored(f"✗ 安裝失敗 {server.name}: {result.stderr}", Color.RED)
                return False
                
        except subprocess.TimeoutExpired:
            self.print_colored(f"✗ 安裝超時 {server.name}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"✗ 安裝異常 {server.name}: {e}", Color.RED)
            return False
    
    def install_server(self, server_key: str, server: MCPServer) -> bool:
        """安裝單個 MCP 伺服器"""
        self.print_colored(f"\n開始安裝: {server.name} ({server_key})", Color.MAGENTA, True)
        self.print_colored(f"類別: {server.category}", Color.GRAY)
        self.print_colored(f"描述: {server.description}", Color.GRAY)
        
        success = False
        
        if server.installation_method == InstallMethod.NPM:
            success = self.install_npm_package(server)
        elif server.installation_method == InstallMethod.PIP:
            success = self.install_pip_package(server)
        elif server.installation_method == InstallMethod.GIT:
            success = self.install_git_repository(server, server_key)
        elif server.installation_method == InstallMethod.GO:
            success = self.install_go_package(server)
        elif server.installation_method == InstallMethod.UNITY:
            self.print_colored(f"Unity 包需要手動安裝: {server.repository}", Color.YELLOW)
            success = True
        else:
            self.print_colored(f"不支援的安裝方法: {server.installation_method.value}", Color.RED)
            success = False
        
        if success:
            self.success_count += 1
            self.install_log.append(f"✓ {server.name}")
        else:
            self.failed_installs.append(server.name)
            self.install_log.append(f"✗ {server.name}")
        
        return success
    
    def generate_vscode_config(self) -> None:
        """生成 VS Code MCP 配置文件"""
        self.print_colored("\n生成 VS Code 配置文件...", Color.YELLOW, True)
        
        vscode_config = {
            "mcpServers": {}
        }
        
        # 為每個成功安裝的伺服器生成配置
        for server_key, server in self.servers.items():
            if server.name not in self.failed_installs:
                server_config = self._generate_server_config(server_key, server)
                if server_config:
                    vscode_config["mcpServers"][server_key] = server_config
        
        # 保存配置文件
        config_file = self.config_dir / "vscode-mcp-settings.json"
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(vscode_config, f, indent=2, ensure_ascii=False)
        
        self.print_colored(f"VS Code 配置已保存到: {config_file}", Color.GREEN)
    
    def _generate_server_config(self, server_key: str, server: MCPServer) -> Optional[Dict]:
        """為單個伺服器生成 VS Code 配置"""
        config = {}
        
        if server.installation_method == InstallMethod.NPM:
            config["command"] = "npx"
            config["args"] = [server.package]
        elif server.installation_method == InstallMethod.PIP:
            config["command"] = "python"
            config["args"] = ["-m", server.package]
        elif server.installation_method == InstallMethod.GIT:
            server_dir = self.servers_dir / server_key
            if (server_dir / "package.json").exists():
                config["command"] = "node"
                config["args"] = [str(server_dir / "index.js")]
            elif (server_dir / "main.py").exists():
                config["command"] = "python"
                config["args"] = [str(server_dir / "main.py")]
            else:
                return None
        elif server.installation_method == InstallMethod.GO:
            # Go 安裝的包通常在 GOPATH/bin 中
            go_bin = shutil.which(server.package.split('/')[-1])
            if go_bin:
                config["command"] = go_bin
                config["args"] = []
            else:
                return None
        else:
            return None
        
        # 添加環境變量配置
        if server.config_required:
            config["env"] = {}
            for env_var in server.config_required:
                config["env"][env_var] = f"${env_var}"
        
        return config
    
    def generate_env_template(self) -> None:
        """生成環境變量模板文件"""
        self.print_colored("\n生成環境變量模板...", Color.YELLOW, True)
        
        env_template = []
        env_template.append("# MCP 伺服器環境變量配置")
        env_template.append("# 請根據需要設置以下環境變量\n")
        
        # 按類別分組環境變量
        categories = {}
        for server in self.servers.values():
            if server.config_required:
                if server.category not in categories:
                    categories[server.category] = []
                categories[server.category].extend(server.config_required)
        
        for category, env_vars in categories.items():
            env_template.append(f"# === {category} ===")
            for env_var in set(env_vars):  # 去重
                env_template.append(f"# export {env_var}=your_value_here")
            env_template.append("")
        
        # 保存環境變量模板
        env_file = self.config_dir / "environment-template.sh"
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(env_template))
        
        # 同時生成 Windows 批次文件
        env_bat = self.config_dir / "environment-template.bat"
        with open(env_bat, 'w', encoding='utf-8') as f:
            bat_content = env_template.copy()
            for i, line in enumerate(bat_content):
                if line.startswith("# export "):
                    bat_content[i] = line.replace("# export ", "REM set ").replace("=", "=")
            f.write('\n'.join(bat_content))
        
        self.print_colored(f"環境變量模板已保存到:")
        self.print_colored(f"  Linux/Mac: {env_file}", Color.CYAN)
        self.print_colored(f"  Windows: {env_bat}", Color.CYAN)
    
    def install_all(self, methods: List[InstallMethod] = None, server_list: List[str] = None) -> None:
        """安裝所有或指定的 MCP 伺服器"""
        self.print_colored("\n開始安裝 MCP 伺服器...", Color.YELLOW, True)
        
        if methods:
            self.print_colored(f"安裝方法: {[m.value for m in methods]}", Color.GRAY)
        if server_list:
            self.print_colored(f"指定伺服器: {server_list}", Color.GRAY)
        
        for server_key, server in self.servers.items():
            # 檢查是否符合安裝條件
            if methods and server.installation_method not in methods:
                continue
            
            if server_list and server_key not in server_list:
                continue
            
            self.total_count += 1
            self.install_server(server_key, server)
    
    def print_summary(self) -> None:
        """打印安裝結果摘要"""
        self.print_colored("\n" + "=" * 50, Color.YELLOW)
        self.print_colored("安裝結果摘要", Color.YELLOW, True)
        self.print_colored("=" * 50, Color.YELLOW)
        
        self.print_colored(f"總計伺服器: {self.total_count}", Color.WHITE)
        self.print_colored(f"成功安裝: {self.success_count}", Color.GREEN)
        self.print_colored(f"安裝失敗: {len(self.failed_installs)}", Color.RED)
        
        if self.failed_installs:
            self.print_colored("\n失敗的伺服器:", Color.RED, True)
            for failed in self.failed_installs:
                self.print_colored(f"  - {failed}", Color.RED)
        
        self.print_colored("\n下一步:", Color.YELLOW, True)
        self.print_colored("1. 編輯環境變量模板文件設置必要的 API Keys", Color.WHITE)
        self.print_colored("2. 將 VS Code 配置複製到您的 settings.json", Color.WHITE)
        self.print_colored("3. 運行測試腳本驗證安裝", Color.WHITE)
        
        # 保存安裝日誌
        log_file = self.config_dir / "install-log.txt"
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.install_log))
        
        self.print_colored(f"\n安裝日誌已保存到: {log_file}", Color.CYAN)


def main():
    """主函數"""
    parser = argparse.ArgumentParser(description="MCP 伺服器自動化安裝腳本")
    parser.add_argument("--config", default="mcp-servers-config.json", help="配置文件路徑")
    parser.add_argument("--method", choices=["npm", "pip", "git", "go", "unity"], 
                       help="指定安裝方法")
    parser.add_argument("--servers", help="指定要安裝的伺服器列表，用逗號分隔")
    parser.add_argument("--skip-check", action="store_true", help="跳過先決條件檢查")
    
    args = parser.parse_args()
    
    # 創建安裝器實例
    installer = MCPInstaller(args.config)
    
    try:
        # 檢查先決條件
        if not args.skip_check:
            if not installer.check_prerequisites():
                sys.exit(1)
        
        # 載入配置
        if not installer.load_config():
            sys.exit(1)
        
        # 解析安裝方法
        methods = None
        if args.method:
            methods = [InstallMethod(args.method)]
        
        # 解析伺服器列表
        server_list = None
        if args.servers:
            server_list = [s.strip() for s in args.servers.split(",")]
        
        # 開始安裝
        installer.install_all(methods, server_list)
        
        # 生成配置文件
        installer.generate_vscode_config()
        installer.generate_env_template()
        
        # 打印摘要
        installer.print_summary()
        
    except KeyboardInterrupt:
        installer.print_colored("\n安裝被用戶中斷", Color.YELLOW)
        sys.exit(1)
    except Exception as e:
        installer.print_colored(f"\n安裝過程中發生錯誤: {e}", Color.RED)
        sys.exit(1)


if __name__ == "__main__":
    main()