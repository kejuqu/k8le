#!/bin/bash

# 定义变量
CONTAINER_NAME="frontend-app"
IMAGE_NAME="lekequ/frontend-app:master"
PORT=3000

# 输出时间戳的日志函数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 检查是否存在同名容器并删除
if docker ps -a | grep -q $CONTAINER_NAME; then
    log "发现已存在的容器，正在停止并删除..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# 拉取最新镜像
log "拉取最新镜像..."
docker pull $IMAGE_NAME

# 运行新容器
log "启动新容器..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    $IMAGE_NAME

# 检查容器是否成功运行
if [ $? -eq 0 ]; then
    log "容器启动成功！"
    log "应用可通过 http://localhost:$PORT 访问"
else
    log "错误：容器启动失败"
    exit 1
fi

# 显示容器状态
docker ps | grep $CONTAINER_NAME 