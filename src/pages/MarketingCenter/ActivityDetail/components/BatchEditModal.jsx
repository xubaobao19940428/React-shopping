import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Select, DatePicker, Radio, Input, Modal, Collapse, Form, InputNumber, Table, Button, message } from 'antd'
import moment from 'moment'
import { DoubleRightOutlined } from '@ant-design/icons'

const { Panel } = Collapse
const BatchEditProduct = (props) => {
    const { showModal, onCancel, onConfirm, languages, groupList, confirmLoading, isAddActivityProduct, preheat, onPre } = props
    const [commissionVal, setCommissionVal] = useState({})
    const [priceVal, setPriceVal] = useState({})
    const [curValues, setCurValues] = useState({
        follow: 1,
        endTime: null,
        startTime: null,
        preheatStartTime: null,
        setPrice: 1,
        setCommissionRate: 1,
        stock: 999999,
        productCorner: {},
        promotionDesc: {}
    })
    const columns = [{
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

    useEffect(() => {
        setCurValues(
            {
                follow: 1,
                endTime: null,
                startTime: null,
                preheatStartTime: null,
                setPrice: 1,
                setCommissionRate: 1,
                stock: 999999,
                productCorner: {},
                promotionDesc: {}
            }
        )
    }, [showModal])

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
    const batchEditProductForm = useRef()

    const handleGroupSelect = useCallback((value) => {
        let item = groupList.find(item => item.id == value)
        item.groupId = value
        if (item) {
            let resData = Object.assign({}, curValues, {
                follow: item.follow,
                startTime: item.startTime ? moment(parseInt(item.startTime)) : null,
                endTime: item.endTime ? moment(parseInt(item.endTime)) : nul,
                preheatStartTime: item.preheatStartTime ? moment(parseInt(item.preheatStartTime)) : null,
                productCorner: item.productCorner,
                promotionDesc: item.promotionDesc,
                groupId: value
            })
            setCurValues(resData)
            if (batchEditProductForm.current) {
                batchEditProductForm.current.setFieldsValue(resData)
            }
        }
    })

    function handleLangChange (type, e, item) {
        let temp = { ...curValues }
        temp[type][item.code] = e.target.value

        setCurValues(temp)
    }

    function handlePriceValChange (val, type) {
        priceVal[type] = val

        setPriceVal(priceVal)
    }

    function handleCommiValChange (val, type) {
        commissionVal[type] = val

        setCommissionVal(commissionVal)
    }

    function handleFollowChange (e) {
        let temp = {...curValues}
        temp.follow = e.target.value

        setCurValues(temp)
    }

    function onFinish (values) {
        let tempValues = { ...values }
        if (!tempValues.follow) { // 自定义
            if (tempValues.startTime.isAfter(tempValues.endTime, 'second')) {
                message.error('开始时间须不大于结束时间')
                return
            } else if (preheat && tempValues.preheatStartTime && (tempValues.preheatStartTime.isAfter(tempValues.startTime, 'second'))) {
                message.error('预热时间须不大于开始时间')
                return
            }
        }
        tempValues.startTime = tempValues.startTime ? (tempValues.startTime).valueOf() : null
        tempValues.endTime  = tempValues.startTime ? (tempValues.endTime).valueOf() : null
        tempValues.preheatStartTime = (preheat && tempValues.preheatStartTime) ? (tempValues.preheatStartTime).valueOf() : null
        tempValues.preheat = preheat // 直接用活动是否预热
        let data = Object.assign({}, curValues, 
            tempValues, {
                priceDiscount: priceVal[values.setPrice] || 0,
                commissionRateDiscount: commissionVal[values.setCommissionRate] || 0
            }
        )

        onConfirm(data)
    }
    
    return (
        <Modal
            destroyOnClose
            title="批量编辑商品"
            visible={showModal}
            onCancel={onCancel}
            okText="确认填充"
            width={800}
            okButtonProps={{ htmlType: 'submit', form: 'batchEditProductForm'}}
            className="batch-edit-modal"
            confirmLoading={confirmLoading}
        >
            {isAddActivityProduct && <Button type="link" onClick={onPre}>上一步</Button>}
            <Form id="batchEditProductForm" onFinish={onFinish} initialValues={curValues}
                ref={batchEditProductForm}
            >
                <Collapse 
                    bordered={false}
                    defaultActiveKey={['1','2','3','4','5','6','7']}
                    expandIcon={({ isActive }) => <DoubleRightOutlined rotate={isActive ? 90 : 0} style={{ color: '#409eff' }}/>}
                    expandIconPosition="right"
                    className="batch-edit-modal-collapse"
                >
                    <Panel header="选择分组" key="1">
                        <Form.Item label="选择分组" name="groupId">
                            <Select onChange={handleGroupSelect}>
                                {
                                    groupList.map(item => (
                                        <Select.Option
                                            value={item.id}
                                            key={item.id}
                                    >{item.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="设置活动时间" key="2">
                        <Form.Item name="follow">
                            <Radio.Group onChange={handleFollowChange}>
                                <Radio value={1}>跟随活动</Radio><br/>
                                <Radio value={0}>自定义
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
                                                    <DatePicker 
                                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
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
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="设置活动价" key="3">
                        <Form.Item name="setPrice">
                            <Radio.Group>
                                <Radio value={1}>
                                    <span className="radio-text">建议活动价</span>
                                    <span className="desc">活动价 = 建议活动价</span>
                                </Radio><br/>
                                <Radio value={2}>
                                    <span className="radio-text">按建议活动价打折</span>
                                    <span className="desc">
                                        活动价 = 建议活动价 ÷ <InputNumber onChange={(val) => handlePriceValChange(val, 2)} min={0.0001}/>
                                    </span>
                                </Radio><br/>
                                <Radio value={3}>
                                    <span className="radio-text">按VIP价打折</span>
                                    <span className="desc">
                                        活动价 = VIP价 * <InputNumber onChange={(val) => handlePriceValChange(val, 3)} min={0.0001} max={1}/>
                                    </span>
                                </Radio><br/>
                                <Radio value={4}>
                                    <span className="radio-text">自定义</span>
                                    <span className="desc">
                                        活动价 = <InputNumber onChange={(val) => handlePriceValChange(val, 4)} min={0}/>
                                    </span>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="设置活动佣金率" key="4">
                        <Form.Item name="setCommissionRate">
                            <Radio.Group>
                                <Radio value={1}>
                                    <span className="radio-text">按日常佣金率</span>
                                    <span className="desc">活动佣金率 = 日常佣金率</span>
                                </Radio><br/>
                                <Radio value={2}>
                                    <span className="radio-text">按日常佣金率换算</span>
                                    <span className="desc">
                                        活动佣金率 = 日常佣金率 * <InputNumber onChange={(val) => handleCommiValChange(val, 2)} min={0} max={1}/>
                                    </span>
                                </Radio><br/>
                                <Radio value={3}>
                                    <span className="radio-text">自定义</span>
                                    <span className="desc">
                                        活动佣金率 = <InputNumber onChange={(val) => handleCommiValChange(val, 3)} min={0} max={1}/>
                                    </span>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="设置活动库存" key="5">
                        <Form.Item>
                            <Radio.Group defaultValue={1}>
                                <Radio value={1}>
                                    <span className="radio-text">批量填充</span>
                                    <span className="desc">
                                    活动库存 = <Form.Item name="stock" noStyle>
                                            <InputNumber min={0} precision={0}/>
                                        </Form.Item>
                                    </span>
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="设置营销文案" key="6">
                        <Table
                            rowKey={record => record.code}
                            bordered
                            columns={columns}
                            dataSource={languages}
                            pagination={{hideOnSinglePage: true}}
                            scroll={{ y: 160 }}
                        />
                    </Panel>
                    <Panel header="设置商品角标" key="7">
                        <Table
                            rowKey={record => record.code}
                            bordered
                            columns={descColumns}
                            dataSource={languages}
                            pagination={{hideOnSinglePage: true}}
                            scroll={{ y: 160 }}
                        />
                    </Panel>
                </Collapse>
            </Form>
        </Modal>
    )
}

export default React.memo(BatchEditProduct)