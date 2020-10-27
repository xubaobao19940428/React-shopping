import React, { useState, useCallback } from 'react'
import { history } from 'umi'
import { Button, Divider, message } from 'antd'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import QueryTable from '@/components/QueryTable'
import SendPackageModal from './SendPackageModal'
import { getCouponPackageList, sendCouponPackage } from '@/services/coupon'

const CouponPackageList = (props) => {
    const {countries} = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const columns = [{
        title: "券包ID",
        width: 140,
        fixed: 'left',
        dataIndex: 'id'
    }, {
        title: '券包名称',
        hideInTable: true,
        key: 'couponName',
        render: (_, item) => item.name && item.name.cn,
        width: 160
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
        render: (_, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: "优惠券内容",
        width: 240,
        hideInForm: true,
        key: 'couponDetail',
        render: (_, item) => (
            <>
                {
                    item.couponDetail && JSON.parse(item.couponDetail).map(coupon => 
                        <>
                            <p>ID: {coupon.couponId}  数量: {coupon.num}</p>
                        </>    
                    )
                }
            </>
        )
    }, {
        title: "发行总量",
        width: 120,
        dataIndex: 'totalNumber',
        hideInForm: true
    }, {
        title: "发行余量",
        width: 120,
        hideInForm: true
    }, {
        title: "每日发行上限",
        dataIndex: 'dayMaxNumber',
        width: 160,
        hideInForm: true
    }, {
        title: "每人限领",
        width: 140,
        hideInForm: true
    }, {
        title: "更新人",
        width: 120,
        dataIndex: 'operation',
        hideInForm: true
    }, {
        title: "更新时间",
        width: 180,
        hideInForm: true,
        key: 'updated',
        render: (_, item) => secondTimeFormat(item.updated)
    }, {
        title: "操作",
        hideInForm: true,
        width: 140,
        render: (_, item) => (
            <>
                <a onClick={() => handleDetail(item)} type="link">详情</a>
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
        getCouponPackageList(param).then(res => {
            if (res.ret.errCode === 0) {
                setTotal(res.data.total)
                setDataList(res.data.list)
            }
        })
    }

    const handleSendConfirm = useCallback((data) => {
        sendCouponPackage(data).then(res => {
            if (res.ret.errCode === 0) {
                message.success('发放成功')
                getDataList()
            }
        })
    }, [])

    const handleDetail = useCallback((item) => {
        history.pushState({
            pathname: 'couponPackageDetail',
            query: {
                packageId: item.id
            }
        })
    }, [])

    return (
        <div className="coupon-package-list-wrapper">
            <QueryTable
                tableItemCenter
                dataSource={dataList}
                columns={columns}
                tableProps={{
                    bordered: true,
                    rowKey: 'id'
                }}
                scroll={{ x: '100%' }}
                onQuery={(param) => {
                    getDataList(param)
                }}
                buttonRender={<>
                    <Button style={{ marginRight: 8 }} icon={<PlusOutlined />} onClick={() => {
                        history.push('couponPackageEdit')
                    }} type="primary">新增</Button>
                    <Button icon={<DownloadOutlined />} onClick={() => setShowModal(true)} type="primary">分发优惠券</Button>
                </>}
            />

            <SendPackageModal showModal={showModal} onCancel={() => setShowModal(false)} onConfirm={handleSendConfirm}/>
        </div>
    )
}

export default React.memo(CouponPackageList)