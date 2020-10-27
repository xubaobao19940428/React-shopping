import React, { useState } from 'react'
import { Button, Form, Input, Select, Table } from 'antd'
import QueryTable from '@/components/QueryTable'
import { SearchOutlined } from '@ant-design/icons'
import { getUserCouponList } from '@/services/coupon'
import { filterCountry, filterCurrencyUnit, secondTimeFormat } from '@/utils/filter'
import { COUPON_STATUS_ENUM } from '../enum'

const CouponSearchList = (props) => {
    const {countries} = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const columns = [{
        title: "优惠券ID",
        fixed: 'left',
        dataIndex: 'couponId',
        width: 160
    }, {
        title: "优惠券信息",
        fixed: 'left',
        width: 160
    }, {
        title: "优惠码",
        dataIndex: 'userCouponId',
        width: 200
    }, {
        title: "领取用户ID",
        dataIndex: 'userId',
        width: 140
    }, {
        title: "领取方式",
        dataIndex: 'receivingChannel',
        width: 180
    }, {
        title: "到账时间",
        width: 240,
        key: 'createTime',
        render: (_, item) => secondTimeFormat(item.createTime, 'YYYY-MM-DD HH:mm:ss')
    }, {
        title: "优惠券有效期",
        key: 'time',
        width: 280,
        render: (_, item) => (
            `${secondTimeFormat(item.startTime)} ~ ${secondTimeFormat(item.endTime)}`
        )
    }, {
        title: "使用状态",
        width: 140,
        render: (_,item) => COUPON_STATUS_ENUM[item.status]
    }, {
        title: "使用时间"
    }, {
        title: "订单编号",
        width: 140,
        dataIndex: 'orderId'
    }]

    function getDataList (data) {
        let param = {
            ...page,
            name
        }
        param = Object.assign(param, data || {})
        getUserCouponList(param).then(res => {
            if (res.ret.errCode === 0) {
                setTotal(res.data.total)
                setDataList(res.data.list)
            }
        })
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }

    function handleSearch (values) {
        setPage({
            pageNum: 1,
            pageSize: 10
        })
        getDataList(values)
    }

    return (
        <div className="coupon-search-list-wrapper">
            <Form layout="inline" onFinish={handleSearch}>
                <Form.Item label="使用状态" name="status">
                    <Select>
                        {
                            Object.keys(COUPON_STATUS_ENUM).map(status => {
                            <Select.Option value={parseInt(status)} key={status}>{COUPON_STATUS_ENUM[status]}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="订单编号" name="orderNo">
                    <Input/>
                </Form.Item>
                <Form.Item label="领取用户ID" name="userId">
                    <Input/>
                </Form.Item>
                <Form.Item label="优惠券ID" name="couponId">
                    <Input/>
                </Form.Item>
                <Form.Item label="到账时间">
                    <Form.Item name="createTime" noStyle>
                        <DatePicker/>
                    </Form.Item>
                     - 
                    <DatePicker disabled/>
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined />} type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>

            <Table
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={dataList}
                style={{ marginTop: 16 }}
                rowKey={record => record.id}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: () => `共${total}条`,
                    pageSize: page.pageSize,
                    pageSizeOptions: [10, 20, 50, 100],
                    current: page.pageNum,
                    total: total,
                    onChange: changePage
                }}
            />
        </div>
    )
}

export default React.memo(CouponSearchList)