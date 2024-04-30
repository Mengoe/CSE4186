<template>
  <div class="container q-mt-lg q-gutter-y-lg">
    <div class="post-container row justify-start q-gutter-y-lg q-gutter-x-md">
      <q-card
        bordered
        v-for="post in postLists"
        :key="post.id"
        @click="toDetail(post.id)"
        class="column wrap"
      >
        <q-card-section>
          <div class="text-h6">{{ post.title }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2">{{ post.content }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useBoardStore } from "src/stores/board";
const props = defineProps({
  postLists: Array,
});

const router = useRouter();

function toDetail(id) {
  useBoardStore().initPost();
  router.push(`/board/${id}`);
}
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  height: 700px;
  margin: 0 auto;
  .post-container {
    .q-card {
      height: 30%;
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background-color: $light-blue-1;
        cursor: pointer;
      }
    }
  }
}
</style>
