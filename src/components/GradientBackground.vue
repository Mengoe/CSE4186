<template>
  <div
    ref="gradient"
    class="relative w-full h-full overflow-hidden bg-gradient-to-br from-[--color-a] via-[--color-b] to-[--color-c] duration-500 ease-in [transition-property:_--color-a,_--color-b,_--color-c] before:absolute before:left-[20%] before:top-[10%] before:h-[50%] before:w-[70%] before:origin-[60%] before:animate-blob before:rounded-3xl before:bg-gradient-to-br before:from-[--color-a] before:to-[--color-b] before:blur-[50px] before:brightness-125 after:absolute after:left-[40%] after:top-[30%] after:h-[80%] after:w-[70%] after:origin-[60%] after:animate-blob-reverse after:rounded-3xl after:bg-gradient-to-br after:from-[--color-a] after:to-[--color-b] after:blur-[50px] after:brightness-125"
  ></div>
</template>

<script setup>
import "/src/css/tailwind.css";
import { ref, onMounted } from "vue";
const gradient = ref(null);
onMounted(() => {
  gradient.value.style.setProperty("--color-a", "#0064FF");
  gradient.value.style.setProperty("--color-b", "#FFC0CB");
  gradient.value.style.setProperty("--color-c", "#87CEEB");
});
</script>
