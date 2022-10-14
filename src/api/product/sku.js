import request from '@/utils/request'

// GET /admin/product/list/{page}/{limit}
// sku列表的接口
export const reqGetSkuList = (page, limit) => request.get(`/admin/product/list/${page}/${limit}`)

// GET /admin/product/onSale/{skuId}
// 上架的接口
export const reqGetOnSale = skuId => request.get(`/admin/product/onSale/${skuId}`)

// GET /admin/product/cancelSale/{skuId}
// 下架的接口
export const reqGetCancelSale = skuId => request.get(`/admin/product/cancelSale/${skuId}`)

// GET /admin/product/getSkuById/{skuId}
// 获取sku详情的接口
export const reqGetSkuById = skuId => request.get(`/admin/product/getSkuById/${skuId}`)
