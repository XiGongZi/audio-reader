export default class CreateAudioHTML {
    constructor(mediaStream: MediaStream) {
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
    }
}