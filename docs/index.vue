<template>
  <img class="count-img" src="https://count.getloli.com/@leet-code?name=leet-code&theme=booru-mjg&padding=7&offset=0&align=top&scale=0.3&pixelated=1&darkmode=auto" alt="leet-code" />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  import('canvas-confetti').then((module) => {
    module.default({
      particleCount: 100,
      spread: 170,
      origin: { y: 0.6 },
    });
  })
})
</script>

<style>
.count-img {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>