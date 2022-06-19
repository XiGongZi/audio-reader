import CreateAudioHTML from "./CreateAudioHTML";
import Recorder from "./Recorder"
const begin: HTMLElement = document.getElementById("intercomBegin") as HTMLElement;
const end: HTMLElement = document.getElementById("intercomEnd") as HTMLElement;

let record: Recorder; //多媒体对象，用来处理音频
let speaker: CreateAudioHTML
/*
 * 开始对讲
 */
begin.onclick = () => {
    const constraints = { audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            speaker = new CreateAudioHTML(mediaStream);
            record = (new Recorder(mediaStream));
            record.onChange = (data: ArrayBuffer) => {
                console.log("onChange data", data);
            }
            console.log("开始对讲");
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
    record.stop();
    speaker.removeAudio();
    console.log("关闭对讲以及WebSocket");
};