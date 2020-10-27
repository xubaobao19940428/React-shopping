import React, { useState, useRef } from 'react';
import { Modal, Space, Table, Button, Form, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const ConfirmRefound = (props) => {
    const formRef = React.createRef(FormInstance)
    const checkPrice = (rule, value) => {
        if(isNaN(Number(value))){
            return Promise.reject('请输入数字');
        }
        if (Number(value) >=0 && Number(value) < props.defaultValue.applyRefund) {
            return Promise.resolve();
        } else if(Number(value)<0) {
            return Promise.reject('退款价格要大于等于0');
        }else{
            return Promise.reject('退款价格要小于预计退款金额');
        }
    }
    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                let params={
                    orderId: props.defaultValue.orderId,
                    afterId: props.defaultValue.afterId,
                    amount:currentValue.amount
                }
                props.getChildValue(params)
            } else {
                console.log('error,submit')
            }
        })
    }
    return (
        <div>
            <React.Fragment>
                <Modal
                    title='任务详情'
                    visible={props.isShow}
                    style={{ width: '900px', fontSize: '20px' }}
                    width="900px"
                    destroyOnClose
                    onCancel={props.handleCancel}
                    footer={[
                        <Button key="back" onClick={props.handleCancel}>
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
                        name="dynamic_form_nest_item" autoComplete="off" 
                        ref={formRef}
                    >
                        <Form.Item
                            label="预计退款金额："
                            name="applyRefund"
                        >
                            <span>{props.defaultValue.applyRefund}</span>
                        </Form.Item>
                        <Form.Item
                            label="退款金额"
                            name="amount"
                            rules={[{ required: true, validator: checkPrice, }]}
                        >
                            <Input
                                type="text"
                                value={0}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
}
export default ConfirmRefound