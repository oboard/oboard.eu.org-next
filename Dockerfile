# 构建阶段
FROM oven/bun:1 AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN bun run build

# 生产阶段
FROM oven/bun:1-slim AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 从构建阶段复制必要文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["bun", "server.js"] 