import React, { useState, useCallback } from 'react'
import { Modal, Form, Input } from 'antd'
import { splitData } from '@/utils/utils'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
}

const AddPackageModal = (props) => {
    const {showModal, onCancel, onConfirm, confirmLoading} = props

    const onFinish = useCallback((values) => {
        let temp = { ...values }
        temp.userIds = splitData(temp.userIds)
        
        onConfirm(temp)
    }, [])
    
    return (
        <Modal title="发送至用户账户"
            visible={showModal}
            width={650}
            onCancel={onCancel}
            okButtonProps={{ htmlType: "submit", form: "sendCouponPackageForm"}}
            confirmLoading={confirmLoading}
            cancelText=""
        >
            <Form id="sendCouponPackageForm" onFinish={onFinish} {...formItemLayout}>
                <Form.Item label="优惠券包ID" rules={[{
                    required: true,
                    message: '必填'
                }]} name="id">
                    <Input/>
                </Form.Item>
                <Form.Item label="用户ID" rules={[{
                    required: true,
                    message: '必填'
                }]} name="userIds">
                    <Input placeholder="支持输入多个用户ID，按英文逗号,分开"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(AddPackageModal)