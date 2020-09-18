import { request } from '@/api/service'

/**
 * 商户新增或更新
 * @param data
 */
export function merchantService (data) {
  let url = '/admin/merchant/save'
  let method = 'post'
  if (data.id > 0) {
    url = '/admin/merchant/update'
    method = 'put'
  }
  return request({
    url,
    method,
    data
  })
}

/**
 * 内容分类新增或更新
 * @param data
 */
export function infoCategoryService (data) {
  let url = '/admin/info/categorySave'
  let method = 'post'
  if (data.id > 0) {
    url = '/admin/info/categoryUpdate'
    method = 'put'
  }
  return request({
    url,
    method,
    data
  })
}

/**
 * 内容banner新增或更新
 * @param data
 */
export function infoBannerService (data) {
  let url = '/admin/info/bannerSave'
  let method = 'post'
  if (data.id > 0) {
    url = '/admin/info/bannerUpdate'
    method = 'put'
  }
  return request({
    url,
    method,
    data
  })
}

/**
 * 内容新增或更新
 * @param data
 */
export function infoContentService (data) {
  let url = '/admin/info/contentSave'
  let method = 'post'
  if (data.id > 0) {
    url = '/admin/info/contentUpdate'
    method = 'put'
  }
  return request({
    url,
    method,
    data
  })
}
