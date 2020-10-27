import React, {useState, useEffect} from 'react'
import { Form, Radio, Checkbox, Button, InputNumber, message } from 'antd'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24,
        },
    },
}

const RuleCommon = (props) => {
    const { onCancel, onConfirm, ruleInfo, curItem, type, showModal, isLast } = props
    const [curValues, setCurValues] = useState({})
    
    useEffect(() => {
        setCurValues(JSON.parse(JSON.stringify(ruleInfo)))
    }, [showModal])

    function handleCheckboxChange (item, e) {
        let temp = {...curValues}
        let key = item.key
        let value = e.target.checked
        temp[key].selected = !!value
        temp[key].type = item.type || ''
        temp[key].name = item.name

        setCurValues(temp)
    }

    function handleSubChange (key, list) {
        let temp = {...curValues}
        temp[key].param = list

        setCurValues(temp)
    }

    function handleSubRadioChange (key, value) {
        let temp = {...curValues}
        temp[key].param = [value]

        setCurValues(temp)
    }

    function onFinish (values) {
        let activityElementInfos = []
        let keys = Object.keys(values)
        let len = keys.length
        for (let i = 0; i < len; i++) {
            let key = keys[i]
            let temp = curValues[key]
            if (temp && temp.selected && temp.type && !temp.param.length) {
                message.error(`${temp.name}的具体内容未设置`)
                return
            }
            if (temp) {
                activityElementInfos.push({
                    selected: temp.selected ? 1 : 0,
                    elementType: key,
                    param: temp.selected ? (temp.param.length ? temp.param.join(',') : "1") : ''
                })
            }
        }
        let existTrue = activityElementInfos.find(item => item.selected)
        if (activityElementInfos.length && !existTrue && curItem.required) {
            message.error('活动人群的用户身份必须设置一种')
            return
        }
        // if (!activityElementInfos.length) {
        //     onCancel()
        // } else {
        onConfirm({ activityElementInfos })
        // }
    }

    return (
        <Form onFinish={onFinish} {...formItemLayout}>
            {
                curItem.content && curItem.content.map(item => (
                    <Form.Item name={item.key} label="" key={item.key}>
                        {
                            curValues[item.key] &&
                            (
                                <>
                                    <Checkbox defaultChecked={!!curValues[item.key].selected} onChange={(e) => handleCheckboxChange(item, e)}>{item.name}</Checkbox>
                                    {
                                        item.type == 'checkbox' && (
                                            <>
                                                <br/>
                                                <Checkbox.Group
                                                    style={{ marginLeft: 30 }}
                                                    defaultValue={curValues[item.key].param}
                                                    onChange={(list) => handleSubChange(item.key, list)}
                                                    options={item.list}
                                                    disabled={!curValues[item.key].selected}
                                                />
                                            </>
                                        )
                                    }
                                    {
                                        item.type == 'input' && (
                                            <>
                                                {item.name} <InputNumber min={1} size="mini" 
                                                    onChange={(value) => handleSubRadioChange(item.key, value)}
                                                    disabled={!curValues[item.key].selected}
                                                    defaultValue={curValues[item.key].param[0]}/> 件
                                            </>
                                        )
                                    }
                                    {
                                        item.type === 'radio' && (
                                            <>
                                                <br/>
                                                <Radio.Group
                                                    style={{ marginLeft: 30 }}
                                                    defaultValue={curValues[item.key].param[0]}
                                                    disabled={!curValues[item.key].selected}
                                                    onChange={(e) => handleSubRadioChange(item.key, e.target.value)}
                                                    options={item.list}
                                                />
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </Form.Item>
                ))
            }
            <Form.Item style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 8 }} onClick={onCancel}>{type === 'edit' ? '取消' : '上一步'}</Button>
                <Button type="primary" htmlType="submit" disabled={type === 'edit' && curItem.type == 1}>{type === 'edit' ? '确认' : (isLast ? '完成' : '下一步')}</Button>
            </Form.Item>
        </Form>
    )
}

export default React.memo(RuleCommon)
