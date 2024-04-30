<template>
  <q-page class="q-mt-md">
    <LoaderComponent v-if="loading" fixed :size="3" />

    <div v-else class="post full-height">
      <div class="post-details shadow-11 rounded-borders">
        <PostHeader :title="post.title" />
        <q-separator />
        <PostBody :content="post.content" />
      </div>
      <div>
        <PostComment :comments="post.comments" :postId="post.id" />
      </div>
      <div class="row justify-end q-mt-sm q-gutter-x-sm">
        <q-btn
          v-if="post.userId == userId"
          color="grey-7"
          size="lg"
          to="./edit"
        >
          수정
        </q-btn>
        <q-btn
          v-if="post.userId == userId"
          color="negative"
          size="lg"
          @click="deletePost(post.id)"
        >
          삭제
        </q-btn>
        <q-btn color="primary" size="lg" to="./">목록</q-btn>
      </div>
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

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const memberStore = useMemberStore();

const userId = memberStore.userId;

const post = computed(() => boardStore.post);
const loading = computed(() => boardStore.loading);

onMounted(() => {
  boardStore.fetchPost(route.params.id);
});

function deletePost(postId) {
  if (!confirm("삭제하시겠습니까?")) return;

  console.log(postId);
  boardStore.deletePost(postId);
}
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
