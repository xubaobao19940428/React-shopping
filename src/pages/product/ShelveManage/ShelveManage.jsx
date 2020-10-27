import React, { useState, useEffect, useMemo, useCallback, forwardRef, useRef } from 'react';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import { Select, Input, DatePicker, Button, Tabs, Popover, Space, Pagination, Radio, message } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { getShelveList, batchOffShelve, batchOnShelveCheck, batchAcceptShelveAdviceCheck, batchOnShelve,changeSaleStatus,batchAcceptShelveAdvice} from '@/services/product1';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { dealShowFileSrc } from '@/utils/utils'
import Form from 'antd/lib/form/Form';
import SheleDown from './components/ShelveDown'
import SheleUp from './components/ShelveUp'
import {filterData} from '@/utils/filter'
const Option = Select.Option;

/**
 * 上下架管理
 * 
 */
const ShelveManage = () => {
    const [queryForm, setQueryForm] = useState({})
    const initFrontTypes = [{ label: "选项", value: 4, children: [{ label: "子项", value: 5 }] }, { label: "选项2", value: 5 }, { label: "选项3", value: 6 }];
    const [queryKey, setQueryKey] = useState("productIdKey");
    const [frontTypes, setFrontTypes] = useState(initFrontTypes);
    const [size, setSize] = useState('small');
    const [countryCode, setDefaultActiveKey] = useState('MY')
    const { TabPane } = Tabs;
    const [tableData, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [defaultPageSize, setDefaultPageSize] = useState(10)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [checkStrictly, setCheckStrictly] = useState(false)
    const [selectedRowKeys, setSelect] = useState([])
    //上下架状态
    const [upUisible, setUpVisible] = useState(false)
    const [downVisible, setDownVisible] = useState(false)
    const upShelveRef = useRef()
    //单个上下架时的Id
    const [productId, setProductId] = useState('')

    const queryLanguageList = (params, countryCode) => {
        let queryFormDetail = JSON.parse(JSON.stringify(params))
        setQueryForm(queryFormDetail)
        params.countryCode = countryCode
        getShelveList(
            params
        ).then((res) => {
            if (res.ret.errCode === 0) {
                res.data.list.map(item => {
                    item.children = item.skuUnitList
                })
                console.log(res)
                setData(res.data.list)
                setTotal(res.data.total)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const changeCountry = (ActiveKey) => {
        setDefaultActiveKey(ActiveKey)
        setPageNum(1)
        queryLanguageList({
            page: {
                pageNum: 1,
                pageSize: 20
            }
        }, ActiveKey)

    }
    const clickRow = (row) => {
        console.log(row)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys)
            setSelect(selectedRowKeys)
        },
    };
    //设置表格不可选中
    const getCheckboxProps = (row) => {
        if (row.children) {
            return {
                disabled: false
            }
        } else {
            return {
                disabled: true
            }
        }
    }
    //上下架


    const upCancel = () => {
        setUpVisible(false)
    }
    //上架确认
    const upConfirm = (data) => {
        console.log(data)
        let params = {
            countryCode: countryCode,
            productIdList: data.productList
        }
        if(data.type=='up'){
           
            batchOnShelve(params).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    message.success('操作成功')
                    setUpVisible(false)
                    setProductId('')
                    setSelect([])
                    queryLanguageList(queryForm, countryCode)
                }
            }).catch(error=>{
                console.log(error)
            })
        }else{
            batchAcceptShelveAdvice(params).then(resultes=>{
                if (resultes.ret.errCode == 0) {
                    message.success('操作成功')
                    setUpVisible(false)
                    setProductId('')
                    setSelect([])
                    queryLanguageList(queryForm, countryCode)
                }
            }).catch(error=>{
                console.log(error)
            })
        }
        
    }
    //上架check
    const upShelve = (row,type) => {
        setProductId(row.productId)
        let params = {
            productIdList: row.productId ? [row.productId] : selectedRowKeys,
            countryCode: countryCode
        }
        batchOnShelveCheck(params).then(response => {
            if (response.ret.errCode == 0) {
                upShelveRef.current.changeTableData(response.data.reasonList)
                upShelveRef.current.changeType(type)
                setUpVisible(true)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    //批量上架
    const batchUp = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请选择要上架的商品')
        } else {
            let productIds = []
            _.forEach(selectedRowKeys, productId => {
                // 过滤已上架的、库存为0的商品
                _.forEach(tableData, item => {
                    if (item.productId === productId) {
                        if ((item.shelveStatus === 2 && item.stock != 0) || (item.shelveStatus === 2 && item.suggest === 5) || (item.shelveStatus === 2 && item.suggest === 6)) {
                            productIds.push(item.productId)
                        }
                    }
                })
            })
            if (productIds.length === 0) {
                message.warning('未勾选【未上架】商品')
                return
            }
            let params = {
                productIdList: productIds,
                countryCode: countryCode
            }
            batchOnShelveCheck(params).then(response => {
                if (response.ret.errCode == 0) {
                    upShelveRef.current.changeTableData(response.data.reasonList)
                    setUpVisible(true)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
    const downShelve = (row) => {
        console.log(row)
        setProductId(row.productId)
        setDownVisible(true)
    }
    const downCancel = () => {
        setDownVisible(false)
    }
    const downConfirm = (data) => {
        let params = {
            offReason: data.offReason,
            productIdList: productId ? [productId] : selectedRowKeys,
            countryCode: countryCode
        }
        batchOffShelve(params).then(reusltes => {
            if (reusltes.ret.errCode == 0) {
                message.success('操作成功')
                setDownVisible(false)
                setProductId('')
                setSelect([])
                console.log(queryForm)
                queryLanguageList(queryForm, countryCode)
            }
        })
    }

    //批量下架
    const batchOff = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请选择要下架的商品')
        } else {
            setDownVisible(true)
        }
    }
    //采纳建议
    const batchAccept = (row,type) => {
        setProductId(row.productId)
        let params = {
            productIdList: row.productId ? [row.productId] : selectedRowKeys,
            countryCode: countryCode
        }
        batchAcceptShelveAdviceCheck(params).then(reusltes => {
            if (reusltes.ret.errCode == 0) {
                upShelveRef.current.changeTableData(reusltes.data.reasonList)
                upShelveRef.current.changeType(type)
                setUpVisible(true)
            }
        })
    }
    const batchAcceptSuggest = (type)=>{
        
        if (selectedRowKeys.length === 0) {
            message.warning('请选择商品')
        } else {
            let productIds = []
            _.forEach(selectedRowKeys, productId => {
                // 过滤已上架的、库存为0的商品
                _.forEach(tableData, item => {
                    if (item.productId === productId) {
                        if ((item.suggest != item.shelveStatus) && item.suggest != 5 && item.suggest != 6)  {
                            productIds.push(item.productId)
                        }
                    }
                })
            })
            if (productIds.length === 0) {
                message.warning('请选择需要可批量【采纳建议】的商品')
                return
            }
            let params = {
                productIdList: productIds,
                countryCode: countryCode
            }
            batchAcceptShelveAdviceCheck(params).then(response => {
                if (response.ret.errCode == 0) {
                    upShelveRef.current.changeTableData(response.data.reasonList)
                    upShelveRef.current.changeType(type)
                    setUpVisible(true)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
    //在售，停售
    const changeSaleStatusRequest = (row,saleStatus)=>{
        let params = {
            productId: row.productId,
            skuId: row.skuId,
            countryCode: countryCode,
            saleStatus: saleStatus,
        }
        console.log(row)
        changeSaleStatus(params).then(resultes=>{
            if(resultes.ret.errCode==0){
                message.success('操作成功')
                let dataList = [...tableData,...[]]
                _.forEach(dataList, item => {
                    if (row.productId == item.productId) {
                        _.forEach(item.children, sku => {
                            if (row.skuId === sku.skuId) {
                                sku.saleStatus = saleStatus
                            }
                        })
                    }
                })
                console.log(dataList)
                setData(dataList)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    useEffect(() => {

    })
    return (
        <div>
            <ViewContainer>
                <Tabs defaultActiveKey='MY' type="card" size={size} onChange={changeCountry} activeKey={countryCode}>
                    <TabPane tab="马来西亚" key="MY">

                    </TabPane>
                    <TabPane tab="泰国" key="TH">

                    </TabPane>
                    <TabPane tab="新加坡" key="ID">

                    </TabPane>
                </Tabs>
                <QueryTable
                    tableItemCenter
                    dataSource={tableData}
                    columns={[
                        {
                            title: "商品ID",
                            dataIndex: "productId",
                            width: 150,
                        },
                        {
                            title: "销售方式",
                            dataIndex: "productId1",
                            width: 150,
                            queryType: "select",
                            hideInTable: true,
                            valueEnum: [{
                                value: '1',
                                label: '售完即止'
                            }, {
                                value: '2',
                                label: '边售边采'
                            }],
                        },
                        {
                            title: "后台类目",
                            dataIndex: 'backCate',
                            queryType: "cascader",
                            width: 150,
                            hideInTable: true,
                            formItemProps: {
                                showSearch: false,
                                options: frontTypes
                            }
                        },
                        {
                            title: "",
                            dataIndex: 'radio',
                            queryType: "radio",
                            width: 150,
                            hideInTable: true,
                            valueEnum: [{
                                value: 1,
                                label: '只看应该下架商品',
                            }, {
                                value: 2,
                                label: '只看应该上架商品'
                            }],

                        },
                        {
                            title: "商品信息",
                            dataIndex: "title",
                            width: 200,
                            hideInForm: true,
                            render: (item, row) =>
                                <div className={styles.productInfo}>
                                    <div className={styles.imgBox}>
                                        <Popover content={<img src={dealShowFileSrc(row.cover)} alt="" style={{ width: '120px', height: '120px' }} />} trigger="hover">
                                            <img src={dealShowFileSrc(row.cover)} style={{ width: '80px', height: '80px' }} />
                                        </Popover>
                                    </div>
                                    {item}
                                </div>
                        },

                        {
                            title: "可售库存",
                            dataIndex: 'stock',
                            width: 150,
                            hideInForm: true,
                            render: (text, row, index) => {
                                if (text == 0) {
                                    return <span>-</span>
                                } else {
                                    return <span>{text}</span>
                                }
                            }
                        },
                        {
                            title: "库存建议",
                            dataIndex: 'suggest',
                            width: 150,
                            hideInForm: true,
                            render: (item) => <React.Fragment>
                                {item === 1 ? `建议上架` : (item == 2 ? `建议下架` : (item == 3) ? `建议在售` : (item == 4) ? `建议停售` : (item == 5) ? <span className={styles['no-suggess']}>边售边采</span> : (item == 6) ? <span className={styles['no-suggess']}>预售商品</span> : '')}
                            </React.Fragment>
                        },
                        {
                            title: "当前状态",
                            dataIndex: 'brand',
                            width: 150,
                            hideInForm: true,
                            render: (item, row, index) => <React.Fragment>
                                {
                                    row.skuAttrList ? (row.shelveStatus == 1 ? <span className={styles['row-warning']}>已上架</span> : <span className={styles['row-warning']}>已下架</span>) : (row.saleStatus == 1 ? <span className={styles['row-warning']}>在售中</span> : <span className={styles['row-warning']}>已停售</span>)
                                }
                            </React.Fragment>
                        },
                        {
                            title: "操作",
                            dataIndex: 'options',
                            hideInForm: true,
                            fixed: 'right',
                            width: 150,
                            render: (item, row, index) => <React.Fragment>
                                {
                                    row.skuUnitList ? <div>
                                        {
                                            <div className={styles['flex-box']}>
                                                <Button size="small" danger disabled={((row.suggest === row.shelveStatus || row.suggest === 5) || row.suggest === 6)} onClick={()=>batchAccept(row,'suggest')}>采纳建议</Button>
                                                {
                                                    row.shelveStatus === 1 ? <Button type="primary" size="small" onClick={() => downShelve(row)}>下架</Button> : <Button type="primary" size="small" onClick={() => upShelve(row,'up')}>上架</Button>
                                                }

                                            </div>
                                        }
                                    </div>
                                        : <div>
                                            {
                                                row.saleStatus === 1 ? <Button type="primary" size="small" onClick={()=>changeSaleStatusRequest(row,2)}>停售</Button> : <Button type="primary" size="small" onClick={()=>changeSaleStatusRequest(row,1)}>在售</Button>
                                            }
                                        </div>
                                }
                            </React.Fragment>
                        }
                    ]} onQuery={({ pageNum, pageSize, ...params }) => {
                        queryLanguageList({
                            page: {
                                pageNum: pageNum,
                                pageSize: pageSize
                            },
                            ...params,

                        }, countryCode)
                    }}

                    tableProps={{
                        rowKey: (row) => {
                            if (row.skuId) {
                                return row.skuId
                            } else {
                                return row.productId
                            }
                        }, bordered: true, scroll: { x: 'max-content' }, pagination: {
                            total: total
                        }, rowSelection: {
                            ...rowSelection, checkStrictly, getCheckboxProps
                        }
                    }}
                    buttonRender={<React.Fragment>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={()=>batchAcceptSuggest('suggest')}>批量采纳建议</Button>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => batchUp('up')}>批量上架</Button>
                        <Button type="primary" onClick={() => batchOff()}>批量下架</Button>
                    </React.Fragment>}
                />
            </ViewContainer>
            {/* <Pagination
                defaultPageSize={10}
                defaultCurrent={1}
                current={pageNum}
                total={total}
                showTotal={total => `共 ${total} 数据`}
                onChange={changeCurrentSize}
                pageSizeOptions={[10, 20, 50, 100]}
                showQuickJumper
                showSizeChanger
                style={{ position: 'fixed',bottom: '10px'}}
            /> */}
            <SheleDown downVisible={downVisible} downConfirm={downConfirm} downCancel={downCancel}></SheleDown>
            <SheleUp ref={upShelveRef} upUisible={upUisible} upCancel={upCancel} upConfirm={upConfirm}></SheleUp>
        </div>
    )
}

export default ShelveManage;