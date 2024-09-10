//小仓库：layout组件相关配置仓库
import { Refresh } from '@element-plus/icons-vue';
import {defineStore} from 'pinia';
let useLayoutSettingStore = defineStore('Setting',{
    state:()=>{
        return {
            fold:false, // 用户控制菜单折叠还是收起
            refresh:false, //仓库这个属性用于控制刷新效果
        }
    }
})

export default useLayoutSettingStore;