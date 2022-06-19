class AudioData {
    size = 0; //录音文件长度
    buffer: Float32Array[] = []; //录音缓存
    inputSampleRate: number = 48000; //输入采样率
    inputSampleBits: number = 16; //输入采样数位 8, 16
    outputSampleRate: number; //输出采样数位
    oututSampleBits: number; //输出采样率
    constructor({ outputSampleRate, oututSampleBits }: { outputSampleRate: number, oututSampleBits: number }) {
        console.log("Class AudioData constructor");
        this.outputSampleRate = outputSampleRate;
        this.oututSampleBits = oututSampleBits;
    }
    clear() {
        console.log("Class AudioData clear");

        this.buffer = [];
        this.size = 0;
    }
    input(data: Float32Array) {
        console.log("Class AudioData input");
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
    }
    compress() {
        console.log("Class AudioData compress");
        //合并压缩
        //合并
        const data = new Float32Array(this.size);
        let offset = 0;
        for (var i = 0; i < this.buffer.length; i++) {
            data.set(this.buffer[i], offset);
            offset += this.buffer[i].length;
        }
        //压缩
        const compression = parseInt((this.inputSampleRate / this.outputSampleRate).toString());
        const length = data.length / compression;
        const result = new Float32Array(length);
        let index = 0,
            j = 0;
        while (index < length) {
            result[index] = data[j];
            j += compression;
            index++;
        }
        return result;
    }
    encodePCM() {
        console.log("Class AudioData encodePCM");
        //这里不对采集到的数据进行其他格式处理，如有需要均交给服务器端处理。
        const sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
        const sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
        const bytes = this.compress();
        const dataLength = bytes.length * (sampleBits / 8);
        const buffer = new ArrayBuffer(dataLength);
        const data = new DataView(buffer);
        let offset = 0;
        for (var i = 0; i < bytes.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return new Blob([data]);
    }
};
//录音对象
export default class Recorder {
    stream: MediaStream;
    sampleBits = 16; //输出采样数位 8, 16
    sampleRate = 8000; //输出采样率
    context: AudioContext;
    audioInput;
    recorder;
    audioData: AudioData;
    constructor(stream: MediaStream) {
        console.log("Class Recorder constructor");
        this.stream = stream;
        this.context = new AudioContext();
        this.audioInput = this.context.createMediaStreamSource(stream);
        this.recorder = this.context.createScriptProcessor(4096, 1, 1);
        this.audioData = new AudioData({ outputSampleRate: this.sampleRate, oututSampleBits: this.sampleBits });
    }
    onChange(e: ArrayBuffer): void {
        console.log("Class Recorder onChange");
        // return e;
    }
    sendData() {
        console.log("Class Recorder sendData");

        //对以获取的数据进行处理(分包)
        var reader = new FileReader();
        reader.onload = (e) => {
            if (!e?.target?.result) return;
            var outbuffer = e.target.result as ArrayBuffer;
            var arr = new Int8Array(outbuffer);
            if (arr.length > 0) {
                var tmparr = new Int8Array(1024);
                var j = 0;
                for (var i = 0; i < arr.byteLength; i++) {
                    tmparr[j++] = arr[i];
                    if ((i + 1) % 1024 == 0) {
                        this.onChange(tmparr);
                        if (arr.byteLength - i - 1 >= 1024) {
                            tmparr = new Int8Array(1024);
                        } else {
                            tmparr = new Int8Array(arr.byteLength - i - 1);
                        }
                        j = 0;
                    }
                    if (i + 1 == arr.byteLength && (i + 1) % 1024 != 0) {
                        this.onChange(tmparr);
                    }
                }
            }
        };
        reader.readAsArrayBuffer(this.audioData.encodePCM());
        this.audioData.clear(); //每次发送完成则清理掉旧数据
    };

    start() {
        console.log("Class Recorder start");
        this.audioInput.connect(this.recorder);
        this.recorder.connect(this.context.destination);
    };

    stop() {
        console.log("Class Recorder stop");
        this.recorder.disconnect();
    };

    getBlob() {
        console.log("Class Recorder getBlob");
        return this.audioData.encodePCM();
    };

    clear() {
        console.log("Class Recorder clear");
        this.audioData.clear();
    };

    onaudioprocess(e: { inputBuffer: AudioBuffer }) {
        console.log("Class Recorder onaudioprocess");
        var inputBuffer: Float32Array = e.inputBuffer.getChannelData(0);
        this.audioData.input(inputBuffer);
        this.sendData();
        // this.onChange(inputBuffer);
    };
};
