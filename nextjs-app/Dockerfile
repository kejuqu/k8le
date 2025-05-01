# 阶段1：构建应用
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./

COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start"]