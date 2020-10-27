import React, {useState} from 'react'
import { Modal, Form, Input, Select } from 'antd'

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

const SubjectModal = (props) => {
    const { showSubjectModal, subjectData, onCancel, onConfirm, countries } = props

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.subjectId = subjectData.subjectId
        onConfirm(data)
    }

    return (
        <Modal
            destroyOnClose
            title="专题"
            visible={showSubjectModal}
            onCancel={onCancel}
            okButtonProps={{ htmlType: 'submit', form: 'subjectForm'}}
        >
            <Form id="subjectForm" onFinish={onFinish} initialValues={subjectData} {...formItemLayout}>
                <Form.Item name="countryCode" label="国家"
                    rules={[{
                        required: true,
                        message: '国家不能为空'
                    }]}
                >
                    <Select disabled={subjectData.subjectId}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="专题名称"
                    rules={[
                        {
                            required: true,
                            message: '名称必填'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(SubjectModal)