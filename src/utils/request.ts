//进行axios的二次封装，使用请求、响应拦截器
import axios from 'axios';
import {ElMessage} from "element-plus";
//引入用户相关仓库
import useUserStore from '@/store/modules/user';
//1.创建axios实例
let request=axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API, //基础路径会携带/api
    timeout:50000
});
//2.request实例添加拦截器
request.interceptors.request.use((config)=>{
    //获取用户相关小仓库：获取用户内部小仓库，登录以后携带给服务器
    let userStore = useUserStore();
    if(userStore.token){
        config.headers.token = userStore.token;
    }
    //config配置对象，headers属性请求头，经常给服务器端携带公共参数
    //返回配置对象
    return config;
});
//3.响应拦截器
request.interceptors.response.use((response)=>{
    return response.data;
},(error)=>{
    let message='';
    let status=error.response.status;
    switch (status) {
        case 401:
            message="TOKEN过期";
            break;
        case 403:
            message="无权访问";
            break;
        case 404:
            message="请求地址错误";
            break;
        case 500:
            message="服务器出现问题";
            break;
        default:
            message="网络出现问题";
            break;
    }
    //提示错误信息
    ElMessage({
        type: 'error' ,
        message
    });
    return Promise.reject(error);
})
//对外暴露
export default request;