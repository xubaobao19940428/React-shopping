// 商品参数
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import styles from './styles/index.less';
import { Form, Row, Col, Select } from 'antd';
import AddAttrValueDialog from "./components/AddAttrValueDialog"
import { FormInstance } from 'antd/lib/form';
import 'lodash'
const FormItem = Form.Item;
const { Option } = Select

const ProductParam = React.forwardRef((props, ref) => {
    const {defaultVal} = props
    const form =React.createRef(FormInstance)
    const [attrId, setAttrId] = useState('')
    const [attrIndex, setAttrIndex] = useState('')
    const [showModal, setShowModal] = useState(false)
    const returnAttrVal = useCallback((attrVal) => {
        if (!attrVal) {
            return ''
        }
        let item = attrVal.find((val) => {
            return val.languageCode == 'cn'
        })
        return item ? item.name : ''

    }, [])

    const addAttrValue = useCallback((attrId, index) => {
        setAttrId(attrId)
        setAttrIndex(index)
        setShowModal(true)
    }, [])

    function confirmAddAttr(attrValueList) {
        let attrList = JSON.parse(JSON.stringify(props.paramAttrList))
        if (!attrList[attrIndex].attrValueList) {
            attrList[attrIndex].attrValueList = []
        }
        for (let i = 0; i < attrValueList.length; i++) {
            let item = attrList[attrIndex].attrValueList.find((val) => {
                return val.valueId == attrValueList[i].valueId
            })
            if (!item) {
                attrList[attrIndex].attrValueList.push(attrValueList[i])
            }
        }
        props.updateParamAttrList(attrList)
        setShowModal(false)
    }

    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            getData: () => {
                let returnParams = []
                // return new Promise((resolve, reject) => {
                    let values=form.current.getFieldsValue()
                    // .then(values => {
                        for (var key in values) {
                            if (values[key]) {
                                values[key].map(item => {
                                    let obj = {}
                                    obj = {
                                        attrId: key,
                                        valueId: item
                                    }
                                    returnParams.push(obj)
                                })
                            }
                        }
                        return returnParams
                    //     resolve(returnParams)
                    // }).catch(err=>{
                    //     reject(err)
                    // })
                // })
            }
        }

    })

    console.log('paramAttrList----')
    useEffect(()=>{
        form.current.setFieldsValue(defaultVal)
    },[defaultVal])
    return (
        <div className={styles.productParam}>
            <Form ref={form} initialValues={defaultVal}>
                <Row>
                    {
                        props.paramAttrList.length != 0 && props.paramAttrList.map((item, index) => {
                            return <Col span={12} key={index}>
                                <FormItem label={returnAttrVal(item.attrNameList)} name={item.attrId} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                                    <Select mode="multiple" showSearch={true}
                                        notFoundContent={
                                            <div>
                                                {
                                                    item.customize != 1 ? <span>  请联系属性值管理员扩充属性模板</span> : <div onClick={() => addAttrValue(item.attrId, index)}><span>没有你想要的属性值？</span><a>新增</a></div>
                                                }
                                            </div>
                                        }
                                    >
                                        {
                                            item.attrValueList && item.attrValueList.map((attrVal, index) => {
                                                return <Option key={index} value={attrVal.valueId}>{
                                                    returnAttrVal(attrVal.valueNameList)
                                                }</Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        })
                    }
                </Row>
            </Form>
            {
                showModal && <AddAttrValueDialog showModal={showModal} attrId={attrId} onClose={() => setShowModal(false)} onConfirm={confirmAddAttr} />
            }
        </div>
    )
})

export default React.memo(ProductParam, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
});
