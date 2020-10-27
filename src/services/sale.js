import request from './fetch'

/**
 * 销量配置
 */
// 获取销量配置列表数据
export function getProductSales(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'SalesService.GetProductSales'
        }
    })
}
// 配置累计增长销量
export function setProductSalesConfig(data) {
    return request({
        data: data,
        interface: {
            serverName: 'product-center',
            interfaceName: 'SalesService.SetProductSalesConfig'
        }
    })
}