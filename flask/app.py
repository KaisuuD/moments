from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
from pymongo import MongoClient
# import sentry_sdk
from apscheduler.schedulers.background import BackgroundScheduler
import pytz

# 初始化 Sentry
# sentry_sdk.init(
#     dsn="your_dsn_here",
#     traces_sample_rate=1.0,
#     profiles_sample_rate=1.0,
# )

# 创建 Flask 应用
app = Flask(__name__, static_folder='./front')
CORS(app)  # 允许所有源

# 连接 MongoDB
# client = MongoClient('mongodb://localhost:27017/')
client = MongoClient('mongodb://mongo:27017/')
db = client['app']
users_collection = db['users']

# 定义定时执行的任务
def clear_posts():
    result = users_collection.delete_many({})
    print(f"{result.deleted_count} post(s) have been deleted.")

# 创建后台调度器，并设置时区为东京时区
scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Tokyo'))

# 启动调度器，并设定在东京时间早上2点执行清空任务
scheduler.add_job(clear_posts, 'cron', hour=2)

# 启动调度器
scheduler.start()

# 静态文件路由
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'concept.html')

@app.route('/<path:path>')
def static_file(path):
    return send_from_directory(app.static_folder, path)

# API路由
@app.route('/api/posts', methods=['POST'])
def submit_post():
    data = request.get_json()
    username = data['username']
    message = data['message']
    if not username or not message:  # 检查用户名和消息是否都存在
        return jsonify({'message': 'Username or message is missing.'}), 400
    posted_at = datetime.now().strftime('%Y/%m/%d %H:%M:%S')  # 修改时间格式为"YYYY/MM/DD HH:MM:SS"

    post = {
        'username': username,
        'message': message,
        'posted_at': posted_at
    }

    result = users_collection.insert_one(post)
    if result.inserted_id:
        return jsonify({'message': 'Post submitted successfully'}), 201
    else:
        return jsonify({'message': 'Failed to submit post'}), 500

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = list(users_collection.find({}, {'_id': 0}))
    return jsonify(posts)

# 启动应用
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
