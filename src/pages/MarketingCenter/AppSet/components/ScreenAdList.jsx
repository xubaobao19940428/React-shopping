import React, {useState, useEffect} from 'react'
import { Select, Button, Table, Modal, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { getScreenList, screenEdit, screenDel, screenAdd, screenBatchDel } from '@/services/marketing'
import ScreenAdModal from './ScreenAdModal'
import { secondTimeFormat, filterCountry } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import moment from 'moment'

const { Option } = Select
const { confirm } = Modal

/**
 * 闪屏广告
 */
const ScreenAdList = (props) => {
    const {countries} = props
    const [showModal, setShowModal] = useState(false)
    const [dataList, setDataList] = useState([])
    const [modalData, setModalData] = useState({})
    const [countryCode, setCountryCode] = useState('MY')
    const [delIds, setDelIds] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '国家',
        key: 'countryCode',
        render: (text, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: '广告位标题',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '链接',
        dataIndex: 'url',
        key: 'url',
        ellipsis: true
    }, {
        title: '图片',
        key: 'icon',
        render: (text, item) => (
            <img src={dealShowFileSrc(JSON.parse(item.icon).cn)} style={{ width: 80 }}/>
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        render: (text, item) => (
            secondTimeFormat(item.startTime)
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        render: (text, item) => (
            secondTimeFormat(item.endTime)
        )
    }, {
        title: '操作',
        key: 'action',
        render: (text, item) => (
            <>
                <Button type="primary" onClick={() => handleEdit(item)} style={{marginRight: 8}}>编辑</Button>
                <Button type="primary" danger onClick={() => handleDel(item)}>删除</Button>
            </>
        )
    }]

    useEffect(() => {
        getDataList({countryCode: 'MY'})
    }, [])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let ids = selectedRows.map(item => item.id)
            setDelIds(ids)
        }
    }

    function getDataList (data) {
        setLoading(true)
        let param = {
            countryCode: countryCode,
            ...page,
            sortType: 'asc',
            sortField: 'created'
        }
        param = Object.assign(param, data || {})
        getScreenList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode == 0) {
                const list = res.data.list
                setDataList(list)
                setTotal(res.data.total || 0)
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        
        setPage(temp)
        getDataList(temp)
    }
    function handleCountryChange (val) {
        setCountryCode(val)
        getDataList({ countryCode: val })
    }
    function handleAdd () {
        setShowModal(true)
        setModalData({})
    }
    function handleBatchDel() {
        if (delIds.length) {
            confirm({
                title: '提示',
                content: '此操作将永久删除所选广告位, 是否继续?',
                onOk() {    
                    screenBatchDel({
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
            message.info('请先勾选您需操作的广告')
        }
    }
    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.icon = JSON.parse(data.icon)
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData(data)

        setShowModal(true)
    }
    function handleDel (item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除所选广告位, 是否继续?',
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
    function onClose () {
        setShowModal(false)
    }
    function onConfirm (data) {
        if (data.id) {
            screenEdit(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        } else {
            delete data.id
            screenAdd(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        }
    }
    return (
        <div className="screen-ad-list-wrapper">
            <Select style={{width: 140, marginRight: 8}} onChange={handleCountryChange} defaultValue={countryCode}>
                {
                    countries.map((item) => (
                        <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                    ))
                }
            </Select>
            <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd} style={{ marginRight: 8 }}>新增</Button>
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleBatchDel}>批量删除</Button>

            <Table 
                bordered
                rowKey={record => record.id}
                loading={loading}
                rowSelection={{ ...rowSelection }}
                columns={columns} 
                dataSource={dataList} 
                style={{ marginTop: 16 }}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: () => `共${total}条`,
                    pageSizeOptions: [10, 20, 50, 100],
                    pageSize: page.pageSize,
                    current: page.pageNum,
                    total: total,
                    onChange: changePage
                }}
            />

            <ScreenAdModal 
                showModal={showModal} 
                countries={countries} 
                modalData={modalData} 
                onClose={onClose} 
                onConfirm={onConfirm}
            ></ScreenAdModal>
        </div>
    )
}

export default ScreenAdList