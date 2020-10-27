import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle,useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/TeamMember.less'
import { Select, Input, Button, Pagination, Tag, Form, Row, Col, Table, Space } from 'antd';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { queryUserCouponManage,queryCouponType } from '@/services/user';
import { history,useModel} from 'umi'
import { timestampToTime } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import { filterData } from '@/utils/filter'

const { Option } = Select;
const CouponList = React.forwardRef((props, ref) => {
    const columns2 = [
        {
            title: '优惠劵ID',
            dataIndex: 'couponId',
            width: 100,
            align: 'center',
            render:(text,row,index)=>{
            return <div>{row.couponUserDopb.couponId}</div>
            }
        },
        {
            title: '中文名称',
            dataIndex: 'name',
            width: 150,
            align: 'center',
            render:(text,row,index)=>{
                return <div>
                    { getLanguage(row.name, 'cn')}
                </div>
            }
        },
        {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            width: 100,
            render:(text,row,index)=>{
                return <div>
                    {
                        getCouponTypeName(row.type)
                    }
                </div>
            }
        },
        {
            title: '使用范围',
            dataIndex: 'memberLevel',
            width: 100,
            align: 'center',
            render: (text, row, index) => {
                return <div>{ couponScope[row.couponUserDopb.couponScope] }</div>
            }
        },
        {
            title: '适用国家',
            dataIndex: 'memberLevel',
            width: 100,
            align: 'center',
            render: (text, row, index) => {
            return <div>{getCountryName(row.couponUserDopb.countryCode)}</div>
            }
        },
        {
            title: '优惠劵有效期',
            width: 450,
            dataIndex: 'bindingTime',
            align: 'center',
            render: (text, row, index) => {
                return <div>{ timestampToTime(Number(row.couponUserDopb.startTime))} - {timestampToTime(Number(row.couponUserDopb.endTime))}</div>
            }
        },

        {
            title: '使用状态',
            dataIndex: 'relation',
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    { useStatus[row.couponUserDopb.couponUseStatus || 0]}
                </div>

            },
            width:150
        },
        {
            title: '领取方式',
            dataIndex: 'receivingChannel',
            align: 'center',
            render: (text, row, index) => {
                return <div>{row.couponUserDopb.receivingChannel}</div>
            },
            width:150
        },
        {
            title: '使用日期',
            width: 180,
            dataIndex: 'refundType',
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {
                        row.couponUserDopb.couponUseTime?<span>{timestampToTime(Number(row.couponUserDopb.couponUseTime))}</span>:<span>-</span>
                    }
                </div>
            }
        },
        {
            title: '订单编号',
            dataIndex: 'receivingChannel',
            align: 'center',
            render: (text, row, index) => {
                return <div>{row.couponUserDopb.orderId}</div>
            },
            width:180
        },
    ];
    useImperativeHandle(ref, () => {
        return {
            getCouponList: () => {
                getViewOrderList(1, 20)
            }
        }
    })
    const useStatus={
        0: '未使用',
        1: '已使用',
        2: '已过期'
    }
    const couponScope={ // 优惠券范围
        1: '指定商品',
        2: '指定品类',
        3: '全品券'
    }
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [defaultValue, setDefaultValue] = useState({
        couponUseStatus:9,
        couponType:''
    })
    
    const [tableData, setTableData] = useState([])
    const [typeList,setTypeList] = useState([])
    const [form] = Form.useForm();
    const { countries, languages } = useModel('dictionary');
    const getCountryName =(data)=> {
        let item = countries.find(item => item.shortCode === data)
        return item ? item.nameLocal : ' '
    }
    const onFinish = (val) => {
        console.log(val)
    }
    const operation = (id) => {
        console.log(id)
    }
    const getLanguage =(data, type)=> {
        let res = ''
        if (data && data.length) {
            let item = data.find(item => item.languageCode === type)

            res = item ? item.name : ' '
        }
        return res
    }
    const getCouponTypeName =(type)=> {
        let item = typeList.find((val) => {
            return type == val.id
        })
        return item ? item.desc : ''
    }
    const getViewOrderList = (pageNum, pageSize) => {
        let params = {
            query:{
                page: {
                    pageSize: pageSize,
                    pageNum: pageNum,
                    pagingSwitch:true
                },
                // userId: '11204447'
                userId:history.location.query.userId
           } 
        }
        params.query = Object.assign(form.getFieldsValue(), params.query)
        queryUserCouponManage(filterData(params)).then(resultes => {
            if (resultes.ret.errcode == 1) {
                setTableData(resultes.couponUserRespPb)
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
    const getCouponType = ()=>{
        queryCouponType({}).then(res => {
            if (res.ret.errcode === 1) {
                setTypeList(res.couponTypeResult)
            }
        })
    }
    useEffect(()=>{
        getCouponType()
    },[])
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
                    <Form.Item label="优惠劵ID：" name="couponId" className={styles['ant-form-item']}>
                        <Input placeholder="请输入优惠劵ID" allowClear />
                    </Form.Item>
                    <Form.Item label="优惠券名称：" name="couponName" className={styles['ant-form-item']}>
                        <Input placeholder="请输入优惠券名称" allowClear />
                    </Form.Item>
                    <Form.Item label="类型：" name="couponType" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            <Option value="">全部</Option>
                         {
                                typeList.map(item => {
                                    return <Option value={item.id} key={item.id}>{item.desc}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="使用状态：" name="couponUseStatus" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                        <Option value={9}>全部</Option>
                            {
                                Object.keys(useStatus).map((item, index) => {
                                    return <Option value={item} key={index}>{useStatus[item]}</Option>
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
                <Table columns={columns2} dataSource={tableData} pagination={false} className={styles['contain-table']} bordered rowKey="couponId" scroll={{"x":'100vw'}}/>
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

export default CouponList;

