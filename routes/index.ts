import dashboard from './dashboard';
import product from './product';
import marketingCenter from './marketingCenter';
import order from './order'
const routes = [
    dashboard,
    product,
    marketingCenter,
    order,
    {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        hideInMenu: true,
        component: './welcome',
        noPermission: true
    },
    {
        path: '/component',
        icon: 'CodeOutlined',
        name: '组件测试',
        component: './ComponentPage',
        hideInMenu: true,
    },
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        component: './404',
    }
];

export default routes;
