// 所有的大分类
const GROUP_RULE_LIST = [
    {
        name: '活动人群',
        type: 1,
        required: true, // 在外层控制必填，则是指包含的元素中必填一个
        content: [{
            key: 55,
            name: '按新老用户', // 使用用户类型，0 全部 1 新用户 2 老用户
            type: 'radio',
            list: [{
                value: '0',
                label: '所有用户'
            }, {
                value: '1',
                label: '仅新用户'
            }, {
                value: '2',
                label: '仅老用户'
            }]
        }, {
            key: 59,
            name: '按会员等级', // 使用用户等级
            type: 'checkbox',
            list: [
                {
                    value: '2',
                    label: 'SH'
                }, {
                    value: '3',
                    label: 'PS'
                }, {
                    value: '4',
                    label: 'AM'
                }, {
                    value: '5',
                    label: 'AT'
                }
            ]
        }, {
            key: 60,
            name: '按品牌馆会员等级',
            type: 'checkbox',
            list: [
                {
                    value: '2',
                    label: 'SH+'
                }, {
                    value: '3',
                    label: 'PS+'
                }, {
                    value: '4',
                    label: 'AM+'
                }, {
                    value: '5',
                    label: 'AT+'
                }
            ]
        }]
    },
    {
        name: '商品设置',
        type: 2,
        content: [{
            key: 5,
            name: '活动价'
        }]
    },
    {
        name: '促销工具',
        type: 3,
        isPromotion: true,
        content: {
            promotionLabel: {}, // 促销标签
            ruleDesc: {}, // 规则文案
            curType: '1', // 促销类型
            ruleList: [] // 促销规则
        }
    },
    {
        name: '商品限购',
        type: 4,
        content: [{
            key: 150,
            name: '每单最小限购',
            type: 'input'
        }, {
            key: 151,
            name: '每单最大限购',
            type: 'input'
        }, {
            key: 153,
            name: '单日最大限购',
            type: 'input'
        }, {
            key: 152,
            name: '活动期间累计最大限购',
            type: 'input'
        }]
    },
    {
        name: '订单规则',
        type: 6,
        content: [{
            key: 156,
            name: '支付方式',
            type: 'radio'
        }, {
            key: 157,
            name: '最大支付时限',
            type: 'input'
        }]
    }
]

const FOLLOW_TYPE_OBJ = {
    1: '跟随',
    0: '自定义'
}

const ACTIVITY_STATUS_OBJ = {
    1: '未开始',
    2: '预热中',
    3: '进行中',
    4: '已结束'
}

const TIME_STATUS_OBJ = {
    1: '正在抢购',
    2: '即将开始',
    3: '未开始',
    4: '已结束'
}

const NO_DEL_SUBJECT_NAME = ['爆款好物', '限时抢购', '新人0元购', '拼团']

const PERSON_LIST = [{
    value: '0',
    label: '所有用户'
}, {
    value: '1',
    label: '仅新用户'
}, {
    value: '2',
    label: '仅老用户'
}]

const MEMBER_LEVEL_LIST = [{
    value: '2',
    label: 'SH'
}, {
    value: '3',
    label: 'PS'
}, {
    value: '4',
    label: 'AM'
}, {
    value: '5',
    label: 'AT'
}]

const BRAND_LEVEL_LIST = [{
    value: '2',
    label: 'SH+'
}, {
    value: '3',
    label: 'PS+'
}, {
    value: '4',
    label: 'AM+'
}, {
    value: '5',
    label: 'AT+'
}]

const PROMOTION_TYPE_OBJ = {
    1: '满额减',
    2: 'M元N件',
    3: 'M件N折',
    4: 'M件N折封顶',
    5: '满件减',
    6: '满额发券',
    7: '满件发券',
    8: '满件免',
    9: '满件赠品',
    10: '满额赠品',
    11: '满件包邮',
    12: '满额包邮',
    13: '每满额减',
    14: '每满件减'
}

// 不同模板默认值
const TEMPLATE_DEFUALT_VALUE = {
    1: {
        // 日常活动模板
        55: {
            selected: 1,
            param: ['0']
        },
        59: {
            selected: 1,
            param: ['2', '3', '4', '5']
        },
        60: {
            selected: 1,
            param: ['2', '3', '4', '5']
        },
        5: {
            selected: 1,
            param: []
        },
        100: {
            selected: 1,
            param: [],
        },
        150: { // 每单最小限购
            selected: 0,
            param: []
        },
        151: { // 每单最大限购
            selected: 0,
            param: []
        },
        152: { // 活动期间累计最大限购
            selected: 0,
            param: []
        },
        153: { // 单日最大限购
            selected: 0,
            param: []
        },
        156: { // 支付方式
            selected: 0,
            param: []
        },
        157: { // 最大支付时限
            selected: 0,
            param: []
        }
    },
    2: {
        // 今日爆款模板
        55: { // 用户类型
            selected: 0,
            param: []
        },
        59: { // 按用户等级
            selected: 1,
            param: ['2', '3', '4', '5']
        },
        60: { // 按品牌馆会员等级
            selected: 1,
            param: ['2', '3', '4', '5']
        },
        5: { // 活动价
            selected: 1,
            param: []
        },
        100: { // 促销
            selected: 1,
            param: []
        },
        150: { // 每单最小限购
            selected: 0,
            param: []
        },
        151: { // 每单最大限购
            selected: 0,
            param: []
        },
        152: { // 活动期间累计最大限购
            selected: 0,
            param: []
        },
        153: { // 单日最大限购
            selected: 0,
            param: []
        },
        156: { // 支付方式
            selected: 0,
            param: []
        },
        157: { // 最大支付时限
            selected: 0,
            param: []
        }
    },
    3: {
        // 限时特卖模板
        55: {
            selected: 0,
            param: []
        },
        59: {
            selected: 0,
            param: []
        },
        60: {
            selected: 0,
            param: []
        },
        5: {
            selected: 1,
            param: []
        },
        100: {
            selected: 1,
            param: []
        },
        150: { // 每单最小限购
            selected: 0,
            param: []
        },
        151: { // 每单最大限购
            selected: 0,
            param: []
        },
        152: { // 活动期间累计最大限购
            selected: 0,
            param: []
        },
        153: { // 单日最大限购
            selected: 0,
            param: []
        },
        156: { // 支付方式
            selected: 0,
            param: []
        },
        157: { // 最大支付时限
            selected: 0,
            param: []
        }
    },
    4: {
        // 0元购模板
        55: {
            selected: 1,
            param: ['0']
        },
        59: {
            selected: 0,
            param: []
        },
        60: {
            selected: 0,
            param: []
        },
        5: {
            selected: 0,
            param: []
        },
        100: {
            selected: 0,
            param: []
        },
        150: { // 每单最小限购
            selected: 0,
            param: []
        },
        151: { // 每单最大限购
            selected: 0,
            param: []
        },
        152: { // 活动期间累计最大限购
            selected: 0,
            param: []
        },
        153: { // 单日最大限购
            selected: 0,
            param: []
        },
        156: { // 支付方式
            selected: 0,
            param: []
        },
        157: { // 最大支付时限
            selected: 0,
            param: []
        }
    },
    5: {
        // 拼团模板
        55: {
            selected: 0,
            param: []
        },
        59: {
            selected: 0,
            param: []
        },
        60: {
            selected: 0,
            param: []
        },
        5: {
            selected: 1,
            param: []
        },
        100: {
            selected: 0,
            param: []
        },
        150: { // 每单最小限购
            selected: 0,
            param: []
        },
        151: { // 每单最大限购
            selected: 0,
            param: []
        },
        152: { // 活动期间累计最大限购
            selected: 0,
            param: []
        },
        153: { // 单日最大限购
            selected: 0,
            param: []
        },
        156: { // 支付方式
            selected: 0,
            param: []
        },
        157: { // 最大支付时限
            selected: 1,
            param: [2]
        }
    }
}


// const ALL_ELE_OBJ = {
//     2: '活动最低价',
//     4: '是否预热',
//     5: '是否含有活动价',
//     50: '活动起止时间',
//     51: '预热开始时间',
//     53: '使用国家',
//     54: '使用区域ID',
//     55: '使用用户类型',
//     56: '是否存在商品元素',
//     57: '支持商品级别',
//     58: '成团人数',
//     59: '使用用户级别',
//     60: '使用用户品牌馆级别',
//     61: '支持商品类型',
//     100: '促销',
//     101: '使用权益商品',
//     150: '个人本次活动每单起购数',
//     151: ''
// }

export default {
    GROUP_RULE_LIST,
    FOLLOW_TYPE_OBJ,
    ACTIVITY_STATUS_OBJ,
    PROMOTION_TYPE_OBJ,
    NO_DEL_SUBJECT_NAME,
    TIME_STATUS_OBJ,
    TEMPLATE_DEFUALT_VALUE
}
