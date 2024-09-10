<template>
    <div>
        <el-card style="max-width: 1280px">
        <!--卡片顶部添加品牌按钮-->
        <el-button type="primary" size="defult" icon="Plus" @click="addTrademark" v-has="`btn.TradeMark.add`">添加品牌</el-button>
        <!--表格组件，展示看板数据-->
        <el-table style="margin: 10px 0px;" border="true" :data="trademarkArr"> 
            <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称" prop="tmName"></el-table-column>
            <el-table-column label="品牌LOGO">
                <template #="{row, $index}">
                    <img :src="row.logoUrl" alt="" style="height: 100px; width: 100px;"/>
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #="{row, $index}">
                    <el-button type="primary" size="small" icon="Edit" @click="$event => updateTrademark(row)"></el-button>
                    <el-popconfirm :title="`您确定要删除${row.tmName}？`" width="180px" icon="Delete" @confirm="removeTrademark(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器组件
            layout：调整分页器6个子组件的布局-->
        <el-pagination
            @size-change="Sizechange"
            @current-change="getHasTrademark"
            :pager-count="9"
            v-model:current-page="pageNo"
            v-model:page-size="limit"
            :page-sizes="[3, 5, 7, 9]"
            :background="true"
            layout=" prev, pager, next, jumper, ->, sizes, total"
            :total="total"/>
        </el-card>
        <!--对话框组件
            v-model：控制对话框显示与隐藏 true or false title：设置对话框左上角标题-->
        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id?'修改品牌':'添加品牌'">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!--具名插槽：footer-->
            <template #footer>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-button type="primary" size="default" @click="confirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
//引入组合式API函数ref
import {ref, onMounted, reactive, nextTick} from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import { Records,TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type';
import { ElMessage, type UploadProps } from 'element-plus'
//当前页面，约束为数字类型，默认是第1页
let pageNo = ref<number>(1);
//定义每页展示多少条数据
let limit = ref<number>(3);
//存储已有品牌总数据
let total = ref<number>(0);
//存储数据
let trademarkArr = ref<Records>([]); 
//控制对话框显示
let dialogFormVisible = ref<boolean>(false)
//定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
    tmName:'',
    logoUrl:''
})
//获取el-form组件实例
let formRef = ref();
//获取已有品牌数据的接口封装为一个函数：在任何情况下向获取数据，调用次函数即可
const getHasTrademark = async (pager=1) =>{
    pageNo.value=pager;
    let result:TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
    if(result.code==200){
        //存储已有品牌总个数
        total.value=result.data.total;
        trademarkArr.value=result.data.records;
    }
}
//组件挂载完毕钩子--发一次请求，获取第一页，一页有三个品牌数据
onMounted(()=>{
    getHasTrademark();
})

//回调函数,页码发生改变时触发，显示相应页码的数据
// const changePageNo=()=>{
//     getHasTrademark();
// }

//当下拉菜单发生变化时触发，分页器将下拉菜单选中的数据返回
const Sizechange = ()=>{
    //当前选择的每页多少条数据发生变化时将页码归1
    // pageNo.value=1;
    getHasTrademark();
}
//添加品牌按钮的回调
const addTrademark = ()=>{
    dialogFormVisible.value = true;
    //在每次点击添加的时候清空上一次添加的数据，否则打开的时候还会看到之前添加的
    trademarkParams.id = 0;
    trademarkParams.tmName = '';
    trademarkParams.logoUrl = '';
    //在点击添加品牌的时候，清空上次校验后的提示信息，1.ts问号法
    // formRef.value?.clearValidate('tmName');
    // formRef.value?.clearValidate('logoUrl');
    //2.获取更新后的dom
    nextTick(()=>{
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
}

const updateTrademark = (row: TradeMark)=>{
    nextTick(()=>{
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
    dialogFormVisible.value = true;
    // trademarkParams.id = row.id;
    // trademarkParams.tmName = row.tmName;
    // trademarkParams.logoUrl = row.logoUrl;
    //ES6语法：合并对象 (双向绑定)
    Object.assign(trademarkParams,row);
}
//对话框底部取消、确定按钮
const cancel = ()=>{
    dialogFormVisible.value = false;
}
const confirm = async ()=>{
    //发请求之前对整个表单校验
    await formRef.value.validate();
    let result:any = await reqAddOrUpdateTrademark(trademarkParams);
    if(result.code==200){
        dialogFormVisible.value = false;
        ElMessage({
            type: 'success',
            message: trademarkParams.id?'修改品牌成功':'添加品牌成功'
        });
        //再次发请求获取已有全部数据（为了更新总数据条数）
        getHasTrademark(trademarkParams.id?pageNo.value:1);
    }else{
        ElMessage({
            type: 'error',
            message: trademarkParams.id?'修改品牌失败':'添加品牌失败'
        });
        dialogFormVisible.value = false;
    }
}
//上传图片组件--上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //要求图片是这几种格式
  if(rawFile.type=='image/png'||rawFile.type=='image/jpeg'||rawFile.type=='image/jpg'){
    if(rawFile.size/1024/1024<4){
        return true;
    }else{
        ElMessage({
            type:'error',
            message:'上传文件大小应小于4M'
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
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,  //当前上传图片post请求返回的数据
  uploadFile
) => {
  trademarkParams.logoUrl = response.data;
  formRef.value.clearValidate('logoUrl');
}
//品牌自定义检验规则
const validatorTmName = (rule: any, value: any, callBack: any)=>{
    //trim：去掉空格
    if(value.trim().length>=2){
        callBack(); //放行函数
    }else{
        callBack(new Error('品牌名称位数大于等于两位'))
    }
}
const validatorLogoUrl =(rule: any, value: any, callBack: any)=>{
    if(value){
        callBack();
    }else{
        callBack(new Error('需上传LOGO图片'))
    }
}
//表单校验规则
const rules = {
    tmName: [
        {required: true, trigger: 'blur', validator: validatorTmName}
    ],
    logoUrl: [
        {required: true, trigger: 'blur', validator: validatorLogoUrl}
    ]
}
//确认删除
const removeTrademark = async (id: number) =>{
    let result = await reqDeleteTrademark(id);
    if(result.code==200){
        ElMessage({
            type: 'success',
            message :'删除品牌成功'
        });
        getHasTrademark(trademarkArr.value.length>1 ? pageNo.value : pageNo.value-1);
    }else{
        ElMessage({
            type: 'error',
            message :'删除品牌失败'
        })
    }
}
</script>

<style scoped lang='scss'>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>