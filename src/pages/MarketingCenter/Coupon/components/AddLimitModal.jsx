import React, { useState, useCallback, useEffect } from 'react'
import {Input, Form, Modal, Select, Radio} from 'antd'
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

const AddLimitModal = (props) => {
    const { countries, showModal, confirmLoading, onCancel, onConfirm, modalData, LIMIT_ENUM } = props
    const [type, setType] = useState(3)
    
    const onFinish = useCallback((values) => {
        let temp = {...values}
        temp.productIds = temp.productId ? splitData(temp.productId + '') : []
        temp.id = modalData.id

        delete temp.productId
        onConfirm(temp)
    }, [modalData])

    useEffect(() => {
        setType(modalData.type)
    }, [])

    return (
        <Modal title="用券限制"
            visible={showModal}
            width={600}
            destroyOnClose
            onCancel={onCancel}
            okButtonProps={{ htmlType: "submit", form: "addCouponLimitForm"}}
            confirmLoading={confirmLoading}
        >
            <Form id="addCouponLimitForm"
                onFinish={onFinish}
                initialValues={modalData}
                {...formItemLayout}
            >
                <Form.Item label="选择国家" rules={[{required: true, message: '必选'}]} name="countryCode">
                    <Select disabled={modalData.id}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="商品ID" name="productId" rules={[{
                    required: true,
                    message: "必填"
                }]}>
                    <Input placeholder="多个商品ID请用英文逗号,隔开" disabled={modalData.id}/>
                </Form.Item>
                <Form.Item label="限制类型" rules={[{required: true, message: '必选'}]} name="type">
                    <Radio.Group onChange={(e)=> {
                        let val = e.target.value

                        setType(val)
                    }} disabled={modalData.id && modalData.type == 3}>
                        {
                            Object.keys(LIMIT_ENUM).map(type => (
                                <Radio key={type} value={parseInt(type)}>{LIMIT_ENUM[type]}</Radio>
                            ))
                        }
                    </Radio.Group>
                </Form.Item>
                {
                    type != 3  && <Form.Item label="优惠券ID" name="couponId" rules={[{
                        required: true,
                        message: "必填"
                    }]}>
                        <Input placeholder="仅支持单个优惠券ID" disabled={modalData.id && modalData.type == 3}/>
                    </Form.Item>
                }
            </Form>
        </Modal>
    )
}

export default React.memo(AddLimitModal)