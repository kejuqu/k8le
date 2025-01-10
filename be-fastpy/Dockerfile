FROM python:3.9-slim

WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 设置默认端口
ENV PORT=8080

EXPOSE ${PORT}

# 使用环境变量启动应用
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} 