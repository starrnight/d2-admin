import { request } from '@/api/service'

export function AccountLogin (data) {
  return request({
    url: '/admin/login/in',
    method: 'post',
    data
  })
}

/**
 * @description [ sys ] 菜单和路由相关
 */
export const sysMenuService = {
  /**
     * 获取菜单
     */
  getNav () {
    return request({
      url: '/center-user/v1/permission/menu'
    })
  },
  /**
   * 获取权限前置配置
   */
  getConf () {
    return request({
      url: '/admin/permission/config'
    })
  },
  /**
   * 获取api接口配置
   */
  getApiList () {
    return request({
      url: '/user-center/v1/api-config/list'
    })
  },
  /**
   * 获取api接口配置
   */
  getPermissionList () {
    return request({
      url: '/user-center/v1/api-config/list'
    })
  },
  /**
     * 获取权限
     */
  getPermissions () {
    return request({
      url: '/admin/permission/button'
    })
  },
  /**
   * 保存权限节点
   */
  savePermission (data) {
    let url = '/user-center/v1/permission/insert'
    let method = 'post'
    if (data.id > 0) {
      url = '/user-center/v1/permission/update'
      method = 'put'
    }
    return request({
      url,
      method,
      data
    })
  }
}

/**
 * @description [ sys ] 角色相关
 */
export const sysRoleService = {
  /**
   * 保存权限节点
   */
  saveRole (data) {
    let url = '/user-center/v1/role/insert'
    let method = 'post'
    if (data.id > 0) {
      url = '/user-center/v1/role/update'
      method = 'put'
    }
    return request({
      url,
      method,
      data
    })
  },
  /**
   * 获取角色自身权限菜单
   */
  myMenu () {
    return request({
      url: '/user-center/v1/user/my-info'
    })
  },
  /**
   * 获取站点
   */
  getSiteList () {
    return request({
      url: '/user-center/v1/site/list'
    })
  }
}
/**
 * @description [ sys ] 用户相关
 */
export const sysUserService = {
  /**
     * 获取用户信息
     */
  getInfo () {
    return request({
      url: '/sys/user/info'
    })
  },
  updatePassword (data) {
    return request({
      url: '/admin/admin_user/password',
      method: 'put',
      data
    })
  },
  /**
   * 保存管理员信息
   */
  saveAdmin (data) {
    let url = '/admin/admin_user/save'
    let method = 'post'
    if (data.id > 0) {
      url = '/admin/admin_user/update'
      method = 'put'
    }
    return request({
      url,
      method,
      data
    })
  }
}
