<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>HELLO</h1>
                    <h2>欢迎来到这里！</h2>
                    <el-form-item prop="username">
                        <el-input type="username" :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang='ts'>
import { User, Lock, } from '@element-plus/icons-vue'
import { reactive,ref } from 'vue';
//引入用户小仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router';
import {ElNotification } from 'element-plus';
import { getTime } from '@/utils/time';
let useStore = useUserStore();
//获取路由器
let $router=useRouter();
let $route = useRoute();
//定义变量控制按钮加载效果
let loading= ref(false);
//收集账号密码
let loginForm = reactive({ username: 'admin', password: '111111' });
let loginForms=ref();
//登录按钮回调
const login = async () => {
    //保证所有表单校验后再发请求
    await loginForms.value.validate();
    loading.value=true;
    try{
        await useStore.useLogin(loginForm);
        //编程式导航跳转到展示数据首页
        //登录的时候，若有query参数，就跳转到对应页面，没有就跳转的到首页
        let redirect:any = $route.query.redirect;
        $router.push({path: redirect||'/'});
        ElNotification({
            type:'success',
            message:'欢迎回家',
            title:`HI,${getTime()}好`
        })
        loading.value=false;
    }catch(error){
        loading.value=false;
        ElNotification({
            type:'error',
            message:(error as Error).message
        })
    }
}
//自定义校验规则函数
const validatorUserName=(rule:any, value:any, callback:any)=>{
    //rule：校验规则对象
    //value：表单元素文本内容
    //callback：回调，如果符合条件就放行通过，不符就注入错误提示信息
    if(value.length>=5){
        callback();
    }else{
        callback(new Error("账号长度至少五位"));
    }
}
const validatorPassword=(rule:any,value:any, callback:any)=>{
    //rule：校验规则对象
    //value：表单元素文本内容
    //callback：回调，如果符合条件就放行通过，不符就注入错误提示信息
    if(value.length>=6){
        callback();
    }else{
        callback(new Error("密码长度至少六位"));
    }
}

const rules={
    //规则对象属性
    // username:[{required:true,message:'账号长度至少6位',min:6,max:10,trigger:'change'}],
    // password:[{required:true,message:'密码长度至少6位',min:6,max:15,trigger:'change'}]
    username:[{trigger:'change', validator:validatorUserName}],
    password:[{trigger:'change', validator:validatorPassword}]
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        width: 70%;
        top: 30vh;
        background: url('@/assets/images/login_form.jpg') no-repeat;
        background-size: cover;
        padding: 40px;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            color: white;
            font-size: 20px;
            margin: 20px 0;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>