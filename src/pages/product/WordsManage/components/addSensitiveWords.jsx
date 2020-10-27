import React, { useState, useImperativeHandle, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Input, Space, Select, Cascader, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from '../styles/WordsManage.less'
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddSensitiveWords = React.forwardRef((props, ref) => {
    const { onConfirm } = props
    const [visible, setVisible] = useState(false);
    const [countryLanage, setCountryLanage] = useState([])
    const [pName, setPName] = useState('')
    const formRef = React.createRef(FormInstance)
    const [defaultValue, setDefault] = useState({
        languageCode: 'cn',
        senseType:1,
        type: 1,
        word: ""
    })

    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changePName: (newVal) => {
                setPName(newVal)
            },
            changeDefault: (data) => {
                if (data) {
                    setDefault(data)
                } else {
                    setDefault({
                        languageCode: 'cn',
                        senseType:1,
                        type: 1,
                        word: ""
                    })
                }
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

    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                currentValue.id = defaultValue.id
                currentValue.type = defaultValue.type
                onConfirm('sensitive', currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        setVisible(false)
    };

    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
    }, [])

    return (
        <div className={styles['container']}>
            <React.Fragment>
                <Modal
                    title={defaultValue.id ? '修改敏感词' : '新增敏感词'}
                    visible={visible}
                    style={{ fontSize: '20px' }}
                    width={850}
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
                    <Form
                        initialValues={
                            defaultValue
                        }
                        {...formItemLayout}
                        name="dynamic_form_nest_item" autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="语种："
                            name="languageCode"
                            rules={[{ required: true, message: '请选择语种' }]}
                        >
                            <Radio.Group>
                                {
                                    countryLanage.map(item => {
                                        return <Radio value={item.code} key={item.code}>{item.desc}</Radio>
                                    })
                                }
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="敏感词"
                            name="word"
                            rules={[{ required: true, message: '敏感词不能为空' }]}
                        >
                            <Input placeholder="请输入敏感词" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                            label="屏蔽对象："
                            name="senseType"
                            rules={[{ required: true, message: '屏蔽对象不能为空' }]}
                        >
                            <Radio.Group>
                                <Radio value={1} >商品标题</Radio>
                                <Radio value={2} >商品属性</Radio>
                            </Radio.Group>

                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default AddSensitiveWords