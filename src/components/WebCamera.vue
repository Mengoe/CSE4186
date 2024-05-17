<template>
  <div>
    <div>
      <video id="video" ref="video" width="400px">
        Video stream not available.
      </video>
    </div>
    <div>
      <q-btn-group>
        <q-btn-dropdown
          :icon="isAccessed.mic ? 'mic' : 'mic_off'"
          @click="handleMicButton"
          color="grey"
          rounded
          split
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
          split
          color="grey"
          rounded
          @click="handleCamButton"
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
          :label="isStarted ? '면접 종료하기' : '면접 시작하기'"
          :icon="isStarted ? 'done_outline' : 'play_arrow'"
          @click="startFinishInterview"
        />
        <q-btn
          :label="isStopped ? '면접 계속하기' : '면접 중지하기'"
          :icon="isStopped ? 'replay' : 'pause'"
          @click="resumePauseInterview"
        />
      </q-btn-group>
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
} = storeToRefs(interviewStore);

interviewStore.$reset();

const memberStore = useMemberStore();
const { userId } = storeToRefs(memberStore);

const cvStore = useCvStore();
const { questions } = storeToRefs(cvStore);
const audioContext = new AudioContext();
const questionStreamDestination = audioContext.createMediaStreamDestination();
const audioBufferSource = null;

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
      .getUserMedia({ video: true })
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
      video: true,
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
  let audioTracks = MicStream.value.getAudioTracks();
  let mediaTracks = [...videoTracks, ...audioTracks];
  mediaStream = new MediaStream(mediaTracks);
  recorder = new MediaRecorder(mediaStream, {
    mimeType: "video/webm",
  });
  recorder.ondataavailable = handleDataAvailable;
  recorder.onstop = () => {
    finalBlob = new Blob(recorded, {
      type: "video/webm",
    });
    videoUrl.value = URL.createObjectURL(finalBlob);
    isFinished.value = true;
  };
};
const startInterview = () => {
  setRecorder()
    .then(() => {
      recorder.start();
      isStopped.value = false;
      isStarted.value = true;
    })
    .catch((err) => {
      console.log(err);
    });
};

const resumeInterview = () => {
  mediaStream.getTracks.forEach((track) => (track.enabled = false));
  recorder.resume();
  isStopped.value = false;
};

const pauseInterview = () => {
  mediaStream.getTracks.forEach((track) => (track.enabled = false));
  recorder.pause();
  isStopped.value = true;
};

const resumePauseInterview = () => {
  isStopped.value ? resumeInterview() : pauseInterview();
};

const finishInterview = () => {
  recorder.stop();
  mediaStream.getTracks().forEach(function (track) {
    track.stop();
  });
  audioContext.close();
  isStarted.value = false;
  isStopped.value = false;
};

const startFinishInterview = () => {
  isStarted.value ? finishInterview() : startInterview();
};

function base64ToUint8Array(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

watch((count, isStarted), () => {
  if (isStarted.value) {
    const audioData = base64ToUint8Array(questions.value[count.value].audio);
    audioContext.decodeAudioData(audioData).then((audioBuffer) => {
      audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = audioBuffer;
      audioBufferSource.connect(mediaStreamDestination);
      audioBufferSource.connect(audioContext.destination);
      const questionAudioTrack =
        mediaStreamDestination.stream.getAudioTracks()[0];
      mediaStream.removeTrack(mediaStream.getAudioTracks()[0]);
      mediaStream.addTrack(questionAudioTrack);
      audioBufferSource.onended = () => {
        mediaStream.removeTrack(mediaStream.getAudioTracks()[0]);
        mediaStream.addTrack(MicStream.value.getAudioTracks()[0]);
        audioBufferSource = null;
      };
      audioBufferSource.start();
    });
  }
});

defineOptions({
  name: "InterviewPage",
});

defineExpose({ finishInterview });

init();
</script>
