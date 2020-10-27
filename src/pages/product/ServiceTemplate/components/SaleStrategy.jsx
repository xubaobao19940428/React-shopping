import React, {useState, useEffect, useRef} from 'react';
import styles from './styles/SaleStrategy.less'
import {Select, Button, Modal, Form, InputNumber, Radio, message} from 'antd';
import { TranslateLang, UploadImageByLangModal, BackCategorySelect } from '@/components'
import {getMultiLangShowInfo} from "@/utils/utils";

const SaleStrategy = React.forwardRef((props,ref) => {
    const {showModal, modalData, loading, productEnum, onCancel, onConfirm } = props
    const [showImages, setShowImages] = useState(modalData.detailPictureList ? modalData.detailPictureList : [])
    const [rangeType, setRangeType] = useState(modalData.rangeType ? modalData.rangeType : 1)
    const [uploadModal, setUploadModal] = useState(false)

    // 标题描述
    const titleRef = useRef()
    const descRef = useRef()
    // 后台分类
    const categoryRef = useRef()

    const handleCancel = () => {
        onCancel()
    }
    const onFinish = (fieldsValue) => {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        let title = titleRef.current.getData()
        let desc = descRef.current.getData()
        if (title && desc) {
            data['labelList'] = title
            data['documentList'] = desc
            data['detailPictureList'] = showImages
            data['afterSaleId'] = modalData.afterSaleId
            data['status'] = modalData.status
            if (rangeType == 1) {
                let category = categoryRef.current.getData()
                if (category.length <= 0) {
                    return message.warning('请选择后台类目')
                }
                data['afterSaleCateList'] = category
            } else {
                if (!data.productTypeList || data.productTypeList.length <= 0) {
                    return message.warning('请选择商品类型')
                }
            }
            onConfirm(data)
        }
    }
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        }
    }

    useEffect(() => {
        setRangeType(modalData.rangeType ? modalData.rangeType : 1)
        setShowImages(modalData.detailPictureList ? modalData.detailPictureList : [])
    }, [modalData])

    return(
        <React.Fragment>
            <Modal
                title='售后策略'
                visible={showModal}
                destroyOnClose
                width={800}
                className={styles.saleStrategy}
                onCancel={handleCancel}
                maskClosable={false}
                confirmLoading={loading}
                okButtonProps={{ htmlType: 'submit', form: 'afterSaleForm'}}
            >
                <Form initialValues={modalData} {...formItemLayout} autoComplete="off" id="afterSaleForm" onFinish={onFinish}
                >
                    <Form.Item label="标签：" required>
                        <TranslateLang ref={titleRef} requiredLang={['cn', 'en']} defaultData={modalData.labelList}>该标签展示于客户端商品详情页和订单详情页中，请认真填写</TranslateLang>
                    </Form.Item>
                    <Form.Item label="文案：" required>
                        <TranslateLang ref={descRef} requiredLang={['cn', 'en']} defaultData={modalData.documentList}>该标签展示于客户端商品详情页和订单详情页中，请认真填写</TranslateLang>
                    </Form.Item>
                    <Form.Item label="详情图：" extra="如有需要可上传详情图作为规则的补充说明">
                        {
                            showImages.length ? (<img src={getMultiLangShowInfo(showImages, 'image')} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item label="售后期限：" name="afterSaleRestrict" rules={[{ required: true, message: '不能为空' }]} extra="指商品确认收货后，售后申请通道的开放时长">
                        <InputNumber min={0}  />
                    </Form.Item>
                    <Form.Item label="适用范围：" required name="rangeType">
                        <Select value={rangeType} onChange={(val) => setRangeType(val)}>
                            <Select.Option value={1}>按照后台类目</Select.Option>
                            <Select.Option value={2}>按商品类型</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="后台类目：" hidden={rangeType == 2} required name="afterSaleCateList">
                        <BackCategorySelect ref={categoryRef} categoryList={modalData.afterSaleCateList || []}/>
                    </Form.Item>
                    <Form.Item label="商品类型：" hidden={rangeType == 1} required name="productTypeList">
                        <Select mode="multiple">
                            { productEnum && productEnum.map(item=>{
                                return <Select.Option value={item.code} key={item.code}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="外显类型：" name="showType" rules={[{ required: true, message: '不能为空' }]} extra="选择“全部外显”代表该标签将展示于APP商品详情页、搜索列表页、购物车、订单列表页及详情页；">
                        <Radio.Group>
                            <Radio value={1}>只外显于商品详情页</Radio>
                            <Radio value={2}>全部外显</Radio>
                            <Radio value={3}>不外显</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                { uploadModal && <UploadImageByLangModal
                    show={uploadModal}
                    onSure={(images) => {
                        setUploadModal(false);
                        setShowImages(images);
                    }}
                    onClose={() => setUploadModal(false)}
                    images={showImages}
                /> }
            </Modal>
        </React.Fragment>
    )
})

export default SaleStrategy
