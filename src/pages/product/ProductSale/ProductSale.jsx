import React, { useState, useRef, useEffect } from 'react'
import { ViewContainer, QueryTable } from '@/components'
import styles from './styles/ProductSale.less'
import { Select, Input, Button, Space, Popover, message } from 'antd'
import { PlusOutlined, DownloadOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import { useModel, history } from 'umi'
import moment from 'moment'
import EditModal from './EditModal'
import BatchData from './BatchData'
import { getProductSaleList, getManualPushAdvancePurchase, getAdvanceSaleDownload, advanceSaleGet } from '@/services/product1'
import { warehousePage } from '@/services/product'
import { dealShowFileSrc } from '@/utils/utils'
import { filterCountry } from '@/utils/filter'

const { Option } = Select;

// 商品预售
const ProductSale = () => {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState('add')
    const { countries, languages } = useModel('dictionary')
    const [tableLoading, setTableLoading] = useState(false);    //表格loading
    const [total, setTotal] = useState(0)
    const [choseKey, setChoseKey] = useState('')
    const [tableData, setTableData] = useState([])
    const [wareHouseList, setWareHouseList] = useState([])
    const [skuList, setSkuList] = useState([])
    const [batchVisible, setBatchVisible] = useState(false)
    const [presaleData, setPresaleData] = useState({
        advanceId: '',
        productId: '',
        countryCode: ''
    })
    const [status, setStatus] = useState(1)
    const [list, setList] = useState([])
    const advanceStatus = {
        1: '未开始',
        2: '预售中',
        3: '已结束'
    }
    const [defaultValue, setDefaultValue] = useState({
        productId: "",
        timeList: [],
        deliveryDeadline: "",
        endConfig: null,
        purchaseConfig: null,
        purchaseDeadline: "",
        warehouseNo: "",
        countryCode: "",
        cover: '',
        name: ''
    })
    const modalRef = useRef();
    const tableRef = useRef();

    const setQueryKey = (val) => {
        setChoseKey(val)
    }
    const getWarehousePage = () => {
        let params = {
            page: {
                pageSize: 100,
                pageNum: 1
            }
        }
        warehousePage(params).then(res => {
            if (res.ret.errcode === 1) {
                console.log(res)
                let params = JSON.parse(JSON.stringify(res.list).replace(/warehouseNo/g,'value'))
                let list = JSON.parse(JSON.stringify(params).replace(/warehouseName/g,'label'))
                setWareHouseList(list)
            }
        })
    }
    const exportData = () => {
        setBatchVisible(true)
    }
    const downLoadData = () => {
        getAdvanceSaleDownload(tableRef.current.getFromData()).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                window.open(dealShowFileSrc(res.data.downloadUrl))
            }
        })
    }
    const productSaleList = (val) => {
        let params = JSON.parse(JSON.stringify(val).replace(/productQueryValue/g,choseKey))
        console.log(params)
        getProductSaleList(params).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                setTableData(res.data.advanceUnitList)
            }
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            let data = []
            for (const iterator of selectedRows) {
                data.push({
                    advanceId: iterator.advanceId,
                    skuCode: iterator.skuCode
                })
            }
            setSkuList(data)
        },
    }
    const getManualPush = () => {
        getManualPushAdvancePurchase({skuList}).then(res => {
            if (res.ret.errCode === 0) {
                message.success('手动推采购单成功！')
            }
        })
    }
    const addClick = () => {
        setVisible(true)
        setType('add')
        let obj = Object.assign({}, defaultValue,{
            productId: "",
            timeList: [],
            deliveryDeadline: "",
            endConfig: null,
            purchaseConfig: null,
            purchaseDeadline: "",
            warehouseNo: "",
            countryCode: "",
            cover: '',
            name: ''
        })
        setDefaultValue(obj)
    }
    const editClick = (val) => {
        let data = {
            ...presaleData,
            advanceId: val.advanceId,
            productId: val.productId,
            countryCode: val.countryCode
        }
        setPresaleData(data)
        toAdvanceSaleGet(data)
    }
    const toAdvanceSaleGet = (data) => {
        advanceSaleGet(data).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                let skuInfo = res.data.advanceProductList[0];
                let now = new Date().getTime();
                let status = 1
                if (now > Number(res.data.endTime)) {
                    status = 3;
                } else if (
                    now < Number(res.data.endTime) &&
                    now > Number(res.data.startTime)
                ) {
                    status = 2;
                } else {
                    status = 1;
                }
                setStatus(status)
                setList(res.data.advanceProductList)
                let obj = Object.assign({}, defaultValue,{
                    productId: skuInfo.productId,
                    timeList: [moment(Number(res.data.startTime)), moment(Number(res.data.endTime))],
                    deliveryDeadline: moment(Number(res.data.deliveryDeadline)),
                    endConfig: res.data.endConfig,
                    purchaseConfig: res.data.purchaseConfig,
                    purchaseDeadline: res.data.purchaseDeadline,
                    warehouseNo: res.data.warehouseNo,
                    countryCode: skuInfo.countryCode,
                    cover: skuInfo.cover,
                    name: skuInfo.name
                })
                setDefaultValue(obj)
                setVisible(true)
                setType('edit')
            }
        })
    }
    const batchCancel = () => {
        setBatchVisible(false)
    }
    const batchConfirm = () => {
        setBatchVisible(false)
        productSaleList({page:{pageNum:1,pageSize:10}})
    }
    const handleCancel = () => {
        setVisible(false)
        productSaleList({page:{pageNum:1,pageSize:10}})
    }
    useEffect(() => {
        getWarehousePage()
    }, [])

    return (
        <ViewContainer>
            <QueryTable
                tableItemCenter
                ref={tableRef}
                advance={3}
                dataSource={tableData}
                columns={[
                    {
                        title: "预售ID",
                        dataIndex: "advanceId",
                        fixed: 'left',
                        width: 120,
                        hideInForm: true
                    },
                    {
                        title: "skuCode",
                        dataIndex: "skuCode",
                        fixed: 'left',
                        width: 120,
                        hideInForm: true
                    },
                    {
                        title: "商品ID",
                        dataIndex: "productId",
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "商品",
                        dataIndex: "productQueryValue",
                        queryType: "render",
                        hideInTable: true,
                        width: 150,
                        renderFormItem: (form) => <div style={{ width: 300 }}>
                            <Select style={{ width: 100 }} allowClear onChange={val => {
                                setQueryKey(val);
                            }}>
                                <Option key="productIdKey">商品ID</Option>
                                <Option key="skuIdKey">skuId</Option>
                                <Option key="skuCodeKey">skuCode</Option>
                                <Option key="titleKey">商品名称</Option>
                            </Select>
                            <span><Input onChange={e => { form.setFieldsValue({ productQueryValue: e.target.value }); }} style={{ width: 190, marginLeft: 5 }} allowClear /></span>
                        </div>
                    },
                    {
                        title: "商品信息",
                        dataIndex: "title",
                        width: 200,
                        hideInForm: true,
                        columnDisabled: true,
                        render: (item, row) => <div className={styles.productInfo}>
                            <div className={styles.imgBox}>
                                <img src={dealShowFileSrc(row.cover)} />
                            </div>
                            <Popover placement="top" title={''} content={row.name} trigger="hover">
                                <span className={styles.productText}>{row.name}</span>
                            </Popover>
                        </div>
                    },
                    {
                        title: "规格信息",
                        dataIndex: "skuValueList",
                        width: 120,
                        hideInForm: true,
                        render: (item, row) => {
                            return (
                                row.skuValueList.map(item => {
                                    return (
                                        <div key={item.valueId}>
                                            <span>{item.attrName}：{item.valueName}</span>
                                        </div>
                                    )
                                })
                            )
                        }
                    },
                    {
                        title: "预售国家",
                        dataIndex: 'saleCountry',
                        queryType: "select",
                        width: 150,
                        valueEnum: countries.map(country => {
                            return {
                                value: country.shortCode,
                                label: country.nameCn
                            }
                        }),
                        render: (item, row) => {
                            return <span>{filterCountry(row.countryCode)}</span>
                        }
                    },
                    {
                        title: "状态",
                        formItemTitle: "预售状态",
                        dataIndex: "advanceStatusKey",
                        queryType: "select",
                        width: 100,
                        valueEnum: [
                            {
                                label: '未开始',
                                value: '1'
                            }, {
                                label: '预售中',
                                value: '2'
                            }, {
                                label: '已结束',
                                value: '3'
                            }
                        ],
                        render: (item, row) => {
                            return <div>{ advanceStatus[row.advanceStatus] }</div>
                        }
                    },
                    {
                        title: "预售开始时间",
                        dataIndex: 'startTime',
                        width: 150,
                        hideInForm: true,
                        format: 'time'
                    },
                    {
                        title: "预售结束时间",
                        dataIndex: 'endTime',
                        width: 150,
                        hideInForm: true,
                        format: 'time'
                    },
                    {
                        title: "采购控制",
                        queryType: "select",
                        dataIndex: "purchaseConfigKey",
                        valueEnum: [
                            {
                                label: '自动推单',
                                value: '1'
                            }, {
                                label: '手动推单',
                                value: '2'
                            }
                        ],
                        render:(item,row)=>{
                            return <div>{ row.purchaseConfig.name === 'PURCHASE_CONFIG_AUTO'?'自动推单':'手动推单' }</div>
                        }
                    },
                    {
                        title: "最迟推单时间",
                        dataIndex: 'purchaseDeadline',
                        width: 150,
                        hideInForm: true,
                        format: 'time'
                    },
                    {
                        title: "最迟发货时间",
                        dataIndex: 'deliveryDeadline',
                        width: 150,
                        hideInForm: true,
                        format: 'time'
                    },
                    {
                        title: "出库仓库",
                        queryType: "select",
                        dataIndex: "warehouseNoKey",
                        valueEnum: wareHouseList,
                        render: (item, row) => {
                            return <div>{row.warehouseName}</div>
                        }
                    },
                    {
                        title: "预售库存/预售库存预留",
                        dataIndex: "advanceStock",
                        hideInForm: true,
                        render:(item, row) => {
                            return <div>{row.advanceStock}/{row.restAdvanceStock}</div>
                        }
                    },
                    {
                        title: "已售子单量/待推采购单/超时未推单",
                        dataIndex: "soldChildOrderCount",
                        hideInForm: true,
                        render:(item, row) => {
                            return <div>{row.soldChildOrderCount}/{row.readyToPushPurchaseOrderCount}/{row.overduePurchaseOrderCount}</div>
                        }
                    },
                    {
                        title: "操作",
                        dataIndex: 'options',
                        hideInForm: true,
                        fixed: 'right',
                        width: 120,
                        render: (item,row) => <Button type="primary" onClick={()=>{editClick(row)}}>编辑</Button>
                    }
                ]}onQuery={({pageNum, pageSize, ...params}) => {
                    productSaleList({ ...params,page:{pageNum:pageNum,pageSize:pageSize}})
                }}
                tableProps={{
                    rowKey: "advanceId",
                    bordered: true,
                    scroll: { x: 'max-content' },
                    loading: tableLoading,
                    rowSelection: rowSelection,
                    pagination: {
                        total: total
                    }
                }}
                buttonRender={<Space>
                    <Button type="primary" onClick={ addClick } icon={<PlusOutlined />}>新增预售商品</Button>
                    <Button icon={<VerticalAlignTopOutlined />} onClick={exportData}>批量导入</Button>
                    <Button icon={<DownloadOutlined />} onClick={downLoadData}>下载</Button>
                    <Button onClick={getManualPush}>手动推采购单</Button>
                </Space>}
            />
            {visible &&
                <EditModal
                    type={type}
                    visible={visible}
                    list={list}
                    status={status}
                    defaultValue={defaultValue}
                    wareHouseList={wareHouseList}
                    presaleData={presaleData}
                    handleCancel={handleCancel}
                />
            }
            <BatchData batchVisible={batchVisible} batchCancel={batchCancel} batchConfirm={batchConfirm}/>
        </ViewContainer>
    )
}
export default ProductSale
