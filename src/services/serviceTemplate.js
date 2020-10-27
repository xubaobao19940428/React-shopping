import request from './fetch'

/**
 * 服务模版
 */
//售后策略 列表
export function ListAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.ListAfterSale'
        }
    })
}

//售后策略 新增
export function AddAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.AddAfterSale'
        }
    })
}

//售后策略 編輯
export function UpdateAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.UpdateAfterSale'
        }
    })
}

//售后策略 获取/明細
export function getAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.GetAfterSale'
        }
    })
}

//售后策略 啟用
export function StartAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.StartAfterSale'
        }
    })
}

//售后策略 停用
export function StopAfterSale(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'AfterSalePledgeService.StopAfterSale'
        }
    })
}

// 到货承诺列表
export function ListArrival(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ArrivalPledgeService.ListArrival'
        }
    })
}
// 新增到货承诺
export function AddArrival(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ArrivalPledgeService.AddArrival'
        }
    })
}
// 编辑到货承诺
export function EditArrival(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ArrivalPledgeService.UpdateArrival'
        }
    })
}
// 启用到货承诺
export function StartArrival(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ArrivalPledgeService.StartArrival'
        }
    })
}
// 停用到货承诺
export function StopArrival(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'ArrivalPledgeService.StopArrival'
        }
    })
}
