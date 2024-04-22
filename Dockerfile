# 使用Python官方镜像作为基础镜像
FROM python:3.11.9-slim

# 安装必要的包
RUN apt-get update
RUN apt-get install gnupg curl
RUN curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
--dearmor
RUN echo "deb http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt-get install -y mongodb-org

# 设置工作目录
WORKDIR /app

# 复制整个项目到工作目录
COPY . .

# 安装Python依赖
RUN pip install Flask Flask-Cors pymongo apscheduler

# 暴露端口
EXPOSE 5000

# 环境变量，用于确定Flask运行环境
ENV FLASK_APP=back/flask/app.py
ENV FLASK_RUN_HOST=0.0.0.0

# 启动MongoDB和Flask应用
CMD mongod --fork --logpath /var/log/mongod.log && flask run

