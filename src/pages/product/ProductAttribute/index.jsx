import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input, Tabs, Select, Checkbox, Pagination, message, Modal } from 'antd';
import styles from './styles/ProductAttr.less'
import { PlusOutlined, ArrowUpOutlined, ReloadOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import AddProductAttr from './components/AddProductAttr'
import { productAttrGet, productAttrValueGet, productAttrGetById, productAttrModify, productAttrAdd, productAttrDisable, productAttrValueDisable,productAttrDownload,productAttrValueDownload} from '@/services/product1'
import { filterData } from '@/utils/filter';
import { timestampToTime } from '@/utils';
import { transform } from 'lodash';
import UploadAttr from './components/UploadAttr';
import UploadAttrVal from './components/UploadAttrVal'
/**
/*  属性管理
/*
/*
*/
const { confirm } = Modal
const ProductAttribute = () => {
    const columns1 = [
        {
            title: '属性值ID',
            dataIndex: 'attrId',
            key: 'attrId',
            width: 100,
            align: 'center'
        },
        {
            title: '名称-简体中文',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.attrNameCodeList.map(item => {
                            if (item.languageCode == 'cn') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-英文',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.attrNameCodeList.map(item => {
                            if (item.languageCode == 'en') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-马来语',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.attrNameCodeList.map(item => {
                            if (item.languageCode == 'ms') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-泰语',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.attrNameCodeList.map(item => {
                            if (item.languageCode == 'th') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-印尼语',
            width: 200,
            render: (text, row, index) => {
                return <div>
                    {
                        row.attrNameCodeList.map(item => {
                            if (item.languageCode == 'id') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            },
            align: 'center',
        },
        {
            title: '更新人',
            width: 200,
            dataIndex: 'operationName',
            align: 'center',
        },
        {
            title: '更新时间',
            width: 200,
            render: (text, row, index) => {
                return <div>{timestampToTime(Number(row.updateTime))}</div>
            },
            align: 'center',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, row, index) => {
                return <Space size="middle">
                    <a onClick={() => editProductAttr(row.attrId)}>编辑</a>
                    <a onClick={() => deleteAttr(row)}>删除</a>
                </Space>
            },
            width: 200,
            align: 'center',
            fixed: 'right'
        },

    ];
    const columns2 = [
        {
            title: '属性值ID',
            dataIndex: 'valueId',
            key: 'valueId',
            width: 100,
            align: 'center'
        },
        {
            title: '名称-简体中文',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueNameList.map(item => {
                            if (item.languageCode == 'cn') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-英文',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueNameList.map(item => {
                            if (item.languageCode == 'en') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-马来语',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueNameList.map(item => {
                            if (item.languageCode == 'ms') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-泰语',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueNameList.map(item => {
                            if (item.languageCode == 'th') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            }
        },
        {
            title: '名称-印尼语',
            width: 200,
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueNameList.map(item => {
                            if (item.languageCode == 'id') {
                                return <span key={item.name}>{item.name}</span>
                            }
                        })
                    }
                </div>
            },
            align: 'center',
        },
        {
            title: '归属属性',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {row.attrId} {row.attrName}
                </div>
            }
        },
        {
            title: '是否是模版',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.valueType === 1 ? '是' : '否'
                    }
                </div>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text,row,index) => {
                return <Space size="middle">
                    <a disabled>编辑</a>
                    <a onClick={() => deleteAttrVal(row)}>删除</a>
                </Space>
            },
            width: 200,
            align: 'center',
            fixed: 'right'
        },
    ];
    const { TabPane } = Tabs
    const [countryLanage, setCountryLanage] = useState([])


    const [countryList, setCountryList] = useState([])
    //属性管理
    const [tableData, setTable] = useState([])
    const attrFormRef = useRef()
    const [sensitiveTotal, setSensitiveTotal] = useState(0)
    const [sensitivePageSize, setSensitivePageSize] = useState(20)
    const [sensitivePageNum, setSensitivePageNum] = useState(1)
    const [sensitiveLoading, setSensitiveLoading] = useState(false)
    const [selectedRowKeys, setSelect] = useState([])
    const [checkStrictly, setCheckStrictly] = useState(false)
    const addProductAttrRef = useRef()
    //属性值管理
    const attrValFormRef = useRef()
    const [attrValTableData, setAttrValueTable] = useState([])
    const [attrValueTotal, setAttrValueTotal] = useState(0)
    const [attrValuePageSize, setAttrValuePageSize] = useState(20)
    const [attrValuePageNum, setAttrValuePageNum] = useState(1)
    const [attrValueLoading, setAttrValueLoading] = useState(false)
    const [attrValueSelectedRowKeys, setAttrValueSelect] = useState([])
    const [attrValCheckStrictly, setAttrvalCheckStrictly] = useState(false)
    //导表修改
    const [uploadAttrVisible, setUploadAttrVisible] = useState(false)
    const [uploadAttrValVisible, setUploadAttrValVisible] = useState(false)
    const changeTabs = (val) => {
        if (val == 'attr') {
            searchAttr(sensitivePageNum, sensitivePageSize)
        } else {
            getProductAttrValueGet(attrValuePageNum, attrValuePageSize)
        }
    }
    //属性值管理
    const attrValChangeCurrentSize = (pageNum, pageSize) => {
        setAttrValuePageSize(pageSize)
        setAttrValuePageNum(pageNum)
        getProductAttrValueGet(pageNum, pageSize)
    }
    // 属性值列表
    const getProductAttrValueGet = (pageNum, pageSize) => {
        setAttrValueLoading(true)
        console.log(attrValFormRef)
        let params = {
            page: {
                pageNum: pageNum,
                pageSize: pageSize,
            },

        }
        if (attrValFormRef.current) {
             params.emptyLanguage = attrValFormRef.current.getFieldsValue().emptyLanguage,
                params.productIdKey = attrValFormRef.current.getFieldsValue().productIdKey,
                params.valueIdKey = attrValFormRef.current.getFieldsValue().valueIdKey
        }
        productAttrValueGet(filterData(params)).then(resultes => {
            if (resultes.ret.errCode == 0) {
                console.log(resultes)
                setAttrValueTable(resultes.data.productAttrValueList)
                setAttrValueTotal(resultes.data.total)
                setAttrValueLoading(false)
                setAttrValueSelect([])
            } else {
                setAttrValueLoading(false)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const addProductAttribute = () => {
        addProductAttrRef.current.changeVal(true)
    }
    //属性管理分页
    const changeCurrentSize = (pageNum, pageSize) => {
        setSensitivePageNum(pageNum)
        setSensitivePageSize(pageSize)
        searchAttr(pageNum, pageSize)
    }
    //属性管理数据
    const searchAttr = (pageNum, pageSize) => {
        setSensitiveLoading(true)
        let params = {
            page: {
                pageNum: pageNum,
                pageSize: pageSize
            },
            attrNameKey: attrFormRef.current.getFieldsValue().attr.attrNameKey,
            attrNameLanguageCode: attrFormRef.current.getFieldsValue().attr.attrNameLanguageCode,
            attrIdKey: attrFormRef.current.getFieldsValue().attrIdKey,
            categoryNameKey: attrFormRef.current.getFieldsValue().categoryNameKey,
            emptyLanguage: attrFormRef.current.getFieldsValue().emptyLanguage,
            emptyLanguageCode: attrFormRef.current.getFieldsValue().emptyLanguage.join(',')
        }
        productAttrGet(filterData(params)).then(resultes => {
            if (resultes.ret.errCode == 0) {
                console.log(resultes)
                setSensitiveLoading(false)
                setTable(resultes.data.productAttrList)
                setSensitiveTotal(resultes.data.total)

            }
        }).catch(error => {

        })
    }
    //属性选择
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelect(selectedRowKeys)
        },
    }
    const attrValRowSelection = {
        attrValueSelectedRowKeys,
        onChange: (attrValueSelectedRowKeys, selectedRows) => {
            setAttrValueSelect(attrValueSelectedRowKeys)
        },
    }
    //一键翻译
    const attributeTransformLate = (type) => {
        let params = {
            attrId: [],
            valueId: [],
            targetLanguageCode: ['en', 'ms', 'th', 'id']
        }
        if (type == 'attr') {
            if (selectedRowKeys.length == 0) {
                message.warning('请挑选要翻译的属性')
                return false
            } else {
                params.attrId = selectedRowKeys
            }
        } else {
            if (attrValueSelectedRowKeys.length == 0) {
                message.warning('请挑选要翻译的属性值')
                return false
            } else {
                params.valueId = attrValueSelectedRowKeys
            }
        }
        translateSelectedAttr(filterData(params)).then(resultes => {
            if (resultes.ret.errcode == 1) {
                message.success('翻译成功')
                if (type == 'attr') {
                    searchAttr(sensitivePageNum, sensitivePageSize)
                    setSelect([])
                } else if (type == 'attrVal') {

                    getProductAttrValueGet(attrValuePageNum, attrValuePageSize)
                    setAttrValueSelect([])

                }
            }
        })
    }
    //编辑属性
    const editProductAttr = (attrId) => {
        let params = {
            attrId: attrId,
            filterHiddenAttrValue: true
        }
        productAttrGetById(params).then((response) => {
            console.log(response)
            if (response.ret.errCode == 0) {
                let attrName = {}
                attrName.attrId = response.data.attrId
                attrName.canBeModify = response.data.canBeModify
                response.data.attrNameList.map(item => {
                    attrName[item.languageCode] = {
                        value: item.name ? item.name : ''
                    }
                })
                let attrValList = []
                if (response.data.attrValueList.length != 0) {
                    response.data.attrValueList.map(item => {
                        let attrValue = {}
                        attrValue.valueId = item.valueId
                        attrValue.canBeModify = item.canBeModify
                        item.valueNameList.map((valName, index) => {
                            attrValue[valName.languageCode] = {
                                value: valName.name ? valName.name : ''
                            }
                        })
                        attrValList.push(attrValue)
                    })
                }
                // else{
                //     let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
                //     var data = {}
                //         countryCodeLists.map(item => {
                //             data[item.code] = {
                //                 editable: false,
                //                 value: ''
                //             }
                //         })
                //     attrValList.push(JSON.parse(JSON.stringify(data)))
                // }
                console.log(attrValList)
                addProductAttrRef.current.changeVal(true)
                addProductAttrRef.current.changeContent({ attrName: [attrName], type: 'edit', attrVal: attrValList })
                addProductAttrRef.current.changeAttrId(response.data.attrId)
            }
        }).catch((err) => {
            console.error(err)
        })
    }
    //删除属性
    const deleteAttr = (row) => {
        confirm({
            title: '确定删除该属性？',
            icon: <ExclamationCircleOutlined />,
            content: <div style={{ color: 'red' }}>{`删除属性："${row.attrName}"不会影响商品，但其与后台类目的绑定关系将解除，且一经删除无法恢复`}</div>,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                let params = {
                    attrId: row.attrId
                }
                productAttrDisable(params).then(resultes => {
                    if (resultes.ret.errCode == 0) {
                        message.success('操作成功！')
                        searchAttr(1, 20)
                        setSensitivePageNum(1)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //删除属性值
    const returnAttrName = (valueNameList) => {
        let str = ''
        valueNameList.map(item => {
            if (item.languageCode == 'cn') {
                str = item.name
            }
        })
        return str
    }
    const deleteAttrVal = (row) => {
        console.log(row)
        confirm({
            title: '确定删除该属性？',
            icon: <ExclamationCircleOutlined />,
            content: <div style={{ color: 'red' }}>{`删除属性值："${returnAttrName(row.valueNameList)}"不会影响商品，但其与后台类目的绑定关系将解除，且一经删除无法恢复`}</div>,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                let params = {
                    attrId: row.attrId,
                    valueId: row.valueId
                }
                productAttrValueDisable(params).then(resultes => {
                    if (resultes.ret.errCode == 0) {
                        message.success('操作成功！')
                        setAttrValuePageNum(1)
                        getProductAttrValueGet(1, attrValuePageSize)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //新增
    const addAttrDetail = (data) => {
        if (data.attrId == '') {
            productAttrAdd(data.data).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    message.success('新增成功')
                    addProductAttrRef.current.changeVal(false)
                    addProductAttrRef.current.changeType()
                    addProductAttrRef.current.changeAttrId('')
                    searchAttr(1, 20)
                    setSensitivePageNum(1)

                }
            }).catch(error => {
                console.log(error)
            })
        } else {
            console.log(data)
            let params = {
                attrId: data.attrId,
                attrNameList: data.data.attrNameList,
                attrValueList: data.data.attrValueList,
                customize: data.data.customize
            }
            productAttrModify(params).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    message.success('编辑成功')
                    addProductAttrRef.current.changeVal(false)
                    addProductAttrRef.current.changeType()
                    addProductAttrRef.current.changeAttrId('')
                    searchAttr(1, 20)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
    // 导表修改
    const attrNameUpload = () => {
        setUploadAttrVisible(true)
    }
    const cancelUploadAttrVisible = () => {
        setUploadAttrVisible(false)
    }
    const uploadAttrVal = () => {
        setUploadAttrValVisible(true)
    }
    const cancelUploadAttrValVisible = () => {
        setUploadAttrValVisible(false)
    }
    //属性以及属性值导出
    const downAttr=(type)=>{
        if(type=='attr'){
            let params = {
                attrNameKey: attrFormRef.current.getFieldsValue().attr.attrNameKey,
                attrNameLanguageCode: attrFormRef.current.getFieldsValue().attr.attrNameLanguageCode,
                attrIdKey: attrFormRef.current.getFieldsValue().attrIdKey,
                categoryNameKey: attrFormRef.current.getFieldsValue().categoryNameKey,
                emptyLanguage: attrFormRef.current.getFieldsValue().emptyLanguage,
                emptyLanguageCode: attrFormRef.current.getFieldsValue().emptyLanguage.join(',')
            }
            productAttrDownload(filterData(params)).then(resultes=>{
                if(resultes.ret.errCode==0){
                    window.open(resultes.data.fileUrl)
                }
            }).catch(error=>{

            })
        }else{
            let params={

            }
            if (attrValFormRef.current) {
                params.emptyLanguage = attrValFormRef.current.getFieldsValue().emptyLanguage,
                   params.productIdKey = attrValFormRef.current.getFieldsValue().productIdKey,
                   params.valueIdKey = attrValFormRef.current.getFieldsValue().valueIdKey
           }
            productAttrValueDownload(params).then(resultes=>{
                if(resultes.ret.errCode==0){
                    window.open(resultes.data.fileUrl)
                }
            })
        }

    }
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
        let countryLists = JSON.parse(localStorage.getItem('COUNTRY_LIST'))
        setCountryList(countryLists)
        searchAttr(sensitivePageNum, sensitivePageSize)
    }, [])
    return (
        <ViewContainer>
            <Tabs onChange={changeTabs} type="card" defaultActiveKey="attr" style={{ height: '100%' }}>
                {/* 属性管理 */}
                <TabPane tab="属性管理" key="attr">
                    <div className={styles['container']}>
                        <Form
                            initialValues={{
                                attr:
                                {
                                    attrNameKey: '',
                                    attrNameLanguageCode: "cn"
                                },
                                attrIdKey: '',
                                attrNameKey: '',
                                categoryNameKey: '',
                                emptyLanguage: []
                            }}
                            name="complex-form"
                            layout="inline" style={{ marginBottom: "20px" }}
                            className={styles['contain-form']}
                            ref={attrFormRef}>
                            <Form.Item label="属性ID：" name="attrIdKey" className={styles['ant-form-item']}>
                                <Input placeholder="多个属性请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
                            </Form.Item>
                            {/* <Form.Item label="同义词：" name="attrNameKey" className={styles['ant-form-item']}>
                                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
                            </Form.Item> */}
                            <Form.Item label="属性名：" className={styles['ant-form-item']}>
                                <Input.Group compact>
                                    <Form.Item
                                        name={['attr', 'attrNameLanguageCode']}
                                        noStyle
                                    >
                                        <Select placeholder="请选择" style={{ width: '120px' }} allowClear>
                                            {
                                                countryLanage.map(item => {
                                                    return <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={['attr', 'attrNameKey']}
                                        noStyle
                                    >
                                        <Input style={{ width: '200px' }} placeholder="请输入属性名" />
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item label="后台类目：" name="categoryNameKey" className={styles['ant-form-item']}>
                                <Input style={{ width: '200px' }} placeholder="请输入后台类目名称" />
                            </Form.Item>
                            <Form.Item name="emptyLanguage" label="查看空名称：" className={styles['ant-form-item']}>
                                <Checkbox.Group>
                                    {
                                        countryList.map((item, index) => {
                                            return <Checkbox key={item.shortCode} value={item.shortCode}>{item.nameCn}</Checkbox>
                                        })
                                    }
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" style={{ marginRight: 10 }} onClick={() => searchAttr(1, 20)} icon={<SearchOutlined />}>搜索</Button>
                                <Button style={{ marginRight: 10 }} icon={<ReloadOutlined />}>重置</Button>
                                <Button type="primary" onClick={()=>downAttr('attr')}>导出</Button>
                            </Form.Item>
                        </Form>
                        <div className={styles['contain-form']}>
                            <Button type="primary" style={{ marginRight: 10 }} icon={<PlusOutlined />} onClick={addProductAttribute}>新增</Button>
                            <Button type="primary" style={{ marginRight: 10 }} icon={<ArrowUpOutlined />} onClick={attrNameUpload}>导表修改</Button>
                            <a onClick={() => attributeTransformLate('attr')}>一键自动翻译</a>
                        </div>
                        <Table columns={columns1} dataSource={tableData} pagination={false} className={styles['contain-table']} bordered loading={sensitiveLoading} rowKey="attrId" scroll={{ "x": '100vw' }} rowSelection={{ ...rowSelection, checkStrictly }} />
                        <Pagination
                            defaultPageSize={20}
                            defaultCurrent={1}
                            current={sensitivePageNum}
                            total={sensitiveTotal}
                            pageSize={sensitivePageSize}
                            showTotal={sensitiveTotal => `共 ${sensitiveTotal} 数据`}
                            onChange={changeCurrentSize}
                            pageSizeOptions={[10, 20, 50, 100]}
                            showQuickJumper
                            showSizeChanger
                        // style={{ marginTop: 20 }}
                        />
                    </div>
                </TabPane>
                {/* 属性值管理 */}
                <TabPane tab="属性值管理" key="attrValue">
                    <div className={styles['container']}>
                        <Form
                            initialValues={{
                                emptyLanguage: [],
                                productIdKey: '',
                                valueIdKey: ''
                            }}
                            name="complex-form"
                            layout="inline" style={{ marginBottom: "20px" }}
                            className={styles['contain-form']}
                            ref={attrValFormRef}>
                            <Form.Item label="属性值ID：" name="valueIdKey" className={styles['ant-form-item']}>
                                <Input placeholder="多个属性请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
                            </Form.Item>
                            <Form.Item label="SPUID：" name="productIdKey" className={styles['ant-form-item']}>
                                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
                            </Form.Item>
                            <Form.Item name="emptyLanguage" label="查看空名称：" className={styles['ant-form-item']}>
                                <Checkbox.Group>
                                    {
                                        countryList.map((item, index) => {
                                            return <Checkbox key={item.shortCode} value={item.shortCode}>{item.nameCn}</Checkbox>
                                        })
                                    }
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item label=" " colon={false}>
                                <Button type="primary" style={{ marginRight: 10 }} icon={<SearchOutlined />} onClick={() => getProductAttrValueGet(1, 20)}>搜索</Button>
                                <Button style={{ marginRight: 10 }} icon={<ReloadOutlined />}>重置</Button>
                                <Button type="primary"onClick={()=>downAttr('attrVal')}>导出</Button>
                            </Form.Item>
                        </Form>
                        <div className={styles['contain-form']}>
                            <Button type="primary" style={{ marginRight: 10 }} icon={<ArrowUpOutlined />} onClick={uploadAttrVal}>导表修改</Button>
                            <a onClick={() => attributeTransformLate('attrVal')}>一键自动翻译</a>
                        </div>
                        <Table columns={columns2} dataSource={attrValTableData} pagination={false} className={styles['contain-table']} bordered scroll={{ "x": '100vw' }} loading={attrValueLoading} rowKey="valueId" rowSelection={{ ...attrValRowSelection, attrValCheckStrictly }} />
                        <Pagination
                            defaultPageSize={10}
                            defaultCurrent={1}
                            current={attrValuePageNum}
                            total={attrValueTotal}
                            pageSize={attrValuePageSize}
                            showTotal={attrValueTotal => `共 ${attrValueTotal} 数据`}
                            onChange={attrValChangeCurrentSize}
                            pageSizeOptions={[10, 20, 50, 100]}
                            showQuickJumper
                            showSizeChanger
                        />
                    </div>
                </TabPane>
            </Tabs>
            {/* 属性添加 */}
            <AddProductAttr ref={addProductAttrRef} resetSearch={() => getProductAttrValueGet(1, 20)} addAttrDetail={addAttrDetail}></AddProductAttr>
            {/* 属性名称导表修改 */}
            <UploadAttr visible={uploadAttrVisible} cancel={() => cancelUploadAttrVisible()}></UploadAttr>
            {/* 属性值导入修改 */}
            <UploadAttrVal visible={uploadAttrValVisible} cancel={() => cancelUploadAttrValVisible()}></UploadAttrVal>

        </ViewContainer>
    )
}
export default ProductAttribute;
