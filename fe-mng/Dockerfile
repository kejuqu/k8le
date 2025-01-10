# 使用 Node.js 官方镜像作为基础镜像
FROM node:20-alpine as builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 设置 pnpm 镜像源为淘宝源
RUN pnpm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 使用 pnpm 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 使用 pnpm 构建应用
RUN pnpm run build

# 使用 nginx 作为生产环境运行镜像
FROM nginx:alpine

# 复制构建产物到 nginx html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY temp.nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 8080 端口
EXPOSE 8080

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
