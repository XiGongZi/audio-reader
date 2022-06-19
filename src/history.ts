// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then((stream) => {
//         /* 使用这个 stream stream */
//         console.log("stream", stream);
//         stream.onaddtrack = event => {
//             console.log(`New ${event.track.kind} track added`);
//         };
//     })
//     .catch(function (err) {
//         /* 处理 error */
//     });
// // let stream = new MediaStream();

// // console.log(`New track added stream`, stream);
// // stream.onaddtrack = (event) => {
// //     console.log(`New ${event.track.kind} track added`);
// // };
// // stream.addTrack(new MediaStreamTrack());
var constraints = { audio: true };
navigator.mediaDevices.getUserMedia(constraints)
    .then((mediaStream) => {
        console.log(mediaStream);
        const domaudio = document.createElement("audio");
        mediaStream.onaddtrack = event => {
            console.log(`New track added`);
        };
        var audio: HTMLAudioElement = domaudio;
        audio.srcObject = mediaStream;
        audio.onloadedmetadata = function (e) {
            console.log(`onloadedmetadata`);
            console.log(e);
            audio.play();
        };
        document.body.appendChild(audio);
    })
    .catch(function (err) { console.log(err.name + ": " + err.message); }); // 总是在最后检查错误
