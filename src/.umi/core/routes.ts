// @ts-nocheck
import { ApplyPluginsType, dynamic } from '/Users/fingo/Downloads/fingo-boss/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: '.umi__plugin-layout__Layout' */'/Users/fingo/Downloads/fingo-boss/src/.umi/plugin-layout/Layout.tsx'), loading: require('@/components/PageLoading/index').default}),
    "routes": [
      {
        "path": "/dashboard",
        "name": "数据中心",
        "icon": "icon-shangpin",
        "routes": []
      },
      {
        "path": "/product",
        "name": "商品中心",
        "icon": "icon-shangpin",
        "routes": [
          {
            "path": "/product/manage",
            "name": "商品管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_LIST",
            "exact": true
          },
          {
            "path": "/product/shelveManage",
            "name": "上下架管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ShelveManage__ShelveManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ShelveManage/ShelveManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_SHELVE_MANAGE",
            "exact": true
          },
          {
            "path": "/product/productPublish",
            "name": "商品发布",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductPublish' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductPublish'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_PUBLISH",
            "exact": true
          },
          {
            "path": "/product/productCheck",
            "name": "商品审核",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductCheck' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductCheck'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_CHECK",
            "exact": true
          },
          {
            "path": "/product/add",
            "name": "新增商品",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductEdit' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductEdit'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_EDIT",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/edit",
            "name": "商品编辑",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductEdit' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductEdit'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_EDIT",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/productSale",
            "name": "商品预售",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductSale__ProductSale' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductSale/ProductSale'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_PRE_SALE",
            "exact": true
          },
          {
            "path": "/product/brandManage",
            "name": "品牌管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__BrandManage__BrandManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/BrandManage/BrandManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_BRAND_MANAGE",
            "exact": true
          },
          {
            "path": "/product/frontCategory",
            "name": "前台类目",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__FrontCategory' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/FrontCategory'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_FONT_CATEGORY",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/categorySort",
            "name": "分类排序",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__CategorySort' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/CategorySort'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_CATEGORY_SORT",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/saleManage",
            "name": "销量管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__SaleManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/SaleManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "BTN_SALES_MANAGE_EDIT_SAVE",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/wordsManage",
            "name": "词库管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__WordsManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/WordsManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_WORDS_MANAGE",
            "exact": true
          },
          {
            "path": "/product/sameProduct",
            "name": "商品同款",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__SameProduct' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/SameProduct'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_SAME_PRODUCT",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/product/productAttribute",
            "name": "属性管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductAttribute' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductAttribute'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_ATTRIBUTE",
            "exact": true
          },
          {
            "path": "/product/backCategory",
            "name": "后台类目",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductCategory' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductCategory'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_BACK_CATEGORY",
            "exact": true
          },
          {
            "path": "/product/priceTemplate",
            "name": "定价模版",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__PriceTemplate__PriceTemplate' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/PriceTemplate/PriceTemplate'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRICE_TEMPLATE",
            "exact": true
          },
          {
            "path": "/product/serviceTemplate",
            "name": "服务模版",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ServiceTemplate__ServiceTemplate' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ServiceTemplate/ServiceTemplate'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_SERVICES_TEMPLATE",
            "exact": true
          },
          {
            "path": "/product/getProductInfo",
            "name": "获取商品信息",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__GetProductInfo' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/GetProductInfo'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_GET_PRODUCT_INFO",
            "exact": true
          },
          {
            "path": "/product/productOperation",
            "name": "商品运营",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__ProductOperation' */'/Users/fingo/Downloads/fingo-boss/src/pages/product/ProductOperation'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_PRODUCT_OPERATION",
            "exact": true
          }
        ]
      },
      {
        "path": "/marketingCenter",
        "name": "运营中心",
        "icon": "FundViewOutlined",
        "routes": [
          {
            "path": "/marketingCenter/activityManage",
            "name": "活动管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__ActivityManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/ActivityManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_ACTIVITY_MANAGE",
            "exact": true
          },
          {
            "path": "/marketingCenter/activityDetail",
            "name": "活动详情",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__ActivityDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/ActivityDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_ACTIVITY_DETAIL",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/marketingCenter/hotSaleDetail",
            "name": "爆款好物",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__HotSaleDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/HotSaleDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_HOT_SALE_DETAIL",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/marketingCenter/flashSaleDetail",
            "name": "限时抢购",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__FlashSaleDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/FlashSaleDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_FLASH_SALE_DETAIL",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/marketingCenter/shake",
            "name": "摇一摇",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__Shake' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/Shake'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_SHAKE",
            "exact": true
          },
          {
            "path": "/marketingCenter/appSet",
            "name": "APP配置",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__AppSet' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/AppSet'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_App_Set",
            "exact": true
          },
          {
            "path": "/marketingCenter/hotSearch",
            "name": "热搜词",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__HotSearch' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/HotSearch'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_HOT_SEARCH",
            "exact": true
          },
          {
            "path": "/marketingCenter/productManage",
            "name": "模块商品管理",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__AppSet__components__productManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/AppSet/components/productManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_MODULE_PRODUCT_MANAGE",
            "exact": true
          },
          {
            "path": "/marketingCenter/coupon",
            "name": "优惠券",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__Coupon' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/Coupon'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_COUPON",
            "exact": true
          },
          {
            "path": "/marketingCenter/couponDetail",
            "name": "优惠券详情",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__CouponDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/CouponDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_COUPON_DETAIL",
            "exact": true,
            "hideInMenu": true
          },
          {
            "path": "/marketingCenter/couponEdit",
            "name": "新增优惠券",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__CouponEdit' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/CouponEdit'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_COUPON_EDIT",
            "exact": true,
            "hideInMenu": true
          },
          {
            "path": "/marketingCenter/couponPackageEdit",
            "name": "新增优惠券包",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MarketingCenter__CouponPackageEdit' */'/Users/fingo/Downloads/fingo-boss/src/pages/MarketingCenter/CouponPackageEdit'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_COUPON_PACKAGE_EDIT",
            "exact": true,
            "hideInMenu": true
          }
        ]
      },
      {
        "path": "/order",
        "name": "订单中心",
        "icon": "AccountBookOutlined",
        "routes": [
          {
            "path": "/order/orderList",
            "name": "订单管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__OrderList__OrderList' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/OrderList/OrderList'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_ORDER_ORDERLIST",
            "exact": true
          },
          {
            "path": "/order/orderDetail",
            "name": "订单详情",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__OrderDetail__OrderDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/OrderDetail/OrderDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_ORDER_DETAIL",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/order/afterSale",
            "name": "发起售后",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__AfterSale__afterSale' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/AfterSale/afterSale'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_AFTER_SALE",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/order/rechargeManage",
            "name": "充值管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__RechargeManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/RechargeManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bRECARGE_MANAGE",
            "exact": true
          },
          {
            "path": "/order/groupOrder",
            "name": "拼团订单",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__GroupOrder' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/GroupOrder'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bGROUP_ORDER",
            "exact": true
          },
          {
            "path": "/order/afterSaleOrderList",
            "name": "售后订单",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__AfterSaleOrderList' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/AfterSaleOrderList'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bAFTER_SALE_ORDERLIS",
            "exact": true
          },
          {
            "path": "/order/afterSaleManage",
            "name": "售后管理",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__AfterSaleManage' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/AfterSaleManage'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bAFTER_SALE_MANAGE",
            "exact": true
          },
          {
            "path": "/order/afterSaleDetail",
            "name": "审核操作",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__AfterSaleManage__AfterSaleDetail' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/AfterSaleManage/AfterSaleDetail'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bAFTER_SALE_DETAIL",
            "hideInMenu": true,
            "exact": true
          },
          {
            "path": "/order/memberInfo",
            "name": "会员详细信息",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__MemberInfo' */'/Users/fingo/Downloads/fingo-boss/src/pages/order/MemberInfo'), loading: require('@/components/PageLoading/index').default}),
            "access": "MENU_\bMEMBERINFO",
            "hideInMenu": true,
            "exact": true
          }
        ]
      },
      {
        "path": "/welcome",
        "name": "welcome",
        "icon": "smile",
        "hideInMenu": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__welcome' */'/Users/fingo/Downloads/fingo-boss/src/pages/welcome'), loading: require('@/components/PageLoading/index').default}),
        "noPermission": true,
        "exact": true
      },
      {
        "path": "/component",
        "icon": "CodeOutlined",
        "name": "组件测试",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ComponentPage' */'/Users/fingo/Downloads/fingo-boss/src/pages/ComponentPage'), loading: require('@/components/PageLoading/index').default}),
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/",
        "redirect": "/welcome",
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/fingo/Downloads/fingo-boss/src/pages/404'), loading: require('@/components/PageLoading/index').default}),
        "exact": true
      }
    ]
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
