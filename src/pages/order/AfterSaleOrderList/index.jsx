import React, { useState, useCallback, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/OrderList.less'
import { Select, Input, Button, Pagination, Tag, Form, DatePicker, Row, Col, Table, Space,Popover,Tooltip,Image,Modal,Spin, message } from 'antd';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import enmu from './Enmu.js'
import { resolve } from '@/proto/proto';
import { viewAfterList,handlerAfter,DownloadAfterSalePage } from '@/services/order';
import { timestampToTime } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import {filterData} from '@/utils/filter'
import PhotoPreview from '@/components/PhotoPreview'
import ConfirmRefound from './components/ConfirmRefound'

const { Option } = Select;
const { RangePicker } = DatePicker;
const {confirm} = Modal

const OrderList = () => {
    const columns2 = [
        {
            title: '售后订单',
            dataIndex: 'afterId',
            key: 'afterId',
            width: 200,
            fixed: 'left',
            align: 'center'
        },
        {
            title: '订单号',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 200,
            fixed: 'left',
            align: 'center'
        },
        {
            title: '商品信息',
            key: 'tags',
            dataIndex: 'tags',
            width: 400,
            align: 'center',
            render: (text, row,index) => {
                return row.productItem.map((item, index) => {
                    return <div className={styles.productInfo} key={index}>
                        <div className={styles.imgBox}>
                            <Popover content={<img src={dealShowFileSrc(item.skuCover)} alt="" style={{ width: '120px', height: '120px' }} />} trigger="hover">
                                <img src={dealShowFileSrc(item.skuCover)} style={{ width: '100px', height: '100px' }} />
                            </Popover>
                        </div>
                        <div>
                            <div>
                            <Tooltip title={item.productName}>
                                <span className={styles['fixed-tool']}>名称：{item.productName || '-' }</span>
                            </Tooltip></div>
                            <div>
                            <Tooltip title={item.attr.toString()}>
                                <span className={styles['fixed-tool']}>规格：{ item.attr.toString() || '-' }</span>
                            </Tooltip></div>
                            <div>数量：{item.num}</div>
                            <div>实际金额：{row.currency} {item.paied}</div>
                            <div>下单时间：{timestampToTime(Number(item.orderTime))}</div>
                        </div>
                    </div>
                })
            }
        },
        {
            title: '商品状态',
            dataIndex: 'isReceived',
            key: 'isReceived',
            width: 100,
            align: 'center',
            render: (text, row, index) => {
                if (text) {
                    return <span key={index}>已收货</span>
                } else {
                    return <span key={index}>未收货</span>
                }
            }
        },
        {
            title: '退款信息',
            width: 250,
            dataIndex: 'currency',
            align: 'center',
            render: (text, row, index) => {
                return <div key={index}>
                    <div>预计退款金额：{row.currency} {row.refundInfo.applyRefund}</div>
                    <div>应退款金额：{row.currency} {row.refundInfo.finalRefund}</div>
                    <div>应退运费：{row.currency} {row.freight || '-'}</div>
                    <div>退款理由：{row.refundInfo.reason || '-'}</div>
                    <div>退款描述：{row.refundInfo.remark || '-'}</div>
                </div>
            },
        },

        {
            title: '退款方式',
            width: 100,
            dataIndex: 'refundType',
            render: (text, row, index) => {
                if (row.refundType == 0) {
                    return <span>退到银行卡</span>
                } else if (row.refundType == 1) {
                    return <span>退到积分</span>
                }
            },
            align: 'center'
        },

        {
            title: '用户凭证',
            width: 100,
            dataIndex:'pictures',
            render:(text,row,index)=>{
                return row.pictures.map((item,index)=>{
                    if(index==0){
                    return <div className={styles['list-img-box']} key={index}>
                        <img
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                        onClick={()=>setImg(row)}
                      />
                      <span>{row.pictures.length}</span>
                    </div> 
                }
                })
            },
            align:'center'
        },
        {
            title: '银行信息',
            width: 200,
            render: (text, row, index) => {
                return <div>
                    <div>用户名： {row.bankInfo.cardholder || '-'}</div>
                    <div>银行卡号： {row.bankInfo.cardNo || '-'}</div>
                    <div>银行名称： {row.bankInfo.bankName || '-'}</div>
                </div>
            }
        },
        {
            title: '用户Id',
            width: 100,
            dataIndex: 'userId'
        },
        {
            title: '物流单号',
            width: 200,
            dataIndex: 'expressNo',
            render: (text, row, index) => {
                return <span>{row.expressNo || '-'}</span>
            }
        },
        {
            title: '状态',
            width: 200,
            dataIndex: 'afterStatus',
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <span>{returnStatus(row.afterStatus)}</span>
                </div>
            }
        },
        {
            title: '售后发起时间',
            width: 250,
            dataIndex: 'applyTime',
            render: (text, row, index) => {
                return <div>{timestampToTime(Number(row.applyTime))}</div>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text, row, index) => {
                 {
                return <div>

                     {
                         row.afterStatus<1&&<div style={{marginTop:5}}><Button type="primary" onClick={()=>clickToRefusedOrder(row)}>拒绝售后</Button></div>
                     }
                     {
                         row.afterStatus<2&&<div style={{marginTop:5}}><Button type="primary" onClick={()=>showRefund(row)}>完成退款</Button></div>
                     }
                     {
                         row.afterStatus<1&&<div style={{marginTop:5}}><Button type="primary" onClick={()=>clickToRejectRefund(row)}>退款失败</Button></div>
                     }
                </div>
                }
            },
            fixed: 'right',
            align:'center',
            width: 200,

        }
    ];
    const { afterStatusList, statusList, paywayList, } = enmu;
    const [total, setTotal ] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [defaultValue, setDefaultValue] = useState({
        orderId: '',
        productName: '',
        userPhone: '',
        receiverPhone: '',
        prarentPhone: '',
        afterStatus: '',
        timeList: [moment().subtract(1, 'days'), moment()],
    })
    const [tableData, setTableData] = useState([])
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
    const [showPreview, setShowPreview] = useState(false);
    const [loading,setLoading] = useState(false)
    const [imgLists,setImgLists] = useState([
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        "https://file-test.fingo.shop/fingo/product/2020-09/03/original/18508545929826100314112_original_800x800.jpg"
    ])
    const [isShow,setIsShow] = useState(false)
    const onFinish = (val) => {
        console.log(val)
    }
    const [defaultValueDialog,setDialogDefaultValue] = useState({
        applyRefund:0,
        amount:0
    })
    const setImg= (row) =>{
        setImgLists(row.pictures)
        setShowPreview(true)
    }
    const getViewOrderList = (pageNum, pageSize) => {
        setLoading(true)
        let params = {
            page: {
                pageSize: pageSize,
                pageNum: pageNum
            },
            startTime: '',
            endtime: ''
        }
        if (form.getFieldsValue().timeList && form.getFieldsValue().timeList.length != 0) {
            params.startTime = moment(form.getFieldsValue().timeList[0]._d).valueOf(),
            params.endTime = moment(form.getFieldsValue().timeList[1]._d).valueOf()
        }
        params = Object.assign(form.getFieldsValue(), params)
        viewAfterList(params).then(resultes => {
            if (resultes.ret.errcode == 1) {
                setTableData(resultes.afterItem)
                setTotal(resultes.total)
                setLoading(false)
            }
        }).catch(error => {
            console.log(error)
        })

    }
    const downLoad = () => {
        if(!form.getFieldsValue().timeList){
            message.warning('请选择导出日期')
            return false
        }else{
            let params = {
                id: form.getFieldsValue().orderId?form.getFieldsValue().orderId:'',
                startTime: moment(form.getFieldsValue().timeList[0]._d).valueOf(),
                endTime: moment(form.getFieldsValue().timeList[1]._d).valueOf(),
                page:{
                    pageNum:pageNum,
                    pageSize:pageSize
                }
            }
            DownloadAfterSalePage(params).then(res=>{
                if (res.ret.errcode === 1) {
                    window.open(`${res.url}`)
                }
            })
        }
    }
    const changeDate = (date, dateString) => {
        console.log(date, dateString)
    }
    const returnStatus = (val) => {
        var str = ''
        afterStatusList.map((item, index) => {
            if (item.value == val) {
                str = item.label
            }
        })
        return str
    }
    const changeCurrentSize = (page, pageSize) => {
        setPageNum(page)
        setPageSize(pageSize)
        // getViewOrderList(page, pageSize)
    }
    //拒绝售后
    const clickToRefusedOrder = async (row)=>{
        confirm({
            title: '确认拒绝售后?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                await handlerAfterRequest(row.orderId,row.afterId,2,'')
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    //退款失败
    const clickToRejectRefund = async(row)=>{
        confirm({
            title: '确认退款失败?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                await handlerAfterRequest(row.orderId,row.afterId,1,'')
            },
            onCancel() {
              console.log('Cancel');
            },
        })
    }
    //完成退款
    const showRefund = (row)=>{
        setDialogDefaultValue({
            orderId:row.orderId,
            afterId:row.afterId,
            applyRefund:row.refundInfo.applyRefund,
            amount:0
        })
        setIsShow(true)
    }
    const handlerAfterRequest = function (orderId, afterId, handlerType, amount){
        let params = {
            orderId: orderId,
            afterId: afterId,
            handlerType: handlerType,
            amount: amount
        }
        handlerAfter(filterData(params)).then(res => {
            if (res.ret.errcode === 1) {
                message.success('操作成功！')
                setIsShow(false)
                getViewOrderList(pageNum,pageSize)
            }
        }).catch(err => {
            
            console.log(err)
        })
    }
    //完成退款
    const getChildValue=(data)=>{
        handlerAfterRequest(data.orderId, data.afterId, 0, data.amount+'')
    }
    const cnacelDialog=()=>{
        setIsShow(false)
    }
    useEffect(() => {
        getViewOrderList(pageNum, pageSize)
    }, [pageSize, pageNum])
    return (
        <ViewContainer>
            <div className={styles['container']}>
                <Form
                    form={form}
                    initialValues={defaultValue}
                    onFinish={onFinish}
                    layout="inline"
                    className={styles['contain-form']}
                >
                    <Form.Item
                        label="订单号："
                        name="orderId"
                        className={styles['ant-form-item']}
                    >
                        <Input placeholder="请输入订单号" allowClear />
                    </Form.Item>
                    {expand &&
                        <>
                            <Form.Item label="商品名称：" name="productName" className={styles['ant-form-item']}>
                                <Input placeholder="请输入订单号" allowClear />
                            </Form.Item>
                            <Form.Item label="买家手机号：" name="userPhone" className={styles['ant-form-item']}>
                                <Input placeholder="请输入买家手机号" allowClear />
                            </Form.Item>
                            <Form.Item label="收货人手机号：" name="receiverPhone" className={styles['ant-form-item']}>
                                <Input placeholder="请输入收货人手机号" allowClear />
                            </Form.Item>
                            <Form.Item label="上级手机号：" name="prarentPhone" className={styles['ant-form-item']}>
                                <Input placeholder="请输入上级手机号" allowClear />
                            </Form.Item>
                            <Form.Item label="订单状态" name="afterStatus" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择">
                                    {
                                        afterStatusList.map(item => {
                                            return <Option value={item.value} key={item.value}>{item.label}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    }
                    <Form.Item
                        label="时间查询："
                        name="timeList"
                        className={styles['ant-form-item']}
                    >
                        <RangePicker onChange={changeDate} />
                    </Form.Item>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<ZoomInOutlined />} onClick={()=>getViewOrderList(1,20)}>
                                搜索
                        </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => { form.resetFields(); }}
                                icon={<UndoOutlined />}
                            >
                                重置
                        </Button>
                            <Button
                                type="primary"
                                style={{ margin: '0 8px' }}
                                onClick={() => downLoad()}
                                icon={<VerticalAlignBottomOutlined />}
                            >
                                导出
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
               
                <Table columns={columns2} dataSource={tableData} pagination={false}  bordered rowKey="afterId" scroll={{x:'100vw'}} className={styles['contain-table']} loading={loading}/>
                <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    current={pageNum}
                    pageSize={pageSize}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[10, 20, 50, 100]}
                    showQuickJumper
                    showSizeChanger
                    className={styles.orderPage}
                />
            </div>
            <PhotoPreview  imagesList={imgLists} initIndex={0} closeCallBack={show => setShowPreview(show)} show={showPreview}></PhotoPreview>
            <ConfirmRefound isShow={isShow} handleCancel={cnacelDialog} defaultValue={defaultValueDialog}  getChildValue={getChildValue}></ConfirmRefound>
        </ViewContainer>
    )
}

export default OrderList;

