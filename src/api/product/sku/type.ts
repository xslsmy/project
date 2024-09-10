//服务器全部接口返回的数据类型
export interface ResponseData{
    code: number,
    message: string,
    ok: boolean
}
export interface Attr{
    id?:number,
    attrId:number|string,  //平台属性的I
    valueId:number|string,  //属性值的ID
}
export interface saleArr{
    id?:number,
    saleAttrId:number|string,  //属性ID'saleAttrValueId":numberlstring,//属性值的ID
    skuDefaultImg:string,  //sku图片地址
}
//SKU
export interface SkuData{
    category3Id?:string|number,  //三级分类的ID
    spuId?:string|number,  //已有的SPU的ID
    tmId?:string | number,  //SPU品牌的ID
    skuName?:string,  //sku名字
    price?:string| number,  //sku价格
    weight?:string|number,  //sku重量
    skuDesc?:string,  //sku的描述
    skuAttrValueList?:Attr[],  //平台属性的收集
    skuSaleAttrValueList?:saleArr[],  //销售属性
    skuDefaultImg?: string,   //图片
    isSale?: number, //控制商品上架与下架
    id?:number
}

//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
    data:{
        records: SkuData[],
        total :number,
        size:number,
        current: number,
        orders: [],
        optimizeCountsql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}

//获取SKU商品详情
export interface SkuInfoData extends ResponseData{
    data: SkuData
}