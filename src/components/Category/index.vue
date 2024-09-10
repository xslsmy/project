<template>
    <el-card style="margin: 10px;">
        <el-form :inline="true">

            <el-form-item label="一级分类">
                <el-select :disabled="scene==0?false : true" v-model="categoryStore.c1Id" @change="handler">
                    <!--:value--收集id-->
                    <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select :disabled="scene==0?false : true" v-model="categoryStore.c2Id" @change="handler1">
                    <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select :disabled="scene==0?false : true" v-model="categoryStore.c3Id">
                    <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
                </el-select>
            </el-form-item>

        </el-form>
    </el-card>
</template>

<script setup lang='ts'>
import { onMounted} from 'vue';
//引入分类相关仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore();
//组件挂载完毕
onMounted(() => {
    getC1();
});
//获取一级分类数据
const getC1 = () =>{
    categoryStore.getC1();
}
//获取一级下拉菜单选中时的ID
const handler = () =>{
    categoryStore.c2Id='';
    categoryStore.c3Arr=[];
    categoryStore.c3Id='';
    categoryStore.getC2();
}
//获取二级下拉菜单选中时的ID
const handler1 = () =>{
    categoryStore.c3Id='';
    categoryStore.getC3();
}
//接收父组件传过来的scene，在添加属性值的时候禁用分类选择
defineProps(['scene']);
</script>

<style scoped>
.el-form-item{
    width: 300px;
}
</style>