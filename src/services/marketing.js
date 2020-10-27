import request from './fetch'

// APP配置

/**
 * 闪屏广告
 * @param {*} data
 */
// 列表获取
export function getScreenList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IStartPageService.QueryByPage'
        }
    })
}
// 修改
export function screenEdit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IStartPageService.Edit'
        }
    })
}
// 单个删除
export function screenDel(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IStartPageService.RemoveById'
        }
    })
}
// 批量删除
export function screenBatchDel(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IStartPageService.RemoveByIdBath'
        }
    })
}
// 新增
export function screenAdd(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IStartPageService.Add'
        }
    })
}

/**
 * 弹窗模块 + 浮窗
 */
// 列表获取
export function getWindowList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IWindowService.QueryByPage'
        }
    })
}
// 新增
export function windowAdd(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IWindowService.Add'
        }
    })
}
// 删除
export function windowDel(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IWindowService.RemoveById'
        }
    })
}
// 编辑
export function windowEdit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IWindowService.Edit'
        }
    })
}
// 上下架 - 隐藏、显示
export function windowEditStatus(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IWindowService.EditStatus'
        }
    })
}


/**
 * 首页配置
 * @param {*} data
 */
// 页面ID查询模块信息
export function getModuleInfo(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleService.Query'
        }
    })
}
// 列表获取
export function getHomeModuleList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.QueryByPage'
        }
    })
}
// 新增
export function addHomeModuleItem(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.Add'
        }
    })
}
// 修改
export function editHomeModuleItem(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.Edit'
        }
    })
}
// 删除
export function delHomeModuleItem(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.RemoveById'
        }
    })
}
// 排序
export function sortHomeModuleItem(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.EditSort'
        }
    })
}
// 显示隐藏
export function statusHomeModuleItem(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IComponentService.EditStatus'
        }
    })
}
// 查询APP首页的模块排序内容
export function getHomeSortItems(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleService.QueryByPage'
        }
    })
}
// 设置APP首页的模块排序
export function homeSort(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleService.EditSort'
        }
    })
}

/**
 * 热搜词
 */
// 获取列表数据
export function getHotSearchList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IHotSearchService.QueryByPage'
        }
    })
}
// 修改
export function hotSearchEdit(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IHotSearchService.Edit'
        }
    })
}
// 删除
export function hotSearchDel(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IHotSearchService.Remove'
        }
    })
}
// 排序
export function hotSearchSort(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IHotSearchService.EditSort'
        }
    })
}
// 添加
export function hotSearchAdd(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IHotSearchService.Add'
        }
    })
}

/**
 * 活动管理
 */
// 获取模板列表
export function getTemplateList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.ListActivityTemplate'
        }
    })
}

// 获取专题列表
export function getSubjectList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySubjectService.ListActivitySubject'
        }
    })
}

// 添加专题
export function addSubject(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySubjectService.Add'
        }
    })
}

// 修改专题
export function editSubject(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySubjectService.Edit'
        }
    })
}

// 删除专题
export function delSubject(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySubjectService.Delete'
        }
    })
}

// 创建活动
export function addActivity(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.AddActivity'
        }
    })
}
// 获取活动列表
export function getActivityList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.ListActivity'
        }
    })
}

// 获取活动基本信息
export function getActivityBasicInfo(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.GetActivityBaseInfo'
        }
    })
}
// 修改活动基本信息
export function updateActivityBasicInfo(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.EditActivityBaseInfo'
        }
    })
}

// 获取活动的分组信息
export function getActivityGroup(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityGroupService.ListAllActivityGroup'
        }
    })
}
// 修改分组信息
export function updateActivityGroup(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityGroupService.Modify'
        }
    })
}

// 获取活动规则值
export function getActivityRule(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.GetActivityRuleInfo'
        }
    })
}
// 修改活动规则值
export function editActivityRule(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivityBossService.EditActivityRule'
        }
    })
}

// 添加活动的商品
export function addActivityProduct(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.BatchAddSpu'
        }
    })
}
// 获取活动下的商品列表
export function getActivityProductList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.ListSpuByPage'
        }
    })
}
// 批量下线商品
export function batchOffliceActivityProduct(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.Offline'
        }
    })
}
// 批量编辑商品
export function batchUpdateActivityProduct(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.BatchEditSpu'
        }
    })
}
// 单个编辑商品
export function updateActivityProduct(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.EditSpu'
        }
    })
}
// 获取活动商品SKU信息
export function getActivityProductSkuList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.ListAllSkuBySpuId'
        }
    })
}

// 根据时间段批量添加商品 - 适用于限时抢购 爆款好物
export function addActivityProductListByTime(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.BatchAddSpuByTime'
        }
    })
}
// 获取限时抢购时间轴
export function getTimeList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.ListTimeAxis'
        }
    })
}
// 根据时间段获取商品
export function getActivityProductListByTime(data) {
    return request({
        data: data,
        interface: {
            serverName: 'market-activity',
            interfaceName: 'IActivitySpuService.ListSpuInTimeSlot'
        }
    })
}

/*
 * 商品管理
 */
// 获取列表数据
export function getModuleProList(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleProductService.QueryByPage'
        }
    })
}
// 添加
export function addModulePro(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleProductService.Add'
        }
    })
}
// 批量删除
export function delBatchModulePro(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleProductService.RemoveByIdBath'
        }
    })
}
// 排序
export function sortModulePro(data) {
    return request({
        data: data,
        interface: {
            serverName: 'app-center',
            interfaceName: 'IModuleProductService.EditSort'
        }
    })
}
