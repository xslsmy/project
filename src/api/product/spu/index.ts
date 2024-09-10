import request from "@/utils/request";
import type {SkuInfoData,SkuData, SpuData,HasSpuResponseData, AllTradeMark, SpuHasImg,SaleAttrResponseData, HasSaleAttrResponseData} from './type'
import { reqUserInfo } from "@/api/user";
enum API{
    //获取已有SPU数据
    HASSPU_URL ='/admin/product/' ,
    //获取全部品牌数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取图片
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取全部已有的销售属性接口地址
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项日全部的销售属性[颜色、版本、尺码]
    ALLSALEATTR_URL="/admin/product/baseSaleAttrList",
    //追加一个新的SPU
    ADDSPU_URL='/admin/product/saveSpuInfo',
    //更新已有的SPU
    UPDATESPU_URL="/admin/product/updateSpuInfo",
    //添加SKU请求
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //查看某个SKU下全部售卖商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
    //删除已有SPU
    REMOVESPU_URL = '/admin/product/deleteSpu/'
}
export const reqHasSpu = (page:number,limit:number,category3Id:number|string)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${page}/${limit}/?category3Id=${category3Id}`);
export const reqAllTradeMark = ()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL);
export const reqSpuImageList = (spuId:number)=>request<any,SpuHasImg>(API.IMAGE_URL+spuId);
export const reqSpuHasSaleAttr = (spuId:number)=>request<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+spuId);
export const reqAllSaleAttr=()=>request.get<any,HasSaleAttrResponseData>(API.ALLSALEATTR_URL);
//data--新增的或已有的SPU对象
export const reqAddOrUpdateSpu=(data:SpuData)=>{
    if(data.id){
        return request.post<any,any>(API.UPDATESPU_URL,data);
    }else{
        return request.post<any,any>(API.ADDSPU_URL,data);
    }
}

export const reqAddSku =(data:SkuData) =>request.post<any,any>(API.ADDSKU_URL,data);
export const reqSkuList =(spuId:number|string) =>request.get<any,SkuInfoData>(API.SKUINFO_URL+spuId)
export const reqRemoveSpu = (SpuId:number|string) =>request.delete<any,any>(API.REMOVESPU_URL+SpuId);