import request from './fetch_proto'
// 分页查询售后策略
export function listAfterSale (params) {
    console.log(params)
    const req = request.create('ListAfterSaleReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'AfterSalePledgeService.ListAfterSale',
        requestBody: req,
        responseType: 'ListAfterSaleResp'
    })
}
// 分页查询到货承诺
export function listArrival (params) {
    console.log(params)
    const req = request.create('ListArrivalReq', params)
    return request({
        serviceName: 'product',
        interfaceName: 'ArrivalPledgeService.ListArrival',
        requestBody: req,
        responseType: 'ListArrivalResp'
    })
}