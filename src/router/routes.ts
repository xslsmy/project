
//对外暴露路由配置
export const constantRoute=[
    {
        //登录
        path:'/login',
        component:()=>import('@/views/login/index.vue'),
        name:'Login',
        meta:{
            title: '登录',
            hidden: true, //true是隐藏
            icon: 'Loading'
        }
    },
    {
        //首页
        path:'/',
        component:()=>import('@/layout/index.vue'),
        name:'Layout',
        meta:{
            title: '',
            hidden: false, //如果不写hidden的话，默认是false
            icon: ''
        },
        redirect: '/home',
        children:[
            {
                path:'/home',
                component:()=>import('@/views/home/index.vue'),
                meta:{
                    title:'首页',
                    hidden: false,
                    icon: 'HomeFilled'
                }
            }
        ]   
    },
    {
        //404
        path:'/404',
        component:()=>import('@/views/404/index.vue'),
        name:'404',
        meta:{
            title:'404',
            hidden: true,
            icon: 'CloseBold'
        }
    },
    {
        path:'/screen',
        component: ()=>import('@/views/screen/index.vue'),
        name:'Screen',
        meta:{
            title:'数据大屏',
            hidden: false,
            icon: 'DataAnalysis'
        }
    }
]

export const asyncRoute = [
    {
        path: '/acl',
        component: ()=>import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock'
        },
        redirect: '/acl/user',
        children:[
            {
                path:'/acl/user',
                component: ()=>import('@/views/acl/user/index.vue'),
                name: 'Acl',
                meta:{
                    title:'用户管理',
                    hidden:false,
                    icon: 'User'
                }
            },
            {
                path:'/acl/role',
                component: ()=>import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta:{
                    title:'角色管理',
                    hidden:false,
                    icon: 'UserFilled'
                }
            }, 
            {
                path:'/acl/permission',
                component: ()=>import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta:{
                    title:'菜单管理',
                    hidden:false,
                    icon: 'Grid'
                }
            }
        ]
    },
    {
        path: '/product',
        component: ()=>import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods'
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: ()=>import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'CreditCard'
                }
            },
            {
                path: '/product/attr',
                component: ()=>import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled'
                }
                },
                {
                    path: '/product/spu',
                    component: ()=>import('@/views/product/spu/index.vue'),
                    name: 'Spu',
                    meta: {
                        title: 'SPU管理',
                        icon: 'Calendar'
                    }
                },
                {
                    path: '/product/sku',
                    component: ()=>import('@/views/product/sku/index.vue'),
                    name: 'Sku',
                    meta: {
                        title: 'SKU管理',
                        icon: 'Orange'
                    }
                }
        ]
    }
]

export const anyRoute = [
    {
        //404
        path:'/:pathMatch(.*)*',
        redirect: '/404',
        name:'Any',
        meta:{
            title:'任意',
            hidden: true,
            icon: 'Operation'
        }
    }
]