import CreateAudioHTML from "./CreateAudioHTML";
import Recorder from "./Recorder"
const begin: HTMLElement = document.getElementById("intercomBegin") as HTMLElement;
const end: HTMLElement = document.getElementById("intercomEnd") as HTMLElement;
declare global {  //设置全局属性
    interface Window {  //window对象属性
        audioCAH: {
            record: Recorder;   //加入对象
            speaker: CreateAudioHTML;
        }
    }
}

// let record: Recorder; //多媒体对象，用来处理音频
// let speaker: CreateAudioHTML
// window.record = record;

/*
 * 开始对讲
 */
begin.onclick = () => {
    const constraints = { audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            window.audioCAH = {
                speaker: new CreateAudioHTML(mediaStream),
                record: (new Recorder(mediaStream))
            }
            const mediaStreamTrack: MediaStreamTrack[] = mediaStream.getAudioTracks()
            const mediaStreamTrackItem = mediaStreamTrack[0];
            // mediaStreamTrackItem.oncapturehandlechange((event) => {
            //     console.log("event", event);

            // })
            console.log("mediaStreamTrackItem.getSettings()", mediaStreamTrackItem.getSettings());
            // console.log("mediaStreamTrackItem", mediaStreamTrackItem);

            console.log("mediaStreamTrack .getConstraints()", mediaStreamTrack, mediaStreamTrackItem, mediaStreamTrackItem.getConstraints());

            mediaStream.onaddtrack = event => {
                console.log(`New ${event} track added`);
            }
            // record.onChange = (data: ArrayBuffer) => {
            //     console.log("onChange data", data);
            // }
            // record.onChange = (data: ArrayBuffer) => {
            //     console.log("onChange data", data);
            // }
            console.log("开始对讲");
            window.audioCAH.record.start();
            // useWebSocket();
        })
        .catch(function (error) {
            console.log(error);
            switch (error.message || error.name) {
                case "PERMISSION_DENIED":
                case "PermissionDeniedError":
                    console.info("用户拒绝提供信息。");
                    break;
                case "NOT_SUPPORTED_ERROR":
                case "NotSupportedError":
                    console.info("浏览器不支持硬件设备。");
                    break;
                case "MANDATORY_UNSATISFIED_ERROR":
                case "MandatoryUnsatisfiedError":
                    console.info("无法发现指定的硬件设备。");
                    break;
                default:
                    console.info(
                        "无法打开麦克风。异常信息:" + (error.code || error.name)
                    );
                    break;
            }
        }); // 总是在最后检查错误
};

/*
 * 关闭对讲
 */
end.onclick = () => {
    window.audioCAH.record.stop();
    window.audioCAH.speaker.removeAudio();
    console.log("关闭对讲以及WebSocket");
};