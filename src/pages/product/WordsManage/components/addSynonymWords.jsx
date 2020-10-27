import React, { useState, useImperativeHandle, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Input, Space, Select, Cascader, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from '../styles/WordsManage.less'
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddWords = React.forwardRef((props, ref) => {
    const { onConfirm } = props
    const [visible, setVisible] = useState(false);
    const [countryLanage, setCountryLanage] = useState([])
    const [pName, setPName] = useState('')
    const formRef = React.createRef(FormInstance)
    const [defaultValue, setDefault] = useState({
        languageCode: 'cn',
        flag: false,
        leftWord: "",
        type: 1,
        rightWord: ""
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
                        flag: false,
                        leftWord: "",
                        type: 1,
                        rightWord: ""
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

                onConfirm('synonym', currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        setVisible(false)
    };
    //控制文字方向
    const controlTwoWord = useCallback(() => {
        let newData = {}
        if (formRef.current) {
            newData = JSON.parse(JSON.stringify(formRef.current.getFieldValue()))
            formRef.current.setFieldsValue({
                leftWord: newData.rightWord,
                rightWord: newData.leftWord,
            })
        }
    })
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
    }, [])
    return (
        <div className={styles['container']}>
            <React.Fragment>
                <Modal
                    title={defaultValue.id ? '修改同义词': '新增同义词'}
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
                        <Form.Item label="目标词：" required style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="leftWord"
                                rules={[{ required: true, message: '目标词不能为空' }]}
                            >
                                <Input placeholder="请输入目标词" style={{ width: 200 }} />
                            </Form.Item>
                            <div>
                                <ControlTwoTone className={styles['icon-name']} onClick={controlTwoWord} />
                            </div>
                        </Form.Item>
                        <Form.Item
                            label="同义词"
                            name="rightWord"
                            rules={[{ required: true, message: '同义词不能为空' }]}
                        >
                            <Input placeholder="请输入同义词" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                            label="匹配方向："
                            name="flag"
                            rules={[{ required: true, message: '匹配方向不能为空' }]}
                        >
                            <Radio.Group>
                                <Radio value={true} >单向</Radio>
                                <Radio value={false} >双向</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default AddWords