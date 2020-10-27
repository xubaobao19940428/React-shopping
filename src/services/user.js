
import request from './fetch_proto'

/**
 * 获取用户基本信息
 * @export
 * @param {*} params
 * @returns
 */
export function getUserManageInfo (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request({
        serviceName: 'member',
        interfaceName: 'UserBossService.GetUserManageInfo',
        requestBody: req,
        responseType: 'member.UserManageInfoResp'
    })
}
/**
 * 获取用户上级链路
 * @export
 * @param {*} params
 * @returns
 */
export function getFatherChain (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request({
        serviceName: 'member',
        interfaceName: 'UserBossService.GetFatherChain',
        requestBody: req,
        responseType: 'member.GetFatherChainResp'
    })
}
/**
 * 查询用户收货地址信息
 * @export
 * @param {*} params
 * @returns
 */
export function listAddress (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request({
        serviceName: 'member',
        interfaceName: 'UserBossService.ListAddress',
        requestBody: req,
        responseType: 'member.ListAddressResp'
    })
}
/**
 * 获取用户银行账户
 * @export
 * @param {*} params
 * @returns
 */
export function getUserBankList(params) {
    console.log(params)
    const req = request.create('GetUserBankListReq', params)
    return request({
        serviceName: 'polypay',
        interfaceName: 'WithdrawalBossService.GetUserBankList',
        requestBody: req,
        responseType: 'polypay.GetUserBankListResp'
    })
}
/**
 * 根据用户id查询商品收藏
 * @export
 * @param {*} params
 * @returns
 */
export function listUserProductCollect(params) {
    console.log(params)
    const req = request.create('ListUserProductCollectReq', params)
    return request({
        serviceName: 'cart',
        interfaceName: 'CollectService.ListUserProductCollect',
        requestBody: req,
        responseType: 'collect.ListUserProductCollectResp'
    })
};
/**
 * 查询粉丝
 * @export
 * @param {*} params
 * @returns
 */
export function listTeamMemberByPage (params) {
    console.log(params)
    const req = request.create('ListTeamMemberByPageReq', params)
    return request({
        serviceName: 'member',
        interfaceName: 'UserBossService.ListTeamMemberByPage',
        requestBody: req,
        responseType: 'member.ListTeamMemberByPageResp'
    })
}
/**
 * 获取优惠券类型
 * @export 
 * @param {*} params
 * @returns
 */
export function queryCouponType(params) {
    console.log(params)
    const req = request.create('QueryCouponTypeReq', params)
    return request({
        serviceName: 'promotion',
        interfaceName: 'CouponService.QueryCouponType',
        requestBody: req,
        responseType: 'QueryCouponTypeResp'
    })
};

/**
 * 后台查询用户优惠券
 * @export
 * @param {*} params
 * @returns
 */
export function queryUserCouponManage(params) {
    console.log(params)
    const req = request.create('QueryUserCouponManageReq', params)
    return request({
        serviceName: 'promotion',
        interfaceName: 'CouponService.QueryUserCouponManage',
        requestBody: req,
        responseType: 'QueryUserCouponManageResp'
    })
};
/**
 * 分页查询用户订单详情
 * @export
 * @param {*} params
 * @returns
 */
export function memberOrderList(params) {
    console.log(params)
    const req = request.create('MemberOrderListReq', params)
    return request({
        serviceName: 'order',
        interfaceName: 'OrderService.MemberOrderList',
        requestBody: req,
        responseType: 'order.MemberOrderListResp'
    })
}