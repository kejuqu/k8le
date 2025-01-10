#!/bin/bash

# 检查版本参数，如果未提供则使用 master
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

# 构建镜像
docker build -t fastapi-app:${VERSION} .

DOCKER_USERNAME="lekequ"

# 标记镜像
docker tag fastapi-app:${VERSION} ${DOCKER_USERNAME}/fastapi-app:${VERSION}

# 推送镜像
docker push ${DOCKER_USERNAME}/fastapi-app:${VERSION} 