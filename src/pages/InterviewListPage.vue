<template>
  <div>
    <q-card class="q-pa-md">
      <q-card-section>
        <h2 class="text-h6">Interview List</h2>
        <q-list bordered>
          <q-item v-for="interview in interviews" :key="interview.id">
            <q-item-section>
              <q-item-label>{{ interview.title }}</q-item-label>
              <q-item-label caption>{{ interview.createdAt }}</q-item-label>
              <q-item-label caption>{{ interview.updatedAt }}</q-item-label>
              <q-item-label caption>{{ interview.link }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { api } from "boot/axios.js";
import { getToken } from "src/utils/cookies.js";
const interviews = [];
function fetchInterviews() {
  const accessToken = "Bearer " + getToken();

  api
    .get("/video/list?page=1&size=5", {
      headers: {
        authorization: accessToken,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error("Error fetching interviews:", error);
    });
}
fetchInterviews();
</script>
