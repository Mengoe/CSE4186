<template>
  <q-page class="q-mt-md">
    <LoaderComponent v-if="loading" fixed :size="3" />

    <div v-else class="q-mt-md post full-height">
      <q-icon
        :name="outlinedArrowBackIos"
        size="sm"
        color="grey-7"
        class="q-pb-md cursor-pointer"
        @click="router.push('/board')"
      />
      <div class="post-details">
        <PostHeader />
        <PostBody />
      </div>

      <q-separator class="q-mt-xl" color="grey-5" />
      <PostComment :comments="post.comments" :postId="post.id" />

      <PostFooter />
    </div>
  </q-page>
</template>
<script setup>
import { useBoardStore } from "src/stores/board";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { outlinedArrowBackIos } from "@quasar/extras/material-icons-outlined";

import LoaderComponent from "components/LoaderComponent.vue";
import PostHeader from "components/PostHeader.vue";
import PostBody from "components/PostBody.vue";
import PostComment from "components/PostComment.vue";
import PostFooter from "components/PostFooter.vue";

const route = useRoute();
const router = useRouter();
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
    border-radius: 15px;
  }
}
</style>
