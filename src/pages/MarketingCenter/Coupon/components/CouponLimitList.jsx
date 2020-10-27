import React, { useState, useCallback } from 'react'
import { Button, Pagination, Divider, Modal, message } from 'antd'
import QueryTable from '@/components/QueryTable'
import { PlusOutlined } from '@ant-design/icons'
import { dealShowFileSrc } from '@/utils/utils'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import { getCouponLimitList, delCouponLimitList, addCouponLimit, updateCouponLimit } from '@/services/coupon'
import AddLimitModal from './AddLimitModal'
import { LIMIT_ENUM } from '../enum'
import { splitData } from '@/utils/utils'
import styles from '../index.less'

const { confirm } = Modal
const CouponLimitList = (props) => {
    const {countries} = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [modalData, setModalData] = useState({})
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [delIds, setDelIds] = useState([])
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })

    const columns = [{
        title: "商品ID",
        width: 160,
        dataIndex: 'productId',
        fixed: 'left'
    }, {
        title: "商品信息",
        hideInForm: true,
        width: 240,
        key: 'product',
        render: (_, item) => (
            <div className={styles.productInfoBox}>
                <img width={100} src={dealShowFileSrc(item.productCover)}/>
                {item.productName}
            </div>
        )
    }, {
        title: "国家站点",
        key: 'countryCode',
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
        title: "限制类型",
        key: 'type',
        queryType: "select",
        valueEnum: Object.keys(LIMIT_ENUM).map(limit => {
            return {
                label: LIMIT_ENUM[limit],
                value: parseInt(limit)
            }
        }),
        render: (_, item) => LIMIT_ENUM[item.type]
    }, {
        title: "限制优惠券ID",
        width: 160,
        dataIndex: 'couponId'
    }, {
        title: "更新人",
        hideInForm: true,
        dataIndex: 'operation'
    }, {
        title: "更新时间",
        hideInForm: true,
        key: 'updated',
        render: (_, item) => secondTimeFormat(item.updated)
    }, {
        title: "操作",
        hideInForm: true,
        width: 120,
        render: (_, item) => (
            <>
                <a onClick={() => handleEdit(item)}>编辑</a>
                <Divider type="vertical"/>
                <a onClick={() => handleDel(item)}>删除</a>
            </>
        )
    }]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let ids = selectedRows.map(item => item.id)
            setDelIds(ids)
        }
    }

    function getDataList (data) {
        let param = {
            ...page,
            name
        }
        param = Object.assign(param, data || {})
        getCouponLimitList(param).then(res => {
            if (res.ret.errCode === 0) {
                setTotal(res.data.total)
                setDataList(res.data.list)
            }
        })
    }

    const handleEdit = useCallback((item) => {
        setShowModal(true)
        setModalData(item)
    }, [])

    function handleDel (item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除, 是否继续?',
            onOk() {    
                delCouponLimitList({
                    ids: [item.id]
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getDataList()
                    }
                })
            },
            onCancel() {
                message.info('已取消删除')
            }
        })
    }

    const handleBatchDel = useCallback(() => {
        if (delIds.length) {
            confirm({
                title: '提示',
                content: '此操作将永久删除, 是否继续?',
                onOk() {    
                    delCouponLimitList({
                        ids: delIds
                    }).then(res => {
                        if (res.ret.errCode === 0) {
                            message.success('删除成功')
                            setDelIds([])
                            getDataList()
                        }
                    })
                },
                onCancel() {
                    message.info('已取消删除')
                }
            })
        } else {
            message.info('请先勾选您需删除的项')
        }
    }, [delIds])

    const handleConform = useCallback((data) => {
        if (data.id) {
            updateCouponLimit(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        } else {
            delete data.id
            addCouponLimit(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        }
    }, [])

    const handleAdd = useCallback(() => {
        setModalData({
            countryCode: 'MY',
            type: 3
        })
        setShowModal(true)
    }, [])

    return (
        <div className="coupone-limit-list-wrapper">
            <QueryTable
                tableItemCenter
                dataSource={dataList}
                columns={columns}
                tableProps={{
                    bordered: true,
                    rowKey: 'id',
                    rowSelection: { ...rowSelection }
                }}
                onQuery={(param) => {
                    param.productIdList = param.productId ? splitData(param.productId) : []
                    getDataList(param)
                }}
                buttonRender={<>
                    <Button style={{ marginRight: 8 }} icon={<PlusOutlined />} onClick={handleAdd} type="primary">新增</Button>
                    <Button onClick={handleBatchDel} type="primary">批量删除</Button>
                </>}
            />

            <AddLimitModal showModal={showModal} countries={countries} onCancel={() => {
                setShowModal(false)
            }} confirmLoading={confirmLoading} LIMIT_ENUM={LIMIT_ENUM} modalData={modalData}
                onConfirm={handleConform}
            />
        </div>
    )
}

export default React.memo(CouponLimitList)