import React, {useState, useEffect} from 'react'
import {PlusOutlined, InfoCircleOutlined} from "@ant-design/icons"
import {
    getHomeModuleList,
    getModuleInfo,
    addHomeModuleItem,
    editHomeModuleItem,
    delHomeModuleItem
} from '@/services/marketing'
import { Button, message, Select, Table } from 'antd'
import moment from 'moment'
import { secondTimeFormat } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import BottomIconModal from './BottomIconModal'

const BottomIcon = (props) => {
    const {moduleData} = props
    const [showModal, setShowModal] = useState(false)
    const [dataList, setDataList] = useState([])
    const [modalData, setModalData] = useState({extJson: []})
    const [curModuleId, setCurModuleId] = useState()
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [countryList, setCountryList] = useState([])
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 160,
        fixed: 'left'
    }, {
        title: '首页',
        key: 'home',
        width: 120,
        render: (text, item) => (
            <>
                {item.extJson.appIconValue[0] &&
                    (
                        <>
                            <img src={dealShowFileSrc(item.extJson.appIconValue[0].unselected)} style={{ width: '40px', marginRight: '4px' }}/>
                            <img src={dealShowFileSrc(item.extJson.appIconValue[0].selected)} style={{ width: '40px' }}/>
                        </>
                    )
                }
            </>
        )
    }, {
        title: '学院',
        key: 'school',
        width: 120,
        render: (text, item) => (
            <>
                {item.extJson.appIconValue[1] &&
                    (
                        <>
                            <img src={dealShowFileSrc(item.extJson.appIconValue[1].unselected)} style={{ width: '40px', marginRight: '4px' }}/>
                            <img src={dealShowFileSrc(item.extJson.appIconValue[1].selected)} style={{ width: '40px' }}/>
                        </>
                    )
                }
            </>
        )
    }, {
        title: 'PS店铺',
        key: 'shopper',
        width: 120,
        render: (text, item) => (
            <>
                {item.extJson.appIconValue[2] && (
                    <>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[2].unselected)} style={{ width: '40px', marginRight: '4px' }}/>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[2].selected)} style={{ width: '40px' }}/>
                    </>)
                }
            </>
        )
    }, {
        title: '购物车',
        key: 'cart',
        width: 120,
        render: (text, item) => (
            <>
                {item.extJson.appIconValue[3] && (
                    <>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[3].unselected)} style={{ width: '40px', marginRight: '4px' }}/>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[3].selected)} style={{ width: '40px' }}/>
                    </>
                )}
            </>
        )
    }, {
        title: '我的',
        key: 'my',
        width: 120,
        render: (text, item) => (
            <>
                {item.extJson.appIconValue[4] && (
                    <>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[4].unselected)} style={{ width: '40px', marginRight: '4px' }}/>
                        <img src={dealShowFileSrc(item.extJson.appIconValue[4].selected)} style={{ width: '40px' }}/>
                    </>
                )}
            </>
        )
    }, {
        title: '修改时间',
        key: 'created',
        width: 180,
        align: 'center',
        render: (text, item) => (
            secondTimeFormat(item.created)
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        width: 180,
        align: 'center',
        render: (text, item) => (
            secondTimeFormat(item.startTime)
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        width: 180,
        align: 'center',
        render: (text, item) => (
            secondTimeFormat(item.endTime)
        )
    }, {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 260,
        align: 'center',
        render: (text, item) => (
            <>
                <Button type="primary" onClick={() => handleEdit(item)} style={{ marginRight: 8 }}>编辑</Button>
                <Button type="primary" onClick={() => handleCopy(item)} style={{ marginRight: 8 }}>复制</Button>
                <Button type="primary" onClick={() => handleDel(item)}>删除</Button>
            </>
        )
    }]

    useEffect(() => {
        getPageModule()
    }, [])

    // 获取模块信息
    function getPageModule () {
        getModuleInfo({
            pageId: moduleData.pageId,
            groupCode: moduleData.groupCode,
            notCountryCode: true
        }).then((res) => {
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
                    item.extJson = item.extJson ? JSON.parse(item.extJson) : []
                    item.name = item.name ? JSON.parse(item.name).cn : ''
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

    function handleDel ({id}) {
        delHomeModuleItem({id}).then(res => {
            if (res.ret.errCode == 0) {
                message.success('删除成功')
                getDataList()
            }
        })
    }

    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        
        setModalData(data)
        setShowModal(true)
    }

    function handleCopy (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.id = ''

        setModalData(data)
        setShowModal(true)
    }

    function handleAdd() {
        setShowModal(true)
        setModalData({extJson: []})
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
        <div className="bottom-icon-wrapper">
            <Select style={{width: 140, marginRight: 8}} onChange={handleCountryChange} value={curModuleId}>
                {
                    countryList.map((item) => (
                        <Select.Option value={item.id} key={item.id}>{item.countryName}</Select.Option>
                    ))
                }
            </Select>
            <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd} style={{ marginRight: 8 }}>新增</Button>

            <p className="tip" style={{ marginTop: 8, color: '#F56C6C'}}><InfoCircleOutlined/>如果所有图标的展示时间失效，则使用默认的底部图标</p>

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
                    defaultPageSize: page.pageSize,
                    defaultCurrent: page.pageNum,
                    pageSizeOptions: [10, 20, 50, 100],
                    total: total,
                    onChange: changePage
                }}
            />

            <BottomIconModal
                showModal={showModal}
                countryList={countryList}
                modalData={modalData}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </div>
    )
}

export default BottomIcon
