<template>
    <div>
        <svg :style="{width,height}">
      <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
    </div>
</template>

<script setup lang='ts'>
defineProps({ //接收父组件传过来的值
    prefix:{
        type:String,
        default:"#icon-"
    },
    name:String,
    color:{
        type:String,
        default:''
    },
    width:{
        type:String,
        default:'16px'
    },
    height:{
        type:String,
        default:'16px'
    }
})
</script>

<style scoped>
    
</style>