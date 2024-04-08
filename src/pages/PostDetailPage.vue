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
        <PostComment :comments="post.comments" :postId="post.id" :userId="12" />
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { useBoardStore } from "src/stores/board";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import LoaderComponent from "components/LoaderComponent.vue";
import PostHeader from "components/PostHeader.vue";
import PostBody from "components/PostBody.vue";
import PostComment from "components/PostComment.vue";

const route = useRoute();
const boardStore = useBoardStore();

const post = computed(() => boardStore.post);
const loading = computed(() => boardStore.loading);

onMounted(async () => {
  boardStore.fetchPost(route.params.id);
});
</script>

<style lang="scss" scoped>
.post {
  width: 60%;
  margin: 0 auto;
}
</style>
