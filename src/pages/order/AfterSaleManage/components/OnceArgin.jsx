import React, { useState, useImperativeHandle, useEffect, useCallback,useRef } from 'react';
import { Modal, Button, Form, Input, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import {ReChargeForOrder} from '@/services/order'
import styles from '../styles/RechargeManange.less'

// 要使用React.forwardRef才能将ref属性暴露给父组件
const OnceArgin = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('重试')
    const formRef = React.createRef(FormInstance)
    const confirmFormRef = useRef()
    const [defaultValue, setDefault] = useState({
        account:'',
        prodName:'',
        orderNo:'',
        faceValue:'',
        id:''
    })
    const [confirmVisible, setConfirmVisible] = useState(false)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changeDefault: (newVal)=>{
                setDefault(newVal)
            }
        }

    });
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
    const onFinish = values => {
        console.log('Received values of form:', values);
    }
    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                setVisible(false)
                setConfirmVisible(true)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        setVisible(false)
    };
    const handleCancelConfirm=()=>{
        setConfirmVisible(false)
    }
    const handleOkConfirm=()=>{
        var params = JSON.parse(JSON.stringify(defaultValue))
        ReChargeForOrder(params).then(resultes=>{
            if(resultes.ret.errcode==1){
                message.success('重试成功')
                setConfirmVisible(false)
            }
        })
    }
    return (
        <div>
            <React.Fragment>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ fontSize: '20px' }}
                    destroyOnClose
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            下一步
                      </Button>
                    ]}
                >
                    <Form
                        initialValues={
                            defaultValue
                        }
                        {...formItemLayout}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="充值账号："
                            name="account"
                            rules={[{ required: true, message: '充值账号不能为空' }]}
                        >
                            <Input placeholder="请输入敏感词" style={{ width: 200 }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title='确认操作'
                    visible={confirmVisible}
                    style={{ fontSize: '20px' }}
                    destroyOnClose
                    onCancel={handleCancelConfirm}
                    footer={[
                        <Button key="back" onClick={handleCancelConfirm}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOkConfirm}>
                            确定重试
                      </Button>
                    ]}
                >
                    <Form
                        {...formItemLayout}
                        name="dynamic_form_nest_item" autoComplete="off" ref={confirmFormRef}
                    >
                        <Form.Item
                            label="订单号："
                            name="orderNo"
                        >
                            <span className={styles['font-bold']}>{defaultValue.orderNo}</span>
                        </Form.Item>
                        <Form.Item
                            label="运营商："
                            name="prodName"
                        >
                            <span className={styles['font-bold']}>{defaultValue.prodName}</span>
                        </Form.Item>
                        <Form.Item
                            label="充值金额："
                            name="faceValue"
                        >
                            <span className={styles['font-bold']}>RM {defaultValue.faceValue}</span>
                        </Form.Item>
                        <Form.Item
                            label="充值账号："
                            name="account"
                        >
                            <span className={styles['font-bold']}>{defaultValue.account}</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default OnceArgin