//创建用户相关的小仓库
import { defineStore } from 'pinia';
//引入登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type';
import type {UserState} from './types/type'
//引入操作本地存储的方法
import { SET_TOKEN,GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
//引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import router from '@/router';
//深拷贝方法
import { cloneDeep } from 'lodash';
//过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute:any, routes:any){
    return asyncRoute.filter((item:any)=>{
        if(routes.includes(item.name)){
            if(item.children && item.children.length>0){
                item.children = filterAsyncRoute(item.children, routes);
            }
            return true;
        } 
    })
}

//创建用户小仓库
let useUserStore = defineStore('User', {
    //存储数据的地方
    state: (): UserState => {
        return {
            token: GET_TOKEN(), //用户的唯一标识token
            menuRoutes: constantRoute, //仓库生成菜单需要的数组（路由）
            username:'',
            avatar:'',
            buttons:[]  //存储当前用户是否包含某一个按钮
        }
    },
    //处理异步|逻辑
    actions: {
        //用户登录方法
        async useLogin(data: loginFormData) {
            let result:loginResponseData = await reqLogin(data);
            if (result.code == 200) {
                //Pinia仓库存储token(由于pinia|vuex存储数据实际上是利用的js对象)
                this.token = (result.data as string);
                SET_TOKEN(result.data as string);
                return 'ok';
            } else {
                return Promise.reject(new Error(result.data));
            }
        },
        //获取用户信息方法
        async userInfo() {
            let result:userInfoResponseData = await reqUserInfo();
            if(result.code==200){
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons = result.data.buttons;
                //计算当前需要展示的异步路由
                let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes);
                //整理菜单需要的数据
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
                //在常量路由的基础上追加：计算之后的异步路由，任意路由
                [...userAsyncRoute, anyRoute].forEach((route:any)=>{
                    router.addRoute(route);
                })
                
                return 'ok';
            }else{
                return Promise.reject(new Error(result.message));
            }
        },
        //退出登录
        async userLogout(){
            let result:any = await reqLogout();
            if(result.code==200){
                this.token = '';
                this.username = '';
                this.avatar = '';
                REMOVE_TOKEN();
                return 'ok';
            }else{
                return Promise.reject(new Error(result.message));
            }
        }
    },
    //计算属性
    getters: {

    }
})
export default useUserStore;