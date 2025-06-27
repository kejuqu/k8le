# Docker Compose 使用指南

> ⚠️： 记得开 科学上网工具

## 基本原则

`docker compose up` 只会使用已经构建的镜像，除非：

- 镜像不存在
- 使用了 `--build` 参数
- Dockerfile 或构建上下文发生变化

## 常用命令

| 命令                                   | 说明                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `docker compose up --build`            | 构建并启动服务，即使镜像已经存在                                           |
| `docker compose up`                    | 如果镜像存在，则使用已构建的镜像启动服务；如果镜像不存在，则构建并启动服务 |
| `docker compose build --no-cache`      | 构建镜像，不使用缓存                                                       |
| `docker compose build`                 | 构建镜像，使用缓存                                                         |
| `docker compose down`                  | 停止并移除服务，删除容器、网络和卷                                         |
| `docker compose down --volumes`        | 停止并移除服务，删除容器、网络和卷                                         |
| `docker compose down --remove-orphans` | 停止并移除服务，删除未被其他服务依赖的容器                                 |

## 开发建议

### 代码修改时

- **前端代码修改**：需要重新构建

  ```bash
  docker compose up -d --build frontend
  ```

- **后端代码修改**：需要重新构建

  ```bash
  docker compose up -d --build backend
  ```

### 配置修改时

- **仅修改环境变量或 docker-compose.yml**：

  ```bash
  docker compose restart
  ```

### 完全重置

```bash
# 停止并删除所有容器、网络
docker compose down

# 重新构建并启动
docker compose up -d --build
```


## 常见问题
