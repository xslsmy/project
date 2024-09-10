<template>
        <!--路由组件出口的位置-->
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <!--渲染layout一级路由的子路由-->
                <component :is="Component" v-if="flag"/> 
            </transition>
        </router-view>
</template>

<script setup lang='ts'>
defineOptions({name: 'Main'});
import { watch, ref, nextTick } from 'vue';
import useLayoutSettingStore from '@/store/modules/setting';
//控制当前组件是否销毁重建
let flag = ref(true);
let layOutSettingStore = useLayoutSettingStore();
//监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(()=> layOutSettingStore.refresh, ()=>{
    //点击刷新按钮：路由组件销毁
    flag.value = false;
    //响应式数据发生变化后，可以获取更新后的Dom(更新后的没有路由组件了，再重新创建)
    nextTick(()=>{
        flag.value = true;
    })
})
</script>

<style scoped lang='scss'>
.fade-enter-from{
    opacity: 0;
    transform: rotate(0deg);
}
.fade-enter-active{
    transition: all 1s;
}
.fade-enter-to{
    opacity: 1;
    // transform: rotate(360deg);
}
</style>