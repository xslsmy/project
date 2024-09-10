//SKU模块接口管理
import request from "@/utils/request";
import type { SkuResponseData,SkuInfoData } from "./type";
//枚举接口
enum API{
    //获取已有的商品的数据-SKU
    SKU_URL = '/admin/product/list/',
    //上架
    SALE_URL='/admin/product/onSale/',
    //下架
    //下架的接口
    CANCELSALE_URL='/admin/product/cancelSale/',
    //获取商品详情的接口
    SKUINFO_URL = '/admin/product/getSkuInfo',
    //删除已有商品
    DELETESKU_URL = '/admin/product/deleteSku/'
}

export const reqSkuList = (page:number, limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+`${page}/${limit}`);

export const reqSaleSku =(skuId:number)=>request.get<any,any>(API.SALE_URL+skuId);
export const reqCancelSale=(skuId:number)=>request.get<any,any>(API.CANCELSALE_URL+skuId);
export const reqSkuInfo=(skuId:number)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+skuId);
export const reqRemoveSku=(skuId:number)=>request.get<any,any>(API.DELETESKU_URL+skuId);

