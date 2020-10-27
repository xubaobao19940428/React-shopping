import React, { useState, useImperativeHandle, useEffect, useCallback, useRef } from 'react';
import { Modal, Button, Form, Input, Space, message, Radio, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { GetUserBankList } from '@/services/order'

// import styles from '../styles/RechargeManange.less'

// 要使用React.forwardRef才能将ref属性暴露给父组件
const { Option } = Select;
const RefundMethod = (props) => {
    const [RefundMethodVisible, setVisible] = useState(false);
    const [title, setTitle] = useState('修改退款方式')
    const formRef = React.createRef(FormInstance)
    const [value4, setVal] = useState(props.defaultValue.refundType)
    const [bankList, setBankList] = useState([])
    const [refundCardNoList, setRefundCardNoList] = useState([])
    const [refundBankNameList, setRefundBankNameList] = useState([])
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };
    const onFinish = values => {
        console.log('Received values of form:', values);
    }
    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                props.confirm(currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        setVal(1)
        props.cancel()
    };
    const onChange4 = (e) => {
        setVal(e.target.value)
    }
    const getUserBankList = () => {
        let params = {
            userId: props.userId
        }
        GetUserBankList(params).then(res => {
            if (res.ret.errcode === 1) {
                setBankList(res.data)
                let refundCardNoList = []
                let refundBankNameList = []
                for (let index = 0; index < res.data.length; index++) {
                    refundCardNoList.push({ val: res.data[index].accountNo, label: res.data[index].accountNo })
                    refundBankNameList.push({ val: res.data[index].bankName, label: res.data[index].bankName })
                }
                setRefundBankNameList(refundBankNameList)
                setRefundCardNoList(refundCardNoList)
            }
        })
    }
    const cardChange =(val)=> {
        console.log(val)
        for (const iterator of bankList) {
            if (val === iterator.accountNo) {
                formRef.current.setFieldsValue({
                refundBankName:iterator.bankName,
                refundCardholder:iterator.accountName,
                mobile:iterator.mobile,
                email:iterator.email
                })
                
            }
        }
    }
    const bankChange=(val)=>{
        for (const iterator of bankList) {
            if (val === iterator.bankName) {
                formRef.current.setFieldsValue({
                refundCardNo:iterator.accountNo,
                refundCardholder:iterator.accountName,
                mobile:iterator.mobile,
                email:iterator.email
                })
                
            }
        }
    }
    useEffect(() => {
        if (props.userId) {
            getUserBankList()
        }
    },[props.userId])
    return (
        <div>
            <Modal
                title={title}
                visible={props.RefundMethodVisible}
                style={{ fontSize: '20px', width: 600 }}
                destroyOnClose
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取 消
                      </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        确 定
                      </Button>
                ]}
            >
                <Form
                    initialValues={
                        props.defaultValue
                    }
                    {...formItemLayout}
                    name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                >
                    <Form.Item
                        label="退款账号："
                        name="refundType"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group value={value4} onChange={(val)=>onChange4(val)}>
                            <Radio value={1}>积分</Radio>
                            <Radio value={0}>银行卡</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        (value4== 0) &&
                        <div>
                            <Form.Item
                                label="银行卡号："
                                name="refundCardNo"
                                rules={[{ required: true }]}
                            >
                                <Select onChange={(val)=>cardChange(val)}>
                                    {
                                        refundCardNoList.map((item,index)=>{
                                        return <Option value={item.val} key={item.val} >{item.val}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="银行名称："
                                name="refundBankName"
                                rules={[{ required: true }]}
                            >
                                <Select onChange={(val)=>bankChange(val)}>
                                    {
                                        refundBankNameList.map((item,index)=>{
                                        return <Option value={item.val} key={item.val} >{item.val}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="账户名称："
                                name="refundCardholder"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="请输入"></Input>
                            </Form.Item>
                            <Form.Item
                                label="联系电话："
                                name="mobile"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="请输入" disabled></Input>
                            </Form.Item>
                            <Form.Item
                                label="电子邮箱："
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="请输入" disabled></Input>
                            </Form.Item>
                        </div>
                    }
                </Form>
            </Modal>
        </div>
    );
}
export default RefundMethod