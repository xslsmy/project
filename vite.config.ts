import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock' //mock插件提供方法
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  //获取各种环境下的对应的变量
  let env = loadEnv(mode, process.cwd());
  return{
    plugins: [vue(),
    createSvgIconsPlugin({
      iconDirs:[path.resolve(process.cwd(),'src/assets/icons')],
      symbolId:'icon-[dir]-[name]',
    }),
    viteMockServe({
      localEnabled: command === 'serve',//保证开发阶段可以使用mock接口
    }),
    ],
    resolve:{
      alias:{
        "@":path.resolve("./src")
      }
    },
    //scss全局变量配置
    css:{
      preprocessorOptions:{
        scss: {
          javascriptEnabled: true,
          additionalData:'@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]:{
        //获取数据的服务器地址
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
}
})
