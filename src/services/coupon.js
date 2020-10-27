import request from './fetch'

/**
 * 优惠券管理
 */
// 获取优惠券列表
export function getCouponList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponDetailService.QueryByPage'
        }
    })
}
// 添加
export function addCoupon(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponDetailService.Add'
        }
    })
}
// 修改
export function updateCoupon(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponDetailService.Edit'
        }
    })
}
// 根据优惠券ID查询详情
export function getCouponDetail(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponDetailService.GetDetailById'
        }
    })
}
// 优惠券添加口令
export function addCouponPassword(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponPasswordService.EditPasswordById'
        }
    })
}

/**
 * 优惠券包
 * @param {*} data 
 */
// 列表获取
export function getCouponPackageList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponPackageService.ListPackageByPage'
        }
    })
}
// 新增
export function addCouponPackage(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponPackageService.AddCouponPackage'
        }
    })
}
// 发券
export function sendCouponPackage(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponPackageService.GetCouponPackage'
        }
    })
}
// 详情 - 包含的优惠券信息
export function getCouponPackageDetail(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponPackageService.ListPackageByPage'
        }
    })
}

/**
 * 用券限制
 */
// 获取列表数据
export function getCouponLimitList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponUseLimitService.QueryByPage'
        }
    })
}
// 批量删除
export function delCouponLimitList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponUseLimitService.RemoveBath'
        }
    })
}
// 新增
export function addCouponLimit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponUseLimitService.AddBath'
        }
    })
}
// 修改
export function updateCouponLimit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponUseLimitService.Edit'
        }
    })
}

/**
 * 优惠券查询 - 领取的优惠券记录
 */
export function getUserCouponList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-coupon',
            interfaceName: 'ICouponUserBossService.ListCouponUserDetail'
        }
    })
}