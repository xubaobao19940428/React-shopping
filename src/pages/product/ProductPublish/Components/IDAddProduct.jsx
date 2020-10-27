import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button, Form, Input, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
// 要使用React.forwardRef才能将ref属性暴露给父组件
const IDAddProduct = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [productFrom, setProductFrom] = useState('1688')
    const {TextArea} = Input
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            }
        }

    });

    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const handleCancel = e => {
        setVisible(false)

    };
    return (
        <div>
            <React.Fragment>
                <Modal
                    title="ID上货"
                    visible={visible}
                    style={{ width: '1000px', fontSize: '20px' }}
                    width='1000px'
                    destroyOnClose
                    onCancel={handleCancel}
                    okButtonProps={{ htmlType: 'submit', form: 'IDAddProduct'}}
                >
                    <Form initialValues={{ productFrom: productFrom }} id="IDAddProduct" onFinish={onFinish} autoComplete="off"
                    >
                        <Form.Item label="商品来源：" name="productFrom" rules={[{ required: true}]}>
                            <Radio.Group>
                                <Radio value="1688">1688</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="商品ID：" name='productId' rules={[{ required: true, message: '商品ID不能为空' }]}>
                           <TextArea rows={4} placeholder="请输入商品ID,多个商品ID时，请用英文,逗号隔开" style={{width:320}}/>
                        </Form.Item>
                        <div className="tips" style={{paddingTop: 8,color: '#aaa',marginLeft: 60,width: 500,}}>
                            <p>1. 上传多个商品ID时，请用英文逗号,隔开；</p>
                            <p>2. 一次最多支持上传20个商品ID；</p>
                            <p>3. 商品ID从商品链接中获取，一般为纯数字；</p>
                            <p>示例1688：</p>
                            <p>https://detail.1688.com/offer/<span style={{color:'red'}}>525395652086</span>.html?spm=a26317.12815169.jxsum3a1.2.29a435618cXmUS&scm=1007.26309.139606.0&udsPoolId=1263941&resourceId=1041521</p>
                        </div>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default IDAddProduct
