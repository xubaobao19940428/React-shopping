const afterStatusList=[{
    label: '审核中',
    value: 0

}, {
    label: '审核通过',
    value: 1

}, {
    label: '售后成功',
    value: 2

}, {
    label: '售后关闭(用户取消)',
    value: 3

}, {
    label: '售后驳回(拒绝)',
    value: 4

}, {
    label: '售后失败(信息有误，重新填写)',
    value: 5

}, {
    label: '售后驳回(拒绝)',
    value: -1

}]
const statusList={
    'REFUND_SUCCESS': '退款成功',
    'REFUND_FAIL': '退款失败',
    'REFUND_CANCEL': '取消退款',
    'APPLY_REJECTED': '申请驳回',
    'WAIT_REFUND': '退款中'
}
const paywayList={
    'ARTIFICIAL_MONEY': '人工打款',
    'INTEGRAL': '积分支付'
}

export default {
    afterStatusList,
    statusList,
    paywayList,
}