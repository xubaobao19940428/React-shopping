import request from './fetch'

//商品管理
/**
 * 新增商品
 * @export
 * @param {*} params
 * @returns
 */
export function createProduct(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductService.CreateProduct',
        }
    })
};
/**
 * 编辑商品
 * @export
 * @param {*} params
 * @returns
 */
export function updateProduct(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductService.ViewProductInfo',
        }
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
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.GetShelveList',
        }
    })
};
/**
 * 批量下架
 * @export
 * @param {*} params
 * @returns
 */
export function batchOffShelve(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.BatchOffShelve',
        }
    })
};
/**
 * 批量上架检查
 * @export
 * @param {*} params
 * @returns
 */
export function batchOnShelveCheck(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.BatchOnShelveCheck',
        }
    })
};
/**
 * 批量上架确认
 * @export
 * @param {*} params
 * @returns
 */
export function batchOnShelve(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.BatchOnShelve',
        }
    })
};
/**
 * 批量采纳建议检查
*/
export function batchAcceptShelveAdviceCheck(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.BatchAcceptShelveAdviceCheck',
        }
    })
};
/**
 * 批量采纳检查
 * @export
 * @param {*} params
 * @returns
 */
export function batchAcceptShelveAdvice(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.BatchAcceptShelveAdvice',
        }
    })
};
/**
 * 改变sku在售状态
 * @export
 * @param {*} params
 * @returns
 */
export function changeSaleStatus(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBatchOperationService.ChangeSaleStatus',
        }
    })
};
/**
 * 属性管理列表
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGet(params) {
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrGet',
        }
    })
};
/**
 * 属性值分页获取
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueGet(params) {
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrValueGet',
        }
    })
};
/**
 * 添加商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrAdd(params) {
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrAdd',
        }
    })
};
/**
 * 根据id获取属性信息
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGetById(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrGetById',
        }
    })
};
/**
 * 修改商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrModify(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrModify',
        }
    })
};
/**
 * 上传文件方式更新属性翻译信息
 * @export
 * @param {*} params
 * @returns
 */
export function uploadAttrTranslate(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.UploadAttrTranslate',
        }
    })
};
/**
 * 上传文件方式更新属性值翻译信息
 * @export
 * @param {*} params
 * @returns
 */
export function uploadAttrValueTranslate(params) {
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.UploadAttrValueTranslate',
        }
    })
};
/**
 * 删除商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrDisable(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrDisable',
        }
    })
};
/**
 * 失效商品属性值
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueDisable(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrValueDisable',
        }
    })
};
/**
 * 下载搜索到的属性数据
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrDownload(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrDownload',
        }
    })
};
/**
 * 属性值下载
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueDownload(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrValueDownload',
        }
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
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBrandService.BrandInfoGet',
        }
    })
};
/**
 * 添加品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoAdd(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBrandService.BrandInfoAdd',
        }
    })
};

/**
 * 编辑品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoModify(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBrandService.BrandInfoModify',
        }
    })
};
/**
 * 删除品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandDelete(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBrandService.BrandDelete',
        }
    })
};
/**
 * 启用, 禁用品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandChangeStatus(params) {
    console.log(params)
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductBrandService.BrandChangeStatus',
        }
    })
};


/**
 * 商品分页获取
 * @export
 * @param {*} params
 * @returns
 */
export function queryProductList(params) {
    console.log(params);
    return request({
        data:params,
        interface:{
            serverName: 'product-center',
            interfaceName: 'ProductService.ListProduct',
        }
    })
}

// 根据sku code获取sku 信息
export function getProductSkuInfoBySkuCode (params) {
    console.log(params)
    return request({
        data: params,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.GetProductSkuInfoBySkuCode'
        }
    })
}


/**
 * 商品预售
 * @param {*} data
 */
// 列表获取
export function getProductSaleList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleList'
        }
    })
}

// 获取对应的类目列表 - cateType为区分
export function categoryList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryListGet'
        }
    })
}
// 删除后台类目
export function delCategory(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryDelete'
        }
    })
}
// 更新后台类目
export function updateCategory(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryUpdate'
        }
    })
}
// 新增后台类目
export function addCategory(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryAdd'
        }
    })
}
// 后台类目排序
export function sortCategory(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryChangeToSort'
        }
    })
}
// 根据属性id批量获取值内容
export function batchGetProductAttr(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.ProductAttrGetByIdBatch'
        }
    })
}

/**
 * 預售活動 - 搜索預售商品
 * @param {*} data
 */
export function getAdvanceSaleSkuInfoGet(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleSkuInfoGet'
        }
    })
}

/**
 * 預售活動 - 新增
 * @param {*} data
 */
export function getAdvanceSaleAdd(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleAdd'
        }
    })
}

/**
 * 預售活動 - 更新
 * @param {*} data
 */
export function getAdvanceSaleUpdate(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleUpdate'
        }
    })
}

/**
 * 預售活動 - 获取某个预售的信息
 * @param {*} data
 */
export function advanceSaleGet(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleGet'
        }
    })
}

/**
 * 預售活動 - 手動推采購單
 * @param {*} data
 */
export function getManualPushAdvancePurchase(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.ManualPushAdvancePurchase'
        }
    })
}

/**
 * 預售活動 - 資料導出
 * @param {*} data
 */
export function getAdvanceSaleDownload(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.AdvanceSaleDownload'
        }
    })
}
/**
 * 获取类目关联属性规格信息
 */
export function getUpperRelatedCategoryById(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.GetUpperRelatedCategoryById'
        }
    })
}
/**
 * 商品状态枚举
 */
export function GetProductEnumInfo(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.GetProductEnumInfo'
        }
    })
}
/**
 * 添加自定义属性
 */
export function addCustomizeAttrValue(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductAttrService.AddCustomizeAttrValue'
        }
    })
}

/*
* 分类排序
*/
// 分类排序的列表数据
export function listCategoryProduct(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.ListCategoryProduct'
        }
    })
}
// 设置人工排序分值
export function changeCategoryProductSort(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.ChangeCategoryProductSort'
        }
    })
}
// 置顶
export function setCategoryProductTop(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.SetCategoryProductTop'
        }
    })
}

// 类目分组列表根据父类id
export function getCategoryGroupList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupListGet'
        }
    })
}

/**
 * 定价模版
 */
//获取所有商品价格模版
export function listPriceTemplate(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductPriceTemplateService.ListProductPriceTemplate'
        }
    })
}

//新增定价模版
export function addPriceTemplate(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductPriceTemplateService.AddNewProductPriceTemplate'
        }
    })
}

//更新定价模版
export function updatePriceTemplate(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SynonymWordsList'
        }
    })
}

//停用 启用 定价模板
export function changeEffectStatus(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SynonymWordsDelete'
        }
    })
}

/**
 * 词库管理
 */
// 同义词列表
export function synonymWordsList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SynonymWordsList'
        }
    })
}
// 同义词新增或编辑
export function synonymWordsAddOrEdit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SynonymWordsAddOrEdit'
        }
    })
}
// 同义词删除
export function synonymWordsDelete(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SynonymWordsDelete'
        }
    })
}
// 敏感词列表
export function sensitiveWordsList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SensitiveWordsList'
        }
    })
}
// 敏感词新增或编辑
export function sensitiveWordsAddOrEdit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SensitiveWordsAddOrEdit'
        }
    })
}
// 敏感词删除
export function sensitiveWordsDelete(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductSearchBossService.SensitiveWordsDelete'
        }
    })
}
/**
*  前台类目分组
*  @params
*/
export function categoryGroupList(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupListGet'
        }
    })
}
//新增前台类目分组
export function frontCategoryGroupAdd(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryAdd'
        }
    })
}
/**
 * 前台类目显示隐藏
 */
export function categoryHiddenOrShow(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryHiddenOrShow'
        }
    })
}
/**
 * 前台类目更新
 */
export function categoryUpdate(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryUpdate'
        }
    })
}
/**
 * 前台类目排序
 */
export function frontCategorySort(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryChangSort'
        }
    })
}
/**
 * 前台二级类目星标
 */
export function frontCategoryStar(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryStar'
        }
    })
}
/**
 * 前台一级类目分组管理
 */
export function frontCategoryGroupListGet(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupListGet'
        }
    })
}
/**
 * 前台一级类目分组新增或者编辑
 */
export function frontCategoryGroupAddOrUpdate(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupAddOrUpdate'
        }
    })
}
/**
 * 前台一级类目分组删除
 */
export function frontCategoryGroupDelete(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupDelete'
        }
    })
}
/**
 * 前台一级类目分组排序
 */
export function frontCategoryGroupSort(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupSort'
        }
    })
}
/**
 * 前台一级类目分组详情
 */
export function frontCategoryGroupGet(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CategoryGroupGet'
        }
    })
}
/**
 * 前台类目copy
 */
export function frontCopyFrontCategory(data) {
    console.log(data)
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductCategoryService.CopyFrontCategory'
        }
    })
}

/**
 * 一键上传 操作草稿，
 */
// 获取草稿箱记录
export function listDrafts(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.ListDrafts'
        }
    })
}
// 删除草稿
export function deleteDrafts(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.DeleteDrafts'
        }
    })
}
// 获取草稿箱记录的对应创建者数据
export function getDraftOperatorList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ProductService.GetDraftOperatorList'
        }
    })
}
