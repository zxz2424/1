<template>
  <div id="app">
    <!-- 直接引入三维场景组件，无多余嵌套 -->
    <VehicleTrack />
  </div>
</template>

<script setup>
// 确保导入路径与实际文件一致（架构2.1.2节目录规范）
import VehicleTrack from '@/components/3d/viewer/VehicleTrack.vue'
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>