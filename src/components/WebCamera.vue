<template>
  <div>
    <div class="text-wsfont" style="z-index: 1">
      <div style="width: 100%; aspect-ratio: 16/10" class="bg-black">
        <video id="video" ref="video" width="100%">
          Video stream not available.
        </video>
      </div>
      <div>
        <q-btn-group flat unelevated>
          <q-btn-dropdown
            :icon="isAccessed.mic ? 'mic' : 'mic_off'"
            @click="handleMicButton"
            color="indigo-12"
            rounded
            split
            size="12px"
            class="q-mr-sm q-mb-sm"
          >
            <q-btn-dropdown
              icon="mic_none"
              :label="isAccessed.mic ? selectedMic.label : '권한 없음'"
              :disable="!isAccessed.mic"
              color="grey"
            >
              <q-list>
                <q-item
                  clickable
                  v-for="device in MicDevices"
                  :key="device.deviceId"
                >
                  <q-item-section>
                    <q-item-label>{{ device.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-btn-dropdown>

          <q-btn-dropdown
            :icon="isAccessed.camera ? 'videocam' : 'videocam_off'"
            size="12px"
            rounded
            split
            color="indigo-12"
            @click="handleCamButton"
            class="q-mr-sm q-mb-sm"
          >
            <q-btn-dropdown
              icon="videocam"
              :label="isAccessed.camera ? selectedCam.label : '권한 없음'"
              :disable="!isAccessed.camera"
              color="grey"
            >
              <q-list>
                <q-item
                  clickable
                  v-for="device in CamDevices"
                  :key="device.deviceId"
                >
                  <q-item-section>
                    <q-item-label>{{ device.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-btn-dropdown>
          <q-btn
            :icon="isStopped ? 'replay' : 'pause'"
            @click="resumePauseInterview"
            color="red"
            outline
            size="10px"
            round
            v-if="isStarted"
            class="q-mb-sm"
          />
        </q-btn-group>
        <div class="row flex-center q-mt-xl">
          <q-btn
            @click="startFinishInterview"
            size="xl"
            color="deep-purple-14"
            rounded
            class="q-mr-sm q-mb-sm"
            ><span style="text-color: white">{{
              isStarted ? "모의 면접 종료하기" : "모의 면접 시작하기"
            }}</span>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCvStore } from "stores/cv.js";
import { useInterviewStore } from "stores/interview.js";
import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";
import { api } from "boot/axios.js";
import { uploadToBucket } from "src/utils/aws.js";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "src/utils/cookies.js";
import RecordRTC from "recordrtc";

const MicDevices = ref(null);
const CamDevices = ref(null);
const selectedMic = ref(null);
const selectedCam = ref(null);
const isAccessed = ref({ camera: false, mic: false });
const MicStream = ref(null);
const CamStream = ref(null);
let mediaStream = null;
let recorder = null;
let recorded = [];
const router = useRouter();
let finalBlob = null;
const video = ref(null);
const audioSrc = ref(null);
const audio = ref(null);

const interviewStore = useInterviewStore();
const {
  videoUrl,
  isFinished,
  isStarted,
  isStopped,
  isSaved,
  saveFinished,
  title,
  count,
  turn,
} = storeToRefs(interviewStore);

interviewStore.$reset();

const memberStore = useMemberStore();
const { userId } = storeToRefs(memberStore);

const cvStore = useCvStore();
const { questions } = storeToRefs(cvStore);
const audioContext = new AudioContext();
const questionStreamDestination = audioContext.createMediaStreamDestination();
let audioBufferSource = null;
let answerRecorder = null;
let answerRecorded = [];

const emit = defineEmits(["CamStreamChanged"]);
watch(CamStream, () => {
  if (CamStream.value) {
    if (!video.value.paused) video.value.pause();
    video.value.srcObject = CamStream.value;
    video.value.play();
  }
});

const generateRandomString = () => {
  return uuidv4();
};

const uploadVideoUrl = async (fileUrl) => {
  try {
    const savedTitle =
      title.value == "" || title.value == null
        ? new Date().toString()
        : title.value;
    const data = {
      title: savedTitle,
      link: fileUrl,
      userId: userId.value,
    };
    const accessToken = "Bearer " + getToken();
    const res = await api.post("/video", data, {
      headers: {
        authorization: accessToken,
      },
    });
    console.log(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

watch(isSaved, async () => {
  if (isSaved.value) {
    try {
      const filename =
        "video_" + userId.value + "/" + generateRandomString() + ".webm";
      const file = new File([finalBlob], filename, { type: "video/webm" });
      const keyString = await uploadToBucket(file, filename);
      await uploadVideoUrl(keyString);
      saveFinished.value = true;
    } catch (err) {
      console.log(err);
      alert("동영상 저장에 실패했습니다.");
      saveFinished.value = true;
    }
  }
});

const handleMicButton = () => {
  if (!isAccessed.value.mic) {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
        },
      })
      .then((stream) => {
        setMic(stream);
        if (!MicDevices.value) getAudioDevices();
      })
      .catch((err) => {
        console.log(err);
        alert("마이크 권한을 허용해주세요.");
      });
  }
};

const handleCamButton = () => {
  if (!isAccessed.value.camera) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setCam(stream);
        if (!CamDevices.value) getVideoDevices();
      })
      .catch((err) => {
        alert("카메라 권한을 허용해주세요");
      });
  }
};

const setMic = (stream) => {
  MicStream.value = stream;
  selectedMic.value = stream.getAudioTracks()[0];
  isAccessed.value.mic = true;
};

const setCam = (stream) => {
  CamStream.value = stream;
  selectedCam.value = stream.getVideoTracks()[0];
  isAccessed.value.camera = true;
};

const getAudioDevices = async () => {
  let devices = await navigator.mediaDevices.enumerateDevices();
  MicDevices.value = devices.filter((device) => device.kind == "audioinput");
};

const getVideoDevices = async () => {
  let devices = await navigator.mediaDevices.enumerateDevices();
  CamDevices.value = devices.filter((device) => device.kind == "videoinput");
};

const setMedias = (mediaStream) => {
  setMic(new MediaStream(mediaStream.getAudioTracks()));
  setCam(new MediaStream(mediaStream.getVideoTracks()));
  getAudioDevices();
  getVideoDevices();
};

const unsetMic = () => {
  isAccessed.value.mic = false;
  selectedMic.value = null;
  if (MicStream.value) {
    MicStream.value.getAudioTracks().forEach((track) => {
      track.stop();
    });
    MicStream.value = null;
  }
};

const unsetCam = () => {
  isAccessed.value.camera = false;
  selectedCam.value = null;
  if (CamStream.value) {
    CamStream.value.getVideoTracks().forEach((track) => {
      track.stop();
    });
    CamStream.value = null;
  }
};

const handleMicPermission = (permission) => {
  if (permission.state == "granted") {
    console.log("granted");
    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: { exact: true } } })
      .then((stream) => {
        setMic(stream);
      })
      .catch((err) => console.log(err.messgae));
    getAudioDevices();
  } else {
    unsetMic();
    MicDevices.value = null;
  }
};

const handleCamPermission = (permission) => {
  if (permission.state == "granted") {
    navigator.mediaDevices
      .getUserMedia({ video: { aspectRatio: 16 / 10 } })
      .then((stream) => {
        setCam(stream);
      })
      .catch((err) => console.log(err.messgae));
    getVideoDevices();
  } else {
    unsetCam();
    CamDevices.value = null;
  }
};

async function init() {
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        echoCancellation: true,
      },
      video: { aspectRatio: 16 / 10 },
    })
    .then(setMedias)
    .catch((err) => {
      console.log(err);
    });
  navigator.permissions
    .query({ name: "microphone" })
    .then((permission) => {
      permission.onchange = () => {
        handleMicPermission(permission);
      };
    })
    .catch((err) => {
      console.log("해당 브라우저가 permission api의 일부 기능을 지원하지 않음");
    });

  navigator.permissions
    .query({ name: "camera" })
    .then((permission) => {
      permission.onchange = () => {
        handleCamPermission(permission);
      };
    })
    .catch((err) => {
      console.log("해당 브라우저가 permission api의 일부 기능을 지원하지 않음");
    });
}

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recorded.push(event.data);
  }
};

const setRecorder = async () => {
  let videoTracks = CamStream.value.getVideoTracks();
  let micAudio = audioContext.createMediaStreamSource(MicStream.value);
  micAudio.connect(questionStreamDestination);
  let mediaTracks = [
    ...videoTracks,
    questionStreamDestination.stream.getAudioTracks()[0],
  ];
  mediaStream = new MediaStream(mediaTracks);
  recorder = RecordRTC(mediaStream, {
    mimeType: "video/webm",
  });
  answerRecorder = new RecordRTC(MicStream.value, {
    mimeType: "audio/webm",
  });
};

const startInterview = () => {
  setRecorder()
    .then(() => {
      recorder.startRecording();
      isStopped.value = false;
      isStarted.value = true;
    })
    .catch((err) => {
      console.log(err);
    });
};

const resumeInterview = () => {
  mediaStream.getTracks().forEach((track) => (track.enabled = true));
  recorder.resumeRecording();
  isStopped.value = false;
};

const pauseInterview = () => {
  mediaStream.getTracks().forEach((track) => (track.enabled = false));
  recorder.pauseRecording();
  isStopped.value = true;
};

const resumePauseInterview = () => {
  isStopped.value ? resumeInterview() : pauseInterview();
};

const finishInterview = () => {
  recorder.stopRecording(() => {
    finalBlob = recorder.getBlob();
    videoUrl.value = recorder.toURL();
  });
  isFinished.value = true;
  mediaStream.getTracks().forEach(function (track) {
    track.stop();
  });
  audioContext.close();
};

const startFinishInterview = () => {
  isStarted.value ? finishInterview() : startInterview();
};

function base64ToArrayBuffer(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const notRecordAnswer = () => {
  MicStream.value.getAudioTracks()[0].enabled = true;
};

const handleAnswerDataAvailable = (event) => {
  if (event.data.size > 0) {
    answerRecorded.push(event.data);
  }
};

const recordAnswer = () => {
  MicStream.value.getAudioTracks()[0].enabled = true;

  answerRecorder.startRecording();
};
function createAudioBufferSource(audioBuffer, isRecorded) {
  audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  audioBufferSource.connect(questionStreamDestination);
  audioBufferSource.connect(audioContext.destination);
  console.log(questionStreamDestination.stream.getAudioTracks());
  audioBufferSource.onended = isRecorded ? recordAnswer : notRecordAnswer;
  return audioBufferSource;
}

function playQuestion(base64Data) {
  let audioData = base64ToArrayBuffer(base64Data);
  audioContext.decodeAudioData(audioData).then((audioBuffer) => {
    let audioBufferSource = createAudioBufferSource(
      audioBuffer,
      questions.value[count.value].turn > turn.value,
    );
    MicStream.value.getAudioTracks()[0].enabled = false;
    audioBufferSource.start();
  });
}

watch((count, isStarted), () => {
  if (isStarted.value) {
    playQuestion(questions.value[count.value].audio);
  }
});

const blobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
};

watch(
  turn,
  () => {
    if (isStarted.value && turn.value != 0) {
      answerRecorder.stopRecording(() => {
        blobToBase64(answerRecorder.getBlob()).then((base64Data) => {
          //api post해서 다음 문제 가져오기
          //playQuestion()
          answerRecorder.reset();
        });
      });
    }
  },
  {
    immediate: true,
  },
);

defineOptions({
  name: "InterviewPage",
});

defineExpose({ finishInterview });

init();
</script>
