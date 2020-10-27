import React, {useState, useEffect} from 'react'
import { Input, Form, Tabs, Button, DatePicker, message, Modal, Table } from 'antd'
import { useModel } from 'umi'
import { dealShowFileSrc } from '@/utils/utils'
import { secondTimeFormat, filterCountry, filterCurrencyUnit } from '@/utils/filter'
import ViewContainer from '@/components/ViewContainer'
import BatchEditModal from '../ActivityDetail/components/BatchEditModal'
import ProductEditModal from '../ActivityDetail/components/ProductEditModal'
import TimeSlect from '../HotSaleDetail/components/TimeSelect'
import { EditOutlined, StopOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import AddProduct from '../AppSet/components/ProductManageModal'
import {
    getTimeList, getActivityProductListByTime, 
    addActivityProduct,
    batchUpdateActivityProduct,
    addActivityProductListByTime, batchOffliceActivityProduct,
    getActivityProductSkuList, updateActivityProduct,
    getActivityGroup
} from '@/services/marketing'
import './index.less'
import commonEnum from '../ActivityManage/enum'
import moment from 'moment'

/**
 * 限时抢购
 */
const { TabPane } = Tabs
const { confirm } = Modal

const FlashSaleDetail = () => {
    const { countries, languages } = useModel('dictionary')
    const [countryCode, setCountryCode] = useState('MY')
    const [addStatus, setAddStatus] = useState(-1) // 判断添加商品的形式 1 表示需要编辑的添加  2 根据时间快速添加 3 仅批量编辑
    const [selectIds, setSelectIds] = useState([])
    const [selectItems, setSelectItems] = useState([])
    const [timeList, setTimeList] = useState([])
    const [dataList, setDataList] = useState([]) // 
    const [groupList, setGroupList] = useState([])
    const [curPreheat, setCurPreheat] = useState(-1) // 活动是否预热
    const [activityId, setActivityId] = useState('') // 当前的活动ID
    const [loading, setLoading] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [timeShowModal, setTimeShowModal] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [serachParam, setSearchParam] = useState({
        searchBeginTime: moment().startOf('day') // 用于设置请求时间轴的开始时间
    })
    const [editData, setEditData] = useState({})
    const [showEditModal, setShowEditModal] = useState(false)
    const [curStartTime, setCurStartTime] = useState(null) // 选中时间轴，根据时间轴时间查询商品列表
    const [curBeginTime, setCurBeginTime] = useState(null) // 开始时间，用于查询时间轴
    const [timeObj, setTimeObj] = useState({
        startTime: null,
        endTime: null,
        preheatStartTime: null
    })
    const { TIME_STATUS_OBJ } = commonEnum

    const Operations = [
        <Button icon={<PlusOutlined/>} onClick={handleAddProduct} style={{ marginRight: 8 }} key="addProduct">添加商品</Button>,
        <Button icon={<PlusOutlined/>} onClick={handleQuickAddProduct} key="quickAdd" type="primary">快捷添加商品</Button>
    ]
    const TIME_LIST = [
        {
            label: '10:00',
            value: '10:00:00'
        },
        {
            label: '12:00',
            value: '12:00:00'
        },
        {
            label: '13:00',
            value: '13:00:00'
        },
        {
            label: '14:00',
            value: '14:00:00'
        },
        {
            label: '15:00',
            value: '15:00:00'
        },
        {
            label: '16:00',
            value: '16:00:00'
        },
        {
            label: '17:00',
            value: '17:00:00'
        },
        {
            label: '18:00',
            value: '18:00:00'
        },
        {
            label: '19:00',
            value: '19:00:00'
        },
        {
            label: '20:00',
            value: '20:00:00'
        }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectItems(selectedRows)
        }
    }

    const columns = [{
        title: '商品信息',
        width: 240,
        key: 'product',
        fixed: 'left',
        render: (text, item, index) => (
            <div className="product-info-box">
                <img width={100} src={dealShowFileSrc(item.image)}/>
                {item.title}
            </div>
        )
    }, {
        title: '商品ID',
        width: 200,
        key: 'id',
        dataIndex: 'spuId',
        align: 'center'
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
                { moment().isBefore(item.endTime) && <StopOutlined onClick={() => handleOffline(item)} style={{ color: 'red' }}/> }
            </>
        )
    }]

    useEffect(() => {
        let time = new Date(new Date().toLocaleDateString()).getTime()
        setCurBeginTime(time)
        getTimeData({
            countryCode: 'MY',
            beginTime: time
        })
    }, [])

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
                        getDataList()
                    }
                })
            },
            onCancel() {
                message.info('已取消下线')
            }
        })
    }

    function getTimeData (data, type) {
        setLoading(true)
        let param = {
            countryCode,
            beginTime: curBeginTime
        }
        param = Object.assign(param, data || {})
        getTimeList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setActivityId(res.data.activityId)
                getGroupList(res.data.activityId)
                setCurPreheat(res.data.preheat)
                setTimeList(res.data.timeAxisInfos)
                let list = res.data.timeAxisInfos || []
                if (list && list.length) {
                    let resParam = {}
                    if (curStartTime && type !== 'again') { // 'again'表示重新请求 当前的时段已经存储过所以不用再重新存储
                        resParam = Object.assign({}, {
                            countryCode,
                            activityId: res.data.activityId
                        }, data || {}) // 例如国家的数据传输过来
                    } else {
                        let curItem = list.find(item => item.status === 1)
                        let startTime = curItem ? curItem.startTime : list[0].startTime
                        resParam = Object.assign({}, {
                            countryCode,
                            activityId: res.data.activityId,
                            startTime
                        }, data || {}) // 例如国家的数据传输过来
                        setCurStartTime(startTime + '')
                    }
                    getDataList(resParam)
                } else {
                    setDataList([])
                }
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    function handleTimeTabChange (curStartTime) {
        setCurStartTime(curStartTime)
        getDataList({startTime: curStartTime})
    }

    function getDataList (data) {
        setLoading(true)
        let param = {
            countryCode,
            activityId,
            startTime: curStartTime,
            ...serachParam
        }
        param = Object.assign(param, data || {})
        getActivityProductListByTime(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setDataList(res.data)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 国家选择修改 
    function handleTabChange (val) {
        setCountryCode(val)
        getTimeData({
            countryCode: val
        }, 'again')
    }

    function handleAddProduct () {
        setAddStatus(1)
        setShowAddModal(true)
    }

    // 选择了时段，下一步
    function handleTimeSelectNext (data) {
        data.type = 1
        setTimeObj(data)
        setTimeShowModal(false)

        // 打开添加商品弹窗
        setShowAddModal(true)
    }
    // 选中了商品，添加商品
    function handleAddConfirm (data) {
        if (!data || !data.length) {
            message.info('请先选择需要添加的商品')
            return
        }
        let ids = data.map(item => item.productId)
        if (addStatus == 1) { // 需要下一步编辑，针对的是普通添加商品
            setSelectIds(ids)
            setShowModal(true)
        } else if (addStatus == 2) { // 根据时间快速添加商品
            addActivityProductListByTime({
                ...timeObj,
                spuIds: ids,
                countryCode,
                activityId
            }).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('添加成功')
                    setShowAddModal(false)
                    getTimeData() // 由于添加商品不知道是不是增加了时段，所以需要先请求时段。不修改时段
                }
            })
        }
    }

    // 商品的确认与关闭
    function handleAddCancel () {
        setShowAddModal(false)
    }

    // 快捷添加商品
    function handleQuickAddProduct () {
        setAddStatus(2)
        setTimeShowModal(true)
    }
    function handleTimeSelectCancel () {
        setTimeShowModal(false)
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
                    getTimeData()
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
                    getTimeData()
                }
            }).catch(() => {
                setConfirmLoading(false)
            })
        }
    }

    function handleSearch (values) {
        let resParam = { ...values }
        resParam.beginTime = (resParam.searchBeginTime).startOf('day').valueOf()
        delete resParam.searchBeginTime
        setSearchParam(resParam)
        if (resParam.beginTime != curBeginTime) { // 不一样说明设置了时间，则需要去请求时间轴
            setCurBeginTime(resParam.beginTime)
            getTimeData(resParam, 'again')
        } else {
            getDataList(resParam)
        }
    }

    function handleEditCancel () {
        setShowEditModal(false)
    }

    // 获取分组列表
    function getGroupList (val) {
        getActivityGroup({activityId: val}).then(res => {
            if (res.ret && res.ret.errCode === 0) {
                setGroupList(res.data.activityGroupInfos || [])
            }
        })
    }

    // 单个编辑商品确认
    function handleEditConfirm (data) {
        setConfirmLoading(true)
        updateActivityProduct({
            activityId,
            ...data
        }).then(res => {
            if (res.ret.errCode === 0) {
                setShowEditModal(false)
                message.success('修改成功')
                getTimeData() // 可能是编辑了商品的时段，所以需要先请求时段
            }
            setConfirmLoading(false)
        }).catch(() => {
            setConfirmLoading(false)
        })
    }

    return (
        <ViewContainer>
            <Tabs defaultActiveKey='MY' tabBarExtraContent={Operations} onChange={handleTabChange} type="card" size="large">
                {
                    countries.map(item => (
                    <TabPane key={item.shortCode} tab={item.nameCn}>
                        <Form layout="inline" onFinish={handleSearch} initialValues={serachParam}>
                            <Form.Item name="spuId" label="商品ID">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="title" label="商品标题">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="searchBeginTime" label="选择日期">
                                <DatePicker style={{ width: 200 }} allowClear={false}/>
                            </Form.Item>
                            <Form.Item>
                                <Button icon={<SearchOutlined />} type="primary" htmlType="submit">搜索</Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: 32 }}>
                            <Button onClick={handleBatchEdit}>批量编辑</Button>
                        </div>

                        <Tabs centered className="tabs-wrapper" tabBarGutter={80} onChange={handleTimeTabChange} activeKey={curStartTime}>
                            {
                                timeList.map(time => (
                                    <TabPane key={time.startTime} value={time.startTime}
                                        tab={
                                            <div className="flash-sale-tab-box">
                                                <span className="time-text">{moment(parseInt(time.startTime)).format('M/D')}</span><br/>
                                                <span className="time-text">{moment(parseInt(time.startTime)).format('HH:mm')}</span><br/>
                                                <span className="text">{TIME_STATUS_OBJ[time.status]}</span><br/>
                                            </div>
                                        }
                                    >
                                    </TabPane>
                                ))
                            }
                        </Tabs>

                        <Table
                            rowSelection={{ ...rowSelection }}
                            columns={columns}
                            dataSource={dataList}
                            pagination={{hideOnSinglePage: true}}
                            loading={loading}
                            scroll={{ x: '100%' }}
                            rowKey={record => record.id}
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
                needDay={1}
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
                name="限时抢购"
                onConfirm={handleEditConfirm}
                confirmLoading={confirmLoading}
                preheat={curPreheat}
            />
        </ViewContainer>
    )
}

export default FlashSaleDetail