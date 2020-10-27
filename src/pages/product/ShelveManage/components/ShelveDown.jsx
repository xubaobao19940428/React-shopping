import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import { Button, Space, Form, Table, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
/**
/*  
/* 商品下架
/*
*/
const {Option} = Select
const ShelveDown = (props) => {
    const reasonOptions = [{
        value: 1,
        label: '暂时缺货'
    }, {
        value: 2,
        label: '永久缺货'
    }, {
        value: 3,
        label: '侵权/违禁/敏感产品'
    }, {
        value: 4,
        label: '滞销'
    }, {
        value: 5,
        label: '质量/色差/尺码等产品问题'
    }, {
        value: 6,
        label: '供应商不合作'
    }, {
        value: 7,
        label: '其他原因'
    }]
    const formRef = React.createRef(FormInstance)
    const handleCancel = () => {
        props.downCancel()
    }
    const handleOk = () => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                props.downConfirm(currentValue)
                formRef.current.resetFields()
            } else {
                console.log('error,submit')
            }
        })
       
    }
    return (
        <div>
            <Modal
                title="商品下架"
                visible={props.downVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form name='sheleDownForm' ref={formRef}>
                    <Form.Item name='offReason' label="下架原因" rules={[{required:true,message:'请选择下架原因'}]} >
                        <Select>
                            {
                                reasonOptions.map((item,index)=>{
                                    return <Option value={item.value} key={index}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default ShelveDown;