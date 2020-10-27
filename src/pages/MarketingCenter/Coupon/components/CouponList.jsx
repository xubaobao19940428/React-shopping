import React, { useState, useCallback } from 'react'
import { Button, Pagination, Divider } from 'antd'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { filterCountry, filterCurrencyUnit, secondTimeFormat } from '@/utils/filter'
import { getCouponList } from '@/services/coupon'
import { history } from 'umi'
import QueryTable from '@/components/QueryTable'
import SendCouponModal from './SendCouponModal'
import { COUPON_TYPE_ENUM } from '../enum'

const CouponList = (props) => {
    const {countries} = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [page, setPage] = useState({
        pageNum: 10,
        pageSize: 1
    })
    const columns = [{
        title: "优惠券ID",
        width: 160,
        dataIndex: 'id',
        fixed: "left"
    }, {
        title: "优惠券名称",
        dataIndex: 'name',
        width: 140,
        render: (_, item) => (
            <span>{item.name ? JSON.parse(item.name).cn : '-'}</span>
        )
    }, {
        title: "适用国家",
        dataIndex: 'countryCode',
        queryType: "select",
        valueEnum: countries.map(item => {
            return {
                label: item.nameCn,
                value: item.shortCode
            }
        }),
        width: 160,
        render: (_, item) => filterCountry(item.countryCode)
    }, {
        title: "优惠券类型",
        hideInForm: true,
        key: 'couponType',
        render: (_, item) => COUPON_TYPE_ENUM[item.couponType],
        width: 140
    }, {
        title: "优惠内容",
        key: 'content',
        hideInForm: true,
        render: (_, item) => (
            <>
                {(item.couponType == 1 || item.couponType == 5) && (
                    `${filterCurrencyUnit(item.countryCode)}${item.amount}（满${filterCurrencyUnit(item.countryCode) || ' '}${item.fullAmount || 0}）`
                )}
                {item.couponType == 2 && `优惠${item.amount}%`}
                {item.couponType == 3 && filterCurrencyUnit(item.countryCode) + item.amount}
                {item.couponType == 4 && '免邮'}
            </>
        ),
        width: 240
    }, {
        title: "优惠券有效期",
        key: 'time',
        hideInForm: true,
        render: (_, item) => (
            item.timeType == 1 ? `${secondTimeFormat(item.startTime)} ~ ${secondTimeFormat(item.endTime)}` : `发放之日起${item.day}天`
        ),
        width: 280
    }, {
        title: '发行量',
        hideInForm: true,
        width: 180,
        render: (_, item) => (
            <>
                <p>总发行量：{item.totalNumber}</p>
                <p>已发行量：{item.sendNumber}</p>
                <p>剩余发行量：{item.totalNumber - item.sendNumber}</p>
            </>
        )
    }, {
        title: "每日发行上限",
        hideInForm: true,
        dataIndex: 'dayMaxNumber',
        width: 160
    }, {
        title: "每人限领",
        hideInForm: true,
        dataIndex: 'userLimit',
        width: 140
    }, {
        title: "公开设置",
        queryType: "select",
        dataIndex: 'openType',
        valueEnum: [{
            label: '全部',
            value: null
        }, {
            label: '公开中',
            value: 1
        }],
        width: 140,
        render: (_, item) => item.openType == 1 ? '公开' : '不公开'
    }, {
        title: "转赠设置",
        queryType: "select",
        dataIndex: 'givingType',
        valueEnum: [{
            label: '全部',
            value: null
        }, {
            label: '允许',
            value: 1
        }, {
            label: '禁止',
            value: 2
        }],
        render: (_, item) => item.givingType == 1 ? '允许' : '禁止',
        width: 140
    }, {
        title: "更新人",
        hideInForm: true,
        dataIndex: 'operation',
        width: 120
    }, {
        title: "更新时间",
        hideInForm: true,
        key: 'updated',
        render: (_, item) => secondTimeFormat(item.updated),
        width: 240
    }, {
        title: "操作",
        hideInForm: true,
        width: 200,
        fixed: "right",
        render: (_, item) => (
            <>
                <a onClick={() => handleEdit('edit', item)}>编辑</a>
                <Divider type="vertical"/>
                <a onClick={() => handleDetail(item)}>详情</a>
                <Divider type="vertical"/>
                <a onClick={() => handleEdit('copy', item)}>复制</a>
            </>
        )
    }]

    function getDataList (data) {
        let param = {
            ...page,
            name
        }
        param = Object.assign(param, data || {})
        getCouponList(param).then(res => {
            if (res.ret.errCode === 0) {
                setTotal(res.data.total)
                setDataList(res.data.list)
            }
        })
    }

    const handleDetail = useCallback((item) => {
        history.push({
            pathname: 'couponDetail',
            query: {
                couponId: item.id
            }
        })
    }, [])

    const handleEdit = useCallback((type, item) => {
        history.push({
            pathname: 'couponEdit',
            query: {
                type: type,
                couponId: item.id
            }
        })
    }, [])

    const handleAdd = useCallback(() => {
        history.push({
            pathname: 'couponEdit',
            query: {
                type: 'add'
            }
        })
    }, [])

    return (
        <div className="coupon-manage-list-wrapper">
            <QueryTable
                tableItemCenter
                dataSource={dataList}
                columns={columns}
                tableProps={{
                    bordered: true,
                    rowKey: 'id',
                    scroll: { x: '100%' }
                }}
                onQuery={(param) => {
                    getDataList(param)
                }}
                buttonRender={<>
                    <Button style={{ marginRight: 8 }} icon={<PlusOutlined />} onClick={handleAdd} type="primary" key="add">新增</Button>
                    <Button icon={<DownloadOutlined />} onClick={() => {
                        setShowModal(true)
                    }} type="primary" key="send">发券</Button>
                </>}
            />

            <SendCouponModal showModal={showModal} />
        </div>
    )
}

export default React.memo(CouponList)