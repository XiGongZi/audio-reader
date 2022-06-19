class CreateMediaHTML {
    name: string;
    constructor() {
        this.name = new Date().getTime().toString();
    }
}
export default class CreateAudioHTML extends CreateMediaHTML {
    mediaStream: MediaStream;
    constructor(mediaStream: MediaStream) {
        super();
        this.mediaStream = mediaStream;
        console.log(mediaStream);
        this.createAudio();
        return this;
    }
    createAudio() {
        const domAudio = document.createElement("audio");
        domAudio.id = this.name;
        this.mediaStream.onaddtrack = event => {
            console.log(`New track added`);
        };
        var audio: HTMLAudioElement = domAudio;
        audio.srcObject = this.mediaStream;
        audio.onloadedmetadata = function (e) {
            console.log(`onloadedmetadata`);
            console.log(e);
            audio.play();
        };
        document.body.appendChild(audio);
    }
    removeAudio() {
        const audio = document.getElementById(this.name);
        if (audio) {
            audio.remove();
        }
    }
}