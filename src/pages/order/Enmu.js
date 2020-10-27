const orderStatusEnum =[{
    key: '-1',
    name: '全部订单'
},
{
    key: '0',
    name: '待支付'
},
{
    key: '1',
    name: '待发货'
},
{
    key: '2',
    name: '待收货'
},
{
    key: '3',
    name: '交易成功'
},
{
    key: '4',
    name: '交易失败'
}]

const orderTypeEnum = {
    0: '普通商品订单',
    1: '小礼包商品订单',
    2: '大礼包商品订单',
    4: '拼团订单',
    5: '直播订单',
    8: '虚拟商品订单',
    9: '批发商品订单',
    10: '微商商品订单'
}

const selectProductTypeEnum = {
    0: '商品名称',
    1: '商品ID',
    2: '规格ID'
}

const selectUserTypeEnum = {
    0: '买家ID',
    1: '邀请人ID'
}

const userLevel = {
    2: '(SP)',
    3: '(PS)',
    4: '(AM)',
    5: '(AT)'
}

const statusFilter = {
    0: '待支付',
    1: '待发货',
    2: '待收货',
    3: '交易成功',
    4: '交易关闭',
    5: '部分发货'
}

const payWay = {
    1: 'molpay',
    2: '积分支付',
    3: '信用卡支付',
    4: 'omise',
    5: 'OnlineBanking',
    6: 'COD',
    7: '组合支付'
}

const afterStatus = {
    0:  '审核中',
    1:  '审核通过',
    2:  '售后成功',
    3:  '售后关闭(用户取消)',
    4:  '售后驳回(拒绝)',
    5:  '售后失败(信息有误，重新填写)'
}

const outOrderStatus = {
    0:'-',
    1:'已出库',
    2:'未出库',
    3:'已取消'
}

const ponStatus = {
    WAIT_PURCHASE: "未采购",
    PURCHASED:"待发货",
    SHIPPED:"待入库",
    STORAGED: "已入库",
    CANCELED: "已取消",
    NULL: "",
}

const subStatus = {
    0: '待支付',
    1: '待发货',
    2: '待收货',
    3: '交易成功',
    4: '交易关闭',
    5: '部分发货'
}

export default {
    orderStatusEnum,
    orderTypeEnum,
    selectProductTypeEnum,
    selectUserTypeEnum,
    userLevel,
    statusFilter,
    payWay,
    afterStatus,
    outOrderStatus,
    ponStatus,
    subStatus
}