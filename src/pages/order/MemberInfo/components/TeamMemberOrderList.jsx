import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/TeamMember.less'
import { Select, Input, Button, Pagination, Tag, Form, Row, Col, Table, Space } from 'antd';
import { ZoomInOutlined, UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listTeamMemberByPage } from '@/services/user';
import { history } from 'umi'
import { timestampToTime } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import { filterData } from '@/utils/filter'

const { Option } = Select;
const TeamMemberOrderList = React.forwardRef((props, ref) => {
    const columns2 = [
        {
            title: '用户Id',
            dataIndex: 'userId',
            width: 100,
            align: 'center'
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            width: 100,
            align: 'center'
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            align: 'center',
        },
        {
            title: '等级',
            dataIndex: 'memberLevel',
            width: 100,
            align: 'center',
            render: (text, row, index) => {
                return <div>{userLevel[row.memberLevel]}</div>
            }
        },
        {
            title: '绑定时间',
            width: 250,
            dataIndex: 'bindingTime',
            align: 'center',
            render: (text, row, index) => {
                return <div>{timestampToTime(Number(row.bindingTime))}</div>
            }
        },

        {
            title: '关系',
            dataIndex: 'relation',
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    {row.relation == 1 ? <Tag color="geekblue">直属</Tag> : <Tag color="geekblue">间属</Tag>}
                </div>


            }
        },
        {
            title: '贡献收益',
            dataIndex: 'commissionAmount',
            align: 'center',
            render: (text, row, index) => {
                return <div>{row.commissionAmount || '-'}</div>
            }
        },
        {
            title: '团队人数',
            dataIndex: 'teamMemberCount',
            align: 'center',
            render: (text, row, index) => {
                return <div>{row.teamMemberCount.teamTotalNum}</div>
            }
        },
        {
            title: '总返利',
            dataIndex: 'commissionAmount',
            align: 'center',
        },
        {
            title: '操作',
            width: 100,
            dataIndex: 'refundType',
            align: 'center',
            fixed:'right',
            render: (text, row, index) => {
                return <Button onClick={() => operation(row.id)}>详情</Button>
            }
        }
    ];
    useImperativeHandle(ref, () => {
        return {
            getTeamOrderData: () => {
                getViewOrderList(1, 20)
            }
        }
    })
    const [relationshipList, setRealtion] = useState([
        {
            value: 1,
            label: '直属'
        },
        {
            value: 2,
            label: '间属'
        }
    ])
    const [userLevel, setUserLevel] = useState({
        1: '全部',
        2: 'SP',
        3: 'PS',
        4: 'AM',
        5: 'AT'
    })
    const commissionStatusList = [
        {
            value: 0,
            label: '未返佣'
        },
        {
            value: 1,
            label: '已返佣'
        }
    ]
    const statusList = [
        {
            value: null,
            label: '全部'
        },
        {
            value: 1,
            label: '未付款'
        },
        {
            value: 2,
            label: '未发货'
        },
        {
            value: 3,
            label: '已发货'
        },
        {
            value: 4,
            label: '订单完成'
        },
        {
            value: 4,
            label: '售后'
        }
    ]
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [defaultValue, setDefaultValue] = useState({})
    const [tableData, setTableData] = useState([])
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (val) => {
        console.log(val)
    }
    const operation = (id) => {
        console.log(id)
    }
    const getViewOrderList = (pageNum, pageSize) => {
        let params = {
            page: {
                pageSize: pageSize,
                pageNum: pageNum
            },
            // userId: '11204447'
            userId:history.location.query.userId
        }
        params = Object.assign(form.getFieldsValue(), params)
        // listTeamMemberByPage(filterData(params)).then(resultes => {
        //     if (resultes.ret.errcode == 1) {
        //         console.log(resultes)
        //         setTableData(resultes.lowerUserPb)
        //         setTotal(resultes.total)
        //     }
        // }).catch(error => {
        //     console.log(error)
        // })
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
                    <Form.Item
                        label="订单编号："
                        name="orderId"
                        className={styles['ant-form-item']}
                    >
                        <Input placeholder="请输入订单编号：" allowClear />
                    </Form.Item>
                    <Form.Item label="返佣状态：" name="commissionStatus" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            {
                                commissionStatusList.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="订单状态：" name="status" className={styles['ant-form-item']}>
                        <Select style={{ width: 200 }} placeholder="请选择">
                            {
                                statusList.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    {expand &&
                        <>
                            <Form.Item
                                label="归属用户Id："
                                name="memberId"
                                className={styles['ant-form-item']}
                            >
                                <Input placeholder="请输入用户Id" allowClear />
                            </Form.Item>
                            <Form.Item label="关系：" name="relation" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择">
                                    {
                                        relationshipList.map(item => {
                                            return <Option value={item.value} key={item.value}>{item.label}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="等级：" name="memberLevel" className={styles['ant-form-item']}>
                                <Select style={{ width: 200 }} placeholder="请选择">
                                    {
                                        Object.keys(userLevel).map((item, index) => {
                                            return <Option value={item} key={index}>{userLevel[item]}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    }
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
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

export default TeamMemberOrderList;

