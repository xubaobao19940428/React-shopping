import request from './fetch_proto'
/**
 *  仓库
 * @export
 * @param {*} params
 * @returns
 */
// 仓库列表分页
export function wmsWarehouse(params) {
    console.log(params)
    const req = request.create('WarehousePageReq', params)
    return request({
        serviceName: 'erp',
        interfaceName: 'WarehouseBossService.WarehousePage',
        requestBody: req,
        responseType: 'warehouse.WarehousePageResp'
    })
};