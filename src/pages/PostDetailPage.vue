<template>
  <q-page class="q-mt-md">
    <LoaderComponent v-if="loading" fixed :size="3" />

    <div v-else class="post full-height">
      <div class="post-details shadow-11 rounded-borders">
        <PostHeader
          :title="post.title"
          :postId="post.id"
          :postUserId="post.userId"
        />

        <q-separator />

        <PostBody :content="post.content" :postId="post.id" />
      </div>
      <div class="q-mt-md row flex-center q-gutter-x-sm">
        <q-btn
          :color="post.checkLikeOrDislike === 'like' ? 'grey-5' : 'white'"
          text-color="dark"
          round
          stack
          :icon="outlinedThumbUp"
          :label="like"
          @click="reflectPrefence('like')"
        ></q-btn>
        <q-btn
          :color="post.checkLikeOrDislike === 'dislike' ? 'grey-5' : 'white'"
          text-color="dark"
          round
          stack
          :icon="outlinedThumbDown"
          :label="dislike"
          @click="reflectPrefence('dislike')"
        ></q-btn>
      </div>
      <PostComment :comments="post.comments" :postId="post.id" />
      <PostFooter />
    </div>
  </q-page>
</template>
<script setup>
import { useBoardStore } from "src/stores/board";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  outlinedThumbUp,
  outlinedThumbDown,
} from "@quasar/extras/material-icons-outlined";
import LoaderComponent from "components/LoaderComponent.vue";
import PostHeader from "components/PostHeader.vue";
import PostBody from "components/PostBody.vue";
import PostComment from "components/PostComment.vue";
import PostFooter from "components/PostFooter.vue";

const route = useRoute();
const boardStore = useBoardStore();

const post = computed(() => boardStore.post); // 특정 게시글 저장
const loading = computed(() => boardStore.loading);

const like = computed(() => boardStore.prefs.like);
const dislike = computed(() => boardStore.prefs.dislike);

function reflectPrefence(pref) {
  boardStore.reflectLikeOrDislike(post.value.id, pref);
}
onMounted(() => {
  boardStore.fetchPost(route.params.id);
});
</script>

<style lang="scss" scoped>
.post {
  width: 60%;
  margin: 0 auto;
  .post-details {
    word-wrap: break-word;
  }
}
</style>
