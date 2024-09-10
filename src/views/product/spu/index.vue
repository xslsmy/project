<template>
    <div>
        <Category :scene="scene"/>
        <el-card style="margin: 10px;">
            <div v-show="scene==0">
                <el-button @click="addSpu" type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id?false:true" >添加SPU</el-button>
            <el-table style="margin: 10px 0px;" border :data="records">
                <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                <el-table-column label="SPU操作">
                    <!--row即为已有SPU数据-->
                    <template #="{row, $index}">
                        <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="()=>addSku(row)"></el-button>
                        <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="()=>updateSpu(row)"></el-button>
                        <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="()=>findSku(row)"></el-button>
                        <el-popconfirm :title="`你确定删除${row.spuName}吗？`" width="200px"  @confirm="deleteSpu(row)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                :page-sizes="[3,5,7,9]"
                :background="true"
                layout="prev, pager, next, jumper,->,sizes,total"
                @current-change="getHasSpu"
                @size-change = "changeSize"
                :total="total"
                />
            </div>
            <!--Spu子组件-->
            <SpuForm ref="spu" v-show="scene==1" @changeScene="changeScene"></SpuForm>
            <!--Sku子组件-->
            <SkuForm ref="sku" v-show="scene==2" @changeScene="changeScene"></SkuForm>
            <el-dialog v-model="show" title="SKU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKu重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{row,$index}">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                        </el-table-column>
                    </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import {ref, watch, onBeforeUnmount} from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu,  reqRemoveSpu,  reqSkuList} from '@/api/product/spu';
import {HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData} from '@/api/product/spu/type';
//子组件
import SpuForm from './SpuForm.vue';
import SkuForm from './SkuForm.vue';
import { reqRemoveAttr } from '@/api/product/attr';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
//父组件给子组件传一个场景值（分类卡片是否可以选择）
let scene = ref<number>(0); //0--展示SKU数据  1--添加或修改SKU数据  2--添加SKU结构
//分页器默认页面
let pageNo = ref<number>(1);
//每一页展示多少条数据
let pageSize = ref<number>(3);
//存储已有SPU数据
let records = ref<Records>([]);
//存储已有SPU总个数
let total = ref<number>(0);
//子组件vc实例
let spu = ref<any>();
let sku = ref<any>();
//存储全部Sku数据
let skuArr = ref<SkuData[]>([]);
let show = ref<boolean>(false);
//监听三级分类ID变化
watch(()=>categoryStore.c3Id, ()=>{
    //保证有三级分类ID
    if(!categoryStore.c3Id) return;
    getHasSpu();
})
//获取某一个三级分类下已有全部SPU
const getHasSpu = async(pager=1)=>{
    //修改当前页码
    pageNo.value = pager; //pager:初始值为第一个页面
    let result:HasSpuResponseData = await reqHasSpu(pageNo.value,pageSize.value,categoryStore.c3Id);
    if(result.code==200){
        records.value = result.data.records;
        total.value = result.data.total;
    }
}
//分页器下拉发生变化时，跳回第一页
const changeSize =()=>{
    getHasSpu();
}
//添加新的Spu按钮的回调，点击添加SPU,切换到场景1--添加页面
const addSpu = ()=>{
    scene.value=1;
    spu.value.initAddSpu(categoryStore.c3Id);
}
//编辑Spu按钮的回调，点击编辑SPU,切换到场景1--编辑页面
const updateSpu = (row:SpuData)=>{
    scene.value=1;
    //调用子组件实例方法获取完整已有的SPU的数据
    spu.value.initHasSpuData(row);

}
//子组件Spu绑定自定义事件--子组件通知父组件切换为场景0
const changeScene=(obj:any)=>{
    scene.value=obj.flag;
    if(obj.params=='update'){
        //再次获取全部SPU
        getHasSpu(pageNo.value);
    }else{
        getHasSpu();
    }
}
//添加Sku
const addSku =(row:SpuData) =>{
    scene.value=2;
    sku.value.initSkuData(categoryStore.c1Id,categoryStore.c2Id,row);
}
//查看SKU列表的数据
const findSku = async(row:SpuData) =>{
    let result:SkuInfoData = await reqSkuList((row.id as number));
    if(result.code==200){
        skuArr.value = result.data;
        show.value=true;
    }
}
//删除已有SPU按钮的回调
const deleteSpu = async(row:SpuData) =>{
    let result = await reqRemoveSpu((row.id as number));
    if(result.code==200){
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //获取剩余SPU数据
        getHasSpu(records.value.length>1?pageNo.value:pageNo.value-1);
    }else{
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
//路由组件销毁前（切换页面时），清空仓库关于分类的数据
onBeforeUnmount(()=>{
    categoryStore.$reset();
})
</script>

<style scoped lang="scss">
</style>