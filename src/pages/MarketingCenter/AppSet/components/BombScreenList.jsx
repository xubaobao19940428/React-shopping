import React, {useState, useEffect} from 'react'
import {Select, Button, Table, Modal, message, Switch} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import BombScreenModal from './BombScreenModal'
import { secondTimeFormat, filterCountry } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import moment from 'moment'
import { getWindowList, windowAdd, windowDel, windowEdit, windowEditStatus } from '@/services/marketing'

/**
 * 弹屏广告
 */
const SHOW_TYPE_OBJ = {
    1: '每次弹',
    2: '首次弹'
}
const SHOW_TYPE_LIST = [{
    key: 2,
    name: '首次弹'
}, {
    key: 1,
    name: '每次弹'
}]
const { confirm } = Modal

const BombScreenList = (props) => {
    const {countries, OPEN_TYPE_LIST, OPEN_TYPE_OBJ, APP_PAGE_ENUM, moduleData} = props
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
        title: 'id',
        dataIndex: 'id',
        align: 'center',
        width: 80,
        fixed: 'left'
    }, {
        title: '国家',
        key: 'countryCode',
        width: 120,
        render: (text, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 160,
    }, {
        title: '图片',
        key: 'icon',
        width: 120,
        render: (text, item) => (
            <img src={dealShowFileSrc(JSON.parse(item.icon).cn)} style={{ width: 80 }}/>
        )
    }, {
        title: '跳转类型',
        dataIndex: 'type',
        align: 'center',
        width: 120,
        render: (text, item) => (
            <span>{OPEN_TYPE_OBJ[item.showType]}</span>
        )
    }, {
        title: '跳转链接',
        dataIndex: 'url',
        align: 'center',
        ellipsis: true,
        width: 160
    }, {
        title: '弹屏状态',
        key: 'showType',
        align: 'center',
        width: 120,
        render: (text, item) => (
            <span>{SHOW_TYPE_OBJ[item.showType]}</span>
        )
    }, {
        title: '弹窗效期',
        key: 'time',
        width: 240,
        align: 'center',
        render: (text, item) => (
            <>
                <span>{ secondTimeFormat(item.startTime) }</span> ~
                <span>{ secondTimeFormat(item.endTime) }</span>
            </>
        )
    }, {
        title: '操作',
        fixed: 'right',
        align: 'center',
        key: 'action',
        width: 320,
        render: (text, item) => (
            <>
                <Switch checked={item.status === 1} onChange={() => handleChangeStatus(item)} style={{ margin: 'left', marginRight: 10 }}/>
                <Button type="primary"
                    onClick={() => handleEdit(item)} style={{marginRight: 8}}>编辑</Button>
                <Button type="primary"
                    danger onClick={() => handleDel(item)} style={{marginRight: 8}}>删除</Button>
                <Button type="primary" onClick={() => handleCopy(item)} style={{marginRight: 8}}>复制</Button>
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
            type: 1,
            sortType: 'asc',
            sortField: 'created'
        }
        param = Object.assign(param, data || {})
        getWindowList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode == 0) {
                const list = res.data.list
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

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }

    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.timeList = [data.startTime, data.endTime]
        data.iconList = []
        data.icon = JSON.parse(data.icon)
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData(data)

        setShowModal(true)
    }

    function handleDel (item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除, 是否继续?',
            onOk() {
                screenDel({
                    id: item.id
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

    function handleChangeStatus (item) {
        windowEditStatus({
            id: item.id,
            status: item.status == 1 ? 2 : 1
        }).then(res => {
            if (res.ret.errCode === 0) {
                getDataList()
            }
        })
    }

    function handleCopy (item) {
        let temp = JSON.parse(JSON.stringify(item))
        temp.countryCode = ''
        temp.id = ''
        temp.startTime = moment(temp.startTime)
        temp.endTime = moment(temp.endTime)
        temp.timeList = [temp.startTime, temp.endTime]
        temp.iconList = []
        temp.icon = JSON.parse(temp.icon)
        temp.iconList = objectMapToArray(temp.icon, 'languageCode', 'name')
        setModalData(temp)
        setShowModal(true)
    }

    function handleAdd () {
        setShowModal(true)
        setModalData({
            openType: 1,
            showType: 2
        })
    }

    function onClose () {
        setShowModal(false)
    }
    function onConfirm (data) {
        Object.assign(data, {
            pageId: moduleData.pageId,
            countryCode: countryCode
        })
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
        <div className="bomb-screen-list-wrapper">
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

            <BombScreenModal
                showModal={showModal}
                countries={countries}
                modalData={modalData}
                onClose={onClose}
                onConfirm={onConfirm}
                SHOW_TYPE_LIST={SHOW_TYPE_LIST}
                OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                APP_PAGE_ENUM={APP_PAGE_ENUM}
            ></BombScreenModal>
        </div>
    )
}

export default BombScreenList
