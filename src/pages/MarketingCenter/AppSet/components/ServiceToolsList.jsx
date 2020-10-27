import React, {useState, useEffect} from 'react'
import { Select, Button, Table, message, InputNumber, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { secondTimeFormat, filterCountry } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import { useModel } from 'umi'
import {
    getHomeModuleList,
    getModuleInfo,
    addHomeModuleItem,
    editHomeModuleItem,
    delHomeModuleItem,
    sortHomeModuleItem
} from '@/services/marketing'
import ServiceToolsModal from './ServiceToolsModal'
import moment from 'moment'

const { confirm } = Modal
const ServiceToolsList = (props) => {
    const { moduleData, OPEN_TYPE_OBJ, SERVICE_STATUS_OBJ, SERVICE_STATUS_LIST, SERVICE_TOOLS_ENUM, OPEN_TYPE_LIST } = props
    const [showModal, setShowModal] = useState(false)
    const [dataList, setDataList] = useState([])
    const [modalData, setModalData] = useState({name: []})
    const [loading, setLoading] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [total, setTotal] = useState(0)
    const { languages } = useModel('dictionary')
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })
    const [curModuleId, setCurModuleId] = useState()

    const columns = [{
        title: '名称',
        key: 'name',
        width: 120,
        align: 'center',
        fixed: 'left',
        render: (text, item) => (
            item.name.cn
        )
    }, {
        title: '图标',
        key: 'icon',
        width: 110,
        fixed: 'left',
        align: 'center',
        render: (text, item) => (
            <img src={dealShowFileSrc(item.icon.cn)} style={{ width: 80 }}/>
        )
    }, {
        title: 'ID',
        key: 'id',
        width: 120,
        align: 'center',
        dataIndex: 'id'
    }, {
        title: '国家',
        key: 'countryCode',
        width: 120,
        render: (text, item) => (
            filterCountry(item.countryCode)
        )
    }, {
        title: '跳转类型',
        key: 'openType',
        width: 100,
        render: (text, item) => (
            OPEN_TYPE_OBJ[item.openType]
        )
    }, {
        title: '跳转链接',
        key: 'url',
        dataIndex: 'url',
        ellipsis: true,
        width: 160
    }, {
        title: '状态',
        key: 'status',
        width: 100,
        render: (text, item) => (
            SERVICE_STATUS_OBJ[item.status]
        )
    }, {
        title: '排序',
        key: 'sort',
        width: 220,
        render: (text, item, index) => (
            <>
                <InputNumber value={item.sort} min={0} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                <Button onClick={() => handleSort(item)}>排序</Button>
            </>
        )
    }, {
        title: '修改人',
        key: 'operation',
        dataIndex: 'operation',
        align: 'center',
        width: 140
    }, {
        title: '修改时间',
        key: 'updated',
        width: 200,
        render: (text, item) => (
            secondTimeFormat(item.updated)
        )
    }, {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 260,
        render: (text, item) => (
            <>
                <Button type="primary" onClick={() => handleEdit(item)} style={{ marginRight: 8 }}>编辑</Button>
                <Button type="primary" onClick={() => handleCopy(item)} style={{ marginRight: 8 }}>复制</Button>
                <Button type="primary" danger onClick={() => handleDel(item)}>删除</Button>
            </>
        )
    }]

    useEffect(() => {
        getPageModule()
    }, [])

    // 获取模块信息
    function getPageModule () {
        setLoading(true)
        getModuleInfo({
            pageId: moduleData.pageId,
            groupCode: moduleData.groupCode,
            notCountryCode: true
        }).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setCountryList(res.data)
                let curModule = res.data.find(val => val.countryCode == 'MY')
                if (curModule) {
                    setCurModuleId(curModule.id)
                    getDataList({moduleId: curModule.id})
                }
            }
        })
    }

    // 获取列表信息
    function getDataList (data) {
        setLoading(true)
        let param = {
            groupCode: moduleData.groupCode,
            moduleId: curModuleId,
            ...page
        }
        param = Object.assign(param, data || {})
        getHomeModuleList(param).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                let temp = [...res.data.list]
                temp = temp.map(item => {
                    item.name = item.name ? JSON.parse(item.name) : {}
                    item.icon = item.icon ? JSON.parse(item.icon) : {}
                    return item
                })
                
                setDataList(temp || [])
                setTotal(res.data.total)
            }
        })
    }

    // 国家切换
    function handleCountryChange (val) {
        setCurModuleId(val)
        getDataList({moduleId: val})
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }

    function handleSortChange (val, index) {
        let temp = [...dataList]
        let item = temp[index]
        item.sort = val
        
        setDataList(temp)
    }

    function handleSort (item) {
        sortHomeModuleItem({
            id: item.id,
            sort: item.sort
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('排序成功')
                getDataList()
            }
        })
    }

    function handleAdd () {
        setModalData({
            status: 1,
            openType: 1
        })
        setShowModal(true)
    }

    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.iconList = []
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData({
            icon: data.icon,
            iconList: data.iconList,
            moduleId: data.moduleId,
            name: data.name,
            openType: data.openType,
            sort: data.sort,
            status: data.status,
            url: data.url,
            id: data.id
        })
 
        setShowModal(true)
    }

    function handleCopy (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.iconList = []
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData({
            icon: data.icon,
            iconList: data.iconList,
            moduleId: '',
            name: data.name,
            openType: data.openType,
            sort: data.sort,
            status: data.status,
            url: data.url,
            id: ''
        })
 
        setShowModal(true)
    }

    function handleDel (item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除该项, 是否继续?',
            onOk() {    
                delHomeModuleItem({
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

    function onCancel () {
        setShowModal(false)
    }

    function onConfirm (data) {
        if (data.id) {
            editHomeModuleItem(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        } else {
            delete data.id
            addHomeModuleItem(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        }
    }

    return (
        <div className="service-tools-list">
            <Select style={{width: 140, marginRight: 8}} onChange={handleCountryChange} value={curModuleId}>
                {
                    countryList.map((item) => (
                        <Select.Option value={item.id} key={item.id}>{item.countryName}</Select.Option>
                    ))
                }
            </Select>
            <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd} style={{ marginRight: 8 }}>新增</Button>

            <Table
                bordered
                rowKey={record => record.id}
                loading={loading}
                columns={columns}
                dataSource={dataList}
                style={{ marginTop: 16 }}
                scroll={{ x: '100%' }}
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

            <ServiceToolsModal
                showModal={showModal}
                countryList={countryList}
                modalData={modalData}
                onCancel={onCancel}
                onConfirm={onConfirm}
                languages={languages}
                SERVICE_TOOLS_ENUM={SERVICE_TOOLS_ENUM}
                OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                SERVICE_STATUS_LIST={SERVICE_STATUS_LIST}
            />
        </div>
    )
}

export default ServiceToolsList
