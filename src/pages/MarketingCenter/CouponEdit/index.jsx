import { useState, useEffect, useCallback } from 'react'
import { useModel, history } from 'umi'
import ViewContainer from '@/components/ViewContainer'
import { filterCurrencyUnit, filterCountry } from '@/utils/filter'
import { Form, Input, Select, InputNumber, Radio, Checkbox, Button, DatePicker, Table } from 'antd'
import { COUPON_TYPE_ENUM, COUPON_SCOPE_ENUM } from '../Coupon/enum'
import { addCoupon, updateCoupon, getCouponDetail } from '@/services/coupon'
import styles from './index.less'
import moment from 'moment'

const { RangePicker } = DatePicker
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
}

const AddCoupon = () => {
    const { countries, languages } = useModel('dictionary')
    const [couponId, setCouponId] = useState('')
    const [curType, setCurType] = useState('add')
    const [curValues, setCurValues] = useState({
        countryCode: 'MY',
        couponType: 1,
        timeType: 1,
        openType: 2,
        description: {},
        name: {}
    })

    const useColumns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (_, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (_, item) => (
            <Input value={curValues.description[item.code]} onChange={(e) => handleNameChange(e, item.code, 'description')}/>
        )
    }]

    const nameColumns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (_, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (_, item) => (
            <Input value={curValues.name[item.code]} onChange={(e) => handleNameChange(e, item.code, 'name')}/>
        )
    }]

    const handleNameChange = useCallback((e, code, type) => {
        let temp = { ...curValues }
        let langObj = temp[type] || {}
        langObj[code] = e.target.value
        setCurValues(temp)
    }, [curValues])

    // 需要根据某个字段值变化的，才监听变化
    const handleChange = useCallback((type, val) => {
        let temp = { ...curValues }
        temp[type] = val
        setCurValues(temp)
    }, [curValues])

    useEffect(() => {
        let query = history.location.query || {}
        let couponId = parseInt(query.couponId)
        let type = query.type
        if (couponId) {
            setCouponId(couponId)
            getData(couponId)
            setCurType(type)
        }
    }, [])

    const getData = useCallback((couponId) => {
        getCouponDetail({
            id: couponId
        }).then(res => {
            if (res.ret.code === 0) {
                setCurValues(res.data)
            }
        })
    }, [])

    function onFinish (values) {
        console.log(values)
    }

    return (
        <ViewContainer>
            <Form onFinish={onFinish} initialValues={curValues} {...formItemLayout}>
                <p className={styles.text}>基本信息</p>
                {
                    curType === 'add' ? 
                    <>
                        <Form.Item label="适用国家" required name="countryCode">
                            <Select>
                                {
                                    countries.map((item) => (
                                        <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                                    ))
                                }
                            </Select> 
                        </Form.Item>
                        <Form.Item  
                            name="couponType"
                            label="优惠券类型"
                            rules={[{
                                required: true,
                                message: '必选'
                            }]}
                        >
                            <Select onChange={(val) => {
                                handleChange('couponType', val)
                            }}>
                                {
                                    Object.keys(COUPON_TYPE_ENUM).map(key => (
                                    <Select.Option value={parseInt(key)} key={key}>{COUPON_TYPE_ENUM[key]}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </>
                     : 
                    <>
                        <Form.Item label="适用国家" required>
                            { filterCountry(curValues.countryCode) }
                        </Form.Item>
                        <Form.Item label="优惠券类型" required>
                            { COUPON_TYPE_ENUM[type] }
                        </Form.Item>
                    </>
                }
                <Form.Item label="优惠券名称" required>
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={nameColumns}
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>

                <Form.Item label='总发行量' required>
                    {
                        curType === 'add' ? 
                        <>
                            <Form.Item name="totalNumber" noStyle>
                                <InputNumber min={1} max={9999999}
                                    placeholder="只能输入正整数，输入9999999为无限制"
                                    style={{ width: '90%' }}
                                />
                            </Form.Item> 张
                        </>
                         : curValues.totalNumber + '张'
                    }
                </Form.Item>

                <Form.Item label="每日发行量" required>
                    {
                        curType === 'add' ? <>
                            <Form.Item noStyle name="totalNumber">
                                <InputNumber min={1} max={9999999}
                                    placeholder="只能输入正整数，输入9999999为无限制"
                                    style={{ width: '90%' }}
                                />
                            </Form.Item> 张
                        </> : curValues.totalNumber + '张'
                    }
                </Form.Item>

                <Form.Item label="适用商品" required>
                    <Radio.Group>
                        {
                            Object.keys(COUPON_SCOPE_ENUM).map(scope => <Radio key={scope} value={parseInt(scope)}>{COUPON_SCOPE_ENUM[scope]}</Radio>)
                        }
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="与其他券同时使用" name="isMutex" rules={[{required: true, message: '必选'}]}>
                    <Radio.Group>
                        <Radio value={1}>不可以</Radio>
                        <Radio value={0}>可以</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="使用门槛" rules={[{
                    required: true,
                    message: '必填'
                }]}>
                    <Form.Item name="">

                    </Form.Item>
                    {/* {   
                        // 满减券 邮费券才有门槛
                        ['1', '5'].includes(getFieldValue('couponType')) ? 
                            `满${filterCurrencyUnit(getFieldValue('countryCode'))}`
                        : `满${filterCurrencyUnit(getFieldValue('countryCode'))}0`
                    } */}
                    <InputNumber/>
                </Form.Item>
                
                <Form.Item label="优惠内容" required>
                    {}
                </Form.Item>

                <p className={styles.text}>领用规则</p>

                <Form.Item label="用户范围" required>
                    <Radio.Group>
                        <Radio></Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="限领规则" rules={[{
                    required: true,
                    message: '必填'
                }]} name="userLimit">
                    <InputNumber min={1} max={9999999} style={{ width: '80%' }}/>
                </Form.Item>

                <Form.Item label="优惠券有效期">
                    <Form.Item noStyle name="timeType" rules={[{required: true, message: '必选'}]}>
                        <Radio.Group onChange={(e) => handleChange('timeType', e.target.value)}>
                            <Radio value={1}>日期范围</Radio>
                            <Radio value={2}>自发放之日起</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        curValues.timeType == 1 ? <Form.Item name="timeList" rules={[{ required: true, message: '必填' }]}>
                            <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                        </Form.Item> : <Form.Item name="day" rules={[{ required: true, message: '必填' }]}>
                            <InputNumber min={1} max={9999999} style={{ width: '60%' }}/>
                        </Form.Item>   
                    }
                </Form.Item>

                <Form.Item label="公开领取" extra="谨慎操作：设置优惠券为公开领取，则券会出现在商品详情页；特殊用途的优惠券（如无门槛补偿券）请切勿公开领取">
                    <Form.Item rules={[{required: true, message: '必选'}]} name="openType">
                        <Radio.Group onChange={(e) => handleChange('openType', e.target.value)}>
                            <Radio value={2}>不公开领取</Radio>
                            <Radio value={1}>公开领取时间</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        curValues.openType == 1 && <Form.Item name="openTimelist">
                            <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                        </Form.Item>
                    }
                </Form.Item>

                <Form.Item label="转赠设置">
                    <Checkbox />允许转赠
                </Form.Item>

                <Form.Item label="使用说明" required>
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={useColumns}
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
                    <Button style={{ marginRight: 16 }} htmlType="button" onClick={() => {history.goBack()}}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        </ViewContainer>
    )
}

export default AddCoupon