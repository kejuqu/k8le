#!/usr/bin/env python3
"""
语音转文字GUI应用
支持中英文语音识别和虚拟键盘
"""

import sys
import os
import requests
import pytesseract
from PIL import Image
from io import BytesIO
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import Qt

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from gui.main_window import MainWindow


def extract_text_from_image_url(url: str) -> dict:
    """
    从图片URL中提取文字
    
    Args:
        url (str): 图片的URL地址
        
    Returns:
        dict: 包含url和提取的文字的字典 {url: xxx, text: xxx}
    """
    try:
        # 下载图片
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # 从字节流创建PIL图像对象
        image = Image.open(BytesIO(response.content))
        
        # 使用pytesseract进行OCR文字识别
        # 支持中英文识别
        text = pytesseract.image_to_string(image, lang='chi_sim+eng')
        
        # 清理提取的文本（去除多余的空白字符）
        text = text.strip()
        
        return {
            "url": url,
            "text": text
        }
        
    except requests.exceptions.RequestException as e:
        return {
            "url": url,
            "text": f"网络请求错误: {str(e)}"
        }
    except Exception as e:
        return {
            "url": url,
            "text": f"OCR处理错误: {str(e)}"
        }


def batch_extract_text_from_image_urls(urls: list) -> list:
    """
    批量从图片URL中提取文字
    
    Args:
        urls (list): 图片URL列表
        
    Returns:
        list: 包含url和提取的文字的字典列表 [{url: xxx, text: xxx}, ...]
    """
    results = []
    for url in urls:
        result = extract_text_from_image_url(url)
        results.append(result)
    return results


def main():
    """主函数"""
    # 创建应用
    app = QApplication(sys.argv)
    app.setApplicationName("语音转文字")
    app.setApplicationVersion("1.0.0")
    
    # 设置应用样式
    app.setStyle('Fusion')
    
    # 创建主窗口
    window = MainWindow()
    window.show()
    
    # 运行应用
    sys.exit(app.exec())


if __name__ == "__main__":
    # main()
    urls = [
        "https://img.alicdn.com/bao/uploaded/i1/1951442050/O1CN01GJAqGh1R0wz96sXpe_!!1951442050.jpg",
        "https://img.alicdn.com/bao/uploaded/i1/1951442050/O1CN01QyVl5C1R0wzGN3F1m_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i1/1951442050/O1CN01BfIbya1R0x0tgYvgI_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN01hCSB881R0wzGN5SGb_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01gTZ2EQ1R0wzDMs706_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN01S3sP7V1R0wzF6IPDp_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01fK4QOy1R0wzFoeRiN_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01tVGduX1R0wzGudUFV_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i1/1951442050/O1CN01T8k5Uw1R0wzGud5IU_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN01YvSwpf1R0wzDMtWHq_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01OMgGNe1R0wz96t9HO_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN01gO6iAN1R0wz96qGTq_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i4/1951442050/O1CN01BHQo7v1R0wzF6Ifs6_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i4/1951442050/O1CN01eYgOx71R0wz96s8uj_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i4/1951442050/O1CN0177vCvx1R0wz96soVO_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01OPx97j1R0wzFeBiRV_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i1/1951442050/O1CN01rDXSjR1R0wzGQadoQ_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i3/1951442050/O1CN01iQ2RAR1R0wzF6H8GG_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN01erJ5211R0wzFpJlpv_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i4/1951442050/O1CN01UhZOia1R0wzGN4v15_!!1951442050.jpg",
        "https://img.alicdn.com/imgextra/i2/1951442050/O1CN016qf46G1R0wzUkmYSS_!!1951442050.jpg",
    ]
    print(batch_extract_text_from_image_urls(urls))

