

import request from './fetch_proto'

/**
 * 供应商简要信息列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function supplierBasePage(params) {
    console.log(params)
    const req = request.create('SupplierBasePageReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'SupplierBossService.SupplierBasePage',
        requestBody: req,
        responseType: 'supplier.SupplierBasePageResp',
        // noToast: true
    })
};