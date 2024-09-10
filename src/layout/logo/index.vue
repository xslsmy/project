<template>
    <div class="logo" v-if="setting.logoHidden">
        <img :src="setting.logo" alt="">
        <p>{{setting.title}}</p>
    </div>
</template>

<script setup lang="ts">
defineOptions({name: 'Logo'});
import  setting from '@/setting.ts'
</script>
<style scoped lang='scss'>
    .logo{
        width: 100%;
        height: $base-menu-logo-height;
        color: white;
        display: flex; //让logo和标题在一行显示
        align-items: center;
        padding-left:8px;
        img{
            width: 40px;
            height: 40px;
        }
        p{
            font-size: $base-logo-title-fontSize;
            margin-left: 10px;
        }
    }
</style>