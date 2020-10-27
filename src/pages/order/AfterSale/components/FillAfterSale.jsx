import React, { useState, useCallback, useEffect } from 'react';
import { Button, Form, Input, Select, Radio, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from '@/components'
import enmu from '../../Enmu'

const { TextArea } = Input;
const { Option } = Select

const FillAfterSale = (props) => {
    const { reasonList, defaultSale, saleChange } = props
    const [form] = Form.useForm()

    const onChange = (val,mark) => {
        console.log(val, mark)
        switch (mark) {
            case 'type':
                saleChange(val.target.value, mark)
            return;
            case 'reason':
                saleChange(val, mark)
            return;
            case 'input':
                saleChange(val, mark)
            return;
        }
    }
    const setImage = (val,list) => {
        let data = list.map((item,index) => {
            return item.url
        })
        saleChange(data, 'pic')
    }
    return (
        <>
            <Form form={form} initialValues={defaultSale}>
                <Form.Item name="afterType" label="售后类型：" rules={[{ required: true }]}>
                    <Radio.Group onChange={(val)=>{onChange(val,'type')}}>
                        <Radio value={7}>仅退款</Radio>
                        <Radio value={1}>退货退款</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="reason" label="售后原因：" rules={[{ required: true }]}>
                    <Select
                            placeholder="请选择"
                            onChange={(val)=>{onChange(val,'reason')}}
                        >
                            {
                                reasonList.map((item, index) => {
                                    return <Option value={item.label} key={index}>{item.value}</Option>
                                })
                            }
                    </Select>
                </Form.Item>
                <Form.Item name="pic" label="上传凭证：">
                    <UploadFile max={3} onUploaded={setImage}/>
                </Form.Item>
                <Form.Item name="remark" label="备注说明：" onChange={(e)=>{onChange(e.target.value,'input')}}>
                    <TextArea />
                </Form.Item>          
            </Form>
        </>
    )
}

export default FillAfterSale