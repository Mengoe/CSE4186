<template>
  <div class="container">
    <div class="post-container row justify-center q-gutter-md">
      <q-card
        bordered
        v-for="post in postLists"
        :key="post.id"
        class="post cursor-pointer"
        @click="toDetail(post.id)"
      >
        <q-card-section horizontal style="height: 70%">
          <q-card-section class="q-pt-xs col-6">
            <div class="text-overline text-primary">
              {{ jobFieldMap.get(post.jobField) }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs text-weight-bold title-field">
              {{ post.title }}
            </div>
            <div class="text-caption text-grey-7 content-field">
              {{ post.content.replace(/<[^>]*>/g, "")
              }}<!-- replace html -> normal text -->
            </div>
          </q-card-section>

          <q-card-section
            class="col-6 flex flex-center"
            v-if="post.videoList && post.videoList.length !== 0"
          >
            <q-video
              style="filter: blur(3px)"
              class="rounded-borders"
              :src="getSrc(post.videoList[0].video.link)"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center justify-between">
          <q-avatar size="md" text-color="white" class="avt">{{
            jobFieldMap.get(post.jobField)
          }}</q-avatar>
          <div class="text-weight-bold">
            {{ "Mengou" }}
            <!--tmp-->
          </div>
          <div class="column">
            <div>
              <q-icon :name="outlinedVisibility" /><span class="q-pl-xs">{{
                post.viewCount
              }}</span>
            </div>
            <div>
              <q-icon :name="outlinedChat" /><span class="q-pl-xs">{{
                post.comments.length
              }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useBoardStore } from "src/stores/board";
import {
  outlinedVisibility,
  outlinedChat,
} from "@quasar/extras/material-icons-outlined";
const props = defineProps({
  postLists: Array,
});

const router = useRouter();

const jobFieldMap = new Map();
function getSrc(src) {
  console.log(src);
  return "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + src;
}

function toDetail(id) {
  useBoardStore().initPost();
  router.push(`/board/${id}`);
}

function initMap() {
  jobFieldMap.set("백엔드/서버", "BE");
  jobFieldMap.set("프론트엔드", "FE");
  jobFieldMap.set("앱개발", "AP");
  jobFieldMap.set("게임개발", "GM");
  jobFieldMap.set("데이터 사이언티스트", "DS");
  jobFieldMap.set("빅데이터 개발", "BD");
  jobFieldMap.set("데브옵스 개발", "DV");
  jobFieldMap.set("임베디드 소프트웨어 개발", "EM");
  jobFieldMap.set("정보보안", "SE");
  jobFieldMap.set("인공지능 개발", "AI");
  jobFieldMap.set("기타", "EC");
}

initMap();
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  margin: 0 auto;
  border-radius: 20px;
  .post-container {
    padding-top: 20px;
    .post {
      height: 250px;
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 15px;

      &:hover {
        background-color: $grey-4;
        cursor: pointer;
      }
      .post-meta {
        z-index: 100;
      }
    }
  }

  .avt {
    background: linear-gradient(to right, #6699ff, #cc99ff);
  }

  .title-field {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content-field {
    max-height: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
