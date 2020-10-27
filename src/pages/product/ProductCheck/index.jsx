import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input, Tabs, Select, Checkbox, Pagination, DatePicker, Divider } from 'antd';
import styles from './index.less'
import { PlusOutlined, ArrowUpOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { listDrafts, getDraftOperatorList, deleteDrafts } from '@/services/product1'
import {supplierBasePage} from '@/services/supplier'
import { filterData, secondTimeFormat } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { history } from 'umi'
import moment from 'moment'
/**
*  商品审核管理
*/
const { RangePicker } = DatePicker;
const PUBLISH_TYPE_ENUM = {
    1: '手工录入',
    2: '一键上传',
    3: '供应商上传'
}
const SOURCE_ENUM = {
    1: "手工录入/自营",
    2: "甩宝",
    3: "1688",
    4: "拼多多"
}
const TIME_TYPE_LIST = [{
    label: "创建时间",
    value: 1
}, {
    label: "更新时间",
    value: 2
}]
const {Option} = Select
const ProductCheck = () => {
    const columns1 = [
        {
            title: '商品信息',
            width: 320,
            key: 'product',
            align: 'center',
            fixed: 'left',
            render: (_, item) => (
                <div className={styles.productInfoBox}>
                    <img width={100} src={dealShowFileSrc(item.image)}/>
                    {item.title}
                </div>
            )
        },
        {
            title: '发布方式',
            key: 'publishType',
            align: 'center',
            render: (_, item) => PUBLISH_TYPE_ENUM[item.publishType],
            width: 140
        },
        {
            title: '商品来源',
            key: 'source',
            align: 'center',
            render: (_, item) => SOURCE_ENUM[item.channel],
            width: 140
        },
        {
            title: '商品原始链接',
            key: 'age1',
            align: 'center',
            render: (_, item) => <a href={item.orgUrl} target="_blank" style={{ color: '#66b1ff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',  width: '150px'}}>{item.orgUrl}</a>,
            width: 200
        },
        {
            title: '后台类目',
            dataIndex: 'cateNameList',
            align: 'center',
            width: 220
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            align: 'center',
            width: 140
        },
        {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            render: (_, item) => secondTimeFormat(item.createTime),
            width: 240
        },
        {
            title: '更新人',
            align: 'center',
            dataIndex: 'operator',
            width: 140
        },
        {
            title: '更新时间',
            key: 'updateTime',
            align: 'center',
            render: (_, item) => secondTimeFormat(item.updateTime),
            width: 240
        },
        {
            title: '操作',
            key: 'action',
            fixed:'right',
            align: 'center',
            render: (_, row) => {
                return <Space size="middle">
                    {
                        row.draftStatus == 3 && <>
                            <a onClick={() => {
                                history.push({
                                    pathname: '/product/edit',
                                    query: {
                                        draftId: row.draftId
                                    }
                                })
                            }}>去审核</a>
                            <Divider type="vertical"/>
                        </>
                    }
                    <a onClick={() => handleDel(item)}>删除</a>
                </Space>
            },
            width: 160
        },

    ];
    const columns2 = [
        {
            title: '商品信息',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
            width: 200
        },
        {
            title: '供货价',
            dataIndex: 'age',
            key: 'age',
            width: 200
        },
        {
            title: '发布方式',
            key: 'tags',
            dataIndex: 'tags',
            width: 200
        },
        {
            title: '后台类目',
            dataIndex: 'age1',
            key: 'age1',
            width: 200
        },
        {
            title: '供应商',
            width: 200
        },
        {
            title: '商品来源',
            width: 200
        },
        {
            title: '国家',
            width: 200
        },
        {
            title: '创建时间',
            width: 200
        },
        {
            title: '更新人',
            width: 200
        },
        {
            title: '更新时间',
            width: 200
        },
        {
            title: '操作',
            key: 'action',
            fixed:'right',
            render: (text, row, index) => {
                return <Space size="middle">
                    <a onClick={() => {
                        
                    }}>编辑</a>
                    <a onClick={() => { }}>删除</a>
                </Space>
            },
            width: 200
        },

    ];
    const { TabPane } = Tabs
    const attrFormRef = useRef()
    const attrValFormRef = useRef()
    const [tableData, setTable] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [createUser,setCreateUser] = useState([])
    const [supplierList,setSuppliterList] = useState([])
    const [curTab, setCurTab] = useState('oneKeyPublish')
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })

    const changeTabs = (val) => {
        setCurTab(val)
        if (val === 'oneKeyPublish') {
            getListDrafts()
        } else {
            getSupplierList()
        }
    }

    // 删除草稿
    const handleDel = useCallback((item) => {
        deleteDrafts({draftIdList: [item.draftId]}).then(res => {
            if (res.ret.errCode === 0) {
                message.success('删除成功')
                getListDrafts()
            }
        })
    }, [])

    // 获取创建人列表
    const draftOperatorList = ()=>{
        var params={
            operatorType: 1
        }
        getDraftOperatorList(params).then(resultes=>{
            if(resultes.ret.errCode == 0){
                setCreateUser(resultes.data.operatorList)
            }
        }).catch(error=>{
            console.log(error)
        })
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        if (curTab === 'oneKeyPublish') {
            getListDrafts(temp)
        } else {
            
        }
    }

    const getListDrafts =()=>{
        setLoading(true)
        let params={
            pageSize: 10,
            pageNum: 1
        }
        if(attrFormRef.current){
            let currentValue = attrFormRef.current.getFieldsValue()
            if (currentValue) {
              params = Object.assign({}, params, currentValue)
              if (currentValue.timeList) {
                params.startTime = moment(currentValue.timeList[0]).valueOf()
                params.endTime = moment(currentValue.timeList[1]).valueOf()
              }
            } else {
              console.log('error,submit')
            }
        }
        listDrafts(params).then(resultes=>{
            setLoading(false)
            if(resultes.ret.errCode == 0){
                setTable(resultes.data.list)
                setTotal(resultes.data.total)
            }
        }).catch(error=>{
            setLoading(false)
            console.log(error)
        })
    }

    /**
     * 获取供应商列表
    */
    const getSupplierList=(query)=> {
        let params = {
            supplierName: query 
        }
        if(attrValFormRef.current){
            let currentValue = attrValFormRef.current.getFieldsValue()
            if (currentValue) {
              params = Object.assign({}, params, currentValue)
            } else {
              console.log('error,submit')
            }
        }
        supplierBasePage(filterData(params)).then(res => {
            console.log(res)
            if (res.ret.errcode === 1) {
            setSuppliterList(res.list)
            }
        })
    }

    useEffect(()=>{
        draftOperatorList()
        getListDrafts()
    },[])

    return (
        <ViewContainer>
            <Tabs onChange={changeTabs} type="card" defaultActiveKey="oneKeyPublish" style={{ height: '100%' }}>
                {/* 一键上传 */}
                <TabPane tab="一键上传" key="oneKeyPublish">
                    <div className={styles['container']}>
                        <Form
                            initialValues={{}}
                            name="complex-form"
                            layout="inline" 
                            style={{ marginBottom: "20px" }}
                            className={styles['contain-form']}
                            ref={attrFormRef}>
                            <Form.Item label="时间查询：" className={styles['ant-form-item']}>
                                <Input.Group compact>
                                    <Form.Item
                                        name="timeType"
                                        noStyle
                                    >
                                        <Select placeholder="请选择" style={{ width: '120px' }} allowClear options={TIME_TYPE_LIST}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="timeList"
                                        noStyle
                                    >
                                        <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item label="创建人：" name="operatorId" className={styles['ant-form-item']}>
                                <Select placeholder="请选择" style={{ width: '200px' }} allowClear>
                                    {
                                        createUser.map((item,index)=>{
                                        return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" style={{ marginRight: 10 }}  icon={<SearchOutlined />} onClick={getListDrafts}>搜索</Button>
                                <Button style={{ marginRight: 10 }} icon={<ReloadOutlined />}>重置</Button>
                            </Form.Item>
                        </Form>
                        <Table 
                            loading={loading}
                            columns={columns1} 
                            scroll={{ x: '100%'}}
                            dataSource={tableData} 
                            rowKey="draftId"
                            pagination={false} 
                            bordered />
                        <Pagination
                            total={total}
                            current={page.pageNum}
                            pageSize={page.pageSize}
                            style={{ textAlign: 'right', marginTop: 20 }}
                            showTotal={total => `共 ${total} 数据`}
                            onChange={changePage}
                            pageSizeOptions={[10, 20, 50, 100]}
                            showQuickJumper
                            showSizeChanger
                        />
                    </div>
                </TabPane>

                {/* 商家发布 */}
                <TabPane tab="商家发布" key="supplierPublish">
                    <div className={styles['container']}>
                        <Form
                            name="complex-form"
                            layout="inline" style={{ marginBottom: "20px" }}
                            className={styles['contain-form']}
                            ref={attrValFormRef}>
                           <Form.Item label="时间查询：" className={styles['ant-form-item']}>
                                <Input.Group compact>
                                    <Form.Item
                                        name={['attr', 'attrNameLanguageCode']}
                                        noStyle
                                    >
                                        <Select placeholder="请选择" style={{ width: '120px' }} allowClear options={TIME_TYPE_LIST}/>
                                    </Form.Item>
                                    <Form.Item
                                        name={['attr', 'attrNameKey']}
                                        noStyle
                                    >
                                        <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item label="后台类目：" name="productIdKey" className={styles['ant-form-item']}>
                                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
                            </Form.Item>
                            <Form.Item label="供应商：" name="supplier" className={styles['ant-form-item']}>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onSearch={getSupplierList}
                                    allowClear
                                >
                                    {
                                        supplierList.map(item=>{
                                        return <Option value={item.supplierId} key={item.supplierId}>{item.supplierName}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" style={{ marginRight: 10 }}  icon={<SearchOutlined />}>搜索</Button>
                                <Button style={{ marginRight: 10 }} icon={<ReloadOutlined />}>重置</Button>
                            </Form.Item>
                        </Form>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="全部" key="1"></TabPane>
                            <TabPane tab="待审核" key="2"></TabPane>
                            <TabPane tab="审核通过" key="3"></TabPane>
                            <TabPane tab="审核不通过" key="4"></TabPane>
                            <TabPane tab="草稿" key="5"></TabPane>
                        </Tabs>
                        <Table 
                            loading={loading}
                            columns={columns2} 
                            rowKey="id"
                            dataSource={tableData} 
                            pagination={false} 
                            bordered />
                        <Pagination
                            current={page.pageNum}
                            pageSize={page.pageSize}
                            total={total}
                            pageSizeOptions={[10, 20, 50, 100]}
                            style={{ textAlign: 'right', marginTop: 20 }}
                            showTotal={total => `共 ${total} 数据`}
                            onChange={changePage}
                            showQuickJumper
                            showSizeChanger
                        />
                    </div>
                </TabPane>
            </Tabs>
        </ViewContainer>
    )
}
export default ProductCheck;