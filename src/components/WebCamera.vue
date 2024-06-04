<template>
  <div>
    <div class="text-wsfont" style="z-index: 1">
      <div
        style="width: 30vw; aspect-ratio: 16/10; min-width: 350px"
        class="bg-black"
      >
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
            :disable="!isAnswer"
          >
            <q-tooltip anchor="top middle" v-if="!isAnswer">
              답변 시간에 일시정지를 다시 시도해주세요.
            </q-tooltip>
          </q-btn>
        </q-btn-group>
        <div class="row flex-center q-mt-xl">
          <q-btn
            @click="startFinishInterview"
            size="xl"
            color="deep-purple-14"
            rounded
            class="q-mr-sm q-mb-sm"
            :disable="!isStarted && (!isAccessed.mic || !isAccessed.camera)"
            ><span style="text-color: white">{{
              isStarted ? "모의 면접 종료하기" : "모의 면접 시작하기"
            }}</span>
            <q-tooltip
              anchor="top middle"
              v-if="!isStarted && (!isAccessed.mic || !isAccessed.camera)"
            >
              마이크 및 카메라 권한을 허용해주세요
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCvStore } from "stores/cv.js";
import { useInterviewStore } from "stores/interview.js";
import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";
import tokenApi from "src/utils/interceptor.js";
import { uploadToBucket } from "src/utils/aws.js";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "src/utils/cookies.js";
import RecordRTC from "recordrtc";
import fixWebmDuration from "webm-duration-fix";

const MicDevices = ref(null);
const CamDevices = ref(null);
const selectedMic = ref(null);
const selectedCam = ref(null);
const isAccessed = ref({ camera: false, mic: false });
const MicStream = ref(null);
const CamStream = ref(null);
let mediaStream = null;
let recorder = null;
const router = useRouter();
const route = useRoute();
let finalBlob = null;
const video = ref(null);
let micAudio = null;

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
  followUp,
  isAnswer,
} = storeToRefs(interviewStore);
const { dataObj } = history.state;
const dept = dataObj.dept;
const cvId = dataObj.cvId;
interviewStore.$reset();

const memberStore = useMemberStore();
const { userId } = storeToRefs(memberStore);

const cvStore = useCvStore();
const { questions } = storeToRefs(cvStore);
let audioContext = null;
let questionStreamDestination = null;
let audioBufferSource = null;
let answerRecorder = null;
let prevChat = null;

const emit = defineEmits(["startTimer"]);
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
    const res = await tokenApi.post("/video", data);
  } catch (err) {
    return Promise.reject(err);
  }
};

watch(
  isSaved,
  async () => {
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
  },
  { immediate: true },
);

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

const setRecorder = async () => {
  let videoTracks = CamStream.value.getVideoTracks();
  micAudio = audioContext.createMediaStreamSource(MicStream.value);
  micAudio.connect(questionStreamDestination);
  let mediaTracks = [
    ...videoTracks,
    questionStreamDestination.stream.getAudioTracks()[0],
  ];
  mediaStream = new MediaStream(mediaTracks);
  recorder = RecordRTC(mediaStream, {
    type: "video",
    mimeType: "video/webm",
    audioBitsPerSecond: 128000,
  });
  recorder.onstop;
  answerRecorder = new RecordRTC(MicStream.value, {
    type: "audio",
    mimeType: "audio/webm",
  });
};

const startInterview = () => {
  audioContext = new AudioContext();
  questionStreamDestination = audioContext.createMediaStreamDestination();
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
  if (answerRecorder.state === "paused") answerRecorder.resumeRecording();
  recorder.resumeRecording();
  isStopped.value = false;
};

const pauseInterview = () => {
  mediaStream.getTracks().forEach((track) => (track.enabled = false));
  if (answerRecorder.state === "recording") answerRecorder.pauseRecording();
  recorder.pauseRecording();
  isStopped.value = true;
};

const resumePauseInterview = () => {
  isStopped.value ? resumeInterview() : pauseInterview();
};

const finishInterview = () => {
  recorder.stopRecording(async () => {
    finalBlob = await fixWebmDuration(recorder.getBlob());
    videoUrl.value = URL.createObjectURL(finalBlob);
    if (micAudio) micAudio.disconnect();
    mediaStream.getTracks().forEach(function (track) {
      track.stop();
    });
    MicStream.value.getTracks().forEach(function (track) {
      track.stop();
    });
    CamStream.value.getTracks().forEach(function (track) {
      track.stop();
    });
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    isFinished.value = true;
  });
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
  isAnswer.value = true;
};

const recordAnswer = () => {
  MicStream.value.getAudioTracks()[0].enabled = true;
  isAnswer.value = true;
  answerRecorder.reset();
  answerRecorder.startRecording();
};
function createAudioBufferSource(audioBuffer, isRecorded) {
  let audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = audioBuffer;
  audioBufferSource.connect(questionStreamDestination);
  audioBufferSource.connect(audioContext.destination);
  audioBufferSource.onended = isRecorded ? recordAnswer : notRecordAnswer;
  return audioBufferSource;
}

function playQuestion(base64Data) {
  let audioData = base64ToArrayBuffer(base64Data);
  audioContext.decodeAudioData(audioData).then((audioBuffer) => {
    audioBufferSource = createAudioBufferSource(
      audioBuffer,
      questions.value[count.value].turn - 1 > turn.value,
    );
    MicStream.value.getAudioTracks()[0].enabled = false;
    audioBufferSource.start();
    emit("startTimer");
  });
}

watch(
  [count, isStarted],
  () => {
    if (isStarted.value) {
      if (count.value < questions.value.length) {
        playQuestion(questions.value[count.value].audio);
      } else finishInterview();
    }
  },
  { immediate: true },
);

const blobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
};

const setPrevChat = () => {
  prevChat = [
    {
      role: "system",
      content: questions.value[count.value].question,
    },
  ];
};

const getNextQuestion = () => {
  followUp.value =
    "답변을 듣고 꼬리 질문을 생성 중입니다. 잠시 후 질문이 나타납니다.";
  answerRecorder.stopRecording(() => {
    blobToBase64(answerRecorder.getBlob()).then((base64Data) => {
      if (turn.value == 1) setPrevChat();
      const body = {
        turn: turn.value - 1,
        selfIntroductionId: cvId,
        deptNum: dept,
        questions: prevChat,
        userAudio: base64Data,
      };

      tokenApi
        .post("/question/followUp", body)
        .then((res) => {
          console.log(res);
          let followUpQuestion = res.data.body.followUps[0];
          followUp.value = followUpQuestion[0].Text;
          prevChat = res.data.body.messages;
          prevChat.push({ role: "system", content: followUp.value });
          playQuestion(followUpQuestion[1].Audio);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

watch(
  turn,
  () => {
    if (isStarted.value && turn.value != 0) {
      if (answerRecorder.getState() != "inactive") getNextQuestion();
      else {
        turn.value = 0;
        count.value++;
      }
    }
  },
  {
    immediate: true,
  },
);
onBeforeUnmount(() => {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value);
  if (micAudio) micAudio.disconnect();
  mediaStream.getTracks().forEach(function (track) {
    track.stop();
  });
  MicStream.value.getTracks().forEach(function (track) {
    track.stop();
  });
  CamStream.value.getTracks().forEach(function (track) {
    track.stop();
  });
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
});
defineOptions({
  name: "InterviewPage",
});

defineExpose({ finishInterview });

init();
</script>
