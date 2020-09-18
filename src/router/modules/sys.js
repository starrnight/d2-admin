import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/sys',
  name: 'sys',
  meta,
  redirect: { name: 'sys-index' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'permission/node', name: `${pre}permission-node`, component: _import('sys/permission/node.vue'), meta: { ...meta, title: '权限节点' } },
    { path: 'permission/role', name: `${pre}permission-role`, component: _import('sys/permission/role.vue'), meta: { ...meta, title: '角色管理' } },
    { path: 'users/admin', name: `${pre}users-admin`, component: _import('sys/users/admin.vue'), meta: { ...meta, title: '用户管理' } }
  ])('sys-')
}
