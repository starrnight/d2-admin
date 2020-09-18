import { request } from '@/api/service'

/**
 * 筛选活动内容
 * @param params
 */
export function infoSelectContent (params) {
  return request({
    url: '/admin/info/selectContent',
    method: 'get',
    params
  })
}

/**
 * 筛选商品
 * @param params
 */
export function infoSelectGoods (params) {
  return request({
    url: '/admin/info/selectGoods',
    method: 'get',
    params
  })
}

/**
 * 获取版本控制
 */
export function getVersion () {
  return request({
    url: '/admin/version/index',
    method: 'get'
  })
}

/**
 * 筛选商品
 * @param data
 */
export function setVersion (data) {
  return request({
    url: '/admin/version/update',
    method: 'post',
    data
  })
}
