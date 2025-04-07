<template>
  
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

</style>