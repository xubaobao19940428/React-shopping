const APP_MODE_LIST = [{
    key: 'screen',
    name: '开屏'
}, {
    key: 'home',
    name: '首页'
}, {
    key: 'category',
    name: '类目列表'
}, {
    key: 'PSShopper',
    name: 'PS店铺'
}, {
    key: 'center',
    name: '个人中心'
}, {
    key: 'footIcon',
    name: '底部图标'
}]

const APP_MODE_DETAIL_OBJ = {
    screen: [{
        key: 'ScreenAdList',
        name: '开屏广告',
        isCustomize: true
    }],
    home: [{
        key: 'BannerList',
        name: 'banner列表',
        pageId: 2,
        groupCode: 'INDEX_BANNER',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'ServiceCopyList',
        name: '服务文案',
        pageId: 2,
        groupCode: 'INDEX_SERVER_CONTENT',
        columns: {
            name: '服务文案'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'FunctionalAreaList',
        name: '功能区',
        pageId: 2,
        groupCode: 'INDEX_FUNCTION_LIST',
        columns: {
            name: '标题',
            icon: '图标',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'GirdleAdList',
        name: '腰封',
        pageId: 2,
        groupCode: 'INDEX_MIDDLE_BANNER',
        columns: {
            name: '标题',
            icon: '腰封图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'GongGe',
        name: '爆款好物(Hot Sale)',
        pageId: 2,
        groupCode: 'INDEX_HOT_SALE',
        columns: {
            icon: '广告图',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间',
            spuId: '展示商品ID'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'MarketingCardList',
        name: '营销Card(一行两个)',
        pageId: 2,
        groupCode: 'INDEX_BOTTOM_BANNER_TWO',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            proManage: true,
            status: true
        }
    }, {
        key: 'CardList',
        name: '广告Card(一行三个)',
        pageId: 2,
        groupCode: 'INDEX_BOTTOM_BANNER_THREE',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            proManage: true,
            status: true
        }
    }, {
        key: 'PlatformAd',
        name: '平台广告位(底部腰封)',
        pageId: 2,
        groupCode: 'INDEX_BOTTOM_BANNER',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'QyOptimization',
        name: '首页商品列表',
        pageId: 2,
        groupCode: 'INDEX_PRODUCT_LIST',
        columns: {
            name: '名称'
        },
        btnAccess: {
            edit: true, // 编辑
            delete: true, // 删除
            copy: true,  // 复制
            status: true,  // 显示隐藏
            proManage: true  //商品管理
        }
    }, {
        key: 'ProductListAd',
        name: '列表活动',
        pageId: 2,
        groupCode: 'INDEX_ACTIVE_LIST',
        columns: {
            name: '标题',
            subTitle: '副标题',
            icon: '广告图',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'BombScreenList',
        name: '弹屏广告',
        pageId: 2,
        isCustomize: true
    }, {
        key: 'MarketingModelList',
        name: '营销浮窗',
        pageId: 2,
        isCustomize: true
    }],
    category: [{
        key: 'CategoryOperation',
        name: '类目运营',
        groupCode: 'INDEX_CATEGORIES_LIST',
        pageId: 2,
        isCustomize: true
    }],
    PSShopper: [{
        key: 'PSShopperBannerList',
        name: 'PS店铺banner',
        pageId: 3,
        groupCode: 'PS_SHOP_BANNER',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }],
    center: [{
        key: 'CustomCenterBannerList',
        name: '会员中心banner',
        pageId: 1,
        groupCode: 'USER_CENTER_BANNER',
        columns: {
            name: '标题',
            icon: '广告图',
            personnelType: '曝光人群',
            openType: '跳转类型',
            url: '跳转链接',
            startTime: '开始时间',
            endTime: '结束时间'
        },
        btnAccess: {
            edit: true,
            delete: true,
            copy: true,
            status: true
        }
    }, {
        key: 'ServiceToolsList',
        name: '服务与工具',
        pageId: 1,
        groupCode: 'TOOL_SERVER',
        isCustomize: true
    }],
    footIcon: [{
        key: 'BottomIconList',
        name: '底部图标',
        pageId: 4,
        groupCode: 'COMMON_BOTTOM_ICON',
        isCustomize: true
    }]
}

const APP_PAGE_ENUM = {
    'MEMBER_PAGE': '会员页',
    'BUSINESS_SCHOOL': '商学院',
    'SHOP_CART': '购物车页',
    'USER_CENTER': '个人中心页',
    'MY_INCOME': '我的收益页',
    'MY_TEAM': '我的团队页',
    'MY_COUPON': '优惠券列表页',
    'MY_ORDER': '全部订单页',
    'CUSTOMER_SERVICE': '客服页',
    'ALL_CATEGORY': '全部分类',
    'PRODUCT_DETAILS': '商品详情页',
    'VIRTUAL_RECHARGE': '虚拟充值'
}

const SERVICE_TOOLS_ENUM = {
    'MY_COUPON': '优惠券列表页',
    'CUSTOMER_SERVICE': '客服页',
    'MY_COLLECTION': '我的收藏',
    'SWITCH_COUNTRY': '切换购物站点',
    'SWITCH_LANG': '切换app语言',
    'CHECK_UPDATE': '检查更新',
    'SHIPPING_ADDRESS': '收货地址',
    'SHAKE': '摇一摇'
}

const PERSON_TYPE_OBJ = {
    3: '所有用户',
    1: '新用户',
    2: '老用户'
}

const PERSON_TYPE_LIST = [{
    key: 3,
    name: '所有用户'
}, {
    key: 1,
    name: '新用户'
}, {
    key: 2,
    name: '老用户'
}]
const OPEN_TYPE_LIST = [{
    key: 1,
    name: 'H5'
}, {
    key: 2,
    name: '原生'
}]

const OPEN_TYPE_OBJ = {
    1: 'H5',
    2: '原生'
}

const SERVICE_STATUS_OBJ = {
    1: '启用中',
    2: '已停用'
}

const SERVICE_STATUS_LIST = [{
    key: 1,
    name: '启用'
}, {
    key: 2,
    name: '停用'
}]

export default {
    PERSON_TYPE_LIST,
    PERSON_TYPE_OBJ,
    OPEN_TYPE_LIST,
    OPEN_TYPE_OBJ,
    APP_PAGE_ENUM,
    APP_MODE_LIST,
    APP_MODE_DETAIL_OBJ,
    SERVICE_STATUS_OBJ,
    SERVICE_STATUS_LIST,
    SERVICE_TOOLS_ENUM
}
