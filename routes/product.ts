export default {
    path: '/product',
    name: '商品中心',
    icon: 'icon-shangpin',
    routes: [
        {
            path: '/product/manage',
            name: "商品管理",
            component: './product/ProductManage',
            access: 'MENU_PRODUCT_LIST'
        },
        {
            path: '/product/shelveManage',
            name: "上下架管理",
            component: './product/ShelveManage/ShelveManage',
            access: 'MENU_SHELVE_MANAGE'
        },
        {
            path: '/product/productPublish',
            name: "商品发布",
            component: './product/ProductPublish',
            access: 'MENU_PRODUCT_PUBLISH'
        },
        {
            path: '/product/productCheck',
            name: "商品审核",
            component: './product/ProductCheck',
            access: 'MENU_PRODUCT_CHECK',
        },

        {
            path: '/product/add',
            name: "新增商品",
            component: './product/ProductEdit',
            access: 'MENU_PRODUCT_EDIT',
            hideInMenu: true
        },
        {
            path: '/product/edit',
            name: "商品编辑",
            component: './product/ProductEdit',
            access: 'MENU_PRODUCT_EDIT',
            hideInMenu: true
        },
        {
            path: '/product/productSale',
            name: "商品预售",
            component: './product/ProductSale/ProductSale',
            access: 'MENU_PRODUCT_PRE_SALE',
        },
        {
            path: '/product/brandManage',
            name: "品牌管理",
            component: './product/BrandManage/BrandManage',
            access: 'MENU_BRAND_MANAGE',
        },
        {
            path: '/product/frontCategory',
            name: "前台类目",
            component: './product/FrontCategory',
            access: 'MENU_PRODUCT_FONT_CATEGORY',
            hideInMenu: true,
        },
        {
            path: '/product/categorySort',
            name: '分类排序',
            component: './product/CategorySort',
            access: 'MENU_PRODUCT_CATEGORY_SORT',
            hideInMenu: true
        },
        {
            path: '/product/saleManage',
            name: "销量管理",
            component: './product/SaleManage',
            access: 'BTN_SALES_MANAGE_EDIT_SAVE',
            hideInMenu: true,
        },
        {
            path: '/product/wordsManage',
            name: "词库管理",
            component: './product/WordsManage',
            access: 'MENU_WORDS_MANAGE',
        },
        {
            path: '/product/sameProduct',
            name: "商品同款",
            component: './product/SameProduct',
            access: 'MENU_SAME_PRODUCT',
            hideInMenu: true,
        },
        {
            path: '/product/productAttribute',
            name: "属性管理",
            component: './product/ProductAttribute',
            access: 'MENU_PRODUCT_ATTRIBUTE',
        },
        {
            path: '/product/backCategory',
            name: "后台类目",
            component: './product/ProductCategory',
            access: 'MENU_PRODUCT_BACK_CATEGORY'
        },
        {
            path: '/product/priceTemplate',
            name: "定价模版",
            component: './product/PriceTemplate/PriceTemplate',
            access: 'MENU_PRICE_TEMPLATE',
        },
        {
            path: '/product/serviceTemplate',
            name: "服务模版",
            component: './product/ServiceTemplate/ServiceTemplate',
            access: 'MENU_SERVICES_TEMPLATE',
        },
        {
            path: '/product/getProductInfo',
            name: "获取商品信息",
            component: './product/GetProductInfo',
            access: 'MENU_GET_PRODUCT_INFO',
        },
        {
            path: '/product/productOperation',
            name: "商品运营",
            component: './product/ProductOperation',
            access: 'MENU_PRODUCT_OPERATION',
        },
    ]
}
