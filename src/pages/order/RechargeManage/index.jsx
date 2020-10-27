import React, { useState, useCallback, forwardRef, useRef } from 'react';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/RechargeManange.less'
import { Select, Input, Button, Space, Pagination, Tag,Modal, message } from 'antd';
import { GetChargeRecordList,RefundForCharge } from '@/services/order';
import { DownloadOutlined, PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import OnceArgin from './components/OnceArgin'
import {  timestampToTime } from '@/utils';
const Option = Select.Option;
const { confirm } = Modal;

/**
 * 充值管理
 * 
 */
const RechargeManange = () => {
    const [tableData, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [defaultPageSize, setDefaultPageSize] = useState(10)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [valueStatus,setStatus] = useState([
        {
            value: '0',
            label: '未发送'
        },{
            value: '1',
            label: '已发送'
        },{
            value: '2',
            label: '充值成功'
        },{
            value: '3',
            label: '充值失败'
        },{
            value: '4',
            label: '充值退款成功'
        }
    ])
    const OnceArginRef = useRef();
    const getBrandInfo = (params) => {
        return new Promise((resolve, reject) => {
            GetChargeRecordList(
                {
                    page: {
                        pageSize: params.pageSize,
                        pageNum: params.pageNum,
                    },
                    userId:params.userId?params.userId:'',
                    status:params.status?params.status:'',
                    orderId:params.orderNo?params.orderNo:''
                }).then(res => {
                    if (res.ret.errcode == 1) {
                        console.log(res)
                        setData(res.chargeInfo)
                        setTotal(res.total)
                    }
                }).catch(error => {
                    reject(error)
                })
        })
    }
    const changeCurrentSize = (page, pagesize) => {
        setPageNum(page)
        setPageSize(pagesize)
        getBrandInfo({ pageNum: page, pageSize: pagesize })
    }
    const returnStatus = (status)=>{
        let str=''
        valueStatus.map(item=>{
            if(item.value==status){
                str = item.label
            }
        })
        return str
    }
    const onceArgin = (row) =>{
        OnceArginRef.current.changeVal(true)
        OnceArginRef.current.changeDefault({
            account:row.account,
            orderNo:row.orderNo,
            prodName:row.prodName,
            faceValue:row.faceValue,
            id:row.id,
        })
    }
    const refundClick = (row)=>{
        confirm({
            title: '确定要将其标记为已退款吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                let params={
                    id:row.id,
                    orderNo:row.orderNo
                }
                RefundForCharge(params).then(res=>{
                    if(res.ret.errcode==1){
                        message.success('退款成功')
                        getBrandInfo({ pageNum: pageNum, pageSize: pageSize })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    return (
        <ViewContainer>
            <div className={styles.container}>
                <QueryTable
                    tableItemCenter
                    dataSource={tableData}
                    columns={[
                        {
                            title: "订单号:",
                            dataIndex: "orderNo",
                            width: 150,
                            fixed:'left'
                        },
                        {
                            title: "reload_id",
                            dataIndex: 'reloadId',
                            queryType: "text",
                            width: 150,
                            hideInForm:true
                        },
                        {
                            title: "用户ID",
                            dataIndex: 'userId',
                            queryType: "text",
                            width: 150,
                        },
                        {
                            title: "状态：",
                            dataIndex: "status",
                            width: 150,
                            queryType: "select",
                            hideInTable: true,
                            valueEnum: valueStatus
                        },
                        {
                            title: "充值账号",
                            dataIndex: "account",
                            width: 200,
                            hideInForm: true
                        },

                        {
                            title: "运营商",
                            dataIndex: 'prodName',
                            width: 200,
                            hideInForm: true
                        },
                        {
                            title: "充值金额（RM）",
                            width: 200,
                            dataIndex:'faceValue',
                            hideInForm: true
                        },
                        {
                            title: "充值时间",
                            width: 200,
                            dataIndex:'sendTime',
                            hideInForm: true,
                            render:(text,row,index)=>{
                                return <React.Fragment>
                                    <div>{timestampToTime(Number(row.sendTime))}</div>
                                </React.Fragment>
                              
                            }
                        },
                        {
                            title: "信息",
                            width: 200,
                            dataIndex:'msg',
                            hideInForm: true
                        },
                        {
                            title: "状态",
                            dataIndex: 'status',
                            width: 150,
                            hideInForm: true,
                            render: (item, row, index) => <React.Fragment>
                                {
                                    <div className={row.status === 2?styles['success']:(row.status==3?styles['err']:'pend')}>{returnStatus(row.status)}</div>
                                }
                            </React.Fragment>
                        },
                        {
                            title: "操作",
                            dataIndex: 'options',
                            hideInForm: true,
                            fixed: 'right',
                            width: 150,
                            render: (item, row, index) => <div className={styles.btnBox}>
                                <Button type="primary" size="small" onClick={()=>onceArgin(row)}>重试</Button>
                                <Button type="primary" size="small" danger onClick={()=>refundClick(row)}>退款</Button>
                            </div>
                        }
                    ]} onQuery={(params) => {
                        getBrandInfo({ ...params })
                    }}
                    tableProps={{
                        rowKey: 'sendTime',
                        bordered: true, scroll: { x: 'max-content' }, pagination: false
                    }}
                />
                <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    current={pageNum}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[1,10, 20, 50, 100]}
                    showQuickJumper
                    showSizeChanger
                    style={{ marginTop: 20 }}
                />
                <OnceArgin ref={OnceArginRef}></OnceArgin>
            </div>
        </ViewContainer>
    )
}

export default RechargeManange;