<template>
  <div class="container">
    <div class="post-container row justify-center q-gutter-md">
      <q-card
        bordered
        v-for="post in postLists"
        :key="post.id"
        class="post cursor-pointer"
        :class="post.userId == memberStore.userId ? 'self-post' : ''"
        @click="toDetail(post.id)"
      >
        <q-card-section horizontal style="height: 70%">
          <q-card-section class="q-pt-xs col-6">
            <div class="text-overline text-primary" style="white-space: nowrap">
              {{ post.jobField }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs text-weight-bold title-field">
              {{ post.title }}
            </div>
            <div class="text-caption text-grey-7 content-field">
              {{ decodeHtmlEntities(post.content)
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
            getSymbol(post.jobField)
          }}</q-avatar>
          <div class="text-weight-bold">
            {{ post.userName }}
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
import { computed } from "vue";
import {
  outlinedVisibility,
  outlinedChat,
} from "@quasar/extras/material-icons-outlined";
import { useMemberStore } from "src/stores/member";

const props = defineProps({
  postLists: Array,
});

const router = useRouter();
const boardStore = useBoardStore();
const memberStore = useMemberStore();

const jobFields = computed(() => boardStore.jobFields);

function getSrc(src) {
  console.log(src);
  return "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + src;
}

function decodeHtmlEntities(content) {
  return content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function toDetail(id) {
  boardStore.initPost();
  router.push(`/board/${id}`);
}

// fetch job Field
boardStore.fetchJobFields();

function getSymbol(field) {
  const job = jobFields.value.find((element) => element.field === field);
  return job ? job.symbol : null;
}
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

    .self-post {
      border-style: solid;
      border-color: $primary;
      border-width: 1.5px;
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
