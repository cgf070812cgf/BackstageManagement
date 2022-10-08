import request from '@/utils/request'

// /admin/product/baseTrademark/{page}/{limit}
// 获取品牌列表的接口
export const reqGetBaseTrademark = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)

// /admin/product/baseTrademark/save
// 品牌的名称 品牌的Logo id服务器生产不需要传递
// 添加品牌

// /admin/product/baseTrademark/update
// 品牌的名称 品牌的Logo id
// 修改品牌

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 修改品牌
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'PUT', data: tradeMark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'POST', data: tradeMark })
  }
}

// /admin/product/baseTrademark/remove/{id}
// id
// 删除品牌
export const reqDeleteTradeMark = id => request.delete(`/admin/product/baseTrademark/remove/${id}`)
