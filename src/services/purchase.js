import request from './fetch_proto'

// 后台类目分组列表
export function PurCateGroupList(params) {
    console.log(params)
    const req = request.create('PurCateGroupQueryReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.GetPurCateGroupList',
        requestBody: req,
        responseType: 'PurCateGroupListResp'
    })
}
// 新增 编辑 后台类目
export function PurCateGroupAdd(params) {
    const req = request.create('PurCateGroupAddReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.SaveAndUpdate',
        requestBody: req,
        responseType: 'PurCateGroupAddResp'
    })
}

/**
 * 类目权限
 */
// 获取类目
export function PurCateGroupQuery(params) {
    const req = request.create('PurCateGroupQueryReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.GetPurCateGroupBuyerList',
        requestBody: req,
        responseType: 'PurCateGroupBuyerListResp'
    })
}
// 获取类目权限详情
export function PurCateGroupBuyerDetail(params) {
    const req = request.create('PurCateGroupBuyerDetailReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.PurCateGroupBuyerDetail',
        requestBody: req,
        responseType: 'PurCateGroupBuyerDetailResp'
    })
}
// 编辑类目权限
export function PurCateGroupEditBuyer(params) {
    const req = request.create('PurCateGroupEditBuyerReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.EditBuyerGroup',
        requestBody: req,
        responseType: 'PurCateGroupEditBuyerResp'
    })
}
// 删除类目权限
export function DeletePurCateGroupBuyer(params) {
    const req = request.create('DeletePurCateGroupBuyerReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.DeletePurCateGroupBuyer',
        requestBody: req,
        responseType: 'DeletePurCateGroupBuyerResp'
    })
}
// 全部类目分组列表
export function PurCateGroupSelect(params) {
    const req = request.create('PurCateGroupSelectReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'PurCateGroupService.GetPurCateGroupSelect',
        requestBody: req,
        responseType: 'PurCateGroupSelectResp'
    })
}