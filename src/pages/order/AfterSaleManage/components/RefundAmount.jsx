import React, { useState, useImperativeHandle, useEffect, useCallback, useRef } from 'react';
import { Modal, Button, Form, Input, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
// import styles from '../styles/RechargeManange.less'

// 要使用React.forwardRef才能将ref属性暴露给父组件
const RefundAmount = (props) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('修改退款金额')
    const formRef = React.createRef(FormInstance)
    const confirmFormRef = useRef()
    const [defaultValue, setDefault] = useState({
        amount: '',
        freight: ''
    })
    const [confirmVisible, setConfirmVisible] = useState(false)
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
        props.cancel()
    };
    const handleCancelConfirm = () => {
        setConfirmVisible(false)
    }
    const handleOkConfirm = () => {
        var params = JSON.parse(JSON.stringify(defaultValue))
        ReChargeForOrder(params).then(resultes => {
            if (resultes.ret.errcode == 1) {
                message.success('重试成功')
                setConfirmVisible(false)
            }
        })
    }
    const numberEvent = (e) => {

        if (e.target.value > defaultValue.freight) {
            console.log(formRef.current)
            formRef.current.setFieldsValue({
                freight: props.defaultValue.freight
            })
        }
    }
    const numberEventAmount = (e) => {

        if (e.target.value > props.defaultValue.amount) {
            formRef.current.setFieldsValue({
                amount: props.defaultValue.amount
            })
        }
    }
    const checkFright = (rule, value) => {
        if (/[^\d.]/g.test(value)) {
            return Promise.reject('请输入数字');
        } else if (value > props.defaultValue.freight) {
            return Promise.reject(`退款运费不能高于${props.defaultValue.freight}`);
        } else {
            return Promise.resolve();
        }
    }
    const checkAmount = (rule, value) => {
        if (/[^\d.]/g.test(value)) {
            return Promise.reject('请输入数字');
        } else if (value > props.defaultValue.amount) {
            return Promise.reject(`商品退款不能高于${props.defaultValue.amount}`);
        } else {
            return Promise.resolve()
        }
    }
    return (
        <div>
            <Modal
                title={title}
                visible={props.visible}
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
                <div className="title" style={{
                    height: '30px',
                    lineHeight: "30px",
                    marginBottom: "10px",
                    textAlign: "center",
                    fontWeight: 300,
                    color: "rgb(231,113,129)",
                    backgroundColor: "rgb(246,210,215)"
                }}>
                    如有超额退款需求，请走线下赔付流程
                    </div>
                <Form
                    initialValues={
                        props.defaultValue
                    }
                    {...formItemLayout}
                    name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                >
                    <Form.Item
                        label="商品："
                        name="amount"
                        rules={[{ required: true, validator: checkAmount }]}
                    >

                        <Input addonBefore="RM" addonAfter={'最多退' + props.defaultValue.amount + 'RM'} onChange={(e) => numberEventAmount(e)} />
                    </Form.Item>
                    <Form.Item
                        label="运费："
                        name="freight"
                        rules={[{ required: true, validator: checkFright }]}
                    >
                        <Input addonBefore="RM" addonAfter={'最多退' + props.defaultValue.freight + 'RM'} onChange={(e) => numberEvent(e)} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default RefundAmount