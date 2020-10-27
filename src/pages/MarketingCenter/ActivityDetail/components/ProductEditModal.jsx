import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Modal, Form, 
        Select, Input, 
        Row, Col, Table, 
        Radio, DatePicker, 
        InputNumber, Button, message
    } from 'antd'
import moment from 'moment'
import { filterCurrencyUnit, filterCountry } from '@/utils/filter'

const {confirm} = Modal
const ProductEditModal = (props) => {
    const { countryCode, groupList, languages, editData, showModal, name, onCancel, onConfirm, preheat, confirmLoading } = props
    const [curValues, setCurValues] = useState({})
    const [syncParam, setSyncParam] = useState({
        activityPrice: '',
        activityCommissionRate: '',
        activeStock: '',
        attrs: []
    })
    const columns = [{
        title: 'SKUID',
        width: 160,
        fixed: 'left',
        key: 'skuId',
        dataIndex: 'skuId'
    }, {
        title: '规格',
        width: 120,
        key: 'values',
        dataIndex: 'values',
        fixed: 'left'
    }, {
        title: `VIP价(${filterCurrencyUnit(countryCode)})`,
        width: 160,
        key: 'vipPrice',
        dataIndex: 'vipPrice',
        align: 'center'
    }, {
        title: `参考活动价(${filterCurrencyUnit(countryCode)})`,
        width: 160,
        align: 'center',
        key: 'advisePrice',
        dataIndex: 'advisePrice'
    }, {
        title: `活动价(${filterCurrencyUnit(countryCode)})`,
        width: 160,
        key: 'activityPrice',
        render: (text, item, index) => (
            <InputNumber 
                onChange={(val) => handleSkuChange({activityPrice: val}, index)}
                value={item.activityPrice} 
                precision={5}
                min={0} 
                style={{  width: '96%' }}/>
        )
    }, {
        title: '佣金率',
        width: 140,
        key: 'commissionRate',
        dataIndex: 'commissionRate',
        align: 'center'
    }, {
        title: '活动佣金率',
        width: 160,
        key: 'activityCommissionRate',
        render: (text, item, index) => (
            <InputNumber 
                value={item.activityCommissionRate} 
                onChange={(val) => handleSkuChange({activityCommissionRate: val}, index)}
                min={0} 
                style={{  width: '96%' }} 
                max={1}
                precision={5}
            />
        )
    }, {
        title: '活动库存',
        width: 160,
        key: 'activityStock',
        render: (text, item, index) => (
            <InputNumber 
                onChange={(val) => handleSkuChange({activityStock: val}, index)}
                value={item.activityStock} 
                min={0} 
                style={{  width: '96%' }}/>
        )
    }]

    const corColumns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (text, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (text, item) => (
            <Input value={curValues.productCorner[item.code]} onChange={(e) => handleLangChange('productCorner', e, item)}/>
        )
    }]

    const descColumns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (text, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (text, item) => (
            <Input value={curValues.promotionDesc[item.code]} onChange={(e) => handleLangChange('promotionDesc', e, item)}/>
        )
    }]

    const productEditForm = useRef()

    useEffect(() => {
        let data = JSON.parse(JSON.stringify(editData))
        
        setCurValues(data)
    }, [showModal])

    const handleGroupSelect = useCallback((value) => {
        let item = groupList.find(item => item.id == value)
        let temp = {}
        if (item) {
            temp = Object.assign({}, curValues, {
                follow: item.follow,
                startTime: item.startTime ? moment(parseInt(item.startTime)) : null,
                endTime: item.endTime ? moment(parseInt(item.endTime)) : null,
                preheatStartTime: item.preheatStartTime ? moment(parseInt(item.preheatStartTime)) : null,
                productCorner: item.productCorner,
                promotionDesc: item.promotionDesc,
                groupId: value
            })
            setCurValues(temp)
            if (productEditForm.current) {
                productEditForm.current.setFieldsValue(temp)
            }
        }
    })

    function handleParamChange (data) {
        let resData = Object.assign({}, curValues, data)
        setCurValues(resData)
    }

    function handleLangChange (type, e, item) {
        let temp = { ...curValues }
        temp[type][item.code] = e.target.value

        setCurValues(temp)
    }

    function onFinish (values) {
        let priceTipItems = '' // 价格相关的需要提醒的项
        let priceErrorItems = '' // 价格相关的需要阻止的
        let rateTipItems = '' // 佣金率相关的提醒内容
        let rateLowTipItems = '' // 佣金率相关的过低提醒
        let rateErrorItems = '' // 佣金率相关的阻止

        let resParam = Object.assign({}, curValues, values)
        delete resParam.attrList

        if (!resParam.follow) { // 自定义
            if (resParam.startTime.isAfter(resParam.endTime, 'second')) {
                message.error('开始时间须不大于结束时间')
                return
            } else if (preheat && resParam.preheatStartTime && (resParam.preheatStartTime.isAfter(resParam.startTime, 'second'))) {
                message.error('预热时间须不大于开始时间')
                return
            }
        }

        resParam.startTime = resParam.startTime ? (resParam.startTime).valueOf() : null
        resParam.endTime = resParam.endTime ? (resParam.endTime).valueOf() : null
        resParam.preheatStartTime = (preheat && resParam.preheatStartTime) ? (resParam.preheatStartTime).valueOf() : null

        delete resParam.updateTime
        resParam.preheat = preheat // 直接用活动是否预热
        resParam.activitySkuInfos.forEach(sku => {
            if (sku.activityCommissionRate >= 1) {
                rateErrorItems += sku.skuId
            } else if (sku.activityCommissionRate < 1 && sku.activityCommissionRate >= 0.2) {
                rateTipItems += sku.skuId
            } else if (sku.activityCommissionRate < 0.01) {
                rateLowTipItems += sku.skuId
            }
            sku.activityPrice = sku.activityPrice * 1
            if (sku.activityPrice > sku.vipPrice) {
                priceErrorItems += sku.skuId
            } else if (sku.activityPrice < sku.advisePrice) {
                priceTipItems += sku.skuId
            }
        })

        if (rateErrorItems) {
            message.error(rateErrorItems + '的活动佣金率设置异常，保存失败')
            return
        } else if (priceErrorItems) {
            message.error(priceErrorItems + '的活动价设置过高，保存失败')
            return
        } else if (rateLowTipItems || rateTipItems || priceTipItems) {
            let text = priceTipItems ? priceTipItems + '的活动价过低，' : ''
                text += rateTipItems ? rateTipItems + '的活动佣金率过高，' : ''
                text += rateLowTipItems ? rateLowTipItems + '的活动佣金率过低，' : ''
            confirm({
                title: '提醒',
                content: text + '确认要保存吗？',
                onOk() {
                    onConfirm(resParam)
                },
                onCancel() {
                    message.info('已取消保存')
                    return
                }
            })
        } else {
            onConfirm(resParam)
        }
    }

    function syncParamChange (data) {
        let temp = Object.assign({}, syncParam, data)
        setSyncParam(temp)
    }

    function handleSkuChange (data, index) {
        let temp = { ...curValues } 
        temp.activitySkuInfos = temp.activitySkuInfos.map((sku, skuIndex) => {
            if (skuIndex == index) {
                sku = Object.assign({}, sku, data)
            }

            return sku
        })

        setCurValues(temp)
    }

    function handleSync () {
        let tempValues = {...curValues}
        tempValues.activitySkuInfos = tempValues.activitySkuInfos.map(sku => {
            let item = null
            if (!syncParam.attrs || !syncParam.attrs.length) { // 表示针对所有数据
                item = {}
            } else {
                item = syncParam.attrs.find(attr => {
                    return attr === sku.values
                })
            }

            if (item) {
                // 因为是数值型，所以用于区分0和其他
                if (typeof syncParam.activityPrice == 'number') {
                    sku.activityPrice = syncParam.activityPrice
                }
                if (typeof syncParam.activityCommissionRate == 'number') {
                    sku.activityCommissionRate = syncParam.activityCommissionRate
                }
                if (typeof syncParam.activityStock == 'number') {
                    sku.activityStock = syncParam.activityStock
                }
            }

            return sku
        })

        setCurValues(tempValues)
    }

    return (
        <Modal title="编辑活动商品" 
            visible={showModal} 
            destroyOnClose
            onCancel={onCancel}
            maskClosable={false}
            width={900}
            okButtonProps={{ htmlType: 'submit', form: 'productEditForm'}}
            confirmLoading={confirmLoading}
        >
            <Form id="productEditForm" 
                ref={productEditForm}
                preserve={false}
                onFinish={onFinish} initialValues={editData}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="活动名称" required>
                            {name}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="活动国家" required>
                            {filterCountry(countryCode)}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="商品ID" required>{editData.spuId}</Form.Item>
                {!!groupList.length && <Form.Item label="商品分组" name="groupId" extra="修改分组，会同步分组的信息过来">
                    <Select onChange={handleGroupSelect}>
                        {
                            groupList.map(group => (
                                <Select.Option key={group.id} value={group.id}>{group.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>}
                <Form.Item label="开始时间" required>
                    <Form.Item noStyle name="follow">
                        <Radio.Group onChange={(e) => handleParamChange({'follow': e.target.value})}>
                            <Radio value={1}>跟随活动</Radio><br/>
                            <Radio value={0}>自定义</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {   
                        curValues.follow == 0 && (
                            <div className="time-box">
                                {preheat && <Form.Item label="预热时间" name="preheatStartTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: '预热时间必填'
                                        }
                                    ]}
                                >
                                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
                                </Form.Item>}
                                <Form.Item label="开始时间" name="startTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: '开始时间必填'
                                        }
                                    ]}
                                >
                                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
                                </Form.Item>
                                <Form.Item label="结束时间" name="endTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: '结束时间必填'
                                        }
                                    ]}
                                >
                                    <DatePicker showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}/>
                                </Form.Item>
                            </div>
                        )
                    }
                </Form.Item>
                <Form.Item label="活动价格设置" required>
                    <Select
                        mode="multiple"
                        placeholder="默认表示针对所有规格同步操作"
                        style={{ width: 240, marginRight: 8 }}
                        onChange={(val) => syncParamChange({attrs: val})} allowClear>
                        {
                            curValues.attrList && curValues.attrList.map(attr => (
                                <Select.Option key={attr} value={attr}>{attr}</Select.Option>
                            ))
                        }
                    </Select>
                    <InputNumber 
                        placeholder="活动价" 
                        onChange={(val) => syncParamChange({activityPrice: val})} 
                        style={{ width: 140, marginRight: 8 }}/>
                    <InputNumber 
                        placeholder="活动佣金率" 
                        style={{ width: 140, marginRight: 8 }} 
                        onChange={(val) => syncParamChange({activityCommissionRate: val})}/>
                    <InputNumber 
                        placeholder="活动库存" 
                        style={{ width: 140, marginRight: 8 }} 
                        onChange={(val) => syncParamChange({activityStock: val})}
                    />
                    <Button type="primary" onClick={handleSync}>同步</Button>
                    <br/>
                    <Table
                        style={{ marginTop: 8 }}
                        columns={columns}
                        dataSource={curValues.activitySkuInfos}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ x: '100%' }}
                        rowKey={record => record.skuId}
                    />
                </Form.Item>
                <Form.Item label="商品角标">
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={corColumns}
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>
                <Form.Item label="营销文案">
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={descColumns}
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ProductEditModal
