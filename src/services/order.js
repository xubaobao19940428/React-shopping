import request from './fetch_proto'
import { param } from '@/utils/utils'

// 订单列表
export function viewOrderList(params) {
    const req = request.create('GetOrderListRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.GetOrderList',
        requestBody: req,
        responseType: 'GetOrderListResponse'
    })
}

// 订单导出
export function exportOrder(params) {
    const req = request.create('ExportOrderRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.exportOrder',
        requestBody: req,
        responseType: 'ExportOrderResponse'
    })
}

// 订单详情
export function viewOrderDetail(params) {
    console.log(params)
    const req = request.create('GetOrderDetailRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.GetOrderDetail',
        requestBody: req,
        responseType: 'GetOrderDetailResponse'
    })
}

// 根据订单号获取其状态流
export function OrderStatusFlow(params) {
    console.log(params)
    const req = request.create('OrderStatusFlowReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.OrderStatusFlow',
        requestBody: req,
        responseType: 'order.OrderStatusFlowResp'
    })
}

// 自提
export function changeToBuyers(params) {
    console.log(params)
    const req = request.create('ChangeToBuyersReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.ChangeToBuyers',
        requestBody: req,
        responseType: 'order.ChangeToBuyersResp'
    })
}

// 获取子单对应的信息，若是组合商品，展示组合信息
export function SubOrders(params) {
    console.log(params)
    const req = request.create('SubOrdersReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.SubOrders',
        requestBody: req,
        responseType: 'order.SubOrdersResp'
    })
}
// 充值管理
// 获取充值信息列表
export function GetChargeRecordList (params) {
    console.log(params)
    const req = request.create('GetChargeListReq', params)
    return request({
        serviceName: 'polypay',
        interfaceName: 'ChargeService.GetChargeRecordList',
        requestBody: req,
        responseType: 'polypay.GetChargeListResp'
    })
}
// 充值失败重试
export function ReChargeForOrder (params) {
    const req = request.create('ReChargeForOrderReq', params)
    return request({
        serviceName: 'polypay',
        interfaceName: 'ChargeService.ReChargeForOrder',
        requestBody: req,
        responseType: 'polypay.BooleanResp'
    })
}

// 充值退款
export function RefundForCharge (params) {
    const req = request.create('RefundForChargeReq', params)
    return request({
        serviceName: 'polypay',
        interfaceName: 'ChargeService.RefundForCharge',
        requestBody: req,
        responseType: 'polypay.BooleanResp'
    })
}
/**
 * 售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function viewAfterList(params) {
    console.log(params)
    const req = request.create('ViewAfterListRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.ViewAfterList',
        requestBody: req,
        responseType: 'order.ViewAfterListResponse'
    })
}
/**
 * 售后处理
 * @export
 * @param {*} params
 * @returns
 */
export function handlerAfter(params) {
    const req = request.create('HandlerAfterRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.HandlerAfter',
        requestBody: req,
        responseType: 'order.HandlerAfterResponse'
    })
}
/**
 * 拼团订单
 */
// 拼团订单列表
export function groupOrderList (params) {
    const req = request.create('GroupListRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'GroupService.GroupList',
        requestBody: req,
        responseType: 'GroupListResponse'
    })
}

/**
 * 查询可售后订单商品
 * 售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function GetAfterSaleProduct(params) {
    const req = request.create('GetAfterSaleProductRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.GetAfterSaleProduct',
        requestBody: req,
        responseType: 'GetAfterSaleProductResponse'
    })
}

/**
 * 获取所有退款原因
 * */
export function AfterSalePage(params) {
    console.log(params)
    const req = request.create('AfterSalePageRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.AfterSalePage',
        requestBody: req,
        responseType: 'AfterSalePageResponse'
    })
}
/**
 * 批量通过
 * @export
 * @param {*} params
 * @returns
 */
export function BatchApproved(params) {
    console.log(params)
    const req = request.create('BatchApprovedRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.BatchApproved',
        requestBody: req,
        responseType: 'BatchApprovedResponse'
    })
};
/**
 * 批量标记退款
 * @export
 * @param {*} params
 * @returns
 */
export function BatchRefundSuccess(params) {
    console.log(params)
    const req = request.create('BatchRefundSuccessRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.BatchRefundSuccess',
        requestBody: req,
        responseType: 'BatchRefundSuccessResponse'
    })
};
/**
 * 下载售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function AllReturnReason(params) {
    const req = request.create('ReturnReasonReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.AllReturnReason',
        requestBody: req,
        responseType: 'ReturnReasonResp'
    })
}

export function DownloadAfterSalePage(params) {
    console.log(params)
    const req = request.create('AfterSalePageRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.DownloadAfterSalePage',
        requestBody: req,
        responseType: 'DownloadAfterSalePageResponse'
    })
}
/**
 * 售后详情
 * @export
 * @param {*} params
 * @returns
 */
export function AfterSaleInfo(params) {
    console.log(params)
    const req = request.create('AfterSaleInfoRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.AfterSaleInfo',
        requestBody: req,
        responseType: 'AfterSaleInfoResponse'
    })
};
/**
 * 后操作校验接口（主要用于发起售后和售后审核）
 * @export
 * @param {*} params
 * @returns
 */
export function ReturnOperValid(params) {
    console.log(params)
    const req = request.create('ReturnOperValidReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.ReturnOperValid',
        requestBody: req,
        responseType: 'ReturnOperValidResp'
    })
};
/**
 * 同意申请
 * @export
 * @param {*} params
 * @returns
 */
export function AuditPass(params) {
    console.log(params)
    const req = request.create('AuditPassRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.AuditPass',
        requestBody: req,
        responseType: 'AuditPassResponse'
    })
};
/**
 * 拒绝申请
 * @export
 * @param {*} params
 * @returns
 */
export function RejectApply(params) {
    console.log(params)
    const req = request.create('RejectApplyRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.RejectApply',
        requestBody: req,
        responseType: 'RejectApplyResponse'
    })
};
/**
 * 延迟处理
 * @export
 * @param {*} params
 * @returns
 */
export function DelayProcessing(params) {
    console.log(params)
    const req = request.create('DelayProcessingRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.DelayProcessing',
        requestBody: req,
        responseType: 'DelayProcessingResponse'
    })
};
/**
 * 标记退款成功
 * @export
 * @param {*} params
 * @returns
 */
export function RefundSuccess(params) {
    console.log(params)
    const req = request.create('RefundSuccessRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.RefundSuccess',
        requestBody: req,
        responseType: 'RefundSuccessResponse'
    })
};
/**
 * 获取用户银行账户-列表，一个用户有多个银行账户
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserBankList(params) {
    console.log(params)
    const req = request.create('GetUserBankListReq', params)
    return request({
        serviceName: 'polypay',
        interfaceName: 'WithdrawalBossService.GetUserBankList',
        requestBody: req,
        responseType: 'GetUserBankListResp'
    })
}

/**
 * 计算售后价格
        responseType: 'polypay.GetUserBankListResp'
    })
}
/**
 * 修改售后信息
 * @export
 * @param {*} params
 * @returns
 */
export function ComputeReturnAmount(params) {
    console.log(params)
    const req = request.create('ComputeReturnAmountReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.ComputeReturnAmount',
        requestBody: req,
        responseType: 'ComputeReturnAmountResp'
    })
}
export function ModifyAfterSale(params) {
    console.log(params)
    const req = request.create('ModifyAfterSaleRequest', params)
    return request({
        serviceName: 'order',
        interfaceName: 'AfterService.ModifyAfterSale',
        requestBody: req,
        responseType: 'ModifyAfterSaleResponse'
    })
}
