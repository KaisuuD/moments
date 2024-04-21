from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
from pymongo import MongoClient
import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="https://d56e1a0c2218df2c32dbaddc9d96ed69@o4507123063128064.ingest.us.sentry.io/4507123072434176",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)

# 应用配置
app = Flask(__name__, static_folder='../../front')
CORS(app)  # 允许所有源

# 数据库连接
client = MongoClient('mongodb://localhost:27017/')
db = client['app']
users_collection = db['users']

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
    posted_at = datetime.now()

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
    app.run(debug=True, port=5000)
