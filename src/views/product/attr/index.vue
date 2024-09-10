<template>
    <div>

        <!--三级分类全局组件-->
        <Category :scene="scene"/>

        <el-card style="margin: 10px;">
            <div v-show="scene==0">
                <el-button @click="addAttr" type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id?false:true">添加属性</el-button>
            <el-table border style="margin:10px 0px" :data="attrArr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名称" width="120px"  prop="attrName"></el-table-column>
                <el-table-column label="属性值名称">
                    <template #="{row, $index}">
                        <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{row, $index}">
                        <el-button @click="updateAttr(row)" type="primary" size="small" icon="Edit"></el-button>
                        <el-popconfirm :title="`你确定删除${row.attrName}吗？`" @confirm="deteteAttr(row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" ></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            </div>
            <div v-show="scene==1">
                <!--展示添加属性与修改数据的结构-->
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"/>
                    </el-form-item>
                </el-form>
                    <el-button @click="addAttrValue" :disabled="attrParams.attrName?false:true" type="primary" 
                    icon="Plus">添加属性值</el-button>
                    <el-button @click="cancel" type="primary" >取消</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" algin="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{row, $index}">
                            <!--:ref--函数式，注入组件实例，只要有el-input实例，就存储在数组中（通过角标$index存储）-->
                            <el-input :ref="(vc:any)=>inputArr[$index]=vc" v-if="row.flag" @blur="toLook(row,$index)" placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{row, $index}">
                            <el-button type="primary" size="small" icon="Delete"
                            @click="attrParams.attrValueList.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                    <el-button type="primary" @click="save" :disabled="attrParams.attrValueList.length>0?false:true">保存</el-button>
                    <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { watch,ref, reactive, nextTick, onBeforeUnmount } from 'vue';
//引入获取已有属性和属性值接口 
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
import type {AttrResponseData, Attr, AttrValue} from '@/api/product/attr/type';
//引入分类仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
let attrArr = ref<Attr[]>([]);
//添加属性卡片显隐
let scene = ref<number>(0); //1就显示添加属性的卡片
//收集新增属性的数据
let attrParams = reactive<Attr>({
    attrName : '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})
//准备一个数组，将来存储对应的组件实例el-input
let inputArr = ref<any>([]);
//监听三级分类ID变化
watch(()=>categoryStore.c3Id, ()=>{
    //清空上一次查询的属性与属性值
    attrArr.value = [];
    //保证三级分类有选中的数据才能发请求
    if(!categoryStore.c3Id) return;
    getAttr();
})
//获取已有属性值和属性方法
const getAttr = async()=>{
    const {c1Id, c2Id, c3Id} = categoryStore;
    //获取已有属性和值
    let result:AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if(result.code==200){
        attrArr.value=result.data;
    }
}
//点击添加属性时显示其卡片
const addAttr =() =>{
    //每次点击时，先清空数据再收集数据，Object.assign--合并对象，将attrParams与下面的属性合并
    Object.assign(attrParams,{
        attrName : '',
        attrValueList: [],
        categoryId: categoryStore.c3Id,
        categoryLevel: 3
    })
    scene.value=1;
}
//点击编辑属性时显示其卡片
const updateAttr =(row:Attr) =>{
    scene.value=1;
    //将已有属性对象赋值给attrParams对象
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)));
}
//取消按钮的回调
const cancel = () =>{
    scene.value=0;
}
//添加属性值按钮的回调
const addAttrValue =()=>{
    //点击添加属性值按钮时，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName:'',
        flag:true //控制每个属性值编辑模式和切换模式的切换
    });
    //获取最后el-input组件聚焦
    nextTick(()=>{
        inputArr.value[attrParams.attrValueList.length-1].focus();
    })
}
//保存回调
const save = async()=>{
    //发请求，此data接口未返回任何数据，所以是any
    let result:any = await reqAddOrUpdateAttr(attrParams);
    if(result.code==200){
        scene.value=0;
        ElMessage({
            type:'success',
            message:attrParams.id?'修改成功':'添加成功'
        })
        getAttr();
    }else{
        ElMessage({
            type:'error',
            message:attrParams.id?'修改失败':'添加失败'
        })
    }
    
}
//属性值表单元素失去焦点时间回调
const toLook =(row:AttrValue,$index:number)=>{
    //非法情况1：如果输入属性值为空，不能点击保存(trim--去掉空格)
    if(row.valueName.trim()==''){
        //删除属性值为空的元素
        attrParams.attrValueList.splice($index,1);
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return;
    }
    //非法情况2：添加的属性值不能为空
    let repeat = attrParams.attrValueList.find((item)=>{
        //把当前失焦的属性值对象从当前数组抠出并判断
        if(item!=row){
            return item.valueName===row.valueName;
        }
    });
    if(repeat){
        //将重复的属性值从数组中删除
        attrParams.attrValueList.splice($index,1);
        ElMessage({
             type:'error',
            message:'属性值不能重复'
        })
        return;
    }
    //相应属性值对象flag:变为false
    row.flag=false;
}
//
const toEdit=(row:AttrValue,$index:number)=>{
    row.flag=true;
    //nextTick:响应式数据发生变化，获取更新后的DOM或组件实例
    nextTick(()=>{
        inputArr.value[$index].focus();
    })
}
//删除某一个已有属性方法回调
const deteteAttr = async (attrId:number)=>{
    let result = await reqRemoveAttr(attrId);
    if(result.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getAttr();
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
//路由组件销毁时，清空分类相关数据
onBeforeUnmount(()=>{
    //清空仓库的数据
    categoryStore.$reset(); 
})
</script>

<style scoped lang="scss"></style>