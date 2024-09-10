<template>
    <el-card style="margin: 10px; height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名:">
                <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" :disabled="keyword?false:true" @click="search">搜索</el-button>
                <el-button type="primary"size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="selectIdArr.length?false:true" @click="deleteSelectUser">批量删除</el-button>
        <!-- table展示用户信息-->
        <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间"align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{row, $index}">
                        <el-button type="primary" size="small" :icon="row.isSale==1?'Bottom':'Top'"  @click="setRole(row)">分配角色</el-button> <!--如果是上架状态就显示下架按钮↓-->
                        <el-button type="primary" size="small" icon="Edit" title="" @click="updateUser(row)">编辑</el-button>
                        <el-popconfirm :title="`你确定删除${row.username}吗？`" width="200px"  @confirm="deleteUser(row.id)">
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
            @current-change="getHasUser"
            @size-change="handler"
        />
    </el-card>
    <!--抽屉：控制添加和编辑按钮的抽屉显示-->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{userParams.id?'更新用户':'添加用户'}}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input> <!--:model prop 用来验证收集到的字段-->
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!--抽屉：控制分配角色按钮的抽屉显示-->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色（职位）</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" >
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer1=false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import {ref, onMounted, reactive, nextTick} from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user';
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
let userArr = ref<Records>([]);
let drawer = ref<boolean>(false);
let drawer1 = ref<boolean>(false);
let userParams = reactive<User>({
    name: '',
    username: '',
    password: ''
})
let formRef = ref<any>();
let allRole = ref<AllRole>([]);
let userRole = ref<AllRole>([]);
//存储批量删除的用户的id
let selectIdArr = ref<User[]>([]);
//定义响应式数据:收集用户输入进来的关键字，用于搜索功能
let keyword  = ref<string>('');
//获取模板setting仓库 
let settingStore = useLayoutSettingStore();
onMounted(()=>{
    getHasUser();
});
//获取全部已有用户信息
const getHasUser = async(pager=1)=>{
    //默认第一页
    pageNo.value = pager; 
    let result:UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
    if(result.code==200){
        total.value = result.data.total;
        userArr.value = result.data.records;
    }
}
const handler =() =>{
    getHasUser();
}
const addUser =() =>{
    drawer.value = true;
    Object.assign(userParams,{
        id:0,
        name: '',
        username: '',
        password: ''
    });
    nextTick(()=>{
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    })
}
const updateUser =(row: User) =>{
    drawer.value = true;
    Object.assign(userParams,row);
    nextTick(()=>{
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    })
}
const save =async() =>{
    await formRef.value.validate();
    let result:any = await reqAddOrUpdateUser(userParams);
    if(result.code==200){
        drawer.value = false;
        ElMessage({
            type:'success',
            message:userParams.id?'更新成功':'添加成功'
        })
        // getHasUser(userParams.id?pageNo.value:1);
        //浏览器自动刷新一次，实现：若当前修改的用户名是当前登录的用户，就跳转到登录页面
        window.location.reload();
    }else{
        drawer.value = false;
        ElMessage({
            type:'error',
            message:userParams.id?'更新失败':'添加失败'
        })
    }
}
const cancel =() =>{
    drawer.value = false;
}
const validatorUsername =(rule:any, value:any, callBack:any) =>{
    if(value.trim().length>=5){
        callBack();
    }else{
        callBack(new Error('用户名字至少5位'));
    }
}
const validatorName =(rule:any, value:any, callBack:any) =>{
    if(value.trim().length>=5){
        callBack();
    }else{
        callBack(new Error('用户昵称至少5位'));
    }
}
const validatorPassword =(rule:any, value:any, callBack:any) =>{
    if(value.trim().length>=6){
        callBack();
    }else{
        callBack(new Error('用户密码至少6位'));
    }
}
//表单校验
const rules = {
    username: [{required: true, trigger: 'blur', validator: validatorUsername}],
    name: [{required: true, trigger: 'blur', validator: validatorName}],
    password: [{required: true, trigger: 'blur', validator: validatorPassword}]
}
const setRole = async(row:User) =>{
    Object.assign(userParams,row);
    //获取全部的职位的数据与当前用户已有的职位的数据
    let result:AllRoleResponseData= await reqAllRole((userParams.id as number));
    if(result.code == 200){
        //存储全部的职位
        allRole.value =result.data.allRolesList;//存储当前用户已有的职位
        userRole.value =result.data.assignRoles;//抽屉显示出来
        drawer1.value = true;
    }
}
let checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
const handleCheckAllChange = (val:boolean) => {
  userRole.value = val ? allRole.value : [];
  isIndeterminate.value = false;
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount===allRole.value.length;
    isIndeterminate.value = checkedCount>0 && checkedCount<allRole.value.length;
}
//收集参数
const confirmClick =async() =>{
    let data: SetRoleData = {
        userId: (userParams.id as number),
        roleIdList: userRole.value.map(item=>{
            return (item.id as number); 
        })
    };
    //分配用户的职位
    let result: any = await reqSetUserRole(data);
    if(result.code == 200){
        //提示信息
        ElMessage({type:'success',message:'分配职务成功'});
        //关闭抽屉
        drawer1.value = false;
        //获取更新完毕用户的信息,更新完毕留在当前页
        getHasUser(pageNo.value);
    }
}
//删除某一个用户
const deleteUser =async(userId:number)=>{
    let result: any = await reqRemoveUser(userId);
    if(result.code ==200){
        ElMessage({ type:'success', message:'删除成功'
        });
    }
        getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1);
}
const selectChange =(value:any) =>{
    selectIdArr.value = value;
}
const deleteSelectUser =async() =>{
    //整理批量删除的参数
    let idsList:any = selectIdArr.value.map(item=>{
        return item.id;
    });
    //批量删除的请求
    let result: any =await reqSelectUser(idsList);
    if(result.code==200){
        ElMessage({type:'success',message:'删除成功'});
        getHasUser(userArr.value.length >1 ?pageNo.value : pageNo.value - 1);
    }
}
const search =() =>{
    getHasUser();
    keyword.value = '';
}
const reset =() =>{
    settingStore.refresh = !settingStore.refresh;
}
</script>

<style scoped lang='scss'>
.form{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>