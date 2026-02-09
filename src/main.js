import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import VueCesium from 'vue-cesium';
import 'vue-cesium/dist/index.css';

// 架构7.1节规范：引入Cesium核心（基于Vite别名配置，确保路径可解析）
import * as Cesium from 'cesium';
// 架构2.6节规范：引入Cesium样式（基于别名映射，避免路径错误）
import 'cesium/Widgets/widgets.css';

// 架构7.1节规范：全局挂载Cesium实例，供组件统一调用
window.Cesium = Cesium;
// 架构2.6节规范：配置静态资源基础路径（与vite.config.js保持一致）
window.CESIUM_BASE_URL = '/Cesium/';

// 架构7.9节规范：Vue与Cesium生命周期协同，全局注册VueCesium
const app = createApp(App);
app.use(VueCesium, {
  viewerOpts: {
    // 架构7.3节规范：初始化场景配置，关闭冗余控件
    animation: false,
    timeline: false,
    geocoder: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    // 架构12.3节规范：禁用抗锯齿，避免渲染白边
    sceneOptions: { fxaa: false }
  }
});

app.mount('#app');