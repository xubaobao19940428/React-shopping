import React, {useState, useEffect} from 'react'
import { Modal, Table, Button, Select, message } from 'antd'
import {PlusOutlined} from "@ant-design/icons"
import {
    getHomeModuleList,
    getModuleInfo,
    addHomeModuleItem,
    editHomeModuleItem,
    delHomeModuleItem,
    sortHomeModuleItem
} from '@/services/marketing'
import { categoryListGet } from '@/services/product'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import moment from 'moment'
import CategoryOperationModal from './CategoryOperationModal'
import { secondTimeFormat, filterCountry } from '@/utils/filter'

const { confirm } = Modal
const CategoryOperationList = (props) => {
    const {moduleData, OPEN_TYPE_LIST, OPEN_TYPE_OBJ, APP_PAGE_ENUM} = props
    const [loading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    const [categoryListLevelOne, setCategoryListLevelOne] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const [countryList, setCountryList] = useState([])
    const [curModuleId, setCurModuleId] = useState()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '名称',
        key: 'name',
        width: 100,
        align: 'center',
        dataIndex: 'name',
        fixed: 'left'
    }, {
        title: '关联一级类目',
        key: 'extJson',
        width: 120,
        render: (text, item) => (
            getcateName(item.cateId)
        )

    }, {
        title: '国家',
        key: 'countryCode',
        width: 140,
        render: (text, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: '跳转类型',
        key: 'openType',
        width: 100,
        align: 'center',
        render: (text, item) => (
            OPEN_TYPE_OBJ[item.openType]
        )
    }, {
        title: '跳转链接',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        ellipsis: true,
        width: 160,
        render: (text, item) => (
            item.openType == 1 ? item.url : APP_PAGE_ENUM[item.url]
        )
    }, {
        title: '图片',
        key: 'icon',
        width: 100,
        align: 'center',
        render: (text, item) => (
            <img src={dealShowFileSrc(item.icon.cn)} style={{ width: 80 }}/>
        )
    }, {
        title: '创建时间',
        key: 'created',
        width: 240,
        align: 'center',
        render: (text, item) => (
            <span>{ secondTimeFormat(item.created) }</span>
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        width: 240,
        align: 'center',
        render: (text, item) => (
            <span>{ secondTimeFormat(item.startTime) }</span>
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        width: 240,
        align: 'center',
        render: (text, item) => (
            <span>{ secondTimeFormat(item.endTime) }</span>
        )
    }, {
        title: '操作',
        width: 260,
        align: 'center',
        fixed: 'right',
        render: (text, item) => (
            <>
                <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEdit(item)}>编辑</Button>
                <Button type="primary" style={{ marginRight: 8}} onClick={() => handleCopy(item)}>复制</Button>
                <Button type="primary" danger onClick={() => handleDel(item)}>删除</Button>
            </>
        )
    }]

    useEffect(() => {
        getPageModule()
        getCategoryList()
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
                    item.extJson = item.extJson ? JSON.parse(item.extJson) : []
                    item.cateId = item.extJson.cateId
                    item.name = item.name ? JSON.parse(item.name).cn : ''
                    item.icon = item.icon ? JSON.parse(item.icon) : {}
                    return item
                })

                setDataList(temp || [])
                setTotal(res.data.total)
            }
        })
    }

    // 获取一级类目列表
    function getCategoryList () {
        let params = {
            cateType: 1, // 类目类型 1 前台类目 2 后台类目
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }
        categoryListGet(params).then((res) => {
            if (res.ret.errcode === 1) {
                let categoryUnitList = []
                _.forEach(res.categoryUnit, (item) => {
                    item.cateName = item.cateNameValue[0].name
                    categoryUnitList.push(item)
                })
                setCategoryListLevelOne(categoryUnitList)
            }
        }).catch((err) => {
        })
    }

    // 国家切换
    function handleCountryChange (val) {
        setCurModuleId(val)
        getDataList({moduleId: val})
    }

    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.iconList = []
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData(data)
        setShowModal(true)
    }

    function handleCopy(item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.id = ''
        data.iconList = []
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')

        setModalData(data)
        setShowModal(true)
    }

    function handleDel({id}) {
        confirm({
            title: '提示',
            content: '此操作将永久删除该项, 是否继续?',
            onOk() {
                delHomeModuleItem({
                    id
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

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }

    function getcateName (id) {
        let data = categoryListLevelOne.find((val) => {
            return val.cateId == id
        })
        return data ? data.cateName : ''
    }

    function handleAdd () {
        setModalData({
            openType: 1
        })
        setShowModal(true)
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
        <div className="category-operation-wrapper">
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
                    current: page.pageNum,
                    pageSizeOptions: [10, 20, 50, 100],
                    total: total,
                    onChange: changePage
                }}
            />

            <CategoryOperationModal
                showModal={showModal}
                countryList={countryList}
                modalData={modalData}
                onCancel={onCancel}
                onConfirm={onConfirm}
                categoryListLevelOne={categoryListLevelOne}
                OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                APP_PAGE_ENUM={APP_PAGE_ENUM}
            />
        </div>
    )
}

export default CategoryOperationList
