#!/bin/bash

# 检查.env文件是否存在
if [ ! -f .env ]; then
    echo "错误：当前目录下没有找到 .env 文件"
    exit 1
fi

# 从.env文件读取PORT
PORT=$(grep PORT .env | cut -d '=' -f2)

if [ -z "$PORT" ]; then
    echo "错误：.env 文件中没有设置 PORT"
    exit 1
fi

# 获取tag参数，如果没有提供则默认使用master
TAG=${1:-master}

echo "使用端口: $PORT"
echo "使用镜像标签: $TAG"

# 检查并删除使用相同端口的容器
PORT_CONTAINER=$(docker ps -a | grep ":${PORT}->" | awk '{print $1}')
if [ ! -z "$PORT_CONTAINER" ]; then
    echo "发现端口 ${PORT} 被其他容器占用，正在删除..."
    docker rm -f $PORT_CONTAINER
fi

# 检查并删除指定标签的容器
CONTAINER_ID=$(docker ps -a | grep "fastapi-app:${TAG}" | awk '{print $1}')
if [ ! -z "$CONTAINER_ID" ]; then
    echo "发现已存在的容器，正在删除..."
    docker rm -f $CONTAINER_ID
fi

# 运行容器
docker run -d \
    -p ${PORT}:${PORT} \
    -v $(pwd)/.env:/app/.env \
    --env-file .env \
    fastapi-app:${TAG} 