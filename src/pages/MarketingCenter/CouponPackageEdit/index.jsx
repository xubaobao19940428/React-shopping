import { useState, useCallback } from 'react'
import { useModel, history } from 'umi'
import ViewContainer from '@/components/ViewContainer'
import { InputNumber, Form, Button, Input, Table, Select, Radio, Checkbox, Space, message } from 'antd'
import styles from './index.less'
import enmu from '../../order/Enmu'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { addCouponPackage } from '@/services/coupon'

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

const { userLevel } = enmu

const AddCouponPackage = () => {
    const [curValues, setCurValues] = useState({
        countryCode: 'MY',
        userMember: 1,
        name: {}
    })
    const { countries, languages } = useModel('dictionary')

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

    const onFinish = useCallback((values) => {
        let temp = { ...values }
        if (!temp.couponDetail || !temp.couponDetail.length) {
            message.error('优惠券内容必填')
            return
        }
        temp.name = curValues.name
        if (temp.userMember === 0) {
            temp.userMemberLevel = Object.keys(userLevel)
        }
        temp.addElementMap = {
            userMemberLevel: temp.userMemberLevel,
            userLimit: temp.userLimit
        }

        console.log(temp)
        temp.couponDetail = JSON.stringify(temp.couponDetail)
        delete temp.userMemberLevel
        delete temp.userLimit
        addCouponPackage(temp).then(res => {
            if (res.ret.errCode === 0) {
                message.success('新增成功')
                history.goBack()
            }
        })
    }, [])

    return (
        <ViewContainer>
            <Form onFinish={onFinish} {...formItemLayout} initialValues={curValues}>
                <p className={styles.text}>基本信息</p>
                <Form.Item label="适用国家" rules={[{required: true, message: '必选'}]} name="countryCode">
                    <Select>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select> 
                </Form.Item>
                <Form.Item label="券包名称" required>
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={nameColumns}
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>
                <Form.Item label="优惠券内容" required>
                    <Form.List name="couponDetail">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {
                                        fields.map(field => (
                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                <Form.Item
                                                    {...field}
                                                    label="ID"
                                                    name={[field.name, 'couponId']}
                                                    rules={[{required: true, message: '必填'}]}
                                                >
                                                    <Input placeholder="请输入优惠券ID"/>
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="数量"
                                                    name={[field.name, 'num']}
                                                    rules={[{ required: true, message: '必填'}]}
                                                >
                                                    <InputNumber min={1} placeholder="优惠券数量" style={{wdith: '90%'}}/>
                                                </Form.Item>

                                                <DeleteOutlined onClick={() => {remove(field.name)}}/>
                                            </Space> 
                                        ))
                                    }

                                    <Form.Item>
                                        <Button onClick={() => {
                                            add()
                                        }}><PlusOutlined /> 新增</Button>
                                    </Form.Item>
                                </div>
                            )
                        }}
                    </Form.List>
                </Form.Item>
                <Form.Item label="总发行量" required>
                    <Form.Item noStyle rules={[{required: true, message: '必填'}]} name="totalNumber">
                        <InputNumber style={{ width: '90%' }}/>
                    </Form.Item> 份
                </Form.Item>
                <Form.Item label="每日发行量">
                    <Form.Item noStyle name="dayMaxNumber">
                        <InputNumber style={{ width: '90%' }}/>
                    </Form.Item> 张
                </Form.Item>
                <Form.Item label="内部备注" name="remark">
                    <Input placeholder="建议说明此券的用途及注意事项，以方便内部协作"/>
                </Form.Item>
                <p className={styles.text}>领用规则</p>
                <Form.Item label="用户范围" required>
                    <Form.Item name="userMember" rules={[{required: true, message: '必选'}]}>
                        <Radio.Group onChange={(e) => handleChange('userMember', e.target.value)}>
                            <Radio value={0}>所有用户</Radio>
                            <Radio value={1}>用户等级</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        curValues.userMember ? (
                            <Form.Item name="userMemberLevel" rules={[{required: true, message: '必选'}]}>
                                <Checkbox.Group>
                                    {
                                        Object.keys(userLevel).map(key => 
                                            <Checkbox key={key} value={parseInt(key)}>{userLevel[key]}</Checkbox>    
                                        )
                                    }
                                </Checkbox.Group>
                            </Form.Item>
                        ) : ''
                    }
                </Form.Item>
                <Form.Item label="领取规则" required>
                    每人限领<Form.Item noStyle name="userLimit" rules={[{required: true, message: '必填'}]}>
                            <InputNumber style={{ width: 200 }}/>
                        </Form.Item>张
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
                    <Button style={{ marginRight: 16 }} htmlType="button" onClick={() => {history.goBack()}}>取消</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        </ViewContainer>
    )
}

export default AddCouponPackage