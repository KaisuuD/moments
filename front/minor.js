document.getElementById('submitBtn').addEventListener('click', function () {
    var username = document.getElementById('username').value;
    var message = document.getElementById('message').value;
    if (message === '') {
        alert('Please write down your Tale.');
        return;
    }
    if (username === '') {
        alert('Please write down your Name.');
        return;
    }
    submitPost(username, message);
});

function getCurrentTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    var hours = ('0' + now.getHours()).slice(-2);
    var minutes = ('0' + now.getMinutes()).slice(-2);
    var seconds = ('0' + now.getSeconds()).slice(-2);
    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function updateMessagesOnUI(messages) {
    const dynamicContent = document.getElementById('dynamicContent');
    dynamicContent.innerHTML = '';  // 清空之前的动态内容
    messages.forEach(message => {
        const newMessage = createElementForMessage(message);
        dynamicContent.appendChild(newMessage);  // 添加新消息到动态容器
    });
}

function createElementForMessage(message) {
    const messageDiv = document.createElement('div');
    let postedAt = message.posted_at || getCurrentTime();  // 使用后端时间，如果没有则使用前端生成的当前时间
    messageDiv.innerHTML = `
        <div class="message-info">
            <div class="info">
                <img src="./src/default.jpg">
                <strong>${message.username}</strong>
            </div>
            <span>Posted at: ${postedAt}</span>
        </div>
        <div class="content">${message.message.replace(/\n/g, '<br>')}</div>
    `;
    return messageDiv;
}

window.onload = function() {
    fetchAllMessages();
}

function fetchAllMessages() {
    fetch('http://127.0.0.1:5000/api/posts', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => updateMessagesOnUI(data))
    .catch(error => console.error('Error loading posts:', error));
}

// 限制输入框的字符长度
function limitInput(input) {
    // 获取输入框中的值
    var value = input.value;

    // 计算字符长度（一个中文字符长度为2，其他字符长度为1）
    var chineseLength = countChineseCharacters(value);
    var totalLength = value.length + chineseLength;

    // 判断字符长度是否超过限制
    if (totalLength > 16) {
        // 如果总长度超过16个字符，截取前16个字符
        input.value = value.substring(0, 16 - chineseLength);
    }
}

// 计算文本中的中文字符数量
function countChineseCharacters(str) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            count++;
        }
    }
    return count;
}