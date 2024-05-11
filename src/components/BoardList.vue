<template>
  <div class="container q-gutter-y-lg">
    <div class="post-container row justify-center q-gutter-y-lg q-gutter-x-md">
      <q-card
        bordered
        v-for="post in postLists"
        :key="post.id"
        @click="toDetail(post.id)"
        class="column"
      >
        <q-video
          style="height: 75%"
          loading="lazy"
          src="https://www.youtube.com/embed/U34kLXjdw90"
        />

        <q-card-section>
          <div class="text-weight-bold text-center">
            {{ post.title }}
          </div>
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
  margin: 0 auto;
  border-radius: 20px;
  .post-container {
    .q-card {
      height: 250px;
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background-color: $grey-4;
        cursor: pointer;
      }
    }
  }
}
</style>
