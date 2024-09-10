<template>
    <div class="layout_container">
        <div class="layout_slider" >
            <Logo></Logo>
            <!--展示菜单--><!--滚动组件-->
            <el-scrollbar class="scrollbar">
                <!--菜单组件-->
                <el-menu :collapse="LayOutSettingStore.fold?true:false" :default-active="$route.path" background-color="$base-menu-background" text-color="white" active-text-color="yellow">
                    <!--根据路由动态生成菜单-->
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
            <Tabbar></Tabbar>
        </div>
        <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
           <Main></Main>
        </div>
    </div>
</template>
 
<script setup lang='ts'>
defineOptions({name: 'Layout'});
//获取路由对象
import { useRoute } from 'vue-router'
//引入子组件
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
//引入右侧内容展示区
import Main from './main/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting';
let userStore=useUserStore();
//获取路由对象
let $route=useRoute();
//console.log($route.path); 
//获取layout配置仓库
let LayOutSettingStore=useLayoutSettingStore();
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    background: rgb(255, 255, 255);

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-tabbar-height);
            .el-menu{
                border-right: none;
            }
        }
       
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        background: rgb(8, 159, 205);
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        overflow: auto; //主内容区滚动条
        transition: all 0.3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>