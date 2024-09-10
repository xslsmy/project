<template>
        <el-form label-width="100px" >
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌" style="width: 300px;">
                <el-select placeholder="请选择" v-model="SpuParams.tmId">
                    <!--:value:收集品牌id-->
                    <el-option v-for="(item, index) in AllTradeMark" :key=" item.id" :label="item.tmName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图标">
                <!--v-model:file-list是绑定的图片名称和地址-->
                <el-upload
                    v-model:file-list="imgList"
                    action="/api/admin/product/fileUpload"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="handlerUpload"
                >
                    <el-icon><Plus /></el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select  v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length?`还有${unSelectSaleAttr.length}个属性未选择`:'无'" style="width: 200px;">
                    <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
                </el-select>
                <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName?false:true" style="margin-left: 10px;" size="default" type="primary" icon="Plus">添加属性</el-button>
                <el-table border style="margin: 10px 0px" :data="saleAttr">
                    <el-table-column type="index" label="序号" width="80px"></el-table-column>
                    <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                    <el-table-column label="销售属性值" >
                        <!--row：销售属性对象-->
                        <template #="{row, $index}">
                            <el-tag style="margin: 0px 5px;" @close="row.spuSaleAttrValueList.splice(index,1)" v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag==true" placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
                            <el-button v-else @click="toEdit(row)" size="small" type="primary" icon="Plus"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{row, $index}">
                        <el-button size="small" type="primary" icon="Delete" @click="saleAttr.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saleAttr.length>0?false:true" @click="save" size="default" type="primary">保存</el-button>
                <el-button size="default" type="primary" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
</template>

<script setup lang='ts'>
import {computed, ref} from 'vue';
import type { SaleAttrValue, Trademark,SpuImg,SaleAttr,HasSaleAttr,AllTradeMark, SaleAttrResponseData, SpuData, SpuHasImg,HasSaleAttrResponseData } from '@/api/product/spu/type';
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu} from '@/api/product/spu';
import { ElMessage } from 'element-plus';
let $emit = defineEmits(['changeScene']);
//点击取消，通知父组件切换为场景0，展示已有SPU数据
const cancel =()=>{
    $emit('changeScene',{flag:0,params:'update'});
}
//存储已有的SPU这些数据
let AllTradeMark =ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU销售属性
let saleAttr =ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr =ref<HasSaleAttr[]>([]);
//点击预览按钮弹出图片放大框
let dialogVisible = ref<boolean>(false);
//存储预览图片地址
let dialogImageUrl = ref<string>('');
//将来收集未选择的销售属性值
let saleAttrIdAndValueName = ref<string>('');
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
    category3Id:'',//收集三级分类的ID
    spuName:'', //SPU的名字
    description:'', //SPU的描述
    tmId:'', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
//子组件请求数据
const initHasSpuData =async(spu:SpuData)=>{
    //存储已有SPU对象，将来在模板中展示
    SpuParams.value = spu;
    //spu:即为父组件传递过来的已有的SPU对象[不完整]
    //获取全部品牌的数据
    let result:AllTradeMark=await reqAllTradeMark();
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    //获取整个项日全部SPU的销售属性
    let result3:HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储全部品牌的数据
    AllTradeMark.value =result.data;
    //SPU对应商品图片
    imgList.value =result1.data.map(item=>{
        return{
            name:item.imgName,
            url:item.imgUrl
        }
    });
    //存储已有的SPU的销售属性
    saleAttr.value =result2.data;
    //存储全部的销售属性
    allSaleAttr.value = result3.data;
}

//预览图片
const handlePictureCardPreview = (file:any) =>{
    dialogImageUrl.value=file.url;
    dialogVisible.value = true;
}
//删除图片回调
const handleRemove =()=>{
    console.log("success");
}
//上传图片组件--上传图片之前触发的钩子函数
const handlerUpload = (file:any) => {
  //要求图片是这几种格式
  if(file.type=='image/png'||file.type=='image/jpeg'||file.type=='image/jpg'){
    if(file.size/1024/1024<3){
        return true;
    }else{
        ElMessage({
            type:'error',
            message:'上传文件大小应小于3M'
        })
        return false;
    }
    }else{
        ElMessage({
            type:'error',
            message:'上传文件格式需要是PNG|JPG|JPEG'
        })
    }
}
//计算出当前SPU还未拥有的销售属性
//过滤出还没有的销售属性，并显示在下拉框里任选择，如：全部属性颜色、版本、尺码，已有颜色、版本，过滤出尺码
let unSelectSaleAttr = computed(() =>{
    let unSelectArr = allSaleAttr.value.filter(item=>{
        return saleAttr.value.every(item1=>{
            return item.name!=item1.saleAttrName;
        })
    })
    return unSelectArr;
})
//添加销售属性
const addSaleAttr =() =>{
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象，将来带给服务器
    let newSaleAttr:SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
    }
    //追加新的销售属性
    saleAttr.value.push(newSaleAttr);
    //将选择框置空
    saleAttrIdAndValueName.value='';
}
//属性值按钮的点击事件
const toEdit =(row:SaleAttr) =>{
    row.flag=true;
    row.saleAttrValue=''
}
//表单元素失去焦点的回调
const toLook =(row:SaleAttr) =>{
    //拿到添加的属性值的id和值
    const {baseSaleAttrId, saleAttrValue} = row;
    //整理成服务器需要的形式
    let newSaleAttrValue:SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string) 
    }
    //非法判断
    if((saleAttrValue as string).trim()==''){
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return;
    }
    //判断属性值是否重复
    let repeat = row.spuSaleAttrValueList.find(item=>{
        return item.saleAttrValueName==saleAttrValue;
    })
    if(repeat){
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return;
    }

    row.spuSaleAttrValueList.push(newSaleAttrValue );
    //切换为查看模式
    row.flag=false;
}
//保存修改后的数据
const save = async () =>{
    //整理参数
    //收集照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item:any)=>{
        return {
            imgName: item.name,
            imgUrl:( item.response&&item.response.data) || item.url  //新增就response
        }
    });
    //整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if(result.code==200){
        ElMessage({
            type: 'success',
            message: SpuParams.value.id?'更新成功':'添加成功'
        })
        $emit('changeScene',{flag:0, params:SpuParams.value.id?'update':'add'});
    }else{
        ElMessage({
            type: 'error',
            message: SpuParams.value.id?'更新失败':'添加失败'
        })
    }
    //发请求，添加SPU||更新已有SPU
    //成功
    //失败
}
//添加一个新的SPU初始化的方法
const initAddSpu =async (c3Id:number | string) =>{
    //每次点击添加属性时，之前在添加页面输入的数据都清空
    Object.assign(SpuParams.value,{
        category3Id:'',//收集三级分类的ID
        spuName:'', //SPU的名字
        description:'', //SPU的描述
        tmId:'', //品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //以及图片、属性值、下拉选择的属性值
    imgList.value = [];
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌数据
    let result:AllTradeMark = await reqAllTradeMark();
    let result1:HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储全部品牌数据
    AllTradeMark.value = result.data;
    allSaleAttr.value = result1.data;
}

//对外暴露
defineExpose({initHasSpuData,initAddSpu});
</script>

<style scoped lang="scss">
</style>