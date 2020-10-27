import React, { useState, useCallback, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/GroupOrder.less'
import { Select, Input, Button, Pagination, Tag, Form, DatePicker, Row, Col, Table, Space, Popover, Tooltip, Image,Spin } from 'antd';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMode,history } from 'umi';
import moment from 'moment';
import enmu from './Enmu.js'
import { resolve } from '@/proto/proto';
import { groupOrderList } from '@/services/order';
import { timestampToTime } from '@/utils'
import { dealShowFileSrc } from '@/utils/utils'
import { filterData, filterGroupStatus, filterStatus } from '@/utils/filter'

const { Option } = Select;

const GroupOrder = () => {
    const columns2 = [
        {
            title: '拼团号',
            dataIndex: 'groupId',
            width: 200,
            fixed: 'left',
            align: 'center',
            render:(text,row,index)=>{
                const obj = {
                    children: text,
                    props: {},
                  };
                  if(row.rowspan){
                      obj.props.rowSpan=row.rowspan
                      obj.props.colSpan = 1
                  }else{
                      obj.props.rowSpan =0
                      obj.props.colSpan =0
                  }
                  return obj
            }
        },
        {
            title: '订单号',
            dataIndex: 'orderId',
            width: 200,
            fixed: 'left',
            align: 'center'
        },
        {
            title: '拼团商品信息',
            dataIndex: 'tags',
            width: 350,
            align: 'center',
            render: (text, row, index) => {
                return <div className={styles.productInfo} key="productItem">
                    <div className={styles.imgBox}>
                        <Popover content={<img src={dealShowFileSrc(row.productItem.skuCover)} alt="" style={{ width: '120px', height: '120px' }} />} trigger="hover">
                            <img src={dealShowFileSrc(row.productItem.skuCover)} style={{ width: '100px', height: '100px' }} />
                        </Popover>
                    </div>
                    <div className={styles['pointer']} onClick={()=>detailUser(row.userId)}>
                        <div>id：{row.productItem.productId}</div>
                        <div>{row.productItem.name}</div>
                    </div>
                </div>
            }
        },
        {
            title: '商品规格',
            dataIndex: 'attr',
            width: 200,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <div>{row.productItem.attr}</div>
                    <div>skuCode：{row.productItem.skuCode}</div>
                </div>
            }
        },
        {
            title: '拼团创建时间',
            width: 250,
            dataIndex: 'createTime',
            align: 'center',
            render: (text, row, index) => {
                const obj = {
                    children: timestampToTime(Number(row.createTime)),
                    props: {},
                  };
                  if(row.rowspan){
                      obj.props.rowSpan=row.rowspan
                      obj.props.colSpan = 1
                  }else{
                      obj.props.rowSpan =0
                      obj.props.colSpan =0
                  }
                  return obj
            },
        },

        {
            title: '拼团成功时间',
            width: 200,
            dataIndex: 'successTime',
            render: (text, row, index) => {
                const obj = {
                    children: timestampToTime(Number(row.successTime)),
                    props: {},
                  };
                  if(row.rowspan){
                      obj.props.rowSpan=row.rowspan
                      obj.props.colSpan = 1
                  }else{
                      obj.props.rowSpan =0
                      obj.props.colSpan =0
                  }
                  return obj
            },
            align: 'center'
        },
        {
            title: '拼团买家ID',
            width: 200,
            render: (text, row, index) => {
                return <div
                    className={styles['pointer']}
                    onClick={()=>detailUser(row.userId)}
                    >
                    <div>{row.userId}</div>
                </div>
            },
            align: 'center'
        },
        {
            title: '买家手机号',
            width: 150,
            dataIndex: 'userId',
            align: 'center',
            render: (text, row, index) => {
                return <div className={styles['pointer']} onClick={()=>detailUser(row.userId)}>
                    {row.memberPhone || row.userId}
                </div>
            }
        },
        {
            title: '收货人信息',
            width: 200,
            dataIndex: 'receiverName',
            render: (text, row, index) => {
                return <div>
                    <div>姓名：{row.ship.receiverName || '-'}</div>
                    <div>手机号：{row.ship.receiverPhone || '-'}</div>
                    <div>地址：{row.ship.receiverAddress || '-'}</div>
                    {
                        row.ship.expressNo.length > 0 && <div>物流单号：{row.ship.expressNo.join('，')}</div>
                    }
                </div>
            }
        },
        {
            title: '参团时间',
            width: 200,
            dataIndex: 'jionTime',
            align: 'center',
            render: (text, row, index) => {
                return <div>{timestampToTime(Number(row.jionTime))}</div>
            },
        },
        {
            title: '是否支付',
            width: 250,
            dataIndex: 'payStatus',
            render: (text, row, index) => {
                return <div>
                    {
                        row.payStatus == 1 ? <div>已支付</div> : (row.payStatus == 0 ? <div>未支付</div> : '')
                    }
                </div>
            },
            align: 'center'
        },
        {
            title: '拼团商品价格',
            width: 150,
            align: 'center',
            dataIndex: 'prive',
            render: (text, row, index) => {
                return <div> {getCurrencyUnit(row.countryCode, 'currencyUnit') + row.productItem.prive}</div>
            }
        },
        {
            title: '折扣',
            width: 100,
            align: 'center',
            dataIndex: 'discountRate',
            render: (text, row, index) => {
                return <div>{row.productItem.discountRate}</div>
            }
        },
        {
            title: '优惠金额',
            width: 100,
            align: 'center',
            dataIndex: 'totalDiscount',
            render: (text, row, index) => {
                return <div> {getCurrencyUnit(row.countryCode, 'currencyUnit') + row.productItem.totalDiscount}</div>
            }
        },
        {
            title: '运费',
            width: 100,
            align: 'center',
            dataIndex: 'freigh',
            render: (text, row, index) => {
                return <div> {getCurrencyUnit(row.countryCode, 'currencyUnit') + row.productItem.freigh}</div>
            }
        },
        {
            title: '状态',
            width: 100,
            align: 'center',
            dataIndex: 'groupStatus',
            render: (text, row, index) => {
                const obj = {
                    children: filterGroupStatus(row.groupStatus),
                    props: {},
                  };
                  if(row.rowspan){
                      obj.props.rowSpan=row.rowspan
                      obj.props.colSpan = 1
                  }else{
                      obj.props.rowSpan =0
                      obj.props.colSpan =0
                  }
                  return obj
            },
        },
        {
            title: '订单状态',
            width: 100,
            align: 'center',
            dataIndex: 'orderStatus',
            render: (text, row, index) => {
                return <div>{filterStatus(row.orderStatus)}</div>
            }
        },
        {
            title: '退积分',
            width: 100,
            align: 'center',
            render: (text, row, index) => {
                return <div>{row.productItem.returnPoint || 0}</div>
            }
        },
    ];
    const { groupStatus, groupType } = enmu;
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [defaultValue, setDefaultValue] = useState({
        orderId: '',
        groupTypeParam: '',
        userId: '',
        groupId: '',
        groupStatusParam: ''
    })
    const [tableData, setTableData] = useState([])
    const [form] = Form.useForm();
    const [loading,setLoading] = useState(false)
    const onFinish = (val) => {
        console.log(val)
    }
    const getCurrencyUnit = (code, key) => {
        let countryList = JSON.parse(localStorage.getItem('COUNTRY_LIST'))
        let item = countryList.find((val) => {
            return val.shortCode == code
        })
        if (key) {
            return item ? item[key] : null
        }
        return item ? key : null
    }
    const getViewOrderList = (pageNum, pageSize) => {
        setLoading(true)
        let params = {
            page: {
                pageSize: pageSize,
                pageNum: pageNum,
                pagingSwitch: true,
            },
            groupTypeParam: [],
            groupStatusParam: []
        }
        if(form.getFieldsValue()){
            if(form.getFieldsValue().groupTypeParam!=''){
                params.groupTypeParam.push(form.getFieldsValue().groupTypeParam)
            }
            if(form.getFieldsValue().groupStatusParam!=''){
                params.groupTypeParam.push(form.getFieldsValue().groupStatusParam)
            }
        }
        params = Object.assign(form.getFieldsValue(), params)
        groupOrderList(params).then(resultes => {
            if (resultes.ret.errcode == 1) {
                let data = []
                for (let i = 0; i < resultes.groupItem.length; i++) {
                    for (let j = 0; j < resultes.groupItem[i].orderItem.length; j++) {
                        let item = JSON.parse(JSON.stringify(resultes.groupItem[i]))
                        if (j == 0) {
                            item['rowspan'] = resultes.groupItem[i].orderItem.length
                        }
                        Object.assign(item, resultes.groupItem[i].orderItem[j])
                        data.push(item)

                    }
                }
                setTableData(data)
                setTotal(resultes.total)
                setLoading(false)
            }
        }).catch(error => {
            console.log(error)
        })

    }
    const resetSearch = ()=>{
        form.resetFields()
        setPageNum(1)
        setPageSize(20)
        getViewOrderList(pageNum, pageSize)
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

    }
    //会员详情页
    const detailUser=(userId)=>{
        console.log(userId)
        history.push({
            pathname:'/order/memberInfo',
            query:{
                userId:userId
            }
        })
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
                    <Form.Item label="拼团单号：" name="groupId" className={styles['ant-form-item']}>
                        <Input placeholder="请输入拼团单号" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="订单号："
                        name="orderId"
                        className={styles['ant-form-item']}
                    >
                        <Input placeholder="请输入订单号" allowClear />
                    </Form.Item>
                    <Form.Item label="拼团用户ID：" name="userId" className={styles['ant-form-item']}>
                        <Input placeholder="请输入订单号" allowClear />
                    </Form.Item>
                    <Form.Item label="拼团状态" name="groupStatusParam" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            {
                                groupStatus.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="拼团类型" name="groupTypeParam" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            {
                                groupType.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<ZoomInOutlined />} onClick={() => getViewOrderList(1, 20)}>
                                搜索
                        </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={resetSearch}
                                icon={<UndoOutlined />}
                            >
                                重置
                        </Button>
                        </Col>
                    </Row>
                </Form>
               
                    <Table columns={columns2} dataSource={tableData} pagination={false} className={styles['contain-table']} bordered rowKey="groupId" scroll={{ x: '100vw' }} loading={loading} />
               
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
        </ViewContainer>
    )
}

export default GroupOrder;

