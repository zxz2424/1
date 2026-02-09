<template>
  <div class="track-scene-root">
    <vc-viewer 
      ref="viewerRef"
      class="cesium-viewer-container"
      :animation="false"
      :timeline="false"
      :geocoder="false"
      :home-button="false"
      :navigation-help-button="false"
      :scene-mode-picker="false"
      :scene-options="{ fxaa: false }"
      style="margin: 0 !important; padding: 0 !important; border: none !important"
    >
      <vc-layer-imagery :sort-order="10">
        <vc-provider-imagery-cesium-default></vc-provider-imagery-cesium-default>
      </vc-layer-imagery>
    </vc-viewer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
// 仅导入VueCesium组件，移除本地Cesium样式导入
import { VcViewer, VcLayerImagery, VcProviderImageryCesiumDefault } from 'vue-cesium';

const viewerRef = ref(null);
let cesiumViewer = null;
let resizeObserver = null;

onMounted(async () => {
  await nextTick();
  if (viewerRef.value && viewerRef.value.cesiumViewer) {
    cesiumViewer = viewerRef.value.cesiumViewer;
    const canvas = cesiumViewer.scene.canvas;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    
    initResizeObserver();
    initCameraView();
  }
});

onUnmounted(() => {
  if (cesiumViewer) {
    cesiumViewer.entities.removeAll();
    cesiumViewer.destroy();
  }
  if (resizeObserver) resizeObserver.disconnect();
  viewerRef.value = null;
});

const initResizeObserver = () => {
  resizeObserver = new ResizeObserver((entries) => {
    if (!cesiumViewer) return;
    const { width, height } = entries[0].contentRect;
    const canvas = cesiumViewer.scene.canvas;
    canvas.width = width;
    canvas.height = height;
    cesiumViewer.camera.frustum.aspectRatio = width / height;
  });
  resizeObserver.observe(document.querySelector('.track-scene-root'));
};

const initCameraView = () => {
  if (!cesiumViewer || !window.Cesium) return;
  const targetPos = window.Cesium.Cartesian3.fromDegrees(116.403874, 39.914885, 1000);
  cesiumViewer.camera.flyTo({
    destination: targetPos,
    duration: 1.5,
    orientation: {
      heading: window.Cesium.Math.toRadians(0),
      pitch: window.Cesium.Math.toRadians(-30),
      roll: 0
    }
  });
};
</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  height: 100% !important;
  width: 100% !important;
  background: #000 !important;
}

.track-scene-root {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
  width: 100vw !important;
  height: 100vh !important;
}

:deep(.cesium-viewer-container) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  overflow: hidden !important;
  position: relative !important;
}

:deep(.cesium-widget-container),
:deep(.cesium-widget) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

:deep(.cesium-scene-canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.cesium-widget-credits) {
  display: none !important;
}
</style>