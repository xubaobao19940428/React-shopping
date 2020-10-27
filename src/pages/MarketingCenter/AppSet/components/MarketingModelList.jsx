import React, {useState, useEffect} from 'react'
import { Table, Button, Select, Modal, Switch, message } from 'antd'
import { secondTimeFormat } from '@/utils/filter'
import MarketingModal from './MarketingModal'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { getWindowList, windowAdd, windowDel, windowEdit, windowEditStatus } from '@/services/marketing'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import moment from 'moment'

/**
 * 营销浮窗
 */
const MarketingModelList = (props) => {
    const {countries, OPEN_TYPE_LIST, APP_PAGE_ENUM} = props
    const [showModal, setShowModal] = useState(false)
    const [dataList, setDataList] = useState([])
    const [modalData, setModalData] = useState({})
    const [countryCode, setCountryCode] = useState('MY')
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    }, {
        title: '浮窗图标',
        key: 'icon',
        width: 120,
        render: (text, item) => (
            <img src={dealShowFileSrc(JSON.parse(item.icon).cn)} style={{ width: 80 }}/>
        )
    }, {
        title: '浮窗链接',
        key: 'url',
        dataIndex: 'url',
        ellipsis: true
    }, {
        title: '创建时间',
        key: 'created',
        render: (text, item) => (
            <span>{ secondTimeFormat(item.created) }</span>
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        render: (text, item) => (
        <span>{ secondTimeFormat(item.startTime) }</span>
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        render: (text, item) => (
        <span>{ secondTimeFormat(item.endTime) }</span>
        )
    }, {
        title: '操作',
        align: 'center',
        key: 'action',
        width: 180,
        render: (text, item) => (
            <>
                <Switch checked={item.status === 1} onChange={() => handleStatusChange(item)} style={{ margin: 'left', marginRight: 10 }}/>
                <Button type="primary" onClick={() => handleEdit(item)}>编辑</Button>
            </>
        )
    }]

    useEffect(() => {
        getDataList({countryCode: 'MY'})
    }, [])

    function getDataList (data) {
        setLoading(true)
        let param = {
            countryCode: countryCode,
            ...page,
            type: 2,
            sortType: 'asc',
            sortField: 'created'
        }
        param = Object.assign(param, data || {})
        getWindowList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                const list = res.data.list || []
                setDataList(list)
                setTotal(res.data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    function handleCountryChange (val) {
        setCountryCode(val)
        getDataList({countryCode: val})
    }

    function handleStatusChange (item) {
        windowEditStatus({
            id: item.id,
            status: item.status == 1 ? 2 : 1
        }).then(res => {
            if (res.ret.errCode === 0) {
                getDataList()
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

    function handleEdit(item) {
        let data = JSON.parse(JSON.stringify(item))

        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.iconList = []
        data.icon = JSON.parse(data.icon)
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData(data)

        setShowModal(true)
    }

    function handleAdd () {
        setShowModal(true)
        setModalData({

        })
    }

    function onClose () {
        setShowModal(false)
    }

    function onConfirm (data) {
        if (data.id) {
            windowEdit(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        } else {
            delete data.id
            data.pageId = 2 // 首页的
            data.showType = 1 // 也是用于默认值
            windowAdd(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        }
    }

    return (
        <div className="marketing-model-list-wrapper">
            <Select style={{width: 140, marginRight: 8}} onChange={handleCountryChange} defaultValue={countryCode}>
                {
                    countries.map((item) => (
                        <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                    ))
                }
            </Select>
            <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd} style={{ marginRight: 8 }}>新增</Button>

            <Table
                bordered
                rowKey={record => record.id}
                scroll={{ x: '100%' }}
                loading={loading}
                columns={columns}
                dataSource={dataList}
                style={{ marginTop: 16 }}
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
            ></Table>

            <MarketingModal
                showModal={showModal}
                countries={countries}
                modalData={modalData}
                onClose={onClose}
                onConfirm={onConfirm}
                APP_PAGE_ENUM={APP_PAGE_ENUM}
                OPEN_TYPE_LIST={OPEN_TYPE_LIST}
            />
        </div>
    )
}

export default MarketingModelList
