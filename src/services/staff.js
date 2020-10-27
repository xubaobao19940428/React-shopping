import request from './fetch_proto'
/**
 * 查询用户所有权限key
 * @export
 * @param {*} params
 * @returns
 */
export function getPermissionKeys(params) {
    const req = request.create('GetPermissionKeysReq', params)
    return request({
        serviceName: 'staff',
        interfaceName: 'SysUserBossService.GetPermissionKeys',
        requestBody: req,
        responseType: 'staff.GetPermissionKeysResp',
    })
    // return request('staff', 'SysUserBossService.GetPermissionKeys', req, 'staff.GetPermissionKeysResp')
};

// 分页查询后台用户
export function listSysUserByPage(params) {
    console.log(params)
    const req = request.create('ListSysUserByPageReq', params)
    return request({
        serviceName: 'staff',
        interfaceName: 'SysUserBossService.ListSysUserByPage',
        requestBody: req,
        responseType: 'staff.ListSysUserByPageResp'
    })
};
