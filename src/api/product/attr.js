import request from '@/utils/request'

// /admin/product/getCategory1
// 获取一级分类的列表
export const reqGetCategory1List = () => request.get('/admin/product/getCategory1')

// /admin/product/getCategory2/{category1Id}
// 获取二级分类的列表
export const reqGetCategory2List = category1Id => request.get(`/admin/product/getCategory2/${category1Id}`)

// /admin/product/getCategory3/{category2Id}
// 获取三级分类的列表
export const reqGetCategory3List = category2Id => request.get(`/admin/product/getCategory3/${category2Id}`)

// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 获取商品列表
export const reqGetAttrInfoList = categoryListID => request.get(`/admin/product/attrInfoList/${categoryListID.category1ListID}/${categoryListID.category2ListID}/${categoryListID.category3ListID}`)

// /admin/product/saveAttrInfo
// 添加属性与属性值
export const reqAddOrUpdateAttr = data => request({ url: '/admin/product/saveAttrInfo', method: 'POST', data })

// /admin/product/deleteAttr/{attrId}
// 删除属性
export const reqDeleteAttr = attrId => request.delete(`/admin/product/deleteAttr/${attrId}`)
