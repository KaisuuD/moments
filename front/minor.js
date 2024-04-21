// 添加事件监听器，等待页面加载完成后执行
window.addEventListener('load', function() {
    // 获取提交按钮元素并添加点击事件监听器
    document.getElementById('submitBtn').addEventListener('click', function () {
        // 获取用户名和消息内容
        var username = document.getElementById('username').value;
        var message = document.getElementById('message').value;

        // 检查消息内容是否为空
        if (message === '') {
            alert('Please write down your Tale.');
            return;
        }

        // 检查用户名是否为空
        if (username === '') {
            alert('Please write down your Name.');
            return;
        }

        // 调用提交函数
        submitPost(username, message);
    });

    // 加载页面时获取所有留言
    fetchAllMessages();
});

// 提交留言函数
function submitPost(username, message) {
    // 构建要发送到后端的数据对象
    var postData = {
        username: username,
        message: message
    };

    // 发送 POST 请求到后端
    fetch('http://127.0.0.1:5000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit post');
        }
        return response.json();
    })
    .then(data => {
        // 提交成功，可以根据需要执行其他操作
        console.log('Post submitted successfully:', data);
        // 清空输入框内容
        document.getElementById('username').value = '';
        document.getElementById('message').value = '';
        // 提交成功后重新加载所有留言
        fetchAllMessages();
    })
    .catch(error => {
        console.error('Error submitting post:', error);
    });
}

// 加载所有留言函数
function fetchAllMessages() {
    fetch('http://127.0.0.1:5000/api/posts', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // 反转数据，确保最新的评论在前面
        data.reverse();
        // 获取静态内容容器
        const staticContent = document.getElementById('staticContent');
        // 获取消息板容器
        const dynamicContent = document.getElementById('messageBoard');
        
        // 检查是否存在静态内容
        if (staticContent && dynamicContent) {
            // 清空动态内容
            dynamicContent.innerHTML = '';
            // 更新页面上的留言
            data.forEach(message => {
                const newMessage = createElementForMessage(message);
                dynamicContent.appendChild(newMessage);  // 添加新消息到动态容器
            });
        }
    })
    .catch(error => console.error('Error loading posts:', error));
}

// 更新页面上的留言函数
function updateMessagesOnUI(messages) {
    const dynamicContent = document.getElementById('messageBoard');
    dynamicContent.innerHTML = '';  // 清空之前的动态内容

    messages.forEach(message => {
        const newMessage = createElementForMessage(message);
        dynamicContent.appendChild(newMessage);  // 添加新消息到动态容器
    });
}

// 创建留言元素函数
function createElementForMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `
        <div class="message-info">
            <div class="info">
                <img src="./src/default.jpg">
                <strong>${message.username}</strong>
            </div>
            <span>Posted at: ${message.posted_at}</span>
        </div>
        <div class="content">${message.message.replace(/\n/g, '<br>')}</div>
    `;
    return messageDiv;
}
