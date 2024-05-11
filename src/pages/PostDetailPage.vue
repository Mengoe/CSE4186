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

        <PostBody :content="post.content" />
      </div>

      <div class="q-mb-md">
        <PostComment :comments="post.comments" :postId="post.id" />
      </div>
      <PostFooter />
    </div>
  </q-page>
</template>
<script setup>
import { useBoardStore } from "src/stores/board";
import { useMemberStore } from "src/stores/member";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import LoaderComponent from "components/LoaderComponent.vue";
import PostHeader from "components/PostHeader.vue";
import PostBody from "components/PostBody.vue";
import PostComment from "components/PostComment.vue";
import PostFooter from "components/PostFooter.vue";

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const memberStore = useMemberStore();

const userId = memberStore.userId;

const post = computed(() => boardStore.post); // 특정 게시글 저장
const loading = computed(() => boardStore.loading);

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
