import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle,useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/TeamMember.less'
import { Select, Input, Button, Pagination, Tag, Form, Row, Col, Table, Space } from 'antd';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { memberOrderList } from '@/services/user';
import { history,useModel} from 'umi'
import { timestampToTime } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import { filterData } from '@/utils/filter'

const { Option } = Select;
const OrderList = React.forwardRef((props, ref) => {
    const columns2 = [
        {
            title: '订单编号',
            dataIndex: 'orderId',
            align: 'center',
        },
        {
            title: '下单时间',
            dataIndex: 'orderTime',
            align: 'center',
            render:(text,row,index)=>{
                return <div>
                    {timestampToTime(Number(row.orderTime)) }
                </div>
            }
        },
        {
            title: '下单金额',
            dataIndex: 'orderAmount',
            align: 'center',
        },
        {
            title: '收获地址',
            dataIndex: 'address',
            align: 'center',
        },
        {
            title: '订单状态',
            dataIndex: 'status',
           
            align: 'center',
            render: (text, row, index) => {
            return <div>{orderStatusEnum[row.status]}</div>
            }
        },
        {
            title: '操作',
            dataIndex: 'bindingTime',
            align: 'center',
            render: (text, row, index) => {
                return <div><Button type="primary" onClick={()=>operation(row)}>查看详情</Button></div>
            }
        }
    ];
    useImperativeHandle(ref, () => {
        return {
            getOrderList: () => {
                getViewOrderList(1, 20)
            }
        }
    })
    const orderStatusEnum={
        0: '待支付',
        1: '待发货',
        2: '待收货',
        3: '交易成功',
        4: '交易关闭',
        5: '部分发货'
    }
    const statusList=[
        {
            value: null,
            label: '全部'
        },
        {
            value: 0,
            label: '未付款'
        },
        {
            value: 1,
            label: '未发货'
        },
        {
            value: 2,
            label: '已发货'
        },
        {
            value: 3,
            label: '订单完成'
        }
    ]
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [defaultValue, setDefaultValue] = useState({
        status:null,
    })
    const [tableData, setTableData] = useState([])
    const [form] = Form.useForm()
    const onFinish = (val) => {
        console.log(val)
    }
    const operation = (row) => {
        history.push({
            pathname:'/order/orderDetail',
            query:{
                orderId:row.orderId
            }
        })
    }
    const getViewOrderList = (pageNum, pageSize) => {
        let params = {
         
                page: {
                    pageSize: pageSize,
                    pageNum: pageNum,
                    pagingSwitch:true
                },
                // userId: '11204447'
                userId:history.location.query.userId
        }
        params.status = form.getFieldsValue().status == null ?[]:[form.getFieldsValue().status]
        params= Object.assign(form.getFieldsValue(), params)
        memberOrderList(filterData(params)).then(resultes => {
            if (resultes.ret.errcode == 1) {
                setTableData(resultes.orderItem)
                setTotal(resultes.total)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const changeCurrentSize = (page, pageSize) => {
        setPageNum(page)
        setPageSize(pageSize)
        getViewOrderList(page, pageSize)
    }
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
                    <Form.Item label="订单编号：" name="orderId" className={styles['ant-form-item']}>
                        <Input placeholder="请输入优惠劵ID" allowClear />
                    </Form.Item>
                    <Form.Item label="订单状态：" name="status" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            {
                                statusList.map((item, index) => {
                                    return <Option value={item.value} key={index}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Button type="primary" icon={<ZoomInOutlined />} onClick={() => getViewOrderList(1, 20)}>
                        搜索
                        </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => { form.resetFields(); }}
                        icon={<UndoOutlined />}
                    >
                        重置
                        </Button>

                </Form>
                <Table columns={columns2} dataSource={tableData} pagination={false} className={styles['contain-table']} bordered rowKey="afterId" />
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
                    style={{ marginTop: 20 }}
                />
            </div>

        </ViewContainer>
    )
})

export default OrderList;

