#!/bin/bash

# 检查版本参数，如果未提供则使用 latest
if [ -z "$1" ]; then
    VERSION="master"
    echo "未提供版本号，使用默认版本: ${VERSION}"
else
    VERSION=$1
fi

# 从.env文件加载PORT
if [ -f .env ]; then
    export $(cat .env | grep PORT)
fi

DOCKER_USERNAME="lekequ"
IMAGE_NAME="frontend-app"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "开始构建镜像: ${FULL_IMAGE_NAME}"

# 构建镜像
docker build --no-cache -t ${FULL_IMAGE_NAME} . || {
    echo "构建镜像失败"
    exit 1
}

echo "镜像构建成功，准备推送..."

# 登录 Docker Hub（如果未登录）
docker login || {
    echo "Docker登录失败"
    exit 1
}

# 推送镜像
docker push ${FULL_IMAGE_NAME} || {
    echo "推送镜像失败"
    exit 1
}

echo "镜像推送成功：${FULL_IMAGE_NAME}" 