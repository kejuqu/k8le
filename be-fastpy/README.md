# 项目名称

## 环境配置

### 创建虚拟环境

```bash
# Windows
python -m venv venv

# Linux/Mac
python3 -m venv venv
```

### 激活虚拟环境

```bash
# Windows (CMD)
venv\Scripts\activate.bat

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

### 安装依赖

激活虚拟环境后，运行以下命令安装项目依赖：

```bash
pip install -r requirements.txt
```

### 创建依赖文件

如果你添加了新的依赖，请运行以下命令更新 requirements.txt：

```bash
pip freeze > requirements.txt
```

### 退出虚拟环境

完成工作后，可以使用以下命令退出虚拟环境：

```bash
deactivate
```

## 运行项目

```bash
uvicorn main:app --reload
```

## 打包项目

```bash
# 登录 Docker Hub
docker login

# 打包项目
./build_and_push.sh v1.0.0
```

## 运行容器

首先确保当前目录下有 `.env` 文件并设置了正确的端口：

```bash
# .env 文件示例
PORT=8080
```

然后执行运行脚本：
```bash
chmod +x run.sh  # 首次运行前设置执行权限
./run.sh
```

或者直接使用 docker run 命令：
```bash
# 从当前目录的 .env 文件读取配置运行容器
docker run -d \
    -p $(grep PORT .env | cut -d '=' -f2):$(grep PORT .env | cut -d '=' -f2) \
    -v $(pwd)/.env:/app/.env \
    --env-file .env \
    fastapi-app:latest
```
