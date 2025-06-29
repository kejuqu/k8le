"""
虚拟键盘组件
支持更换背景图片
"""

import os
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
    QLabel, QFileDialog, QScrollArea, QFrame
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QPixmap, QPalette, QColor, QFont


class VirtualKeyboard(QWidget):
    """虚拟键盘组件"""
    
    key_pressed = pyqtSignal(str)  # 按键信号
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.background_image = None
        self.init_ui()
        self.load_default_background()
    
    def init_ui(self):
        """初始化界面"""
        self.setMinimumSize(600, 300)
        self.setMaximumHeight(400)
        
        # 主布局
        layout = QVBoxLayout(self)
        layout.setSpacing(5)
        layout.setContentsMargins(10, 10, 10, 10)
        
        # 背景控制区域
        bg_control = QHBoxLayout()
        bg_label = QLabel("键盘背景:")
        bg_label.setFont(QFont("Arial", 10))
        
        self.bg_button = QPushButton("选择背景")
        self.bg_button.clicked.connect(self.select_background)
        
        self.reset_bg_button = QPushButton("重置背景")
        self.reset_bg_button.clicked.connect(self.load_default_background)
        
        bg_control.addWidget(bg_label)
        bg_control.addWidget(self.bg_button)
        bg_control.addWidget(self.reset_bg_button)
        bg_control.addStretch()
        
        layout.addLayout(bg_control)
        
        # 键盘区域
        self.keyboard_frame = QFrame()
        self.keyboard_frame.setFrameStyle(QFrame.Shape.Box)
        self.keyboard_frame.setStyleSheet("""
            QFrame {
                border: 2px solid #ccc;
                border-radius: 10px;
                background-color: #f0f0f0;
            }
        """)
        
        self.keyboard_layout = QVBoxLayout(self.keyboard_frame)
        self.keyboard_layout.setSpacing(5)
        self.keyboard_layout.setContentsMargins(10, 10, 10, 10)
        
        # 创建键盘按键
        self.create_keyboard_keys()
        
        layout.addWidget(self.keyboard_frame)
    
    def create_keyboard_keys(self):
        """创建键盘按键"""
        # 数字行
        number_row = QHBoxLayout()
        number_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        for key in number_keys:
            btn = self.create_key_button(key)
            number_row.addWidget(btn)
        self.keyboard_layout.addLayout(number_row)
        
        # 第一行字母
        row1 = QHBoxLayout()
        row1_keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
        for key in row1_keys:
            btn = self.create_key_button(key)
            row1.addWidget(btn)
        self.keyboard_layout.addLayout(row1)
        
        # 第二行字母
        row2 = QHBoxLayout()
        row2.addStretch(1)
        row2_keys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
        for key in row2_keys:
            btn = self.create_key_button(key)
            row2.addWidget(btn)
        row2.addStretch(1)
        self.keyboard_layout.addLayout(row2)
        
        # 第三行字母
        row3 = QHBoxLayout()
        row3_keys = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        for key in row3_keys:
            btn = self.create_key_button(key)
            row3.addWidget(btn)
        row3.addStretch(3)
        self.keyboard_layout.addLayout(row3)
        
        # 功能键行
        function_row = QHBoxLayout()
        function_keys = ['空格', '退格', '回车', '清除']
        for key in function_keys:
            btn = self.create_key_button(key, is_function=True)
            function_row.addWidget(btn)
        self.keyboard_layout.addLayout(function_row)
    
    def create_key_button(self, text, is_function=False):
        """创建按键按钮"""
        btn = QPushButton(text)
        btn.setMinimumSize(40, 40)
        btn.setMaximumSize(60, 50)
        
        if is_function:
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #4CAF50;
                    color: white;
                    border: 2px solid #45a049;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 12px;
                }
                QPushButton:hover {
                    background-color: #45a049;
                }
                QPushButton:pressed {
                    background-color: #3d8b40;
                }
            """)
        else:
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #ffffff;
                    color: #333333;
                    border: 2px solid #cccccc;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 14px;
                }
                QPushButton:hover {
                    background-color: #e6e6e6;
                    border-color: #999999;
                }
                QPushButton:pressed {
                    background-color: #d4d4d4;
                }
            """)
        
        btn.clicked.connect(lambda: self.on_key_pressed(text))
        return btn
    
    def on_key_pressed(self, key):
        """按键处理"""
        if key == "空格":
            self.key_pressed.emit(" ")
        elif key == "退格":
            self.key_pressed.emit("\b")
        elif key == "回车":
            self.key_pressed.emit("\n")
        elif key == "清除":
            self.key_pressed.emit("CLEAR")
        else:
            self.key_pressed.emit(key)
    
    def select_background(self):
        """选择背景图片"""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "选择键盘背景图片",
            "",
            "图片文件 (*.png *.jpg *.jpeg *.bmp *.gif)"
        )
        
        if file_path:
            self.set_background_image(file_path)
    
    def set_background_image(self, image_path):
        """设置背景图片"""
        if os.path.exists(image_path):
            self.background_image = image_path
            pixmap = QPixmap(image_path)
            
            # 调整图片大小以适应键盘区域
            scaled_pixmap = pixmap.scaled(
                self.keyboard_frame.size(),
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation
            )
            
            # 设置背景图片
            self.keyboard_frame.setStyleSheet(f"""
                QFrame {{
                    border: 2px solid #ccc;
                    border-radius: 10px;
                    background-image: url({image_path});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-origin: content;
                    background-clip: content;
                }}
            """)
    
    def load_default_background(self):
        """加载默认背景"""
        self.background_image = None
        self.keyboard_frame.setStyleSheet("""
            QFrame {
                border: 2px solid #ccc;
                border-radius: 10px;
                background-color: #f0f0f0;
            }
        """)
    
    def resizeEvent(self, event):
        """窗口大小改变事件"""
        super().resizeEvent(event)
        # 如果有背景图片，重新调整大小
        if self.background_image:
            self.set_background_image(self.background_image) 