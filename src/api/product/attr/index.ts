//属性相关API文件
import request from "@/utils/request";
import type { CategoryResponseData,AttrResponseData, Attr} from "./type";
//属性管理模块接口地址
enum API{
    //一级分类
    C1_URL = '/admin/product/getCategory1',
    //二级分类
    C2_URL = '/admin/product/getCategory2/',
    //三级分类
    C3_URL = '/admin/product/getCategory3/',
    //获取分类下已有的属性、属性值
    ATTR_URL = '/admin/product/attrInfoList/',
    //添加或编辑属性、属性值
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除
    DELETEATTR_URL = '/admin/product/deleteAttr/'
}

export const reqC1 = () => request.get<any,CategoryResponseData>(API.C1_URL);
export const reqC2 = (category1Id: number | String) => request.get<any,CategoryResponseData>(API.C2_URL+category1Id);
export const reqC3 = (category2Id:number | string) => request.get<any,CategoryResponseData>(API.C3_URL+category2Id);
export const reqAttr =(category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`);
export const reqAddOrUpdateAttr = (data:Attr) =>request.post<any,any>(API.ADDORUPDATEATTR_URL,data);
export const reqRemoveAttr = (attrId:number) =>request.delete<any,any>(API.DELETEATTR_URL+attrId);