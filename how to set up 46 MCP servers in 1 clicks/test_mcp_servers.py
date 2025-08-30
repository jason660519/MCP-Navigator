#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 伺服器測試腳本
驗證已安裝的 MCP 伺服器是否正常工作

作者: MCP Navigator Project
版本: 1.0.0
日期: 2025-01-20
"""

import os
import sys
import json
import subprocess
import time
import signal
import threading
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse
from dataclasses import dataclass
from enum import Enum
import socket
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed


class TestResult(Enum):
    """測試結果枚舉"""
    PASS = "PASS"
    FAIL = "FAIL"
    SKIP = "SKIP"
    TIMEOUT = "TIMEOUT"
    ERROR = "ERROR"


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
class TestCase:
    """測試案例數據類"""
    server_name: str
    server_key: str
    command: str
    args: List[str]
    env_vars: Dict[str, str]
    timeout: int = 30
    expected_output: Optional[str] = None
    test_type: str = "startup"


@dataclass
class TestReport:
    """測試報告數據類"""
    server_name: str
    server_key: str
    result: TestResult
    message: str
    duration: float
    output: str = ""
    error: str = ""


class MCPTester:
    """MCP 伺服器測試器主類"""
    
    def __init__(self, config_file: str = "mcp-servers-config.json"):
        """初始化測試器"""
        self.config_file = config_file
        self.vscode_config_file = Path.home() / ".mcp" / "config" / "vscode-mcp-settings.json"
        self.test_cases: List[TestCase] = []
        self.test_reports: List[TestReport] = []
        self.running_processes: Dict[str, subprocess.Popen] = {}
        
        # 測試統計
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        self.skipped_tests = 0
        self.timeout_tests = 0
        self.error_tests = 0
    
    def print_colored(self, message: str, color: str = Color.WHITE, bold: bool = False) -> None:
        """彩色輸出函數"""
        prefix = Color.BOLD if bold else ""
        print(f"{prefix}{color}{message}{Color.RESET}")
    
    def load_test_config(self) -> bool:
        """載入測試配置"""
        try:
            # 載入 VS Code 配置
            if not self.vscode_config_file.exists():
                self.print_colored(f"VS Code 配置文件不存在: {self.vscode_config_file}", Color.RED)
                return False
            
            with open(self.vscode_config_file, 'r', encoding='utf-8') as f:
                vscode_config = json.load(f)
            
            # 載入原始配置以獲取伺服器信息
            with open(self.config_file, 'r', encoding='utf-8') as f:
                server_config = json.load(f)
            
            # 生成測試案例
            for server_key, config in vscode_config.get('mcpServers', {}).items():
                server_info = server_config['servers'].get(server_key, {})
                
                test_case = TestCase(
                    server_name=server_info.get('name', server_key),
                    server_key=server_key,
                    command=config['command'],
                    args=config.get('args', []),
                    env_vars=config.get('env', {}),
                    timeout=30
                )
                
                self.test_cases.append(test_case)
            
            self.print_colored(f"載入 {len(self.test_cases)} 個測試案例", Color.GREEN)
            return True
            
        except FileNotFoundError as e:
            self.print_colored(f"配置文件不存在: {e}", Color.RED)
            return False
        except json.JSONDecodeError as e:
            self.print_colored(f"配置文件格式錯誤: {e}", Color.RED)
            return False
        except Exception as e:
            self.print_colored(f"載入配置失敗: {e}", Color.RED)
            return False
    
    def check_environment_variables(self) -> Dict[str, bool]:
        """檢查環境變量設置"""
        self.print_colored("\n檢查環境變量設置...", Color.YELLOW, True)
        
        env_status = {}
        required_vars = set()
        
        # 收集所有需要的環境變量
        for test_case in self.test_cases:
            for env_var in test_case.env_vars.keys():
                if env_var.startswith('$'):
                    required_vars.add(env_var[1:])  # 移除 $ 前綴
                else:
                    required_vars.add(env_var)
        
        # 檢查每個環境變量
        for var in required_vars:
            value = os.getenv(var)
            if value:
                self.print_colored(f"✓ {var}: 已設置", Color.GREEN)
                env_status[var] = True
            else:
                self.print_colored(f"✗ {var}: 未設置", Color.RED)
                env_status[var] = False
        
        missing_count = sum(1 for status in env_status.values() if not status)
        if missing_count > 0:
            self.print_colored(f"\n警告: {missing_count} 個環境變量未設置", Color.YELLOW)
            self.print_colored("某些伺服器可能無法正常工作", Color.YELLOW)
        
        return env_status
    
    def test_server_startup(self, test_case: TestCase) -> TestReport:
        """測試伺服器啟動"""
        start_time = time.time()
        
        try:
            # 準備環境變量
            env = os.environ.copy()
            for key, value in test_case.env_vars.items():
                if value.startswith('$'):
                    env_var = value[1:]
                    env_value = os.getenv(env_var)
                    if env_value:
                        env[key] = env_value
                else:
                    env[key] = value
            
            # 啟動伺服器進程
            cmd = [test_case.command] + test_case.args
            
            self.print_colored(f"啟動命令: {' '.join(cmd)}", Color.GRAY)
            
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
            )
            
            self.running_processes[test_case.server_key] = process
            
            # 等待一段時間檢查進程是否正常啟動
            time.sleep(3)
            
            if process.poll() is None:
                # 進程仍在運行，認為啟動成功
                duration = time.time() - start_time
                
                # 嘗試讀取一些輸出
                try:
                    stdout, stderr = process.communicate(timeout=2)
                    output = stdout + stderr
                except subprocess.TimeoutExpired:
                    output = "進程正在運行..."
                
                return TestReport(
                    server_name=test_case.server_name,
                    server_key=test_case.server_key,
                    result=TestResult.PASS,
                    message="伺服器啟動成功",
                    duration=duration,
                    output=output
                )
            else:
                # 進程已退出
                stdout, stderr = process.communicate()
                duration = time.time() - start_time
                
                return TestReport(
                    server_name=test_case.server_name,
                    server_key=test_case.server_key,
                    result=TestResult.FAIL,
                    message=f"伺服器啟動失敗，退出碼: {process.returncode}",
                    duration=duration,
                    output=stdout,
                    error=stderr
                )
        
        except FileNotFoundError:
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.ERROR,
                message=f"命令不存在: {test_case.command}",
                duration=duration
            )
        
        except subprocess.TimeoutExpired:
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.TIMEOUT,
                message="伺服器啟動超時",
                duration=duration
            )
        
        except Exception as e:
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.ERROR,
                message=f"測試異常: {str(e)}",
                duration=duration
            )
    
    def test_server_health(self, test_case: TestCase) -> TestReport:
        """測試伺服器健康狀態"""
        start_time = time.time()
        
        # 檢查進程是否還在運行
        process = self.running_processes.get(test_case.server_key)
        
        if not process:
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.SKIP,
                message="伺服器未啟動，跳過健康檢查",
                duration=duration
            )
        
        if process.poll() is None:
            # 進程仍在運行
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.PASS,
                message="伺服器運行正常",
                duration=duration
            )
        else:
            # 進程已退出
            duration = time.time() - start_time
            return TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.FAIL,
                message=f"伺服器已停止，退出碼: {process.returncode}",
                duration=duration
            )
    
    def run_single_test(self, test_case: TestCase, test_type: str = "startup") -> TestReport:
        """運行單個測試"""
        self.print_colored(f"\n測試: {test_case.server_name} ({test_case.server_key})", Color.CYAN, True)
        
        if test_type == "startup":
            report = self.test_server_startup(test_case)
        elif test_type == "health":
            report = self.test_server_health(test_case)
        else:
            report = TestReport(
                server_name=test_case.server_name,
                server_key=test_case.server_key,
                result=TestResult.ERROR,
                message=f"未知的測試類型: {test_type}",
                duration=0.0
            )
        
        # 輸出測試結果
        result_color = {
            TestResult.PASS: Color.GREEN,
            TestResult.FAIL: Color.RED,
            TestResult.SKIP: Color.YELLOW,
            TestResult.TIMEOUT: Color.MAGENTA,
            TestResult.ERROR: Color.RED
        }.get(report.result, Color.WHITE)
        
        self.print_colored(f"結果: {report.result.value} - {report.message}", result_color)
        self.print_colored(f"耗時: {report.duration:.2f}s", Color.GRAY)
        
        if report.output:
            self.print_colored("輸出:", Color.GRAY)
            for line in report.output.split('\n')[:5]:  # 只顯示前5行
                if line.strip():
                    self.print_colored(f"  {line}", Color.GRAY)
        
        if report.error:
            self.print_colored("錯誤:", Color.RED)
            for line in report.error.split('\n')[:3]:  # 只顯示前3行
                if line.strip():
                    self.print_colored(f"  {line}", Color.RED)
        
        return report
    
    def run_all_tests(self, test_types: List[str] = None, server_list: List[str] = None) -> None:
        """運行所有測試"""
        if test_types is None:
            test_types = ["startup", "health"]
        
        self.print_colored("\n開始運行 MCP 伺服器測試...", Color.YELLOW, True)
        
        for test_type in test_types:
            self.print_colored(f"\n=== {test_type.upper()} 測試 ===", Color.YELLOW, True)
            
            for test_case in self.test_cases:
                # 檢查是否符合測試條件
                if server_list and test_case.server_key not in server_list:
                    continue
                
                self.total_tests += 1
                report = self.run_single_test(test_case, test_type)
                self.test_reports.append(report)
                
                # 更新統計
                if report.result == TestResult.PASS:
                    self.passed_tests += 1
                elif report.result == TestResult.FAIL:
                    self.failed_tests += 1
                elif report.result == TestResult.SKIP:
                    self.skipped_tests += 1
                elif report.result == TestResult.TIMEOUT:
                    self.timeout_tests += 1
                elif report.result == TestResult.ERROR:
                    self.error_tests += 1
            
            # 在健康檢查前等待一段時間
            if test_type == "startup" and "health" in test_types:
                self.print_colored("\n等待 5 秒後進行健康檢查...", Color.YELLOW)
                time.sleep(5)
    
    def cleanup_processes(self) -> None:
        """清理運行中的進程"""
        self.print_colored("\n清理運行中的進程...", Color.YELLOW)
        
        for server_key, process in self.running_processes.items():
            if process.poll() is None:
                try:
                    if os.name == 'nt':
                        # Windows
                        process.send_signal(signal.CTRL_BREAK_EVENT)
                    else:
                        # Unix/Linux
                        process.terminate()
                    
                    # 等待進程結束
                    try:
                        process.wait(timeout=5)
                        self.print_colored(f"✓ 已停止 {server_key}", Color.GREEN)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        self.print_colored(f"✓ 已強制停止 {server_key}", Color.YELLOW)
                        
                except Exception as e:
                    self.print_colored(f"✗ 停止 {server_key} 失敗: {e}", Color.RED)
    
    def generate_test_report(self) -> None:
        """生成測試報告"""
        self.print_colored("\n" + "=" * 60, Color.YELLOW)
        self.print_colored("測試結果報告", Color.YELLOW, True)
        self.print_colored("=" * 60, Color.YELLOW)
        
        # 總體統計
        self.print_colored(f"總測試數: {self.total_tests}", Color.WHITE)
        self.print_colored(f"通過: {self.passed_tests}", Color.GREEN)
        self.print_colored(f"失敗: {self.failed_tests}", Color.RED)
        self.print_colored(f"跳過: {self.skipped_tests}", Color.YELLOW)
        self.print_colored(f"超時: {self.timeout_tests}", Color.MAGENTA)
        self.print_colored(f"錯誤: {self.error_tests}", Color.RED)
        
        success_rate = (self.passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        self.print_colored(f"成功率: {success_rate:.1f}%", Color.CYAN)
        
        # 詳細結果
        self.print_colored("\n詳細結果:", Color.WHITE, True)
        
        # 按結果分組
        results_by_status = {}
        for report in self.test_reports:
            if report.result not in results_by_status:
                results_by_status[report.result] = []
            results_by_status[report.result].append(report)
        
        for status, reports in results_by_status.items():
            color = {
                TestResult.PASS: Color.GREEN,
                TestResult.FAIL: Color.RED,
                TestResult.SKIP: Color.YELLOW,
                TestResult.TIMEOUT: Color.MAGENTA,
                TestResult.ERROR: Color.RED
            }.get(status, Color.WHITE)
            
            self.print_colored(f"\n{status.value}:", color, True)
            for report in reports:
                self.print_colored(f"  - {report.server_name}: {report.message}", color)
        
        # 保存詳細報告到文件
        report_file = Path.home() / ".mcp" / "config" / "test-report.json"
        report_data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "summary": {
                "total": self.total_tests,
                "passed": self.passed_tests,
                "failed": self.failed_tests,
                "skipped": self.skipped_tests,
                "timeout": self.timeout_tests,
                "error": self.error_tests,
                "success_rate": success_rate
            },
            "details": [
                {
                    "server_name": report.server_name,
                    "server_key": report.server_key,
                    "result": report.result.value,
                    "message": report.message,
                    "duration": report.duration,
                    "output": report.output,
                    "error": report.error
                }
                for report in self.test_reports
            ]
        }
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        self.print_colored(f"\n詳細報告已保存到: {report_file}", Color.CYAN)


def main():
    """主函數"""
    parser = argparse.ArgumentParser(description="MCP 伺服器測試腳本")
    parser.add_argument("--config", default="mcp-servers-config.json", help="配置文件路徑")
    parser.add_argument("--test-type", choices=["startup", "health", "all"], 
                       default="all", help="測試類型")
    parser.add_argument("--servers", help="指定要測試的伺服器列表，用逗號分隔")
    parser.add_argument("--no-cleanup", action="store_true", help="測試後不清理進程")
    
    args = parser.parse_args()
    
    # 創建測試器實例
    tester = MCPTester(args.config)
    
    try:
        # 載入測試配置
        if not tester.load_test_config():
            sys.exit(1)
        
        # 檢查環境變量
        tester.check_environment_variables()
        
        # 解析測試類型
        if args.test_type == "all":
            test_types = ["startup", "health"]
        else:
            test_types = [args.test_type]
        
        # 解析伺服器列表
        server_list = None
        if args.servers:
            server_list = [s.strip() for s in args.servers.split(",")]
        
        # 運行測試
        tester.run_all_tests(test_types, server_list)
        
        # 生成報告
        tester.generate_test_report()
        
    except KeyboardInterrupt:
        tester.print_colored("\n測試被用戶中斷", Color.YELLOW)
    except Exception as e:
        tester.print_colored(f"\n測試過程中發生錯誤: {e}", Color.RED)
    finally:
        # 清理進程
        if not args.no_cleanup:
            tester.cleanup_processes()


if __name__ == "__main__":
    main()