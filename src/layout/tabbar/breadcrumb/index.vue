<template>
    <!--顶部左侧静态-->
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component>
    </el-icon>
    <!--左侧面包屑-->
    <el-breadcrumb separator-icon="ArrowRight">
        <!--动态展示路由标题-->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
        <!--图标-->
        <el-icon>
            <component :is="item.meta.icon"></component>
        </el-icon>
            <!--面包屑展示匹配路由标题-->
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang='ts'>
defineOptions({name: 'Breadcrumb'});
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '@/store/modules/setting';
import { ref } from 'vue';
//读取layout配置相关的仓库
let LayOutSettingStore = useLayoutSettingStore();
let $route = useRoute();
const changeIcon = () => {
    //图标进行切换
    LayOutSettingStore.fold=!LayOutSettingStore.fold;
}
</script>

<style scoped lang='scss'></style>