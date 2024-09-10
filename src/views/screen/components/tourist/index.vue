<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <P class="bg"></P>
            <p class="right">可预约总量<span>9999</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import {ref, onMounted, onBeforeUnmount} from 'vue';
let people = ref('2580人');
import * as echarts from 'echarts';
import 'echarts-liquidfill';
let charts = ref();
onMounted(()=>{
    let mycharts = echarts.init(charts.value);
    mycharts.setOption({
        title:{
            text:'水球图'
        },
        series:{
            type: 'liquidFill',
            data: [0.6, 0.4],
            waveAnimation:true,//动画
            animationDuration:3,
            animationDurationUpdate:0,
            radius:'80%'
        }
    });
});
</script>

<style scoped lang='scss'>
.box{
    background: url(../../images/bg_s.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
    .top{
        margin-left:20px;
        .title {
            color:white;
            font-size: 20px;
            margin-top: 20px;
        }
        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/bg_1.png);
            background-size:100% 100%;
            margin-top: 15px;
        }
        .right{
            float: right;
            color:white;
            font-size: 20px;
            margin: -20px 10px 0 0;
        }
    }
    .number{
        display: flex;
        margin-top: 30px;
        span{
            flex: 1;
            background: url(../../images/bg2.png);
            background-size:100% 100%;
            color: aquamarine;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 30px;
        }
    }
    .charts{
        width: 100%;
        height: 250px;
    }
}
</style>