import React, {useState, useEffect, useRef} from 'react';
import {Modal, Form, Input, Select, message} from 'antd';
import { useModel } from 'umi';
import styles from './styles/TemplateDialog.less'
import { getRecentRateTemplate } from '@/services/product'
import { BackCategorySelect } from '@/components'

const TemplateDialog = React.forwardRef((props, ref) => {
    const {showModal, modalData, loading, onCancel, onConfirm } = props
    const [rateList, setRateList] = useState([]) // 汇率模板
    const { countries } = useModel('dictionary')
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    }
    // 后台分类
    const categoryRef = useRef()

    // 确定
    const onFinish = (fieldsValue) => {
        let data = JSON.parse(JSON.stringify(modalData))
        Object.assign(data, fieldsValue)
        let category = categoryRef.current.getData()
        if (category.length <= 0) {
            return message.warning('请选择后台类目')
        }
        data['categoryList'] = category
        console.log(data)
        onConfirm(data)
    }

    // 取消
    const handleCancel = e => {
        onCancel()
    }

    // 获取汇率模板
    const getRateTemplate = () => {
        getRecentRateTemplate({}).then(res => {
            if (res.ret.errcode === 1) {
                setRateList([res])
            }
        })
    }

    useEffect(() => {
        getRateTemplate()
    }, [])

    return (
        <div>
            <React.Fragment>
                <Modal
                    title='模版编辑'
                    visible={showModal}
                    destroyOnClose
                    width={800}
                    className={styles.templateDialog}
                    onCancel={handleCancel}
                    maskClosable={false}
                    confirmLoading={loading}
                    okButtonProps={{ htmlType: 'submit', form: 'priceTemplate'}}
                >
                    <Form initialValues={modalData} {...formItemLayout} autoComplete="off" onFinish={onFinish} id="priceTemplate"
                    >
                        <Form.Item label="模版名称：" name="templateNameCn" rules={[{ required: true, message: '名称不能为空' }]}>
                            <Input placeholder="请输入模版名称/最多200个字" />
                        </Form.Item>
                        <Form.Item label="适用国家" name="countryCode" rules={[{ required: true, message: '不能为空' }]}>
                            <Select>
                                {
                                    countries.map(item => {
                                        return <Select.Option value={item.shortCode} key={item.code}>{item.nameCn}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="汇率模板：" name="exchangeRateTemplateId" rules={[{ required: true, message: '汇率模板不能为空' }]}>
                            <Select>
                                {
                                    rateList.map((item, index) => {
                                        return <Select.Option value={item.templateCode} key={index}>{item.templateCode}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="适用类目：" name="category" required>
                            <BackCategorySelect ref={categoryRef} propKey={{id: 'id', name: 'name'}} categoryList={modalData.categoryList || []}/>
                        </Form.Item>
                        <Form.Item label="国内物流费：" name="domesticExpressFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="元（CNY）"/>
                        </Form.Item>
                        <Form.Item label="国内仓储费：" name="domesticWarehousingFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="元（CNY）"/>
                        </Form.Item>
                        <Form.Item label="国际物流费：" rules={[{ required: true, message: '不能为空' }]}>
                            <div className={styles.prompt}>在为商品计算空运费用时，系统将分别按照货物体积和重量计算并采取二者更大的金额</div>
                                <div className={styles.airPrice}>
                                    <div className={styles.airPriceTitle}>空运计价：</div>
                                    <div>
                                        <div className={styles.airPrice}>
                                            <Form.Item name="airVolumePrice" rules={[{ required: true, message: '不能为空' }]}>
                                                <Input suffix="元（CNY）" size="small"/>
                                            </Form.Item>
                                            <div className={styles.cutOff}>/</div>
                                            <Form.Item name="airVolumeUnit" rules={[{ required: true, message: '不能为空' }]}>
                                                <Input suffix="cm³" size="small"/>
                                            </Form.Item>
                                        </div>
                                        <div className={styles.airPrice}>
                                            <Form.Item name="airWeightPrice" rules={[{ required: true, message: '不能为空' }]}>
                                                <Input suffix="元（CNY）" size="small"/>
                                            </Form.Item>
                                            <div className={styles.cutOff}>/</div>
                                            <Form.Item name="airWeightUnit" rules={[{ required: true, message: '不能为空' }]}>
                                                <Input suffix="kg" size="small"/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                </div>
                                <div className={styles.airPrice}>
                                    <div className={styles.airPriceTitle}>海运计价：</div>
                                    <div className={styles.airPrice}>
                                        <Form.Item name="oceanVolumeUnit" rules={[{ required: true, message: '不能为空' }]}>
                                            <Input suffix="元（CNY）" size="small"/>
                                        </Form.Item>
                                        <div className={styles.cutOff}>/</div>
                                        <Form.Item name="oceanVolumePrice" rules={[{ required: true, message: '不能为空' }]}>
                                            <Input suffix="cm³" size="small"/>
                                        </Form.Item>
                                    </div>
                                </div>
                        </Form.Item>
                        <Form.Item label="国际仓储费：" name="internationalWarehousingFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="元（CNY）"/>
                        </Form.Item>
                        <Form.Item label="支付通道费：" name="paymentPassageFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                        <Form.Item label="划线价毛利率：" name="grossInterestRate" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                        <Form.Item label="提现手续费：" name="cashServiceFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                        <Form.Item label="VIP价毛利率：" name="vipGrossInterestRate" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                        <Form.Item label="运营开支：" name="operatingFee" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                        <Form.Item label="活动毛利率：" name="activeGrossInterestRate" rules={[{ required: true, message: '不能为空' }]}>
                            <Input suffix="%"/>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    )
})

export default TemplateDialog
