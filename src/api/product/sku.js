import request from '@/utils/request'    

// // 获取图片数据
// export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// // 获取销售属性的数据
// export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// // 获取平台属性数据
// export const reqAttrInfoList = (category1Id,category2Id,category3Id)=> request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// sku列表数据
export const reqSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// 上架
export const reqSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 下架
export const reqCancel = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// sku详情接口
export const reqSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})






