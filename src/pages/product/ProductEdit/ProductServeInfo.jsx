// 商品服务承诺
import React, { useCallback, useState, useEffect, useRef, useImperativeHandle } from 'react';
import styles from './styles/index.less';
import { Select, Tabs, Input, Radio, Form, Row, Col,Button, message } from 'antd';
import {useModel} from "@@/plugin-model/useModel";
import {listAfterSale, listArrival} from "@/services/pledge";
import {freightTemplateListPage} from "@/services/product";
import { filterCountry } from '@/utils/filter'
import { FormInstance } from 'antd/lib/form';
import {history} from 'umi'
const { TabPane } = Tabs;
const { Option } = Select
const ProductServeInfo = React.forwardRef((props, ref) => {
    const [activeKey, setActiveKey] = useState('MY')
    const { spuCountryInfo, getSpuCountryInfo, updateSpuCountryInfo } = useModel('useProEdit');
    const [arrivalList, setArrivalList] = useState({})
    const [freightTemplateList, setFreightTemplateList] = useState({})
    const [afterSalePledge, setAfterSalePledge] = useState([])
    const serverFormRef = React.createRef(FormInstance)
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 2 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    }

    const tabsChange = (val) => {
        setActiveKey(val)
    }

    function handleChange (countryCode, allValues) {
        updateSpuCountryInfo(countryCode, allValues)
    }
    //新增时给到默认选中的运费模版以及到货承诺
    const getListArrival = (countryCode) => {
        let arrivalListOrigin = JSON.parse(JSON.stringify(arrivalList))
        if (arrivalListOrigin[countryCode]) {
            return
        }
        if(!history.location.query.productId){
            serverFormRef.current.setFieldsValue({
                freightType: '1',
                freightId: '',
                afterSalePledge: '',
                arrivalPledge: ''
            })
        }else{
            serverFormRef.current.setFieldsValue(getSpuCountryInfo(countryCode))
        }
        listArrival({
            type: 2,
            countryCode: countryCode,
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }).then(res => {
            if (res.ret.errcode == 1) {
                arrivalListOrigin[countryCode] = res.arrivalPledge
                setArrivalList(arrivalListOrigin)

            }
        }).catch(error => {
            console.log(error)
        })
    }
    //得到运费模版
    const getFreightType = (countryCode) => {
        let freightTypeList = JSON.parse(JSON.stringify(freightTemplateList))
        if (freightTypeList[countryCode]) {
            return
        }
        freightTemplateListPage({
            countryCode: countryCode,
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }).then(res => {
            if (res.ret.errcode == 1) {
                freightTypeList[countryCode] = res.freightTemplateUnit
                setFreightTemplateList(freightTypeList)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    //得到售后承诺
    const getListAfterSale = () => {
        if (afterSalePledge.length > 0) {
            return
        }
        listAfterSale({
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }).then(res => {
            if (res.ret.errcode == 1) {
                setAfterSalePledge(res.afterSalePledge)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeDefaultVal: (newVal) => {
            },
            validateForm:()=>{
                let serverInfoForm={}
                let str
                if(props.countryList.length>spuCountryInfo.length){
                    message.warning('服务承诺未填写完全')
                    return false
                }else{
                   
                     spuCountryInfo.map(serve=>{
                         if(serve.countryCode=='MY'){
                            str='马来西亚'
                         }else if(serve.countryCode=='TH'){
                             str='泰国'
                         }else if(serve.countryCode=='ID'){
                             str='新加坡'
                         }
                             if(!serve.afterSalePledge){
                                 message.warning(`${str}售后策略未选择`)
                                 return false
                             }else if(!serve.freightId){
                                 message.warning(`${str}运费模版未选择`)
                                 return false
                             }else{
                                serverInfoForm[serve.countryCode] = serve
                             }
                     })
                }
                return serverInfoForm
            }
        }
    })

    useEffect(() => {
        getListArrival(activeKey)
        getFreightType(activeKey)
        getListAfterSale()
        serverFormRef.current.setFieldsValue(getSpuCountryInfo(activeKey))
    }, [activeKey])
    useEffect(() => {
        serverFormRef.current.setFieldsValue(getSpuCountryInfo(activeKey))
    }, [spuCountryInfo])
    return (
        <div className={styles.productServeInfo}>
            <Tabs onChange={tabsChange} defaultActiveKey='MY' activeKey={activeKey}>
                {
                    props.countryList.map(countryCode => <TabPane tab={filterCountry(countryCode)} key={countryCode}>
                        {
                            <Form
                                ref={serverFormRef}
                                initialValues={getSpuCountryInfo[countryCode]}
                                {...formItemLayout}
                                onValuesChange={(changedValues, allValues) => handleChange(countryCode, allValues)}
                                autoComplete="off"
                            >
                                <Form.Item label="售后策略：" required>
                                    <Row gutter={10} style={{width:'100%'}}>
                                        <Col span={10}>
                                            <Form.Item
                                                name="afterSalePledge"
                                                noStyle
                                                rules={[{ required: true, message: '售后策略不能为空!' }]}
                                            >
                                                <Select allowClear>
                                                    {
                                                        afterSalePledge.length != 0 &&
                                                        afterSalePledge.map((item, index) => {
                                                            return <Option value={item.afterSaleId} key={index}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <span style={{ color: '#666666' }}>此承诺将展示在APP商品详情页中</span>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item label="到货承诺：">
                                    <Row gutter={10} style={{width:'100%'}}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="arrivalPledge"
                                                noStyle
                                            >
                                                <Select allowClear>
                                                    {
                                                        arrivalList[countryCode] &&
                                                        arrivalList[countryCode].map((item, index) => {
                                                            return <Option value={item.arrivalId} key={index}>{item.name}</Option>
                                                        })

                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={16}>
                                            <span style={{ color: '#666666' }}>此承诺将展示在APP商品详情页、搜索列表页、购物车、订单详情页中</span>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item label="运费模版：">
                                    <Row gutter={10} style={{width:'100%'}}>
                                        <Col span={3}>
                                            <Form.Item
                                                name="freightType"
                                                noStyle
                                            >
                                                <Radio.Group style={{display:'flex','flexDirection':'column'}}>
                                                    <Radio value="1">运费模板</Radio>
                                                    <Radio value="2">包邮</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="freightId"
                                                
                                                rules={[{required:true,message:'请选择运费模版'}]}
                                                noStyle
                                            >
                                                <Select allowClear>
                                                    {
                                                        freightTemplateList[countryCode] && freightTemplateList[countryCode].map((item, index) => {
                                                            return <Option value={item.templateId} key={item.templateId}>{item.templateName}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>
                        }
                    </TabPane>)
                }
            </Tabs>
        </div>
    )
})
export default React.memo(ProductServeInfo, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
})
