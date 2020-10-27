import React, {useEffect, useState} from 'react'
import {Button, InputNumber, message, Modal, Pagination, Select, Switch, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import { dealShowFileSrc, filterData } from "@/utils/utils";
import { objectMapToArray } from "@/utils/index";
import { secondTimeFormat, filterCountry } from "@/utils/filter";
import {
    getHomeModuleList,
    getModuleInfo,
    addHomeModuleItem,
    editHomeModuleItem,
    delHomeModuleItem,
    sortHomeModuleItem,
    statusHomeModuleItem
} from '@/services/marketing';
import CommonSetModal from './CommonSetModal'
import moment from 'moment'
import { history } from 'umi';
const { confirm } = Modal

const BannerList = (props) => {
    const { curTab, APP_MODE_DETAIL_OBJ, PERSON_TYPE_OBJ, OPEN_TYPE_OBJ, APP_PAGE_ENUM, OPEN_TYPE_LIST, PERSON_TYPE_LIST, languages, moduleData } = props
    const [loading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [countryList, setCountryList] = useState([])
    const [modalData, setModalData] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [param, setParam] = useState({
        pageNum: 1,
        pageSize: 10,
        moduleId: null
    })
    const columns = [{
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        align: 'center',
        showTable: true,
        width: 80,
    }, {
        title: '标题',
        key: 'name',
        align: 'center',
        width: 100,
        showTable: true,
        render: (text, item) => (
            <span>{ JSON.parse(item.name).cn }</span>
        )
    }, {
        title: '图片',
        key: 'icon',
        width: 100,
        showTable: moduleData.columns.icon,
        align: 'center',
        render: (text, item) => (
            <img src={dealShowFileSrc(JSON.parse(item.icon).cn)} style={{ width: 80 }}/>
        )
    }, {
        title: moduleData.columns.personnelType || '用户类型',
        key: 'personnelType',
        align: 'center',
        showTable: moduleData.columns.personnelType,
        width: 100,
        render: (text, item) => (
            <span>{ PERSON_TYPE_OBJ[item.personnelType] }</span>
        )
    }, {
        title: moduleData.columns.openType || '跳转类型',
        key: 'openType',
        align: 'center',
        width: 100,
        showTable: moduleData.columns.openType,
        render: (text, item) => (
            <span>{ OPEN_TYPE_OBJ[item.openType] }</span>
        )
    }, {
        title: moduleData.columns.url || '跳转链接',
        key: 'url',
        showTable: moduleData.columns.url,
        align: 'center',
        width: 200,
        ellipsis: true,
        render: (text, item) => (
            <span>{ item.openType == 2 ? APP_PAGE_ENUM[item.url] : item.url }</span>
        )
    }, {
        title: '排序',
        key: 'sort',
        width: 200,
        showTable: true,
        render: (text, item, index) => (
            <>
                <InputNumber value={item.sort} min={0} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                <Button onClick={() => handleSort(item)}>排序</Button>
            </>
        )
    }, {
        title: '国家',
        key: 'countryCode',
        align: 'center',
        width: 100,
        showTable: true,
        render: (text, item) => (
            <span>{ filterCountry(item.countryCode) }</span>
        )
    }, {
        title: '更新时间',
        key: 'created',
        align: 'center',
        showTable: true,
        width: 200,
        render: (text, item) => (
            <span>{ secondTimeFormat(item.updated) }</span>
        )
    }, {
        title: '开始时间',
        key: 'startTime',
        showTable: moduleData.columns.startTime,
        align: 'center',
        width: 200,
        render: (text, item) => (
            <span>{ secondTimeFormat(item.startTime) }</span>
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        showTable: moduleData.columns.endTime,
        align: 'center',
        width: 200,
        render: (text, item) => (
            <span>{ secondTimeFormat(item.endTime) }</span>
        )
    }, {
        title: '操作',
        align: 'center',
        key: 'action',
        fixed: 'right',
        showTable: true,
        width: 200,
        render: (text, item) => (
            <div>
                {/*1上架2下架*/}
                { moduleData.btnAccess.status && <Switch checked={item.status == 1} onChange={ () => handleStatus(item)} /> }
                { moduleData.btnAccess.edit && <a onClick={() => handleEdit(item, 'edit')}>编辑 </a> }
                { moduleData.btnAccess.copy && <a  onClick={() => handleEdit(item, 'copy')}>复制 </a> }
                { moduleData.btnAccess.delete && <a onClick={() => handleDelete(item)}>删除 </a> }
                { moduleData.btnAccess.proManage && <a onClick={() => handleProManage(item)}>商品管理</a> }
            </div>
        )
    }]

    // 列表获取
    function getList(newParam) {
        setLoading(true)
        let fetchParam = {
            groupCode: moduleData.groupCode,
            ...param
        }
        Object.assign(fetchParam, newParam ? newParam : {})
        getHomeModuleList(filterData(fetchParam)).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setDataList(res.data.list ? res.data.list : [])
                setTotal(res.data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 切换国家
    function handleCountryChange (id) {
        let newParam = { ...param }
        newParam.moduleId = id
        setParam(newParam)
        getList({
            moduleId: id
        })
    }

    // 获取模块信息
    function getPageModule () {
        if (!moduleData) {
            return
        }
        setLoading(true)
        getModuleInfo({
            pageId: moduleData.pageId,
            groupCode: moduleData.groupCode,
            notCountryCode: true
        }).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0 && res.data.length) {
                setCountryList(res.data)
                handleCountryChange(res.data[0].id)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 分页信息改变
    function pageChange(pageNum, pageSize) {
        let newParam = { ...param }
        newParam.pageNum = pageNum
        newParam.pageSize = pageSize
        setParam(newParam)
        getList(newParam)
    }
    // 当前模块名称
    function getModalTitle() {
        let curModuleInfo = APP_MODE_DETAIL_OBJ.home.find((item) => {
            return item.key == curTab
        })
        if (!curModuleInfo) {
            return '提示'
        }
        return curModuleInfo.name
    }

    // 新增
    function handleAdd() {
        setModalData(filterData({
            personnelType: moduleData.columns.personnelType ? 3 : null,
            openType: moduleData.columns.openType ? 1 : null,
            status: moduleData.columns.status ? moduleData.columns.status : 1
        }))
        setShowModal(true)
    }
    // 编辑
    function handleEdit(param, type) {
        let item = JSON.parse(JSON.stringify(param))
        let extJson = item.extJson ? JSON.parse(item.extJson) : {}
        item.startTime = moment(item.startTime)
        item.endTime = moment(item.endTime)
        item.name = item.name ? JSON.parse(item.name) : {}
        item.icon = item.icon ? JSON.parse(item.icon) : {}
        item.subTitle = extJson.subTitle ? extJson.subTitle : {}
        item.spuId = extJson.spuId ? extJson.spuId : ''
        item.iconList = objectMapToArray(item.icon, 'languageCode', 'name')
        if (type == 'copy') {
            delete item.id
        }
        setModalData(item)
        setShowModal(true)
    }

    // 排序
    function handleSortChange(val, index) {
        let data = JSON.parse(JSON.stringify(dataList))
        data[index].sort = val
        setDataList(data)
    }

    function handleSort(item) {
        sortHomeModuleItem({
            sort: item.sort,
            id: item.id
        }).then((res) => {
            if (res.ret.errCode === 0) {
                message.success('成功')
                getList()
            }
        })
    }

    // 删除
    function handleDelete(item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除该项, 是否继续?',
            onOk() {
                delHomeModuleItem({
                    id: item.id
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getList()
                    }
                })
            },
            onCancel() {
                message.info('已取消删除')
            }
        })
    }

    // 商品管理
    function handleProManage(item) {
        history.push({
            pathname: '/marketingCenter/productManage',
            query: { moduleId: item.id, countryCode: item.countryCode },
        });
    }
    // 显示隐藏
    function handleStatus(item) {
        statusHomeModuleItem({
            id: item.id,
            status: item.status == 1 ? 2 : 1
        }).then((res) => {
            if (res.ret.errCode === 0) {
                getList()
            }
        })
    }

    function onClose () {
        setShowModal(false)
    }

    function onConfirm (data) {
        let fetchUrl = addHomeModuleItem
        if (data.id) {
            fetchUrl = editHomeModuleItem
        }
        Object.assign(data, {
            moduleId: param.moduleId
        })
        setModalLoading(true)
        fetchUrl(filterData(data)).then((res) => {
            setModalLoading(false)
            if (res.ret.errCode === 0) {
                message.success('成功')
                onClose()
                getList()
            }
        }).catch(() => {
            setModalLoading(false)
        })
    }
    useEffect(() => {
        getPageModule()
    }, [curTab])

    return (
        <div>
            <Select style={{width: 140, marginRight: 8}} onChange={handleCountryChange} value={param.moduleId}>
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
                scroll={{ x: '100%' }}
                loading={loading}
                columns={columns.filter((val) => val.showTable)}
                dataSource={dataList}
                pagination={{
                    pageSize: param.pageSize,
                    pageNum: param.pageNum,
                    pageSizeOptions: [10, 20, 50, 100],
                    total: total,
                    showTotal: () => `共 ${total} 条`,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    onChange: pageChange
                }}
                style={{ marginTop: 16 }}
            ></Table>

            {
                <CommonSetModal
                    title={getModalTitle()}
                    propParam={moduleData.columns}
                    modalData={modalData}
                    modalLoading={modalLoading}
                    countries={countryList}
                    showModal={showModal}
                    languages={languages}
                    OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                    PERSON_TYPE_LIST={PERSON_TYPE_LIST}
                    APP_PAGE_ENUM={APP_PAGE_ENUM}
                    onClose={onClose}
                    onConfirm={onConfirm}
                />
            }
        </div>
    )
}

export default BannerList
