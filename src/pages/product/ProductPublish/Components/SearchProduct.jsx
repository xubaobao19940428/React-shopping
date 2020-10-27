import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button, Form, Input, Space, Select, Radio, Cascader, Tooltip,InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
// 要使用React.forwardRef才能将ref属性暴露给父组件
const SearchProduct = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const formRef = React.createRef(FormInstance)
    const [value4, useSetValue] = useState('single')
    const [minWeight, setMinWeight] = useState(0.01)
    const [maxWeight, setMaxWeight] = useState(5)
    const [options, setOptions] = useState([
        {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
                {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                        {
                            value: 'xihu',
                            label: 'West Lake',
                        },
                    ],
                },
            ],
        }])
    const optionsWithDisabled = [
        { label: '手动上货', value: 'single' },
        { label: '批量上货', value: 'batch' },
    ];
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
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
    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                console.log(currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        setVisible(false)

    };
    //切换模式
    const onChange4 = (e) => {
        useSetValue(e.target.value)
    }
    return (
        <div>
            <React.Fragment>
                <Modal
                    title='搜索上货'
                    visible={visible}
                    style={{ width: '700px', fontSize: '20px' }}
                    destroyOnClose
                    bodyStyle={{ textAlign: 'center' }}
                    onCancel={handleCancel}
                    footer={[
                        <Button type="link" style={{float:'left'}} key="task">
                            任务队列  
                        </Button>,
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <Radio.Group
                        options={optionsWithDisabled}
                        onChange={onChange4}
                        value={value4}
                        optionType="button"
                        buttonStyle="solid"
                        style={{ marginBottom: 30 }}
                    />
                    {
                        value4 == 'single' ?

                            <Form
                            initialValues={{ minWeight:minWeight, maxWeight: maxWeight }}
                                {...formItemLayout}
                                name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}>
                                <Form.Item
                                    label="搜索词："
                                    name="keyword"
                                    rules={[{ required: true, message: '搜索词不能为空' }]}
                                >
                                    <Input placeholder="示例：运动鞋 透气" />
                                </Form.Item>
                                <Form.Item
                                    label="目标数量："
                                    name="target"
                                    rules={[{ required: true, message: '目标数量不能为空' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="归属类目："
                                    name="cateName"
                                    rules={[{ required: true, message: '归属类目不能为空' }]}
                                >
                                    <Cascader options={options} placeholder="请选择归属类目" />
                                </Form.Item>
                                <Form.Item
                                    label="规格属性："
                                    rules={[{ required: true}]}
                                    style={{height:36}}
                                >
                                    <Form.Item
                                        name="productAttrs"
                                        rules={[{ required: true, message: '规格属性不能为空' }]}

                                    >
                                        <Input placeholder="请输入规格属性"/>
                                    </Form.Item>
                                    <Tooltip title="请填写该类目的非销售属性（如材质、款式），支持输入多个，请以英文逗号,分割。">
                                        <InfoCircleFilled style={{ position: 'relative', top: -50, left: 140 }} />
                                    </Tooltip>
                                </Form.Item>
                                <Form.Item
                                    label="单位重量(kg)："
                                >
                                   <Input.Group compact>
                                        <Form.Item
                                        style={{ width: '42%' }}
                                            name='minWeight'
                                            rules={[{ required: true, message: '请输入最低重量' }]}
                                        >
                                           <InputNumber  placeholder="最低重量" min={0} />
                                        </Form.Item>
                                        <span style={{display:'inline-block',width:'6%'}}>~</span>
                                        <Form.Item
                                            name='maxWeight'
                                            style={{ width: '42%' }}
                                            rules={[{ required: true, message: '请输入最高重量' }]}
                                        >
                                            <InputNumber  placeholder="最高重量" min={0} />
                                        </Form.Item>
                                        </Input.Group>
                                </Form.Item>
                                <Form.Item
                                    label="供货价(RMB)："
                                >
                                   <Input.Group compact>
                                        <Form.Item
                                        style={{ width: '42%' }}
                                            name='minPrice'
                                        >
                                           <InputNumber  placeholder="最低价" min={0}/>
                                        </Form.Item>
                                        <span style={{display:'inline-block',width:'6%'}}>~</span>
                                        <Form.Item
                                            name='maxPrice'
                                            style={{ width: '42%' }}
                                        >
                                            <InputNumber  placeholder="最高价" min={0}/>
                                        </Form.Item>
                                        </Input.Group>
                                </Form.Item>
                            </Form>
                            :
                            <p>批量上货</p>
                    }

                </Modal>
            </React.Fragment>
        </div>
    );
})
export default SearchProduct