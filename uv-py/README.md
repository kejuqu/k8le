# 语音转文字 - PC 端应用

一个基于 Python 的桌面 GUI 应用，支持中英文语音识别和虚拟键盘功能。

## 功能特性

- 🎤 **实时语音识别**：支持麦克风实时录音转文字
- 📁 **音频文件识别**：支持上传音频文件进行识别
- 🌏 **中英文支持**：优先支持中文和英文语音识别
- ⌨️ **虚拟键盘**：内置虚拟键盘，支持更换背景
- 🖥️ **跨平台**：兼容 Windows 和 Linux 系统
- 🎨 **美观界面**：基于 PyQt6 的现代化 GUI 界面

## 技术栈

- **Python 3.11+**
- **PyQt6** - GUI 框架
- **Vosk** - 语音识别引擎
- **uv** - Python 包管理工具

## 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd k8le/uv-py
```

### 2. 安装 uv（如果未安装）

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. 安装依赖

```bash
uv sync
```

### 4. 运行应用

```bash
uv run main.py
```

## 使用说明

### 语音识别

1. **实时录音**：点击"开始录音"按钮开始语音识别
2. **音频文件**：点击"选择音频文件"上传音频文件进行识别
3. **清空文本**：点击"清空文本"清除识别结果

### 虚拟键盘

1. **更换背景**：点击"选择背景"按钮选择键盘背景图片
2. **重置背景**：点击"重置背景"恢复默认背景
3. **键盘输入**：点击虚拟键盘按键输入文字

### 支持的音频格式

- WAV (.wav)
- MP3 (.mp3)
- FLAC (.flac)
- M4A (.m4a)

## 项目结构

```
uv-py/
├── main.py                 # 应用入口
├── speech2text.py         # 语音识别核心模块
├── gui/                   # GUI模块
│   ├── __init__.py
│   ├── main_window.py     # 主窗口
│   └── virtual_keyboard.py # 虚拟键盘组件
├── assets/                # 资源文件
│   ├── backgrounds/       # 键盘背景图片
│   └── icons/            # 图标文件
├── models/               # 语音模型目录
├── pyproject.toml        # 项目配置
└── README.md            # 项目说明
```

## 语音模型

应用使用 Vosk 语音识别引擎，首次运行时会自动下载中文语音模型：

- 模型大小：约 50MB
- 支持语言：中文、英文
- 下载地址：https://alphacephei.com/vosk/models/

## 开发说明

### 添加新的语音模型

1. 下载 Vosk 模型到`models/`目录
2. 修改`speech2text.py`中的模型路径
3. 重启应用

### 自定义键盘背景

1. 将背景图片放入`assets/backgrounds/`目录
2. 在应用中通过"选择背景"功能应用

## 故障排除

### 常见问题

1. **麦克风权限问题**

   - Windows：检查麦克风权限设置
   - Linux：确保音频设备正常工作

2. **模型下载失败**

   - 检查网络连接
   - 手动下载模型到`models/`目录

3. **依赖安装失败**
   - 确保 Python 版本 >= 3.11
   - 使用`uv sync --reinstall`重新安装

### 系统要求

- **操作系统**：Windows 10+, Linux (Ubuntu 18.04+)
- **Python**：3.11+
- **内存**：至少 2GB RAM
- **存储**：至少 100MB 可用空间

## 许可证

本项目采用 MIT 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！
