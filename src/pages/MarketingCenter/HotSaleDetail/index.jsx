import React, {useState, useEffect} from 'react'
import { Input, Tabs, Button, message, Radio, Table, Modal } from 'antd'
import { useModel, history } from 'umi'
import ViewContainer from '@/components/ViewContainer'
import { secondTimeFormat } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { EditOutlined, StopOutlined, PlusOutlined } from '@ant-design/icons'
import BatchEditModal from '../ActivityDetail/components/BatchEditModal'
import TimeSlect from './components/TimeSelect'
import moment from 'moment'
import { 
    getActivityProductSkuList,
    getActivityProductList,
    updateActivityProduct, 
    getActivityList,
    getActivityGroup,
    addActivityProduct,
    batchUpdateActivityProduct,
    batchOffliceActivityProduct,
    addActivityProductListByTime
} from '@/services/marketing'
import AddProduct from '../AppSet/components/ProductManageModal'
import ProductEditModal from '../ActivityDetail/components/ProductEditModal'
import './index.less'

/**
 * 爆款好物
 */

const { TabPane } = Tabs
const { Search } = Input
const { confirm } = Modal

const HotSaleDetail = () => {
    const { countries, languages } = useModel('dictionary')
    const [countryCode, setCountryCode] = useState('MY')
    const [activityList, setActivityList] = useState([])
    const [dataList, setDataList] = useState([]) // 商品列表
    const [selectIds, setSelectIds] = useState([])
    const [selectItems, setSelectItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [editData, setEditData] = useState({})
    const [modalLoading, setModalLoading] = useState(false)
    const [addStatus, setAddStatus] = useState(-1) // 判断添加商品的形式 1 表示需要编辑的添加  2 根据时间快速添加 3 仅批量编辑
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [subjectId, setSubjectId] = useState('')
    const [activityId, setActivityId] = useState('')
    const [curPreheat, setCurPreheat] = useState(-1) // 活动是否预热
    const [timeShowModal, setTimeShowModal] = useState(false)
    const [activityName, setActivityName] = useState('')
    const [timeObj, setTimeObj] = useState({
        startTime: null,
        endTime: null
    })
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const TIME_LIST = [
        {
            label: '11:00',
            value: '11:00:00'
        }
    ]
    const columns = [{
        title: '商品信息',
        width: 240,
        key: 'product',
        fixed: 'left',
        render: (_, item) => (
            <div className="product-info-box">
                <img width={100} src={dealShowFileSrc(item.image)}/>
                {item.title}
            </div>
        )
    }, {
        title: '商品ID',
        width: 200,
        align: 'center',
        dataIndex: 'spuId'
    }, {
        title: '预热时间',
        width: 180,
        align: 'center',
        key: 'preheatStartTime',
        render: (_, item) => (
            secondTimeFormat(item.preheatStartTime)
        )
    }, {
        title: '开始时间',
        width: 180,
        align: 'center',
        key: 'startTime',
        render: (_, item) => (
            secondTimeFormat(item.startTime)
        )
    }, {
        title: '操作',
        width: 200,
        align: 'center',
        fixed: 'right',
        render: (_, item) => (
            <>
                {/* <MenuOutlined onClick={() => handleSort(item)} style={{ color: 'blue', marginRight: 12 }}/> */}
                <EditOutlined onClick={() => handleEdit(item)} style={{ color: 'blue', marginRight: 12 }}/>
                { moment().isBefore(item.endTime) && <StopOutlined onClick={() => handleOffline(item)} style={{ color: 'red' }}/>}
            </>
        )
    }]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectItems(selectedRows)
        }
    }

    const Operations = [
        <Button icon={<PlusOutlined/>} onClick={handleAddProduct} style={{ marginRight: 8 }} key="addProduct">添加商品</Button>,
        <Button icon={<PlusOutlined/>} onClick={handleQuickAddProduct} key="quickAdd" type="primary">快捷添加商品</Button>
    ]

    useEffect(() => {
        let query = history.location.query || {}
        let resSubjectId = parseInt(query.subjectId)
        setSubjectId(resSubjectId)
        getActivityData({
            subjectId: resSubjectId,
            countryCode: 'MY'
        })
    }, [])

    function getActivityData (data) {
        setLoading(true)
        let param = {
            subjectId,
            countryCode: countryCode
        }
        param = Object.assign(param, data || {})
        getActivityList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                let list = res.data.list.slice(0, 3)
                setActivityList(list)
                let curActivityId = list[1].activityId
                setActivityId(curActivityId)
                setActivityName(list[1].name)
                getGroupList(curActivityId)
                getProductList({
                    activityId: curActivityId
                })
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 国家选择修改 
    function handleTabChange (val) {
        setCountryCode(val)
        getActivityData({countryCode: val})
    }

    // 选择活动
    function handleActivityChange (e) {
        let val = e.target.value
        setActivityId(val)
        let curActivity = activityList.find(activity => activity.activityId == val)
        setCurPreheat(curActivity.preheat)
        setActivityName(curActivity.name)
        getProductList({
            activityId: val
        })
        getGroupList(val)
    }

    function handleSearch (value) {
        setPage({
            pageNum: 1,
            pageSize: 10
        })
        getProductList({
            spuId: value
        })
    }

    // 添加商品
    function handleAddProduct () {
        setAddStatus(1)
        setShowAddModal(true)
    }

    // 商品的确认与关闭
    function handleAddCancel () {
        setShowAddModal(false)
    }

    // 选中了商品，添加
    function handleAddConfirm (data) {
        if (!data || !data.length) {
            message.info('请先选择需要添加的商品')
            return
        }
        let ids = data.map(item => item.productId)
        if (addStatus == 1) {// 需要下一步的编辑，针对的是普通添加商品
            setSelectIds(ids)
            setShowModal(true)
        } else {
            addActivityProductListByTime({
                ...timeObj,
                spuIds: ids,
                countryCode,
                activityId
            }).then(res => {
                if (res.ret.errCode === 0) {
                    setShowAddModal(false)
                    message.success('添加成功')
                    getProductList()
                }
            })
        }
    }

    // 快捷添加商品
    function handleQuickAddProduct () {
        setAddStatus(2)
        setTimeShowModal(true)
    }
    function handleTimeSelectCancel () {
        setTimeShowModal(false)
    }
    function handleTimeSelectNext (data) {
        data.preheatStartTime = moment().valueOf()
        data.type = 2
        setTimeObj(data)
        setTimeShowModal(false)
        setShowAddModal(true)
    }

    // 获取活动下的商品
    function getProductList (data) {
        setLoading(true)
        let param = {
            countryCode: countryCode,
            activityId,
            pageNum: 1,
            pageSize: 20
        }
        param = Object.assign(param, data || {})
        getActivityProductList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setDataList(res.data.list)
                setTotal(res.data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 获取分组列表
    function getGroupList (val) {
        getActivityGroup({activityId: val}).then(res => {
            if (res.ret && res.ret.errCode === 0) {
                setGroupList(res.data.activityGroupInfos || [])
            }
        })
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getProductList(temp)
    }

    // 编辑单个商品
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
    // 单个商品编辑确认
    function handleEditConfirm (data) {
        setConfirmLoading(true)
        updateActivityProduct({
            activityId,
            ...data
        }).then(res => {
            if (res.ret.errCode === 0) {
                setShowEditModal(false)
                message.success('修改成功')
                getProductList(page)
            }
            setConfirmLoading(false)
        }).catch(() => {
            setConfirmLoading(false)
        })
    }

    // 下线
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
                        getProductList()
                    }
                })
            },
            onCancel() {
                message.info('已取消下线')
            }
        })
    }

    // 选择批量编辑
    function handleBatchEdit () {
        setAddStatus(3)
        if (!selectItems || !selectItems.length) {
            message.warning('请先选择需要编辑的商品')
            return
        }
        setShowModal(true)
    }
    // 批量编辑的上一步
    function handlePre () {
        setShowModal(false)
    }
    // 批量编辑取消
    function handleBatchEditCancel () {
        setShowAddModal(false)
        setShowModal(false)
    }
    // 批量编辑确认
    function handleBatchEditConfirm (data) {
        let param = {}
        setConfirmLoading(true)
        if (addStatus == 1) {
            param = Object.assign(data, {
                activityId,
                spuIds: selectIds
            })
            addActivityProduct(param).then(res => {
                setConfirmLoading(false)
                if (res.ret.errCode === 0) {
                    setShowAddModal(false)
                    setShowModal(false)
                    getProductList()
                }
            }).catch(() => {
                setConfirmLoading(false)
            })
        } else {
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
                    getProductList()
                }
            }).catch(() => {
                setConfirmLoading(false)
            })
        }
    }

    return (
        <ViewContainer>
            <Tabs defaultActiveKey='MY' tabBarExtraContent={Operations} onChange={handleTabChange} type="card">
                {
                    countries.map(item => (
                    <TabPane key={item.shortCode} tab={item.nameCn}>
                        <div className="hot-sale-activity-box">
                            <div></div>
                            <Radio.Group onChange={handleActivityChange} size="large" value={activityId}>
                                {
                                    activityList.map(activity => (
                                        <Radio.Button key={activity.activityId} value={activity.activityId}>{activity.name}</Radio.Button>
                                    ))
                                }
                            </Radio.Group>

                            <Search
                                placeholder="请输入商品ID"
                                onSearch={handleSearch}
                                className="search-box"
                            />
                        </div>

                        <div className="product-opt-btn-box">
                            <Button onClick={handleBatchEdit}>批量编辑</Button>
                        </div>

                        <Table
                            rowSelection={{ ...rowSelection }}
                            columns={columns}
                            dataSource={dataList}
                            style={{ marginTop: 8 }}
                            loading={loading}
                            scroll={{ x: '100%' }}
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
                    </TabPane>
                    ))
                }
            </Tabs>

            <TimeSlect
                showModal={timeShowModal}
                onCancel={handleTimeSelectCancel}
                onNext={handleTimeSelectNext}
                timeList={TIME_LIST}
                needDay={6}
            />

            {showAddModal && <AddProduct
                showVipPrice={true}
                okText={addStatus == 1 ? '下一步' : '确定'}
                showModal={showAddModal}
                modalLoading={modalLoading}
                countryCode={countryCode}
                onClose={handleAddCancel}
                onConfirm={handleAddConfirm}
            />}

            {/* preheat需要拿到活动是否参与了预热 */}
            {showModal && <BatchEditModal
                isAddActivityProduct={addStatus == 1}
                showModal={showModal}
                languages={languages}
                onCancel={handleBatchEditCancel}
                onPre={handlePre}
                onConfirm={handleBatchEditConfirm}
                groupList={groupList}
                confirmLoading={confirmLoading}
                preheat={curPreheat}
            />}

            <ProductEditModal
                showModal={showEditModal}
                countryCode={countryCode}
                onCancel={handleEditCancel}
                groupList={groupList}
                languages={languages}
                editData={editData}
                name={'爆款好物 - ' + activityName}
                onConfirm={handleEditConfirm}
                confirmLoading={confirmLoading}
                preheat={curPreheat}
            />
        </ViewContainer>
    )
}

export default HotSaleDetail