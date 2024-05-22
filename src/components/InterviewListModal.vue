<template>
  <q-card class="q-pa-md" style="height: 100%; width: 100%">
    <q-card-section>
      <h2 class="text-h6">Interview List</h2>
      <q-list bordered separator>
        <q-item v-for="interview in interviews" :key="interview.id">
          <q-item-section
            @click="selectVideo(interview.link, interview.title, interview.id)"
            class="cursor-pointer"
          >
            <q-item-label>{{ interview.title }}</q-item-label>
            <q-item-label caption>{{ interview.createdAt }}</q-item-label>
            <q-item-label caption>{{ interview.updatedAt }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { computed } from "vue";

const emit = defineEmits(["selected"]);
const showVideoListModal = defineModel("showVideoListModal");

const interviews = computed(() => useBoardStore().videos);

function selectVideo(link, title, id) {
  showVideoListModal.value = false;
  emit("selected", { link, title, id });
}
</script>
