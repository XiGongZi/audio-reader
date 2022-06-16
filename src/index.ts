navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        /* 使用这个 stream stream */
        console.log("stream", stream);

    })
    .catch(function (err) {
        /* 处理 error */
    });
