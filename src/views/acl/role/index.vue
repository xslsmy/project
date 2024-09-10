<template>
    <el-card style="margin: 10px; height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索:">
                <el-input placeholder="请你输入搜索职位名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" :disabled="keyword?false:true" @click="search">搜索</el-button>
                <el-button type="primary"size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addRole">添加职位</el-button>
        <el-button type="primary" size="default"  @click="">批量删除</el-button>
        <!-- table展示用户信息-->
        <el-table @selection-change="" style="margin: 10px 0px;" border :data="allRole">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间"align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{row, $index}">
                        <el-button type="primary" size="small" icon="User"  @click="setPermission(row)">分配权限</el-button> <!--如果是上架状态就显示下架按钮↓-->
                        <el-button type="primary" size="small" icon="Edit" title="" @click="updateRole(row)">编辑</el-button>
                        <el-popconfirm :title="`你确定删除${row.roleName}吗？`" width="200px"  @confirm="reqRemoveRole(row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="InfoFilled" title="" @click="">删除</el-button>
                            </template>
                        </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :background="true"
            layout="prev, pager, next, jumper, ->, sizes, total "
            :total="total"
            @current-change="getHasRole"
            @size-change="sizeChange"
        />
    </el-card>
    <!--添加职位与更新已有职位的结构:对话框-->
    <el-dialog v-model="dialogVisite" title="添加职位">
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称">
                <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="dialogVisite=false">取消</el-button>
            <el-button type="primary" size="default" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配角色（职位）</h4>
        </template>
        <template #default>
            <el-tree
                ref="tree"
                style="max-width: 600px"
                :data="menuArr"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="selectArr"
                :props="defaultProps"
            />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer=false">取消</el-button>
                <el-button type="primary" @click="handler">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import {ref, onMounted, reactive, nextTick} from 'vue';
import {reqAllRolelist, reqAddOrUpdateRole,reqAllMenuList, reqSetPermission  } from '@/api/acl/role';
import type {RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
let allRole = ref<Records>([]);
let dialogVisite = ref<boolean>(false);
let form = ref<any>();
let drawer = ref<boolean>(false);
let menuArr = ref<MenuList>([]);
//数组用于存储选中的四级ID
let selectArr = ref<number[]>([]);
let tree = ref<any>();

let RoleParams = reactive<RoleData>({
    roleName: ''
})

//定义响应式数据:收集用户输入进来的关键字，用于搜索功能
let keyword  = ref<string>('');
//获取模板setting仓库 
let settingStore = useLayoutSettingStore();
onMounted(()=>{
    getHasRole();
});
//获取全部已有用户信息
const getHasRole = async(pager=1)=>{
    //默认第一页
    pageNo.value = pager; 
    let result:RoleResponseData = await reqAllRolelist(pageNo.value, pageSize.value, keyword.value);
    if(result.code==200){
        total.value = result.data.total;
        allRole.value = result.data.records;
    }
}
const sizeChange =() =>{
    getHasRole();
}
const addRole =() =>{
    dialogVisite.value = true;
    Object.assign(RoleParams,{
        RoleName: ''
    });
    nextTick(()=>{
        form.value.clearValidate('RoleName');
    })
}
const updateRole =(row: RoleData) =>{
    dialogVisite.value = true;
    Object.assign(RoleParams,row);
    nextTick(()=>{
        form.value.clearValidate('RoleName');
    })
}
const save =async() =>{
    await form.value.validate();
    let result:any = await reqAddOrUpdateRole(RoleParams);
    if(result.code==200){
        drawer.value = false;
        ElMessage({
            type:'success',
            message:RoleParams.id?'更新成功':'添加成功'
        });
        dialogVisite.value = false;
        getHasRole(RoleParams.id?pageNo.value:1);
    }else{
        drawer.value = false;
        ElMessage({
            type:'error',
            message:RoleParams.id?'更新失败':'添加失败'
        })
    }
}
const validatorRoleName =(rule:any, value:any, callBack:any) =>{
    if(value.trim().length>=2){
        callBack();
    }else{
        callBack(new Error('职位名称至少2位'));
    }
}
//表单校验
const rules = {
    roleName: [{required: true, trigger: 'blur', validator: validatorRoleName}]
}
const setPermission =async(row:RoleData) =>{
    drawer.value = true;
    Object.assign(RoleParams,row);
    //根据职位获取权限的数据
    let result:MenuResponseData = await reqAllMenuList((RoleParams.id as number));
    if(result.code == 200){
        menuArr.value =result.data;
        selectArr.value = filterSelectArr(menuArr.value,[]);
    }
}
const filterSelectArr =(allArr:any,initArr:any) =>{
    allArr.forEach((item:any) => {
        if(item.select && item.level==4){
            initArr.push(item.id);
        }
        if(item.children && item.children.length>4){
            filterSelectArr(item.children,initArr);
        }
    });
    return initArr;
}
const defaultProps ={
    children: 'children',
    label: 'name'
}
const search =() =>{
    getHasRole();
    keyword.value = '';
}
const reset =() =>{
    settingStore.refresh = !settingStore.refresh;
}
const handler =async() =>{
    const roleId = RoleParams.id as number;
    //选中节点的ID
    let arr = tree.value.getCheckedKeys();
    //半选中的ID
    let arr1 = tree.value.getHalfCheckedKeys();
    //合并两个数组
    let permissionId = arr.concat(arr1);
    let result:any = await reqSetPermission(roleId,permissionId);
    if(result.code==200){
        drawer.value = false;
        ElMessage({type: 'success', message: '分配权限成功'});
        window.location.reload();
    }
}
const reqRemoveRole =async(id:number) =>{
    let result: any = await reqRemoveRole(id);
    if(result.code ==200){
        //提示信息
        ElMessage({type:'success',message:'删除成功'});
        getHasRole(allRole.value.length>1 ?pageNo.value : pageNo.value - 1)
    }   
}
</script>

<style scoped lang='scss'>
.form{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>