// 给提交按钮添加点击事件监听器
document.getElementById('submitBtn').addEventListener('click', function () {
    // 获取用户名和留言内容
    var username = document.getElementById('username').value;
    var message = document.getElementById('message').value;
    // 如果留言内容为空，弹出提示并返回
    if (message === '') {
        alert('Please post your moments.');
        return;
    }
    // 如果用户名为空，将用户名设置为匿名
    if (username === '') {
        username = 'Nyaoha';
    }
    // 获取留言板元素和当前时间
    var messageBoard = document.getElementById('messageBoard');
    var newMessage = document.createElement('div');
    newMessage.classList.add('message');
    // 设置留言元素的innerHTML，包含用户名、时间和留言内容
    newMessage.innerHTML = '<div class="message-info"><div class="info"><img src="./src/default.jpg"><strong>'
        + username + '</strong></div><span>Posted at: ' + getCurrentTime() +
        '</span></div><div class="content">' + message + '</div>';
    // 在留言板的第一个子元素之前插入新的留言
    messageBoard.insertBefore(newMessage, messageBoard.firstChild);
    // 清空用户名和留言内容的输入框
    document.getElementById('username').value = '';
    document.getElementById('message').value = '';
});
// 获取当前时间的函数
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
function limitInput(input) {
    // 获取输入框中的值
    var value = input.value;

    // 计算字符长度（一个中文字符长度为2，其他字符长度为1）
    var chineseLength = countChineseCharacters(value);
    var totalLength = value.length + chineseLength;

    // 判断字符长度是否超过限制
    if (totalLength > 8) {
        // 如果总长度超过12个字符，截取前12个字符
        input.value = value.substring(0, 8 - chineseLength);
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

