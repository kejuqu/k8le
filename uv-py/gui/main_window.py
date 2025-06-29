"""
主窗口
集成语音识别和虚拟键盘功能
"""

import os
import sys
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
    QPushButton, QTextEdit, QLabel, QFileDialog,
    QMessageBox, QProgressBar, QSplitter, QFrame
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal, QTimer, QObject
from PyQt6.QtGui import QFont, QIcon, QTextCursor

from .virtual_keyboard import VirtualKeyboard
from ..speech2text import SpeechRecognizer


class RecognitionThread(QThread):
    """语音识别线程"""
    
    result_received = pyqtSignal(str)
    status_changed = pyqtSignal(str)
    error_occurred = pyqtSignal(str)
    
    def __init__(self, recognizer):
        super().__init__()
        self.recognizer = recognizer
        self.is_running = False
    
    def run(self):
        """运行识别线程"""
        try:
            self.is_running = True
            self.status_changed.emit("正在录音...")
            
            def on_result(text):
                if text:
                    self.result_received.emit(text)
            
            self.recognizer.set_callback(on_result)
            self.recognizer.start_recording()
            
            # 保持线程运行
            while self.is_running:
                self.msleep(100)
                
        except Exception as e:
            self.error_occurred.emit(f"识别错误: {e}")
        finally:
            self.recognizer.stop_recording()
            self.status_changed.emit("录音已停止")
    
    def stop(self):
        """停止识别"""
        self.is_running = False
        self.recognizer.stop_recording()


class MainWindow(QMainWindow):
    """主窗口"""
    
    def __init__(self):
        super().__init__()
        self.recognizer = None
        self.recognition_thread = None
        self.init_ui()
        self.init_speech_recognizer()
    
    def init_ui(self):
        """初始化界面"""
        self.setWindowTitle("语音转文字 - PC端应用")
        self.setMinimumSize(800, 600)
        
        # 设置窗口图标（如果有的话）
        # self.setWindowIcon(QIcon("assets/icons/app_icon.png"))
        
        # 创建中央部件
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 主布局
        main_layout = QVBoxLayout(central_widget)
        main_layout.setSpacing(10)
        main_layout.setContentsMargins(15, 15, 15, 15)
        
        # 标题
        title_label = QLabel("语音转文字应用")
        title_label.setFont(QFont("Arial", 18, QFont.Weight.Bold))
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("color: #2c3e50; margin: 10px;")
        main_layout.addWidget(title_label)
        
        # 创建分割器
        splitter = QSplitter(Qt.Orientation.Vertical)
        main_layout.addWidget(splitter)
        
        # 上半部分：语音识别区域
        recognition_widget = self.create_recognition_widget()
        splitter.addWidget(recognition_widget)
        
        # 下半部分：虚拟键盘
        keyboard_widget = VirtualKeyboard()
        splitter.addWidget(keyboard_widget)
        
        # 设置分割器比例
        splitter.setSizes([400, 300])
        
        # 连接键盘信号
        keyboard_widget.key_pressed.connect(self.on_keyboard_input)
    
    def create_recognition_widget(self):
        """创建语音识别区域"""
        widget = QFrame()
        widget.setFrameStyle(QFrame.Shape.Box)
        widget.setStyleSheet("""
            QFrame {
                border: 2px solid #bdc3c7;
                border-radius: 10px;
                background-color: #ecf0f1;
            }
        """)
        
        layout = QVBoxLayout(widget)
        layout.setSpacing(10)
        layout.setContentsMargins(15, 15, 15, 15)
        
        # 控制按钮区域
        control_layout = QHBoxLayout()
        
        self.record_button = QPushButton("开始录音")
        self.record_button.setMinimumSize(100, 40)
        self.record_button.clicked.connect(self.toggle_recording)
        self.record_button.setStyleSheet("""
            QPushButton {
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #2980b9;
            }
            QPushButton:pressed {
                background-color: #21618c;
            }
        """)
        
        self.file_button = QPushButton("选择音频文件")
        self.file_button.setMinimumSize(120, 40)
        self.file_button.clicked.connect(self.select_audio_file)
        self.file_button.setStyleSheet("""
            QPushButton {
                background-color: #27ae60;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #229954;
            }
            QPushButton:pressed {
                background-color: #1e8449;
            }
        """)
        
        self.clear_button = QPushButton("清空文本")
        self.clear_button.setMinimumSize(100, 40)
        self.clear_button.clicked.connect(self.clear_text)
        self.clear_button.setStyleSheet("""
            QPushButton {
                background-color: #e74c3c;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #c0392b;
            }
            QPushButton:pressed {
                background-color: #a93226;
            }
        """)
        
        control_layout.addWidget(self.record_button)
        control_layout.addWidget(self.file_button)
        control_layout.addWidget(self.clear_button)
        control_layout.addStretch()
        
        layout.addLayout(control_layout)
        
        # 状态标签
        self.status_label = QLabel("就绪")
        self.status_label.setFont(QFont("Arial", 10))
        self.status_label.setStyleSheet("color: #7f8c8d; padding: 5px;")
        layout.addWidget(self.status_label)
        
        # 进度条
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        layout.addWidget(self.progress_bar)
        
        # 文本显示区域
        text_label = QLabel("识别结果:")
        text_label.setFont(QFont("Arial", 12, QFont.Weight.Bold))
        layout.addWidget(text_label)
        
        self.text_edit = QTextEdit()
        self.text_edit.setFont(QFont("Arial", 12))
        self.text_edit.setStyleSheet("""
            QTextEdit {
                border: 2px solid #bdc3c7;
                border-radius: 8px;
                background-color: white;
                padding: 10px;
            }
        """)
        layout.addWidget(self.text_edit)
        
        return widget
    
    def init_speech_recognizer(self):
        """初始化语音识别器"""
        try:
            self.create_recognizer()
        except Exception as e:
            QMessageBox.critical(self, "错误", f"初始化语音识别器失败: {e}")
    
    def create_recognizer(self):
        """创建识别器"""
        try:
            self.recognizer = SpeechRecognizer()
            self.status_label.setText("语音识别器已就绪")
        except Exception as e:
            QMessageBox.critical(self, "错误", f"创建识别器失败: {e}")
    
    def on_model_downloaded(self, success):
        """模型下载完成"""
        self.progress_bar.setVisible(False)
        if success:
            self.create_recognizer()
        else:
            self.status_label.setText("模型下载失败")
    
    def on_download_error(self, error):
        """下载错误"""
        self.progress_bar.setVisible(False)
        self.status_label.setText(f"下载错误: {error}")
    
    def toggle_recording(self):
        """切换录音状态"""
        if not self.recognizer:
            QMessageBox.warning(self, "警告", "语音识别器未初始化")
            return
        
        if self.recognition_thread and self.recognition_thread.is_running:
            # 停止录音
            self.recognition_thread.stop()
            self.recognition_thread.wait()
            self.recognition_thread = None
            self.record_button.setText("开始录音")
            self.record_button.setStyleSheet("""
                QPushButton {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 14px;
                }
                QPushButton:hover {
                    background-color: #2980b9;
                }
                QPushButton:pressed {
                    background-color: #21618c;
                }
            """)
        else:
            # 开始录音
            self.recognition_thread = RecognitionThread(self.recognizer)
            self.recognition_thread.result_received.connect(self.on_recognition_result)
            self.recognition_thread.status_changed.connect(self.status_label.setText)
            self.recognition_thread.error_occurred.connect(self.on_recognition_error)
            self.recognition_thread.start()
            
            self.record_button.setText("停止录音")
            self.record_button.setStyleSheet("""
                QPushButton {
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 14px;
                }
                QPushButton:hover {
                    background-color: #c0392b;
                }
                QPushButton:pressed {
                    background-color: #a93226;
                }
            """)
    
    def on_recognition_result(self, text):
        """处理识别结果"""
        if text:
            cursor = self.text_edit.textCursor()
            cursor.movePosition(QTextCursor.MoveOperation.End)
            self.text_edit.setTextCursor(cursor)
            self.text_edit.insertPlainText(text + " ")
    
    def on_recognition_error(self, error):
        """处理识别错误"""
        QMessageBox.warning(self, "识别错误", error)
        self.toggle_recording()  # 停止录音
    
    def select_audio_file(self):
        """选择音频文件"""
        if not self.recognizer:
            QMessageBox.warning(self, "警告", "语音识别器未初始化")
            return
        
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "选择音频文件",
            "",
            "音频文件 (*.wav *.mp3 *.flac *.m4a)"
        )
        
        if file_path:
            self.status_label.setText("正在识别音频文件...")
            self.progress_bar.setVisible(True)
            self.progress_bar.setRange(0, 0)
            
            # 在新线程中处理文件
            self.file_thread = QThread()
            self.file_worker = FileProcessor(self.recognizer, file_path)
            self.file_worker.moveToThread(self.file_thread)
            
            self.file_thread.started.connect(self.file_worker.process)
            self.file_worker.finished.connect(self.on_file_processed)
            self.file_worker.error.connect(self.on_file_error)
            self.file_worker.finished.connect(self.file_thread.quit)
            
            self.file_thread.start()
    
    def on_file_processed(self, result):
        """文件处理完成"""
        self.progress_bar.setVisible(False)
        if result:
            self.text_edit.append(result)
        self.status_label.setText("文件识别完成")
    
    def on_file_error(self, error):
        """文件处理错误"""
        self.progress_bar.setVisible(False)
        self.status_label.setText(f"文件识别失败: {error}")
        QMessageBox.warning(self, "识别错误", error)
    
    def on_keyboard_input(self, key):
        """处理键盘输入"""
        if key == "CLEAR":
            self.clear_text()
        elif key == "\b":
            # 退格
            cursor = self.text_edit.textCursor()
            cursor.deletePreviousChar()
        else:
            # 插入文本
            cursor = self.text_edit.textCursor()
            cursor.insertText(key)
    
    def clear_text(self):
        """清空文本"""
        self.text_edit.clear()
    
    def closeEvent(self, event):
        """关闭事件"""
        if self.recognition_thread and self.recognition_thread.is_running:
            self.recognition_thread.stop()
            self.recognition_thread.wait()
        event.accept()


class ModelDownloader(QObject):
    """模型下载器"""
    
    finished = pyqtSignal(bool)
    error = pyqtSignal(str)
    
    def download(self):
        """下载模型"""
        try:
            # SpeechRecognition不需要下载模型，直接返回成功
            self.finished.emit(True)
        except Exception as e:
            self.error.emit(str(e))


class FileProcessor(QObject):
    """文件处理器"""
    
    finished = pyqtSignal(str)
    error = pyqtSignal(str)
    
    def __init__(self, recognizer, file_path):
        super().__init__()
        self.recognizer = recognizer
        self.file_path = file_path
    
    def process(self):
        """处理文件"""
        try:
            result = self.recognizer.recognize_file(self.file_path)
            self.finished.emit(result)
        except Exception as e:
            self.error.emit(str(e)) 