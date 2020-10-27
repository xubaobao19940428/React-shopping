import request from './fetch_proto'

// 首页商品类目
export function listPreferredCategory(params) {
    const req = request.create('ListPreferredCategoryReq', params)
    // return request('product', 'PreferredCategoryService.ListPreferredCategory', req, 'ListPreferredCategoryResp')
    return request({
        serviceName: 'product',
        interfaceName: 'PreferredCategoryService.ListPreferredCategory',
        requestBody: req,
        responseType: 'ListPreferredCategoryResp'
    })
}
/**
 * 获取以图找货列表
 * @export
 * @param {*} params
 * @returns
 */
export function getChilindoImages(params) {
    console.log(params)
    const req = request.create('GetChilindoImagesReq', params)
    return request({
        serviceName: 'carrier',
        interfaceName: 'CarrierService.GetChilindoImages',
        requestBody: req,
        responseType: 'carrier.GetChilindoImagesResp'
    })
};
//上下架管理
/**
 * 获取上下架管理列表
 * @export
 * @param {*} params
 * @returns
 */
export function getShelveList(params) {
    const req = request.create('GetShelveListReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductBatchOperationService.GetShelveList',
        requestBody: req,
        responseType: 'product.GetShelveListResp'
    })
};
//品牌管理
/**
 * 获取品牌管理列表
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoGet(params) {
    const req = request.create('BrandInfoGetReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductBrandService.BrandInfoGet',
        requestBody: req,
        responseType: 'brand.BrandInfoGetResp'
    })
};

export function synonymWordsList(params) {
    console.log(params)
    const req = request.create('SynonymWordsListReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductSearchBossService.SynonymWordsList',
        request: req,
        responseType:'product.SynonymWordsListResp'
    })
};
/**
 * 创建找低价同款任务

//定价模版
/**
 * 获取定价模版列表
 * @export
 * @param {*} params
 * @returns
 */
export function createSameKindTask(params) {
    console.log(params)
    const req = request.create('CreateSameKindTaskReq', params)
    return request({
        serviceName: 'carrier',
        interfaceName: 'CarrierService.CreateSameKindTask',
        request: req,
        responseType:'carrier.CreateSameKindTaskResp'
    })
};
/**
 * 查看结果
 * */
export function listAllProductPriceTemplate(params) {
    const req = request.create('ListProductPriceTemplateReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductPriceTemplateService.ListProductPriceTemplate',
        requestBody: req,
        responseType: 'ListProductPriceTemplateResp'
    })
};

/**
 * 获取类目列表
 * 商品列表
 * @export
 * @param {*} params
 * @returns
 */
export function sameKindResult(params) {
    console.log(params)
    const req = request.create('SameKindResultReq', params)
    return request({
        serviceName: 'carrier',
        interfaceName: 'CarrierService.SameKindResult',
        request: req,
        responseType:'carrier.SameKindResultResp'
    })
}
export function categoryListGet(params) {
    const req = request.create('CategoryListGetReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductCategoryService.CategoryListGet',
        requestBody: req,
        responseType: 'category.CategoryListGetResp'
    })
}

/**
 * 分页查询售后策略
 * @export
 * @param {*} params
 * @returns
 */
export function listAfterSale(params) {
    const req = request.create('ListAfterSaleReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'AfterSalePledgeService.listAfterSale',
        requestBody: req,
        responseType: 'ListAfterSaleResp'
    })
}

/**
 * 分页查询到货承诺
 * @export
 * @param {*} params
 * @returns
 */
export function listArrival(params) {
    const req = request.create('ListArrivalReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'AfterSalePledgeService.listArrival',
        requestBody: req,
        responseType: 'ListArrivalResp'
    })
}

export function queryProductList(params) {
    console.log(params);
    const req = request.create('ListProductReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductService.ListProduct',
        requestBody: req,
        responseType: 'product.ListProductResp'
    })
};

// 查询有效商品
export function getProductSpu (params) {
    const req = request.create('GetProductSpuReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductService.GetProductSpu',
        requestBody: req,
        responseType: 'product.GetProductSpuResp'
    })
}
/**
 * 获取草稿箱记录创建者id列表
 * @export
 * @param {*} params
 * @returns
 */
export function getDraftOperatorList(params) {
    const req = request.create('GetDraftOperatorListReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductService.GetDraftOperatorList',
        requestBody: req,
        responseType: 'product.GetDraftOperatorListResp',
    })
};
/**
 * 一键翻译选择的属性/属性值
 * @export
 * @param {*} params
 * @returns
 */
export function translateSelectedAttr(params) {
    const req = request.create('TranslateSelectedAttrReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductAttrService.TranslateSelectedAttr',
        requestBody: req,
        responseType: 'attribute.TranslateSelectedAttrResp',
    })
};

/**
 * 仓库列表分页
 * 运费模板
 * @export
 * @param {*} params
 * @returns
 */
export function warehousePage(params) {
    console.log(params)
    const req = request.create('WarehousePageReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'WarehouseBossService.WarehousePage',
        requestBody: req,
        responseType: 'warehouse.WarehousePageResp',
    })
}
// 列表
export function freightTemplateListPage (params) {
    console.log(params)
    const req = request.create('FreightTemplateListPageReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'FreightTemplateService.FreightTemplateListPage',
        requestBody: req,
        responseType: 'freight.FreightTemplateListPageResp',
    })
}
/**
 * 根据id获取属性信息
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGetById(params) {
    console.log(params)
    const req = request.create('ProductAttrGetByIdReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductAttrService.ProductAttrGetById',
        requestBody: req,
        responseType: 'attribute.ProductAttrGetByIdResp',
    })
};

//汇率模版
/**
 * 获取当前使用汇率模板
 * @export
 * @param {*} params
 * @returns
 */
export function getRecentRateTemplate(params) {
    console.log(params)
    const req = request.create('ExchangeGetRecentRateTemplateReq', params)
    return request({
        serviceName: 'i18n',
        interfaceName: 'ExchangeService.ExchangeGetRecentRateTemplate',
        requestBody: req,
        responseType: 'ExchangeGetRecentRateTemplateResp',
    })
};
// 根据sku查询spu信息
export function getSpuInfoBySku (params) {
    const req = request.create('GetSkuInfoBySkuIdReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ProductService.GetSkuInfoBySkuId',
        requestBody: req,
        responseType: 'GetSkuInfoBySkuIdResp'
    })
}
