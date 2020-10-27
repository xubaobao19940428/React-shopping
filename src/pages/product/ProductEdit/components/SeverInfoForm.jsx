import React, {useState, useCallback, forwardRef, useEffect, useRef, useImperativeHandle} from 'react';
import {Form,Input,Row,Col,Radio,Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
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
const { Option } = Select
/**
/*
/*服务承诺
/*
*/
const SeverInfoForm =React.forwardRef((props,ref) => {
    const formRef = React.createRef(FormInstance)

    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            getData:()=>{
                return new Promise(((resolve, reject) => {
                    formRef.current.validateFields().then(currentValue => {
                        if (currentValue) {
                            resolve(currentValue)
                        } else {
                            console.log('error,submit')
                            reject()
                        }
                    })
                }))
            }
        }
    })

    return (
        <div>
            {props.defaultValue[props.countryCode] && <Form
                initialValues={props.defaultValue[props.countryCode]}
                {...formItemLayout}
                name="dynamic_form_nest_item" autoComplete="off" ref={formRef}
            >
                <Form.Item label="售后策略">
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item
                                name="afterSalePledge"
                                noStyle
                                rules={[{ required: true, message: '售后策略不能为空!' }]}
                            >
                                <Select allowClear >
                                    {
                                        props.afterSalePledge.length != 0 &&
                                        props.afterSalePledge.map((item, index) => {
                                            return <Option value={item.afterSaleId} key={index}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <span style={{ color: '#666666' }}>此承诺将展示在APP商品详情页中</span>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label="到货承诺：">
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item
                                name="arrivalPledge"
                                noStyle
                            >
                                <Select allowClear>
                                    {
                                        props.arrivalList[props.countryCode] &&
                                        props.arrivalList[props.countryCode].map((item, index) => {
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
                    <Row gutter={10}>
                        <Col span={5}>
                            <Form.Item
                                name="freightType"
                                noStyle
                            >
                                <Radio.Group>
                                    <Radio value="1">运费模板</Radio>
                                    <Radio value="2">包邮</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={15}>
                            <Form.Item
                                name="freightId"
                                noStyle
                            >
                                <Select allowClear>
                                    {
                                        props.freightTemplateList[props.countryCode] && props.freightTemplateList[props.countryCode].map((item, index) => {
                                            return <Option value={item.templateId} key={item.templateId}>{item.templateName}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>}
        </div>
    )
})
export default SeverInfoForm;
