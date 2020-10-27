export default {
    path: '/order',
    name: '订单中心',
    icon: 'AccountBookOutlined',
    routes: [
        {
            path: '/order/orderList',
            name: '订单管理',
            component: './order/OrderList/OrderList',
            access: 'MENU_ORDER_ORDERLIST'
        },
        {
            path: '/order/orderDetail',
            name: '订单详情',
            component: './order/OrderDetail/OrderDetail',
            access: 'MENU_ORDER_DETAIL',
            hideInMenu: true
        },
        {
            path: '/order/afterSale',
            name: '发起售后',
            component: './order/AfterSale/afterSale',
            access: 'MENU_AFTER_SALE',
            hideInMenu: true
        },
        {
            path: '/order/rechargeManage',
            name: '充值管理',
            component: './order/RechargeManage',
            access: 'MENU_RECARGE_MANAGE'
        },
        {
            path: '/order/groupOrder',
            name: '拼团订单',
            component: './order/GroupOrder',
            access: 'MENU_GROUP_ORDER'
        },
        {
            path: '/order/afterSaleOrderList',
            name: '售后订单',
            component: './order/AfterSaleOrderList',
            access: 'MENU_AFTER_SALE_ORDERLIS'
        },
        {
            path: '/order/afterSaleManage',
            name: '售后管理',
            component: './order/AfterSaleManage',
            access: 'MENU_AFTER_SALE_MANAGE'
        },
        {
            path: '/order/afterSaleDetail',
            name: '审核操作',
            component: './order/AfterSaleManage/AfterSaleDetail',
            access: 'MENU_AFTER_SALE_DETAIL',
            hideInMenu: true,
        },
        {
            path: '/order/memberInfo',
            name: '会员详细信息',
            component: './order/MemberInfo',
            access: 'MENU_MEMBERINFO',
            hideInMenu: true,
        },
    ]
}