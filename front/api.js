function submitPost(username, message) {
    // 构建发送到后端的数据对象
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
    })
    .catch(error => {
        console.error('Error submitting post:', error);
    });
}
