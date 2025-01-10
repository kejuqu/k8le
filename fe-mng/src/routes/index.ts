export const routes = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/users',
    name: '用户管理',
    icon: 'UserOutlined',
    component: '@/pages/users',
  },
  {
    path: '/roles',
    name: '角色管理',
    icon: 'UserOutlined',
    component: '@/pages/roles',
  },
  {
    path: '*',
    key: '404',
    name: 'Not Found',
    component: '@/pages/404',
    layout: false,
  },
];
