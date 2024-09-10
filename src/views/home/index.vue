<template>
        <el-card style="margin: 10px;">
            <div class="box">
            <img :src="userStore.avatar" class="avatar"/>
                <div class="bottom">
                    <h3 class="title">{{ getTime() }}好呀 {{userStore.username}}</h3>
                    <p class="subtitle">小雨滴甄选运营平台</p>
                </div>
            </div>
        </el-card>
        <div class="foot">
            <svg-icon name="home" width="500px" height="400px"></svg-icon>
        </div>
</template>

<script setup lang='ts'>
//获取仓库
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
let userStore = useUserStore();
</script>

<style scoped>
.box{
    display: flex;
    .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .title{
        font-size: 30px;
        font-weight: 700;
    }
    .bottom{
        margin: 20px;
        .subtitle{
            font-style: italic;
            color:blue;
            margin-top: 20px;
        }
    }
}
.foot{
    margin-top: 30px;
    display: flex;
    justify-content: center;
}
</style>