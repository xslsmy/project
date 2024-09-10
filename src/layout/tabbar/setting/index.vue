<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
            <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
            <el-popover
                placement="bottom"
                title="主题设置"
                :width="200"
                trigger="hover"
                content=""
            >
            <!--表单元素-->
            <el-form>
                <el-form-item label="主题颜色">
                    <el-color-picker @change="setColor" :visible="false" size="small" v-model="color" show-alpha :predefine="predefineColors" />
                </el-form-item>
                <el-form-item label="暗黑模式">
                    <el-switch
                        @click="changeDark"
                        v-model="dark"
                        size="small"
                        active-icon="MoonNight" inactive-icon="Sunny"
                        inline-prompt
                        class="mt-2"
                        style="margin-left: 24px"
                    />
                </el-form-item>
            </el-form>
                <template #reference>
                    <el-button size="small" icon="Setting" circle></el-button>
                </template>
            </el-popover>

            <img :src="userStore.avatar" style="width: 24px; height: 24px ; margin:0 10px; border-radius: 50%;" />
            <!--下拉菜单-->
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{userStore.username}}
                    <el-icon class="el-icon-right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
</template>

<script setup lang='ts'>
defineOptions({name: 'Setting'});
import useUserStore from '@/store/modules/user';
import useLayoutSettingStore from '@/store/modules/setting';
import { useRouter, useRoute } from 'vue-router';
let layOutSettingStore = useLayoutSettingStore();
let userStore = useUserStore();
//获取路由器
let $router = useRouter();
//获取路由对象
let $route = useRoute();
//刷新按钮点击回调
const updateRefsh = ()=>{
    layOutSettingStore.refresh=!layOutSettingStore.refresh;
}
//全屏按钮点击回调
const fullScreen = () =>{
    //Dom对象的属性：用来判断是否是全屏模式；true：全屏，false：非全屏
    let full = document.fullscreenElement;
    if(!full){
        //文档根节点方法requestFullscreen
        document.documentElement.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
}
//退出登录的回调
const logout = async ()=>{
    //想服务器发请求，退出登录接口
    //清除仓库中用户相关信息(usernamr,avatar)
    await userStore.userLogout();
    //跳转到登录页面
    $router.push({path:'/login', query:{redirect: $route.path}});
}

import { ref } from 'vue'
let dark = ref<boolean>(false);
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeDark =() =>{
    let html = document.documentElement;
    dark.value?html.className='dark':html.className='';
}
const setColor =() =>{
    //通知js修改根节点的样式对象的属性和属性值
    const html = document.documentElement;
    html.style.setProperty('--el-color-primary',color.value);
}
</script>

<style scoped lang='scss'>
</style>