import React, { useState, useImperativeHandle, useEffect, useCallback } from 'react';
import { Modal, Button, Form,Space, Radio, Checkbox,Row,Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ControlTwoTone } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from './styles/ImgSync.less'
// 要使用React.forwardRef才能将ref属性暴露给父组件
const ImgSynchronous = (props) => {
    const [visible, setVisible] = useState(false);
    const [countryLanage, setCountryLanage] = useState([])
    const [pName, setPName] = useState('')
    const formRef = React.createRef(FormInstance)
    const [defaultValue, setDefault] = useState({

    })
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
    const onFinish = values => {
        console.log('Received values of form:', values);
    }
    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                console.log(currentValue)
                props.syncImg(currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        props.resetVisible()
    };
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
        let defaultLang = []
        countryCodeLists.map(item => {
            defaultLang.push(item.code)
        })
        let defaultSourceLang = 'cn'
        setDefault({
            sourceLang: defaultSourceLang,
            targetLang: defaultLang
        })
    }, [])
    return (
        <div className={styles['container']}>
            <React.Fragment>
                <Modal
                    title={'图片和视频同步'}
                    visible={props.visible}
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
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="从："
                            name="sourceLang"
                        >
                            <Radio.Group>
                                <Radio value={'cn'} >中文</Radio>
                                <Radio value={'en'} >英文</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="同步到"
                            name="targetLang"

                        >
                            <Checkbox.Group>
                                <Row>
                                    {
                                        countryLanage.map(item => {
                                            return <Col span={24} key={item.code}>
                                                <Checkbox value={item.code} style={{ lineHeight: '32px' }}>
                                                    {item.desc}
                                                </Checkbox>
                                            </Col>
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
}
export default ImgSynchronous