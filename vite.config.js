import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()], // 仅保留核心Vue插件，避免冲突
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 架构7.1节规范：精准映射Cesium核心目录（Source），解决模块解析
      'cesium': path.resolve(__dirname, 'node_modules/cesium/Source'),
      // 架构2.6节规范：映射样式目录，兜底样式导入路径
      'cesium/Widgets': path.resolve(__dirname, 'node_modules/cesium/Source/Widgets')
    },
    // 适配Cesium内部模块导入，允许省略文件后缀
    extensions: ['.mjs', '.js', '.vue', '.json']
  },
  define: {
    // 架构2.6节规范：配置Cesium静态资源基础路径（对应public/Cesium目录）
    CESIUM_BASE_URL: JSON.stringify('/Cesium/'),
    // 适配Cesium CommonJS模块特性，避免导入报错
    CESIUM_IGNORE_GLOBAL_REQUIRE: true
  },
  server: {
    port: 5173,
    open: true,
    cors: true, // 架构9.1节规范：解决底图跨域问题
    timeout: 30000 // 延长超时时间，适配三维资源加载
  },
  optimizeDeps: {
    include: ['cesium'], // 架构7.1节规范：告诉Vite预优化Cesium模块
    exclude: ['cesium/Source/Workers'] // 排除Worker文件，避免构建冲突
  },
  build: {
    // 架构12.1节规范：工程化性能优化，分离Cesium为独立chunk
    rollupOptions: {
      output: {
        manualChunks: {
          cesium: ['cesium'] // 避免Cesium打包到主包，提升首屏加载速度
        }
      }
    },
    chunkSizeWarningLimit: 2000 // 适配Cesium大模块，避免构建警告
  }
});