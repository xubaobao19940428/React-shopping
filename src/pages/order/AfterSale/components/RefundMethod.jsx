import React, { useState, useCallback, useEffect } from 'react';
import { Button, Form, Input, Select, Radio} from 'antd';
import enmu from '../../Enmu'

const { Option } = Select

const RefundMethod = (props) => {
    const { refundCardNoList, refundBankNameList, bankList, defaultValue, bankChange } = props
    const [form] = Form.useForm()

    const onChange = (val, mark) => {
        console.log(val, mark)
        switch (mark) {
            case "type":
                bankChange(val.target.value, mark)
            return;
            case "card":
                bankChange(val, mark)
                for (const iterator of bankList) {
                    if (val == iterator.accountNo) {
                        form.setFieldsValue({
                            refundBankName: iterator.bankName,
                            refundCardholder: iterator.accountName,
                            mobile: iterator.mobile,
                            email: iterator.email
                        })
                    }
                }
                return;
            case "name":
                bankChange(val, mark)
                for (const iterator of bankList) {
                    if (val == iterator.bankName) {
                        form.setFieldsValue({
                            refundCardNo: iterator.accountNo,
                            refundCardholder: iterator.accountName,
                            mobile: iterator.mobile,
                            email: iterator.email
                        })
                    }
                }
                return;
        }
    }
    return (
        <div>
            <Form form={form} initialValues={defaultValue}>
                <Form.Item name="returnAmount" label="退款总额：" rules={[{ required: true }]}>
                    <span>{defaultValue.currency} {defaultValue.refundAmount}（含运费{defaultValue.refundFreight}）</span>
                </Form.Item>
                <Form.Item name="refundType" label="退款账户：" rules={[{ required: true }]}>
                    <Radio.Group onChange={(val)=>{onChange(val, 'type')}}>
                        <Radio value={1}>积分</Radio>
                        <Radio value={0}>银行卡</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="refundCardNo" label="银行卡号：" rules={[{ required: true }]}>
                    <Select
                            placeholder="请选择"
                            onChange={(val)=>{onChange(val,'card')}}
                        >
                            {
                                refundCardNoList.map((item, index) => {
                                    return <Option value={item.val} key={index}>{item.label}</Option>
                                })
                            }
                    </Select>
                </Form.Item>
                <Form.Item name="refundBankName" label="银行名称：" rules={[{ required: true }]}>
                    <Select
                            placeholder="请选择"
                            onChange={(val)=>{onChange(val,'name')}}
                        >
                            {
                                refundBankNameList.map((item, index) => {
                                    return <Option value={item.val} key={index}>{item.label}</Option>
                                })
                            }
                    </Select>
                </Form.Item>
                <Form.Item name="refundCardholder" label="账户名称：" rules={[{ required: true }]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="mobile" label="联系电话：" rules={[{ required: true }]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="email" label="账户名称：" rules={[{ required: true }]}>
                    <Input disabled/>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RefundMethod