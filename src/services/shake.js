import fingoFetch from './fetch'

// 新增或修改跳转链接
export function addTriggerUrl (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IConfigService.AddOrEdit',
        },
        data: data
    })
}
// 获取跳转链接
export function fetchTriggerUrl (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IConfigService.GetByKeyword',
        },
        data: data
    })
}
// 获取展示商品列表
export function showProductList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IProductService.QueryByPage',
        },
        data: data
    })
}
// 添加展示商品
export function addShowProductList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IProductService.Add',
        },
        data: data
    })
}
// 编辑展示商品
export function editShowProductList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IProductService.Edit',
        },
        data: data
    })
}
// 删除展示商品
export function removeShowProductList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IProductService.RemoveById',
        },
        data: data
    })
}
// 新增盒子
export function addBox (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IBoxService.Add',
        },
        data: data
    })
}
// 修改盒子
export function editBox (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IBoxService.Edit',
        },
        data: data
    })
}
// 删除盒子
export function delBox (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IBoxService.RemoveById',
        },
        data: data
    })
}
// 分页获取箱子
export function queryBox (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IBoxService.QueryByPage',
        },
        data: data
    })
}
// 查询箱子奖池
export function queryPrize (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IPrizeService.Query',
        },
        data: data
    })
}
// 新增奖池
export function addPrize (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IPrizeService.Add',
        },
        data: data
    })
}
// 修改奖池
export function editPrize (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IPrizeService.Edit',
        },
        data: data
    })
}
// 删除奖池
export function delPrize (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IPrizeService.RemoveById',
        },
        data: data
    })
}
// 更新奖品库
export function bonusPoolsUpdate (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleBoxService.BonusPoolsUpdate',
        },
        data: data
    }, false)
}
// 获取所有的箱子数据
export function queryAllBoxList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IBoxService.Query',
        },
        data: data
    })
}

/**
 * 商城设置
 * @param {*} data
 */
// 获取列表数据
export function queryGoldList (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-gold',
            interfaceName: 'IRuleService.QueryByPage',
        },
        data: data
    })
}
// 新增商城设置项
export function addGold (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-gold',
            interfaceName: 'IRuleService.Add',
        },
        data: data
    })
}
// 删除商城设置项
export function delGold (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-gold',
            interfaceName: 'IRuleService.RemoveById',
        },
        data: data
    })
}
// 修改商城设置项
export function updateGold (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-gold',
            interfaceName: 'IRuleService.Edit',
        },
        data: data
    })
}

/**
 * 规则配置
 * @param {*} data
 */
// 查询积分规则
export function queryPoint(data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleService.Query',
        },
        data: data
    })
}
// 删除积分规则
export function removePointById(data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleService.RemoveById',
        },
        data: data
    })
}
// 保存积分配置
export function savePoint (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleService.BathAdd',
        },
        data: data
    })
}


// 查询详细规则配置
export function queryPointDetail (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleBoxService.QueryBath',
        },
        data: data
    })
}
// 保存详细规则配置
export function savePointDetail (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IRuleBoxService.BathAdd',
        },
        data: data,
        timeoutNoToast: true
    })
}

/**
 * 比赛时间
 */
// 获取比赛时间
export function queryMatchTime (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IActivityService.QueryByPage',
        },
        data: data
    })
}
// 批量同步比赛时间
export function setBatchMatchTime (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IActivityService.BathAdd',
        },
        data: data
    })
}
// 添加比赛时间
export function setMatchTime (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IActivityService.Add',
        },
        data: data
    })
}
// 修改比赛时间
export function updateMatchTime (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IActivityService.Edit',
        },
        data: data
    })
}
// 删除比赛时间
export function removeMatchTime (data) {
    return fingoFetch({
        interface: {
            serverName: 'market-center',
            interfaceName: 'IActivityService.RemoveById',
        },
        data: data
    })
}
