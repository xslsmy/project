//服务器全部接口返回的数据类型
export interface ResponseData{
    code: number,
    message: string,
    ok: boolean
}

//SPU数据的类型
export interface SpuData{
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    category3Id: string | number,
    spuSaleAttrList: null | SaleAttr[],
    spuImageList: null | SpuImg[]
}

//数组：元素都是SPU数据类型
export type Records = SpuData[];
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData{
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}

//品牌数据的ts类型
export interface Trademark{
    id: number,
    tmName: string,
    logoUrl: string
}
//品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData{
    data: Trademark[]
}

//商品图片的ts类型
export interface SpuImg{
    id?: number,
    imgName?: string,
    imgUrl?: string
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    name?:string,
    url?:string
}
//已有Spu的照片墙数据的ts类型
export interface SpuHasImg{
    data: SpuImg[]
}

//已有销售属性对象值ts类型
export interface SaleAttrValue{
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
//存储已有销售属性值类型
export type SpuSaleAttrValueList = SaleAttrValue[];

//销售属性对象ts类型
export interface SaleAttr{
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList,
    flag?:boolean,
    saleAttrValue?: string
}
//SPU已有销售属性返回数据的类型
export interface SaleAttrResponseData extends ResponseData{
    data: SaleAttr[]
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr{
    id:number
    name:string
}
export interface HasSaleAttrResponseData extends ResponseData{
    data: HasSaleAttr[]
}

export interface Attr{
    attrId:number|string,  //平台属性的I
    valueId:number|string,  //属性值的ID
}
export interface saleArr{
    saleAttrId:number|string,  //属性ID'saleAttrValueId":numberlstring,//属性值的ID
    skuDefaultImg:string,  //sku图片地址
}
//SKU
export interface SkuData{
    category3Id:string|number,  //三级分类的ID
    spuId:string|number,  //已有的SPU的ID
    tmId:string | number,  //SPU品牌的ID
    skuName:string,  //sku名字
    price:string| number,  //sku价格
    weight:string|number,  //sku重量
    skuDesc:string,  //sku的描述
    skuAttrValueList?:Attr[],  //平台属性的收集
    skuSaleAttrValueList?:saleArr[],  //销售属性
    skuDefaultImg: string,   //图片
}
//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData{
    data: SkuData[]
}