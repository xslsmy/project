//引入项目中的全局组件
import Pagination from './Pagination/index.vue';
import SvgIcon from './SvgIcon/index.vue';
import Category from './Category/index.vue'
//引入全局图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponent:any ={SvgIcon, Pagination, Category}
//对外暴露插件对象
export default{
    install(app:any){
        Object.keys(allGlobalComponent).forEach(key=>{
            app.component(key,allGlobalComponent[key]);
        });
        //将element-plus提供图标注册为全局组件
        for(const [key,component] of Object.entries(ElementPlusIconsVue)){
            app.component(key,component)
        }
    }
}