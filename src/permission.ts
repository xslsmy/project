//路由鉴权：项目中的路由能不能被访问的权限
import router from "@/router";
import nprogress from 'nprogress';
//引入进度条样式
import "nprogress/nprogress.css";
nprogress.configure({showSpinner: false}); //去掉加载的小球
//引入仓库
import pinia from "./store";
import useUserStore from "./store/modules/user";
import setting from "./setting";
let userStore = useUserStore(pinia);

//全局前置守卫
router.beforeEach( async (to, from, next) => {
    //to--将要访问的路由；from--从哪个路由来；next--路由的放行函数
    nprogress.start();
    let token = userStore.token;
    //获取用户名字
    let username = userStore.username;
    //用户登录判断
    if(token){
        //登录成功，就不能再访问login
       if(to.path=='/login'){
            next({path: '/'})
       }else{
            //登录成功，访问其余六个路由
            if(username){
                //有用户信息，放行
                next();
            }else{
                //无用户信息，在守卫这里发请求获取用户信息后再放行
                try{
                    await userStore.userInfo();
                    //异步路由加载完毕再放行
                    next({...to});
                }catch(error){
                    //情况一：token过期
                    //情况二：手动修改了本地存储的token 
                    //退出登录
                    await userStore.userLogout();
                    next({path: '/login', query: {redirect: to.path}});
                }
            }
       }
    }else{
        //用户未登录判断
        if(to.path=='/login'){
            next();
        }else{
            next({path:'/login',query:{redirect: to.path} })
        }
    }
})
//全局后置守卫
router.afterEach((to, from) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.done();
})

//1. 进度条实现 ---nprogress
//2. 路由组件访问权限
//全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)||商品管理(两个子路由)

//未登录：只能访问login
//登录：不能访问login(指向首页)
