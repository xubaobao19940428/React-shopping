import request from './fetch_proto'

// 获取优惠券包详情
export function queryCouponPackageDetails(params) {
    const req = request.create('QueryCouponPackageDetailsReq', params)
    return request({
        serviceName: 'promotion',
        interfaceName: 'CouponService.QueryCouponPackageDetails',
        requestBody: req,
        responseType: 'QueryCouponPackageDetailsResp'
    })
};