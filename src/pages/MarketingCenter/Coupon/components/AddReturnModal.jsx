import React, { useState } from 'react'
import { Select, Input, Form, Modal } from 'antd'
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

const AddReturnModal = (props) => {
    const {countries, showModal, confirmLoading, onCancel, onConfirm, modalData} = props

    const onFinish = useCallback((values) => {
        let temp = { ...values }
        temp.id = modalData.id
        console.log(temp)
    }, [modalData])

    return (
        <Modal
            title="商品返券"
            visible={showModal}
            width={600}
            onCancel={onCancel}
            okButtonProps={{ htmlType: "submit", form: "addReturnCouponForm" }}
            confirmLoading={confirmLoading}
            cancelText=""
        >
            <Form id="addReturnCouponForm" onFinish={onFinish}
                initialValues={modalData}
                {...formItemLayout}
            >
                <Form.Item label="选择国家" required name="countryCode">
                    <Select disabled={modalData.id}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="商品ID" rules={[{
                    required: true,
                    messgae: '必填'
                }]}>
                    <Input disabled={modalData.id} placeholder="多个商品ID请用英文逗号,隔开"/>
                </Form.Item>
                <Form.Item label="优惠券包ID" rules={[{
                    required: true,
                    message: '必填'
                }]}>
                    <Input placeholder="仅支持填写1个优惠券包ID"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(AddReturnModal)