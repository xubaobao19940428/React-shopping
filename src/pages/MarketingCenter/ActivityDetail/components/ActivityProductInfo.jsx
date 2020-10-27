import React, { useState, useEffect } from 'react'
import { Input, Button, Form, Table, Modal, message, Select } from 'antd'
import { dealShowFileSrc } from '@/utils/utils'
import { secondTimeFormat, filterCountry, filterCurrencyUnit } from '@/utils/filter'
import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined } from '@ant-design/icons'
import BatchEditModal from './BatchEditModal'
import { addActivityProduct, 
        updateActivityProduct, 
        getActivityProductSkuList, batchUpdateActivityProduct, batchOffliceActivityProduct } from '@/services/marketing'
import AddProduct from '../../AppSet/components/ProductManageModal'
import ProductEditModal from './ProductEditModal'
import moment from 'moment'

/**
 * 商品列表
 * @param {}} props 
 */

const { confirm } = Modal
const ActivityProductInfo = (props) => {
    const { languages, groupList, activityId, countryCode, getList, preheat, productList, name, total } = props
    const [selectIds, setSelectIds] = useState([])
    const [selectItems, setSelectItems] = useState([])
    const [dataList, setDataList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editData, setEditData] = useState({})
    const [modalLoading, setModalLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    useEffect(() => {
        let list = JSON.parse(JSON.stringify(productList))
        setDataList(list)
    }, [productList])

    const columns = [{
        title: '商品信息',
        width: 240,
        key: 'product',
        fixed: 'left',
        render: (text, item) => (
            <div className="product-info-box">
                <img width={100} src={dealShowFileSrc(item.image)}/>
                {item.title}
            </div>
        )
    }, {
        title: '商品ID',
        key: 'id',
        dataIndex: 'spuId',
        width: 200,
        align: 'center'
    }, {
        title: '预热时间',
        key: 'preheatStartTime',
        width: 200,
        align: 'center',
        render: (text, item) => (
            secondTimeFormat(item.preheatStartTime)
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        width: 200,
        align: 'center',
        render: (text, item, index) => (
            secondTimeFormat(item.startTime)
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        align: 'center',
        width: 200,
        render: (text, item, index) => (
            secondTimeFormat(item.endTime)
        )
    }, {
        title: '最低活动价',
        width: 120,
        key: 'minActivityPrice',
        align: 'center',
        render: (text, item) => (
            `${item.minActivityPrice} ${filterCurrencyUnit(countryCode)}`
        )
    }, {
        title: '最高活动价',
        width: 120,
        key: 'maxActivityPrice',
        align: 'center',
        render: (text, item) => (
            `${item.maxActivityPrice} ${filterCurrencyUnit(countryCode)}`
        )
    }, {
        title: '活动库存',
        width: 100,
        key: 'activityStock',
        dataIndex: 'activityStock'
    }, {
        title: '商品角标',
        width: 140,
        key: 'productCorner',
        dataIndex: 'productCorner',
        render: (text, item) => (
            item.productCorner && item.productCorner.cn
        )
    }, {
        title: '营销文案',
        width: 140,
        key: 'promotionDesc',
        dataIndex: 'promotionDesc',
        render: (text, item) => (
            item.promotionDesc && item.promotionDesc.cn
        )
    }, {
        title: '排序',
        width: 100,
        key: 'sort',
        dataIndex: 'sort'
    }, {
        title: '更新人',
        width: 120,
        key: 'operatorName',
        dataIndex: 'operatorName'
    }, {
        title: '更新时间',
        width: 200,
        align: 'center',
        key: 'updateTime',
        render: (text, item) => (
            secondTimeFormat(item.updateTime)
        )
    }, {
        title: '操作',
        width: 200,
        fixed: 'right',
        align: 'center',
        render: (text, item, index) => (
            <>
                {/* <Button type="link" onClick={() => handleShowSort(item)}>排序</Button> */}
                <EditOutlined onClick={() => handleEdit(item)} style={{ color: '#409eff', marginRight: 16 }}/>
                { moment().isBefore(item.endTime) && <StopOutlined onClick={() => handleOffline(item)} style={{ color: 'red' }}/>}
            </>
        )
    }]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectItems(selectedRows)
        }
    }

    // function handleShowSort (item) {
    //     // 获取活动下的所有商品，以及出现排序弹窗
    // }

    function handleOffline (item) {
        let noStart = moment().isBefore(item.startTime)
        // 判断状态
        confirm({
            title: '确认是否迅速从本活动中下线该商品？',
            content: noStart ? '该商品尚未开始活动，系统将直接删除词条数据，若需重新参与本活动，需重新录入' : '该商品正在活动进行中，下线后可以通过修改活动时间重新上线',
            onOk() {
                batchOffliceActivityProduct({
                    activityId,
                    activitySpuIds: [item.activitySpuId]
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('下线成功')
                        getList(page)
                    }
                })
            },
            onCancel() {
                message.info('已取消下线')
            }
        })
    }

    function handleBatchEdit () {
        setIsAdd(false) // 表示是编辑
        if (!selectItems || !selectItems.length) {
            message.warning('请先选择需要编辑的商品')
            return
        } 
        setShowModal(true)
    }

    function handleBatchEditCancel () {
        setShowAddModal(false)
        setShowModal(false)
    }

    function handlePre () {
        setShowModal(false)
    }

    // 批量编辑商品确认
    function handleBatchEditConfirm (data) {
        let param = {}
        setConfirmLoading(true)
        if (isAdd) { // 表示是新增
            param = Object.assign(data, {
                activityId,
                spuIds: selectIds
            }) 
            addActivityProduct(param).then(res => {
                setConfirmLoading(false)
                if (res.ret.errCode === 0) {
                    handleBatchEditCancel()
                    getList()
                }
            }).catch(() => {
                setConfirmLoading(false)
            })
        } else { // 编辑
            param = Object.assign(data, {
                activityId,
                editSpuInfos: selectItems.map(item => {
                    let res = {}
                    res.activitySpuId = item.activitySpuId
                    res.spuId = item.spuId

                    return res
                })
            })
            batchUpdateActivityProduct(param).then(res => {
                setConfirmLoading(false)
                if (res.ret.errCode === 0) {
                    handleBatchEditCancel()
                    getList(page)
                }
            }).catch(() => {
                setConfirmLoading(false)
            })
        }
    }

    function handleEdit (item) {
        let param = JSON.parse(JSON.stringify(item))
        getActivityProductSkuList({
            activitySpuId: item.activitySpuId,
            spuId: item.spuId
        }).then(res => {
            if (res.ret.errCode === 0) {
                let temp = JSON.parse(JSON.stringify(res.data || []))
                let attrList = []

                if (temp && temp.length) {
                    temp = temp.map((sku) => {
                        let values = ''
                        sku.attribute = sku.attribute || []
                        let len = sku.attribute.length
                        sku.attribute.forEach((attr, index) => {
                            values += `${attr.attrName}:${attr.valueName}`
                            if (index != len - 1) {
                                values += '/'
                            }
                        })

                        if (!attrList.includes(values)) {
                            attrList.push(values)
                        }
                        sku.values = values
                        return sku
                    })
                }
                param.attrList = attrList
                param.activitySkuInfos = temp
                param.startTime = param.startTime ? moment(parseInt(param.startTime)) : null
                param.endTime = param.endTime ? moment(parseInt(param.endTime)) : null
                param.preheatStartTime = param.preheatStartTime ? moment(parseInt(param.preheatStartTime)) : null
                setEditData(param)
                setShowEditModal(true)
            }
        })
    }

    function handleEditCancel () {
        setShowEditModal(false)
    }

    function handleEditConfirm (data) {
        setConfirmLoading(true)
        updateActivityProduct({
            activityId,
            ...data
        }).then(res => {
            if (res.ret.errCode === 0) {
                setShowEditModal(false)
                message.success('修改成功')
                getList(page)
            }
            setConfirmLoading(false)
        }).catch(() => {
            setConfirmLoading(false)
        })
    }

    function handleAdd () {
        setIsAdd(true)
        setShowAddModal(true)
    }

    // 商品的确认与关闭
    function handleAddCancel () {
        setShowAddModal(false)
    }

    function handleAddConfirm (data) {
        // 实际是下一步
        if (!data || !data.length) {
            message.info('请先选择需要添加的商品')
            return
        }
        let ids = data.map(item => item.productId)
        setSelectIds(ids)
        setShowModal(true)
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getList(temp)
    }

    function handleSearch (values) {
        setPage({
            pageNum: 1,
            pageSize: 10
        })
        getList(values)
    }

    return (
        <div>
            <Form layout="inline" onFinish={handleSearch}>
                <Form.Item name="spuId" label="商品ID">
                    <Input style={{ width: 240 }}/>
                </Form.Item>
                <Form.Item name="groupId" label="商品分组">
                    <Select style={{ width: 240 }}>
                        {
                            groupList.map(group => (
                                <Select.Option key={group.id} value={group.id}>{group.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
                </Form.Item>
            </Form>

            <div className="product-opt-btn-box">
                <Button onClick={handleBatchEdit}>批量编辑</Button>
                <Button icon={<PlusOutlined />} onClick={handleAdd} type="primary">添加商品</Button>
            </div>

            <Table
                scroll={{ x: '100%' }}
                columns={columns} 
                dataSource={dataList} 
                rowSelection={{ ...rowSelection }}
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

            {showAddModal && <AddProduct
                showVipPrice={true}
                okText={isAdd ? '下一步' : '确定'}
                showModal={showAddModal}
                modalLoading={modalLoading}
                countryCode={countryCode}
                onClose={handleAddCancel}
                onConfirm={handleAddConfirm}
            />}

            {showModal && <BatchEditModal
                isAddActivityProduct={isAdd}
                showModal={showModal}
                languages={languages}
                onCancel={handleBatchEditCancel}
                onPre={handlePre}
                onConfirm={handleBatchEditConfirm}
                groupList={groupList}
                confirmLoading={confirmLoading}
                preheat={preheat}
            />}

            <ProductEditModal
                showModal={showEditModal}
                countryCode={countryCode}
                onCancel={handleEditCancel}
                groupList={groupList}
                languages={languages}
                editData={editData}
                name={name}
                onConfirm={handleEditConfirm}
                confirmLoading={confirmLoading}
                preheat={preheat}
            />
        </div>
    )
}

export default React.memo(ActivityProductInfo)