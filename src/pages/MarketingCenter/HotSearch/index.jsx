import React, {useState, useEffect} from 'react'
import { Table, Modal, InputNumber, Button, Select, message, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ViewContainer from '@/components/ViewContainer'
import { useModel } from 'umi'
import { secondTimeFormat, filterCountry } from '@/utils/filter'
import HotSearchModal from './components/Modal'
import { getHotSearchList, hotSearchEdit, hotSearchDel, hotSearchSort, hotSearchAdd } from '@/services/marketing'
import { objectMapToArray } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import moment from 'moment'

const { confirm } = Modal
const OPEN_TYPE_OBJ = {
    1: 'H5',
    2: '应用内',
    3: '普通搜索'
}
const OPEN_TYPE_LIST = [{
    key: 1,
    name: 'H5'
}, {
    key: 2,
    name: '应用内'
}, {
    key: 3,
    name: '普通搜索'
}]

const APP_PAGE_ENUM = [{
    key: 'MEMBER_PAGE',
    name: '会员页'
}, {
    key: 'BUSINESS_SCHOOL',
    name: '商学院'
}, {
    key: 'SHOP_CART',
    name: '购物车页'
}, {
    key: 'USER_CENTER',
    name: '个人中心页'
}, {
    key: 'MY_INCOME',
    name: '我的收益页'
}, {
    key: 'MY_TEAM',
    name: '我的团队页'
}, {
    key: 'MY_COUPON',
    name: '优惠券列表页'
}, {
    key: 'MY_ORDER',
    name: '全部订单页'
}, {
    key: 'CUSTOMER_SERVICE',
    name: '客服页'
}, {
    key: 'ALL_CATEGORY',
    name: '全部分类'
}, {
    key: 'VIRTUAL_RECHARGE',
    name: '虚拟充值'
}]

/**
 * 热搜词
 */
const HotSearch = () => {
    const [name, setName] = useState('')
    const [countryCode, setCountryCode] = useState('MY')
    const { countries, languages } = useModel('dictionary')
    const [showModal, setShowModal] = useState(false)
    const [dataList, setDataList] = useState([])
    const [modalData, setModalData] = useState({name: []})
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '序号',
        key: 'numNo',
        width: 80,
        align: 'center',
        render: (text, item, index) => `${index + 1}`
    }, {
        title: '热搜词',
        key: 'name',
        width: 160,
        render: (text, item) => (
            <span style={{whiteSpace: 'pre-wrap'}}>{getAllName(item)}</span>
        )
    }, {
        title: '适用国家',
        key: 'countryCode',
        width: 140,
        render: (text, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: '跳转类型',
        key: 'openType',
        render: (text, item) => (
        <span>{OPEN_TYPE_OBJ[item.openType]}</span>
        )
    }, {
        title: '热搜词图标',
        key: 'icon',
        render: (text, item) => (
            <img src={dealShowFileSrc(JSON.parse(item.icon).cn)} style={{ width: 80 }}/>
        )
    }, {
        title: '当前排序',
        key: 'sort',
        render: (text, item, index) => (
            <>
                <InputNumber value={item.sort} min={0} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                <Button onClick={() => handleSort(item)}>排序</Button>
            </>
        )
    }, {
        title: '操作',
        render: (text, item) => (
            <>
                <Button type="primary" onClick={() => handleEdit(item)} style={{ marginRight: 8 }}>编辑</Button>
                <Button type="primary" danger onClick={() => handleDel(item)}>删除</Button>
            </>
        )
    }]

    useEffect(() => {
        getDataList({countryCode: 'MY'})
    }, [])

    function getAllName ({name}) {
        let res = ''
        let newName = JSON.parse(name)
        for (let key in newName) {
            let name = languages.find(language => language.code === key)
            let languageName = ''
            if (name) {
                languageName = name.desc
            }
            res += `${languageName}: ${newName[key]}\n`
        }

        return res
    }
    

    function handleEdit (item) {
        let data = JSON.parse(JSON.stringify(item))
        data.startTime = moment(data.startTime)
        data.endTime = moment(data.endTime)
        data.iconList = []
        data.icon = JSON.parse(data.icon)
        data.name = JSON.parse(data.name)
        data.iconList = objectMapToArray(data.icon, 'languageCode', 'name')
        setModalData(data)
 
        setShowModal(true)
    }

    function handleDel (item) {
        confirm({
            title: '提示',
            content: '此操作将永久删除该项, 是否继续?',
            onOk() {    
                hotSearchDel({
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

    function getDataList (data) {
        setLoading(true)
        let param = {
            countryCode: countryCode,
            ...page,
            name,
            sortType: 'asc',
            sortField: 'created'
        }
        param = Object.assign(param, data || {})
        getHotSearchList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode == 0) {
                const data = res.data
                setDataList(data.list)
                setTotal(data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    function onClose () {
        setShowModal(false)
    }

    function handleAdd () {
        setModalData({name: [], openType: 1})
        setShowModal(true)
    }

    function handleSortChange (val) {
        let temp = [...dataList]
        let item = temp[index]
        item.sort = val
        
        setDataList(temp)
    }

    function handleSort (item) {
        hotSearchSort({
            id: item.id,
            sort: item.sort
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('排序成功')
                getDataList()
            }
        })
    }

    function handleSearch (values) {
        let temp = {...values}
        setCountryCode(temp.countryCode)
        setName(temp.name)
        getDataList(temp)
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }
    
    function onConfirm (data) {
        if (data.id) {
            hotSearchEdit(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        } else {
            delete data.id
            hotSearchAdd(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                    getDataList()
                }
            })
        }
    }

    return (
        <ViewContainer>
            <Form layout="inline" onFinish={handleSearch} initialValues={{countryCode: 'MY'}}>
                <Form.Item name="name" label="关键词">
                    <Input/>
                </Form.Item>
                <Form.Item name="countryCode" label="国家">
                    <Select style={{width: 140, marginRight: 8}}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>

            <div style={{ marginTop: 8}}>
                <Button type="primary" onClick={handleAdd}><PlusOutlined />新增</Button>
            </div>

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
            />

            <HotSearchModal
                showModal={showModal} 
                countries={countries} 
                languages={languages}
                modalData={modalData} 
                onClose={onClose} 
                onConfirm={onConfirm}
                OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                APP_PAGE_ENUM={APP_PAGE_ENUM}
            />
        </ViewContainer>
    )
}

export default HotSearch;