export default {
  path: '/sys',
  title: '系统管理',
  iconSvg: 'd2-crud',
  children: (pre => [
    { path: `${pre}/permission/node`, title: '权限节点', icon: 'home' },
    { path: `${pre}/permission/role`, title: '角色管理', icon: 'home' },
    { path: `${pre}/users/admin`, title: '用户管理', icon: 'home' }
  ])('/sys')
}
