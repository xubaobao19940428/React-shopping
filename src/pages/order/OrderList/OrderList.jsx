import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Select, Input, Button, Pagination, Tag, Tabs, Form, DatePicker, Row, Col, message} from 'antd';
import { ZoomInOutlined ,UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import enmu from '../Enmu.js'
import { viewOrderList, exportOrder } from '@/services/order';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/OrderList.less'
import OrderTable from './components/OrderTable'

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderList = () => {
    const { orderStatusEnum, orderTypeEnum, selectProductTypeEnum, selectUserTypeEnum } = enmu;
    const [activeTab, setActiveTab] = useState('-1')
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [dataList, setDataList] = useState([])
    const { countries } = useModel('dictionary')
    const [defaultValue, setDefaultValue] = useState({
        id: '',
        timeType: '0',
        countryCode: '',
        orderType: [],
        deliveryWay: null,
        timeList: [moment().subtract(15,'days'), moment()],
        selectProductType: '0',
        selectUserType: '0',
        product: '',
        userVal: ''
    })
    const [expand, setExpand] = useState(false)
    const [form] = Form.useForm();

    const onFinish = (val) => {
        console.log(val)
        setDefaultValue({
            ...defaultValue,
            ...val
        })
    }
    const getViewOrderList = () => {
        let productName,productId,skuId,userId,parentId
        switch(defaultValue.selectProductType){
            case 0: productName=defaultValue.product;productId="";skuId="";break;
            case 1: productName="";productId=defaultValue.product;skuId="";break;
            case 2: productName="";productId="";skuId=defaultValue.product;break;
        }
        switch(defaultValue.selectUserType){
            case 0:userId=defaultValue.userVal;parentId=''; break;
            case 1:userId='';parentId=defaultValue.userVal; break;
        }
        let params = {
            id: defaultValue.id,
            timeType: defaultValue.timeType,
            countryCode: defaultValue.countryCode,
            orderType: defaultValue.orderType,
            deliveryWay: defaultValue.deliveryWay,
            startTime: defaultValue.timeList !== null ?moment(defaultValue.timeList[0]._d).valueOf() : null,
            endTime: defaultValue.timeList !== null ?moment(defaultValue.timeList[1]._d).valueOf() : null,
            productName,
            productId,
            skuId,
            userId,
            parentId,
            selectProductType: defaultValue.selectProductType,
            selectUserType: defaultValue.selectUserType,
            orderStatus: activeTab == '-1' ? [] : [parseInt(activeTab)]
        }
        console.log(params)
        viewOrderList({
            cond: params,
            page:{
                pageNum,
                pageSize
            }
        }).then(res => {
            if (res.ret.errcode === 1) {
                console.log(res)
                for (let i = 0; i < res.item.length; i++) {
                    res.item[i].editFlg = false
                    res.item[i].editFlg = false
                    res.item[i].remarkBack = res.item[i].remarkBack ? res.item[i].remarkBack : ''
                    for (let index = 0; index < res.item[i].productItem.length; index++) {
                        if (index === 0) {
                            res.item[i].productItem[index].row = res.item[i].productItem.length
                        } else {
                            res.item[i].productItem[index].row = 0
                        }
                    }
                }
                console.log(res.item)
                setDataList(res.item)
                setTotal(res.total)
            }
        })
    }
    const getExportOrder = () => {
        if (!defaultValue.timeList || defaultValue.timeList.length !== 2) {
            message.error('请选择导出日期范围!')
            return
        }
        let productName,productId,skuId,userId,parentId
        switch(defaultValue.selectProductType){
            case 0: productName=defaultValue.product;productId="";skuId="";break;
            case 1: productName="";productId=defaultValue.product;skuId="";break;
            case 2: productName="";productId="";skuId=defaultValue.product;break;
        }
        switch(defaultValue.selectUserType){
            case 0:userId=defaultValue.userVal;parentId=''; break;
            case 1:userId='';parentId=defaultValue.userVal; break;
        }
        console.log(defaultValue)

        let params = {
            id: defaultValue.id,
            timeType: defaultValue.timeType,
            countryCode: defaultValue.countryCode,
            orderType: defaultValue.orderType,
            deliveryWay: defaultValue.deliveryWay,
            startTime: defaultValue.timeList !== null ?moment(defaultValue.timeList[0]._d).valueOf() : null,
            endTime: defaultValue.timeList !== null ?moment(defaultValue.timeList[1]._d).valueOf() : null,
            productName,
            productId,
            skuId,
            userId,
            parentId,
            selectProductType: defaultValue.selectProductType,
            selectUserType: defaultValue.selectUserType,
            orderStatus: activeTab == '-1' ? [] : [parseInt(activeTab)]
        }
        exportOrder({cond: params}).then(res => {
            if (res.ret.errcode === 1) {
                window.open(res.url)
            }
        })
    }
    const serchOrder = () => {
        getViewOrderList()
    }
    const downLoad = () => {

    }
    const changeDate = (date,dateString) => {
        console.log(date,dateString)
        setDefaultValue({
            ...defaultValue,
            timeList: date
        })
    }
    const tabChange = (val) =>{
        console.log(val)
        setActiveTab(val)
    }
    const changeCurrentSize = (page, pageSize) => {
        setPageNum(page)
        setPageSize(pageSize)
    }
    useEffect(() => {
        getViewOrderList()
    },[pageSize, pageNum, activeTab, defaultValue])
    return(
        <ViewContainer>
            <div className={styles.mainTab}>
                <Tabs defaultActiveKey={activeTab} type="card" className={styles.tabItem} onChange={tabChange}>
                    {
                        orderStatusEnum.map(item => {
                            return <TabPane key={item.key} tab={item.name}></TabPane>
                        })
                    }
                </Tabs>
            </div>
            <Form
                form={form}
                initialValues={defaultValue}
                onFinish={onFinish}
                className={styles.orderForm}
                >
                <Form.Item
                    label="订单编号："
                    name="id"
                >
                    <Input placeholder="支持查询父订单和子订单编号" allowClear/>
                </Form.Item>
                <Form.Item
                    label="时间查询："
                >
                    <Input.Group compact>
                        <Form.Item
                            name="timeType"
                            noStyle
                        >
                            <Select style={{ width: 120 }}>
                                <Option value="0" key={0}>创建时间</Option>
                                <Option value="1" key={1}>支付时间</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="timeList" noStyle>
                            <RangePicker onChange={changeDate}/>
                        </Form.Item>    
                    </Input.Group>
                </Form.Item>
                <Form.Item label="订单类型：" name="orderType">
                    <Select style={{ width: 200 }} placeholder="请选择" mode="multiple" allowClear>
                        {
                            Object.keys(orderTypeEnum).map(item => {
                                return <Option value={item} key={item}>{orderTypeEnum[item]}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                { expand && 
                    <>
                        <Form.Item label="发货方式：" name="deliveryWay">
                            <Select style={{ width: 160 }} placeholder="请选择">
                                <Option value={1} key={1}>平台发货</Option>
                                <Option value={2} key={2}>直邮</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="商品：">
                            <Input.Group compact>
                                <Form.Item
                                    name="selectProductType"
                                    noStyle
                                >
                                    <Select style={{ width: 120 }}>
                                        {
                                            Object.keys(selectProductTypeEnum).map(item => {
                                                return <Option value={item} key={item}>{selectProductTypeEnum[item]}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="product"
                                    noStyle
                                >
                                    <Input placeholder="请输入" allowClear/>
                                </Form.Item>    
                            </Input.Group>
                        </Form.Item>
                        <Form.Item label="销售国家" name="countryCode">
                            <Select style={{ width: 160 }} placeholder="请选择">
                                {
                                    countries.map(item => {
                                        return <Option value={item.code} key={item.code}>{item.nameCn}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="用户：">
                            <Input.Group compact>
                                <Form.Item
                                    name="selectUserType"
                                    noStyle
                                >
                                    <Select style={{ width: 120 }}>
                                        {
                                            Object.keys(selectUserTypeEnum).map(item => {
                                                return <Option value={item} key={item}>{selectUserTypeEnum[item]}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="userVal"
                                    noStyle
                                >
                                    <Input placeholder="请输入" allowClear/>
                                </Form.Item>    
                            </Input.Group>
                        </Form.Item>
                    </>
                }
                
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" icon={<ZoomInOutlined/>} onClick={serchOrder}>
                            搜索
                        </Button>
                        <Button
                            style={{ margin: '0 8px' }}
                            onClick={() => { form.resetFields();}}
                            icon={<UndoOutlined />}
                        >
                            重制
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '0 8px' }}
                            onClick={() => { downLoad }}
                            icon={<VerticalAlignBottomOutlined />}
                            onClick={getExportOrder}
                        >
                            下载
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
            <OrderTable dataList={dataList} countryList={countries}></OrderTable>
            <div className={styles.orderPage}>
                <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    current={pageNum}
                    pageSize={pageSize}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[10, 20, 50]}
                    showQuickJumper
                    showSizeChanger
                />
            </div>
        </ViewContainer>
    )
}

export default OrderList

