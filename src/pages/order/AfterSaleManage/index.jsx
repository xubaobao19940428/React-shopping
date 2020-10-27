import React, { useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/AfterSaleManage.less'
import { Select, Input, Button, Space, Pagination, Tabs, Modal, message, Form, DatePicker, Row, Col, Table } from 'antd';
import { GetChargeRecordList, RefundForCharge, AfterSalePage, BatchApproved, BatchRefundSuccess, DownloadAfterSalePage } from '@/services/order';
import moment from 'moment';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { timestampToTime, timeTotimestamp } from '@/utils';
import { dealShowFileSrc } from '@/utils/utils'
import { useModel,history } from 'umi';
import { filterData } from '@/utils/filter'
const Option = Select.Option;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs
const { Column } = Table
/**
 * 售后管理
 * 
 */
const AfterSaleManage = () => {
    const productOptionList = [{
        name: '商品ID',
        code: '1'
    },
    {
        name: 'skuID',
        code: '2'
    },
    {
        name: '商品名称',
        code: '3'
    }
    ]
    const orderTypeList = [{
        key: 0,
        value: '普通商品订单'
    }, {
        key: 1,
        value: '小礼包商品订单'
    }, {
        key: 2,
        value: '大礼包商品订单'
    }, {
        key: 4,
        value: '拼团订单'
    }, {
        key: 5,
        value: '直播订单'
    }, {
        key: 8,
        value: '虚拟商品订单'
    }, {
        key: 9,
        value: '批发商品订单'
    }, {
        key: 10,
        value: '微商商品订单'
    }, {
        key: 11,
        value: '99青春版礼包'
    }]
    const tabList = [{
        title: '待审核',
        name: 1
    }, {
        title: '审核中',
        name: 2
    }, {
        title: '已通过待退款',
        name: 3
    }, {
        title: '售后成功',
        name: 4
    }, {
        title: '售后关闭',
        name: 5
    }]
    const type = {
        2: '大礼包',
        1: '小礼包',
        12: '青春礼包',
        10: '批发商品',
        11: '微商商品',
        9: '虚拟商品',
        14: '微商礼包'
    }
    const OrderStatus = {
        0: '待支付',
        1: '待发货',
        2: '已发货',
        3: '交易成功',
        4: '交易关闭',
        5: '部分发货'
    }
    const [tableData, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [defaultPageSize, setDefaultPageSize] = useState(10)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [expand, setExpand] = useState(false);
    const { countries, languages } = useModel('dictionary');
    const [checkStrictly, setCheckStrictly] = useState(false)
    const [defaultTab, setDefaultTab] = useState(1)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [tabData, setTableData] = useState([])
    const [defaultValue, setDefaultValue] = useState({
        choseType: '1',
        value: '',
        timeList: [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
    })
    const [sortTable, setSortTable] = useState('')
    const [selectedRowKeys, setSelect] = useState([])
    const onFinish = (val) => {
        console.log(val)
    }
    const secondTimeFormat = (value) => {
        if (value) {
            value = parseInt(value)
            var mo = moment(value)
            if (mo.isValid()) {
                value = mo.format('YYYY-MM-DD HH:mm:ss')
            }
            return value
        } else {
            return '-'
        }
    }
    const formatSeconds = (mss) => {
        let duration
        let days = parseInt(mss / (1000 * 60 * 60 * 24))
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
        let seconds = parseInt((mss % (1000 * 60)) / 1000)
        if (days > 0) duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
        else if (hours > 0) duration = hours + "小时" + minutes + "分" + seconds + "秒"
        else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
        else if (seconds > 0) duration = seconds + "秒"
        // console.log(duration)
        return duration
    }
    const getAfterSaleList = (pageNum, pageSize, type) => {
        setLoading(true)
        let params = {
            page: {
                pageNum: pageNum,
                pageSize: pageSize
            },
            refundStatus: Number(type),
            productId: '',
            skuId: '',
            productName: '',
            sortTable: sortTable,
            startTime: '',
            endTime: ''
        }
        switch (form.getFieldsValue().choseType) {
            case '1': params.productId = form.getFieldsValue().value; break
            case '2': params.skuId = form.getFieldsValue().value; break
            case '3': paramsa.productName = form.getFieldsValue().value; break
        }
        if (form.getFieldsValue().timeList && form.getFieldsValue().timeList.length != 0) {
            params.startTime = moment(form.getFieldsValue().timeList[0]._d).valueOf(),
                params.endTime = moment(form.getFieldsValue().timeList[1]._d).valueOf()
        }
        params = Object.assign(form.getFieldsValue(), params)
        AfterSalePage(filterData(params)).then(res => {
            if (res.ret.errcode == 1) {
                setData(res.afterSale)
                setTotal(res.total)
                setLoading(false)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const changeCurrentSize = (page, pagesize) => {
        setPageNum(page)
        setPageSize(pagesize)
        getAfterSaleList(page, pageSize, defaultTab)
    }
    //tabs页切换
    const callback = (val) => {
        setSelect([])
        setDefaultTab(val)
        getAfterSaleList(1, 10, val)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRows: ', selectedRows);
            setSelect(selectedRowKeys)
        },
    }
    //批量通过
    const batchClick = () => {
        if (selectedRowKeys.length == 0) {
            message.warning('选项不能为空')
        } else {
            let params = {
                refundId: selectedRowKeys
            }
            BatchApproved(params).then(resultes => {
                if (resultes.ret.errcode == 1) {
                    message.success('批量通过成功')
                    getAfterSaleList(pageNum, pageSize, defaultTab)
                    setSelect([])
                }
            })
        }
    }
    //批量标记为已退款
    const BatchRefund = () => {
        if (selectedRowKeys.length == 0) {
            message.warning('选项不能为空')
        } else {
            let params = {
                refundId: selectedRowKeys
            }
            BatchRefundSuccess(params).then(resultes => {
                if (resultes.ret.errcode == 1) {
                    message.success('批量标记成功')
                    getAfterSaleList(pageNum, pageSize, defaultTab)
                    setSelect([])
                }
            })
        }

    }
    //下载
    const downLoad = () => {
        let params = {
            page: {
                pageNum: pageNum,
                pageSize: pageSize
            },
            refundStatus: 3,
            productId: '',
            skuId: '',
            productName: '',
            sortTable: sortTable,
            startTime: '',
            endTime: ''
        }
        switch (form.getFieldsValue().choseType) {
            case '1': params.productId = form.getFieldsValue().value; break
            case '2': params.skuId = form.getFieldsValue().value; break
            case '3': paramsa.productName = form.getFieldsValue().value; break
        }
        if (form.getFieldsValue().timeList && form.getFieldsValue().timeList.length != 0) {
            params.startTime = moment(form.getFieldsValue().timeList[0]._d).valueOf(),
                params.endTime = moment(form.getFieldsValue().timeList[1]._d).valueOf()
        }
        params = Object.assign(form.getFieldsValue(), params)

        DownloadAfterSalePage(filterData(params)).then(resultes => {
            if (resultes.ret.errcode === 1) {
                console.log(resultes)
                window.open(resultes.url)
            }
        })
    }
    //去审核
    const checkDetail = (row)=>{
        history.push({
            pathname:'/order/afterSaleDetail',
            query:{
                refundId:row.refundId
            }
        })
    }
    const getCountryImg = (code) => {
        let item = countries.find((val) => {
            return val.shortCode == code
        })
        return item ? dealShowFileSrc(item.image) : ''
    }
    const operations = <Button type="primary" onClick={batchClick}>批量通过</Button>
    const operations3 = <div><Button type="primary" style={{ marginRight: 10 }} onClick={BatchRefund}>批量标记为已退款</Button><Button type="primary" onClick={downLoad}>下载</Button></div>
    useEffect(() => {
        getAfterSaleList(1, 10, 1)
    }, [])
    return (
        <ViewContainer>
            <div>
                <Form
                    form={form}
                    initialValues={defaultValue}
                    onFinish={onFinish}
                    layout="inline"
                    className={styles['contain-form']}
                >
                    <Form.Item
                        label="订单编号："
                        name="id"
                        className={styles['ant-form-item']}
                    >
                        <Input placeholder="请输入订单编号" allowClear />
                    </Form.Item>
                    <Form.Item label="售后编号：" name="refundId" className={styles['ant-form-item']}>
                        <Input placeholder="请输入售后编号" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="申请时间："
                        name="timeList"
                        className={styles['ant-form-item']}
                    >
                        <RangePicker />
                    </Form.Item>
                    {expand &&
                        <>

                            <Form.Item label="商品：" name="choseType" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择">
                                    {
                                        productOptionList.map(item => {
                                            return <Option value={item.code} key={item.code}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item name="value" className={styles['ant-form-item']}>
                                <Input placeholder="请输入" allowClear />
                            </Form.Item>
                            <Form.Item label="用户ID：" name="userId" className={styles['ant-form-item']}>
                                <Input placeholder="请输入" allowClear />
                            </Form.Item>
                            <Form.Item label="订单国家：" name="countryCode" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择" allowClear>
                                    {
                                        countries.map(item => {
                                            return <Option value={item.shortCode} key={item.shortCode}>{item.nameLocal}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="订单类型" name="orderType" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择" allowClear>
                                    {
                                        orderTypeList.map(item => {
                                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                        </>
                    }

                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<ZoomInOutlined />} onClick={() => getAfterSaleList(1, 10, defaultTab)}>
                                搜索
                        </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => { form.resetFields(); }}
                                icon={<UndoOutlined />}
                            >
                                重置
                        </Button>
                            <a
                                style={{ fontSize: 12 }}
                                onClick={() => {
                                    setExpand(!expand);
                                }}
                            >
                                {expand ? <UpOutlined /> : <DownOutlined />} {expand ? '收起' : '展开'}
                            </a>
                        </Col>
                    </Row>
                </Form>
                <Tabs defaultActiveKey={defaultTab} onChange={callback} tabBarExtraContent={(defaultTab == 1 || defaultTab == 2) ? operations : (defaultTab == 3 ? operations3 : '')}>
                    {
                        tabList.map(item => {
                            return <TabPane tab={item.title} key={item.name} key={item.name}></TabPane>
                        })
                    }
                </Tabs>
                <Table rowKey="refundId" dataSource={tableData} pagination={false} scroll={{ x: '100vw' }}
                    rowSelection={{ ...rowSelection, checkStrictly }}
                    loading={loading}
                    bordered>
                    <Column title='单据信息' align='center' width={300} render={(text, row, index) => {
                        return <div>
                            <div style={{ textAlign: 'left' }}>售后：{row.refundId}</div>
                            <div className={styles["order-num"]}>
                                <div className={styles["order"]}>订单：{row.orderId}</div>
                                <img src={getCountryImg(row.countryCode)} />
                            </div>
                            <div style={{ textAlign: 'left' }}>skuId：{row.afterSaleProduct.skuId}</div>
                        </div>
                    }}></Column>
                    <Column title='售后商品' align='center' width={400} render={(text, row, idnex) => {
                        return <div className={styles["produt"]}>
                            <div className={styles["product-pic"]}>
                                <img src={dealShowFileSrc(row.afterSaleProduct.picture)} />
                                {
                                    (row.afterSaleProduct.type === 1 || row.afterSaleProduct.type === 2 || row.afterSaleProduct.type === 12 || row.afterSaleProduct.type === 10 || row.afterSaleProduct.type === 11 || row.afterSaleProduct.type === 9 || row.afterSaleProduct.type === 14) && <div>
                                        <div className={styles['img-mark']}></div>
                                        <div className={styles['img-mark-content']}>{type[row.afterSaleProduct.type]}</div>
                                    </div>
                                }
                            </div>
                            <div className={styles["product-content"]}>
                                <div className={styles["product-content-supplier"]}>商品ID：{row.afterSaleProduct.productId}</div>
                                <div className={styles["product-content-name"]}>{row.afterSaleProduct.title}</div>
                                {
                                    row.afterSaleProduct.attr.length !== 0 && <div className={styles['product-content-supplier']}>
                                        {
                                            row.afterSaleProduct.attr.map(item => {
                                                return <span key={item.attrId}>{item.attrLabel}：{item.valueLabel} </span>
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                    }}></Column>
                    <Column title='实价单价x数量' align='center'
                        render={(text, row, index) => {
                            return <div>
                                <div>退{row.refundCurrency}{row.afterSaleProduct.price} X {row.afterSaleProduct.num}</div>
                                <div>（售 X {row.afterSaleProduct.num}）</div>
                            </div>

                        }} width={150}></Column>
                    <Column title='退款金额' align='center' width={150}
                        render={(text, row, index) => {
                            return <div>
                                <div>{row.refundCurrency}{row.refundAmount}</div>
                                <div>
                                    {
                                        (row.refundFreight !== '0' && row.refundFreight !== '0.00') && <span>(含运费{row.refundCurrency}{row.refundFreight}）</span>
                                    }
                                </div>
                            </div>
                        }}
                    ></Column>
                    {/* 售后原因 */}
                    {(defaultTab == 1 || defaultTab == 2) && <Column title='售后原因' align='center' width={150}
                        render={(text, row, index) => {
                            return <div>{row.refundReason}</div>
                        }}
                    ></Column>}
                    {/* 发货状态 */}
                    {(defaultTab == 1 || defaultTab == 2) && <Column title='发货状态' align='center' width={150}
                        render={(text, row, index) => {
                            return <div>
                                {row.orderStatus === 2 ? <div className={styles['pricess']}>{OrderStatus[row.orderStatus]}</div> : <div>{OrderStatus[row.orderStatus]}</div>}
                            </div>
                        }}
                    ></Column>}
                    {/* 申请时间 */}
                    {defaultTab == 1 && <Column title='申请时间' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>{secondTimeFormat(row.operateTime)}</div>
                        }}
                    ></Column>}
                    {/* 最新留言 */}
                    {defaultTab == 2 && <Column title='最新留言' align='center' width={180}
                        render={(text, row, index) => {
                            return <div>
                                {row.message}
                            </div>
                        }}
                    ></Column>}
                    {/* 更新时间 */}
                    {(defaultTab == 2 || defaultTab == 3) && <Column title='更新时间' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>{timestampToTime(Number(row.operateTime))}</div>
                        }}
                    ></Column>}
                    {/* 更新人 */}
                    {defaultTab == 3 && <Column title='更新人' align='center' width={150} dataIndex="operatorName"></Column>}
                    {/* 联系方式 */}
                    {defaultTab == 3 && <Column title='联系方式' align='center' width={150}
                        render={(text, row, index) => {
                            return <div>
                                <div>联系电话：{row.mobile}</div>
                                <div>电子邮箱：{row.email}</div>
                            </div>
                        }}
                    ></Column>}
                    {/* 等待时长 */}
                    {defaultTab != 5 && <Column title='等待时长' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>
                                {formatSeconds(row.waitTime)}
                            </div>
                        }}
                    ></Column>}
                    {/* 退款账户 */}
                    {(defaultTab == 3 || defaultTab == 4) && <Column title='退款账户' align='center' width={250}
                        render={(text, row, index) => {
                            return <div>
                                <div>银行名称：{row.refundBankName || '-'}</div>
                                <div>银行账户名：{row.refundCardholder || '-'}</div>
                            </div>
                        }}

                    ></Column>}
                    {/* 申请人 */}
                    {(defaultTab == 1 || defaultTab == 2) && <Column title='申请人' align='center' width={100}
                        render={(text, row, index) => {
                            return <div>
                                {
                                    row.operatorType === 1 ? <div>{row.operatorName}（{row.operate}</div> : <div>{row.operatorName}（{row.operate}）</div>
                                }
                            </div>
                        }}
                    ></Column>}
                    {/* 创建时间 */}
                    {defaultTab == 4 && <Column title='创建时间' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>
                                {timestampToTime(Number(row.createTime))}
                            </div>
                        }}
                    ></Column>}
                    {/* 退款时间 */}
                    {defaultTab == 4 && <Column title='退款时间' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>
                                {timestampToTime(Number(row.refundTime))}
                            </div>
                        }}
                    ></Column>}
                    {/* 取消人 */}
                    {defaultTab == 5 && <Column title='取消人' align='center' width={150} dataIndex="cancelOperator"></Column>}
                    {/* 取消时间 */}
                    {defaultTab == 5 && <Column title='取消时间' align='center' width={200}
                        render={(text, row, index) => {
                            return <div>
                                {timestampToTime(Number(row.cancelTime))}
                            </div>
                        }}
                    ></Column>}
                    <Column title='操作' align='center' width={100} fixed="right" render={(row, text, index) => {
                        return <div>
                            {
                                defaultTab == 1 || defaultTab == 2 ? <Button type="primary" onClick={()=>checkDetail(row)}>去审核</Button> : <Button type="primary" onClick={()=>checkDetail(row)}>查看详情</Button>
                            }
                        </div>
                    }}></Column>

                </Table>
                <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    current={pageNum}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[10, 20, 50, 100]}
                    showQuickJumper
                    showSizeChanger
                    style={{ marginTop: 20 }}
                />
            </div>
        </ViewContainer>
    )
}

export default AfterSaleManage;