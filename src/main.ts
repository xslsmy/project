import { createApp } from 'vue'
import App from '@/App.vue'

import '@/styles/index.scss' //引入模板的全局的样式
import ElementPlus from 'element-plus' //引入element-plus插件与样式
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register';

import globalComponent from '@/components'; //引入自定义插件对象，注册整个项目全局组件
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //国际化配置
import router from './router' //引入路由
import pinia from './store' //引入仓库
//暗黑模式需要的样式
import "element-plus/theme-chalk/dark/css-vars.css"
const app=createApp(App) //获取应用实例对象
app.use(ElementPlus,{
    locale:zhCn //element-plus国际化配置
}); 

app.use(globalComponent); //安装自定义插件
app.use(router); //注册路由
app.use(pinia); //安装仓库
import './permission'; //引入路由鉴权文件
import { isHasButton } from './directive/has';
isHasButton(app);
app.mount('#app'); //将应用挂载到挂载点上

//axios测试代码
// import axios from 'axios';
// axios({
//     url: '/api/user/login',//请求地址
//     method: 'post',//请求方式
//     data:{
//         username:'admin',
//         password:'111111'
//     }
// })

// import { fileURLToPath, URL } from 'node:url'
 
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue'
// // 引入插件
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
 
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueJsx(),
//     AutoImport({
//       resolvers: [ElementPlusResolver()],
//       imports: ['vue', 'vue-router']
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()]
//     })
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })
