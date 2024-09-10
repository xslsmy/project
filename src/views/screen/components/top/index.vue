<template>
    <div class="top">
        <div class="left">
            <span class="lbtn" @click="goHome">首页</span>
        </div>
        <div class="center">
            <div class="title">智慧旅游可视化大数据平台</div>
        </div>
        <div class="right">
            <span class="rbtn">统计报告</span>
            <span class="time">2024年8月9日</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import {ref, onMounted, onBeforeUnmount} from 'vue';
// import moment from 'moment';
// let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'));
let timer = ref(0);
let $router = useRouter();
const goHome =() =>{
    $router.push('/home');
}
// onMounted(() => {
//     timer.value = setInterval(()=>{
//         time.value = moment().format('YYYY年MM月DD日 hh:mm:ss');
//     },1000)
// })
// const onBeforeUnmount=() =>{
//     clearInterval(timer.value);
// }
</script>

<style scoped lang='scss'>
.top{
    width: 100%;
    height: 60px;
    display: flex;
    .left{
        flex: 1;
        background: url(../../images/top_left.png) no-repeat;
        background-size: cover;
        .lbtn{
            width: 150px;
            height: 60px;
            float: right;
            background-color: rgb(255, 0, 98);
            background: url(../../images/top_left_l.png) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: white;
        }
    }
    .center{
        flex: 2;
        .title{
            width: 100%;
            height: 78px;
            background: url(../../images/top_right.png) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 78px;
            color: aqua;
            font-size: 50px;
        }
    }
    .right{
        flex: 1;
        background: url(../../images/top_left.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        .rbtn{
            width: 150px;
            height: 60px;
            background: url(../../images/top_left_l.png) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: white;
        }
        .time{
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: white;
        }
    }
}
</style>