#!/bin/bash

# 设置默认值
# data_volume="$(pwd)/$(date +%s)-data"
data_volume="$(pwd)/sketch-data"
default_postgres_user="sketch"
default_postgres_password="123456"

# 获取命令行参数或使用默认值
postgres_user="${1:-$default_postgres_user}"
postgres_password="${2:-$default_postgres_password}"

# 将工作目录更改为项目文件夹的根目录
cd "$(dirname "$(dirname "$0")")"

# 检查数据卷文件夹是否存在，如果不存在则创建
if [ ! -d "$data_volume" ]; then
  echo "开始创建数据卷文件夹：$data_volume"
  mkdir -p "$data_volume" || { echo "无法创建数据卷文件夹"; exit 1; }
fi
echo "完成创建数据卷文件夹"

# 执行Docker命令
echo "开始创建 docker 容器..."
container_id=$(docker run \
  -v "$data_volume":/var/lib/postgresql/data \
  -p 5432:5432 \
  -e POSTGRES_USER="$postgres_user" \
  -e POSTGRES_PASSWORD="$postgres_password" \
  -d postgres:14)
echo "docker 容器创建完成：$container_id"