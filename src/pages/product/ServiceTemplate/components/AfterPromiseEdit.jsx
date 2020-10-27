import React, {useState, useImperativeHandle, useEffect, useRef} from 'react';
import {Modal, Button, Form, Input, Select, Radio, InputNumber, message} from 'antd';
import './styles/AfterPromiseEdit.less'
import { TranslateLang, UploadImageByLangModal } from '@/components'
import { useModel } from 'umi';
import {getMultiLangShowInfo} from "@/utils/utils";
import BackAddress from "@/components/AddressSelect/backAddress";

const AfterPromiseEdit = React.forwardRef((props,ref) => {
    const {showModal, modalData, loading, productEnum, onCancel, onConfirm } = props
    const { countries } = useModel('dictionary')
    const [showImages, setShowImages] = useState(modalData.detailPictureList || [])
    const [uploadModal, setUploadModal] = useState(false)
    const [curValues, setCurValues] = useState(modalData.arrivalDistributionList || [])
    const [countryCode, setCountryCode] = useState(modalData.countryCode || 'MY')
    const [curRuleI, setCurRuleI] = useState(-1)
    const [propStateList, setPropStateList] = useState([])
    const [addressModal, setAddressModal] = useState(false)
    // 标题描述
    const titleRef = useRef()
    const descRef = useRef()

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
    const onFinish = (fieldsValue) => {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        let title = titleRef.current.getData()
        let desc = descRef.current.getData()
        if (title && desc) {
            let arrivalList = curValues.filter((val) => {
                return val.timeLimitMax && val.timeLimitMin
            })
            if (arrivalList.length <= 0) {
                return message.warning('时效不能为空')
            }
            data['labelList'] = title
            data['documentList'] = desc
            data['detailPictureList'] = showImages
            data['arrivalId'] = modalData.arrivalId
            data['status'] = modalData.status
            data['arrivalDistributionList'] = arrivalList
            console.log(data)
            onConfirm(data)
        }
    }
    const handleCancel = e => {
        onCancel()
    }

    // 包邮条件改变
    function freeThresholdChange(val, listI, key) {
        let newData = JSON.parse(JSON.stringify(curValues))
        newData[listI][key] = val
        setCurValues(newData)
    }

    // 显示地址选择弹窗
    function showAddressDialog(item, i) {
        if (item[0] == countryCode) {
            return
        }
        setAddressModal(true)
        setPropStateList(item)
        setCurRuleI(i)
    }

    // 关闭地址选择弹窗
    function onAddressClose() {
        setAddressModal(false)
    }

    // 地址确认弹窗
    function onAddressConfirm(addressList) {
        let newData = JSON.parse(JSON.stringify(curValues))
        newData[curRuleI].areaCodeList = addressList
        setCurValues(newData)
        onAddressClose()
    }
    // 删除
    function handleDel (index) {
        let newData = JSON.parse(JSON.stringify(curValues))
        newData.splice(index, 1)
        setCurValues(newData)
    }
    // 新增
    function handleAdd() {
        let newData = JSON.parse(JSON.stringify(curValues))
        newData.push({
            areaCodeList: [],
            timeLimitMax: '',
            timeLimitMin: ''
        })
        setCurValues(newData)
    }
    function countryCodeChange (countryCode) {
        setCountryCode(countryCode)
        setCurValues([{
            areaCodeList: [countryCode],
            timeLimitMax: '',
            timeLimitMin: ''
        }])
    }

    useEffect(() => {
        setCurValues(modalData.arrivalDistributionList|| [])
        setShowImages(modalData.detailPictureList || [])
        setCountryCode(modalData.countryCode || 'MY')
    }, [modalData])

    return(
        <React.Fragment>
            <Modal
                title='到货承诺'
                visible={showModal}
                destroyOnClose
                width={800}
                className="promiseEdit"
                onCancel={handleCancel}
                maskClosable={false}
                confirmLoading={loading}
                okButtonProps={{ htmlType: 'submit', form: 'arrivalForm'}}
            >
                <Form initialValues={modalData} {...formItemLayout} autoComplete="off" onFinish={onFinish} id="arrivalForm"
                >
                    <Form.Item label="标签：" required>
                        <TranslateLang ref={titleRef} requiredLang={['cn', 'en']} defaultData={modalData.labelList}>该标签展示于客户端商品详情页和订单详情页中，请认真填写</TranslateLang>
                    </Form.Item>
                    <Form.Item label="文案：" required>
                        <TranslateLang ref={descRef} requiredLang={['cn', 'en']} defaultData={modalData.documentList}>该标签展示于客户端商品详情页和订单详情页中，请认真填写</TranslateLang>
                    </Form.Item>
                    <Form.Item label="详情图：">
                        {
                            showImages.length ? (<img src={getMultiLangShowInfo(showImages, 'image')} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item label="适用国家：" required name="countryCode">
                        <Select value={countryCode} onChange={countryCodeChange}>
                            {
                                countries.map(item => {
                                    return <Select.Option value={item.shortCode} key={item.code}>{item.nameCn}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="配送时效：" required>
                        <div className="showAddress">未特别指定的地区，按照全国默认时效</div>
                        <div>
                            <ul className="free-address-wrapper">
                                <li>
                                    <div className="flex1 border-r">地区</div>
                                    <div className="w40 border-r">时效</div>
                                    <div className="w20">操作</div>
                                </li>
                                {
                                    curValues.map((item, i) => {
                                        return <li key={i}>
                                            <div className="flex1 free-address pointer border-r"
                                                 onClick={() => showAddressDialog(item.areaCodeList, i)}>{ item.areaCodeList[0] == countryCode ? '全国' : item.areaCodeList.join(', ') }</div>
                                            <div className="w40 promotion-rule-box border-r">
                                                <InputNumber value={item.timeLimitMin} onChange={(value) => freeThresholdChange(value, i, 'timeLimitMin')}/>
                                                <em>-</em>
                                                <InputNumber value={item.timeLimitMax} onChange={(value) => freeThresholdChange(value, i, 'timeLimitMax')}/>
                                                <em>天</em>
                                            </div>
                                            <div className="w20">
                                                { item.areaCodeList[0] != countryCode && <Button onClick={() => handleDel(i)}>删除</Button> }
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="promotion-add-btn" onClick={handleAdd}>新增指定地区</div>
                        </div>
                    </Form.Item>
                    <Form.Item label="是否赔付：" name="payment" required extra="若标签及文案中注明慢必赔，请务必勾选“系统自动赔付">
                        <Radio.Group>
                            <Radio value={1}>系统自动赔付</Radio>
                            <Radio value={2}>不赔付</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="外显类型：" name="showType" required extra="选择“全部外显”代表该标签将展示于APP商品详情页、搜索列表页、购物车、订单列表页及详情页">
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
                {
                    addressModal && <BackAddress
                        propStateList={propStateList}
                        showModal={addressModal}
                        countryCode={countryCode}
                        onCancel={onAddressClose}
                        onConfirm={onAddressConfirm}
                    ></BackAddress>
                }
            </Modal>
        </React.Fragment>
    )
})

export default AfterPromiseEdit
