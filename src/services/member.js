import fingoFetch from './fetch'

// 查询签到列表
export function querySignList(data) {
    return fingoFetch({
        data: data,
        interface: {
            serverName: 'member-center',
            interfaceName: 'ISignService.ListSignRecord',
        }
    }, false);
}