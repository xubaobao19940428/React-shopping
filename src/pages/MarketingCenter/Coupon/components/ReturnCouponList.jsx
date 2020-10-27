import React, { useState, useCallback } from 'react'
import { Button, Pagination, Divider, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import QueryTable from '@/components/QueryTable'
import AddReturnModal from './AddReturnModal'

const { confirm } = Modal
const ReturnCouponList = (props) => {
    const {countries} = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [modalData, setModalData] = useState({})
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [delIds, setDelIds] = useState([])
    const [page, setPage] = useState({
        pageNum: 10,
        pageSize: 1
    })
    const columns = [{
        title: "商品ID"
    }, {
        title: "商品信息",
        hideInForm: true
    }, {
        title: "国家站点",
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
        title: "发放优惠券包ID"
    }, {
        title: "更新人",
        hideInForm: true
    }, {
        title: "更新时间",
        hideInForm: true,
        render: (_, item) => secondTimeFormat(item.updated)
    }, {
        title: "操作",
        hideInForm: true,
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
    }

    const handleEdit = useCallback((item) => {
        setShowModal(true)
        setModalData(item)
    }, [])

    const handleDel = useCallback((item) => {
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
    }, [])

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
        <div className="return-coupon-list-wrapper">
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
                    getDataList(param)
                }}
                buttonRender={<>
                    <Button style={{ marginRight: 8 }} icon={<PlusOutlined />} onClick={handleAdd} type="primary">新增</Button>
                    <Button icon={<DownloadOutlined />} onClick={handleBatchDel} type="primary">批量删除</Button>
                </>}
            />

            <AddReturnModal showModal={showModal}
                countries={countries}
                onCancel={() => setShowModal(false)}
                confirmLoading={confirmLoading}
                modalData={modalData}
                onConfirm={handleConfirm}
            />
        </div>
    )
}

export default React.memo(ReturnCouponList)