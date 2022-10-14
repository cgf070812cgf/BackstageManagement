import request from '@/utils/request'

// GET /admin/product/{page}/{limit}
// 获取spu列表
export const reqGetSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'GET', params: { category3Id }})

// GET /admin/product/getSpuById/{spuId}
// 获取spu信息
export const reqGetSpu = spuId => request.get(`/admin/product/getSpuById/${spuId}`)

// GET /admin/product/baseTrademark/getTrademarkList
// 获取品牌的信息
export const reqGetTradeMarkList = () => request.get('/admin/product/baseTrademark/getTrademarkList')

// GET /admin/product/spuImageList/{spuId}
// 获取spu图片
export const reqGetSpuImgList = spuId => request.get(`/admin/product/spuImageList/${spuId}`)

// GET /admin/product/baseSaleAttrList
// 获取平台的整个销售属性，整个平台的销售属性最多有三个
export const reqGetBaseSaleAttrList = () => request.get('/admin/product/baseSaleAttrList')

// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo
// 修改或者添加spu
export const reqPostAddOrUpdateSpuInfo = spuInfo => request({ url: `/admin/product/${spuInfo.id ? 'updateSpuInfo' : 'saveSpuInfo'}`, data: spuInfo, method: 'POST' })

// DELETE /admin/product/deleteSpu/{spuId}
// 删除spu
export const reqDeleteSpu = spuId => request.delete(`/admin/product/deleteSpu/${spuId}`)

// GET /admin/product/spuImageList/{spuId}
// 获取图片列表
export const reqGetSpuImageList = spuId => request.get(`/admin/product/spuImageList/${spuId}`)

// GET /admin/product/spuSaleAttrList/{spuId}
// 获取销售属性
export const reqGetSpuSaleAttrList = spuId => request.get(`/admin/product/spuSaleAttrList/${spuId}`)

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 获取平台属性
export const reqGetAttrInfoList = categoryListID => request.get(`admin/product/attrInfoList/${categoryListID.category1ListID}/${categoryListID.category2ListID}/${categoryListID.category3ListID}`)

// POST /admin/product/saveSkuInfo
// 保存sku的属性
export const reqPostSaveSkuInfo = skuInfo => request({ url: '/admin/product/saveSkuInfo', method: 'POST', data: skuInfo })

// GET /admin/product/findBySpuId/{spuId}
// 获取sku列表数据的接口
export const reqGetSkuList = spuId => request.get(`/admin/product/findBySpuId/${spuId}`)
