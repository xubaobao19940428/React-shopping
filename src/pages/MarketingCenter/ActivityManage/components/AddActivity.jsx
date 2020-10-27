import React, { useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Select, DatePicker, Radio, Result, Checkbox } from 'antd'
import { getTemplateList, addActivity } from '@/services/marketing'
import BasicInfo from './BasicInfo'
import RuleCommon from '../../ActivityDetail/components/RuleCommon'
import RulePromotion from '../../ActivityDetail/components/RulePromotion'
import commonEnum from '../enum'
import { moment } from 'moment'

const { Step } = Steps
const PROMOTION_KEY = 100
const { GROUP_RULE_LIST, TEMPLATE_DEFUALT_VALUE } = commonEnum
const steps = [{
    title: '基础资料',
}, {
    title: '活动人群',
    type: 1
}, {
    title: '活动商品',
    type: 2
}, {
    title: '促销工具',
    type: 3
}, {
    title: '商品限购',
    type: 4
}, {
    title: '创建结果'
}]
const AddActivity = (props) => {
    const { onFinish, onCancel, languages, countries } = props
    const [current, setCurrent] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [templateList, setTemplateList] = useState([])
    const [allValues, setAllValues] = useState({
        elements: {},
        activityTemplateId: '',
        name: '',
        countryCode: 'MY',
        timeList: [],
        preheatStartTime: '',
        icon: {},
        baseMap: {},
        baseMapPrice: 1,
        jumpLink: '',
        description: '',
        promotionLabel: {},
        ruleDesc: {}
    })
    const [curItem, setCurItem] = useState({})
    const [status, setStatus] = useState('')
    useEffect(() => {
        getTemplateData()
    }, [])

    function getTemplateData () {
        getTemplateList({}).then(res => {
            if (res.ret.errCode === 0){
                setTemplateList(res.data)
            }
        })
    }

    function prev () {
        let tempCurrent = current - 1
        if (tempCurrent > 0) {
            let stepItem = steps[tempCurrent]
            let curItem = GROUP_RULE_LIST.find(item => item.type === stepItem.type)
            setCurItem(curItem)
        } else {
            setCurItem({})
        }
        setCurrent(tempCurrent)
    }

    function next (data) {
        let temp = { ...allValues }
        temp = Object.assign({}, temp, data)
        setAllValues(temp)
        let tempCurrent = current + 1
        let stepItem = steps[tempCurrent]
        let curItem = GROUP_RULE_LIST.find(item => item.type === stepItem.type)
        setCurrent(tempCurrent)
        setCurItem(curItem)
    }
    
    function handleRuleConfirm (resData) {
        let temp = {...allValues}
        if (resData) {
            let ruleItem = {}
            let elements = {}
            resData.activityElementInfos.forEach(item => {
                let param = item.param
                let ruleParam = item.param
                if (item.elementType == 100) {
                    param = JSON.stringify(param)
                    temp.promotionLabel = resData.promotionLabel || {}
                    temp.ruleDesc = resData.ruleDesc || {}
                } else {
                    ruleParam = ruleParam.split(',')
                }
                ruleItem[item.elementType] =  {
                    selected: item.selected,
                    param: ruleParam
                }
                if (item.selected) {
                    elements[item.elementType] = param
                }
            })
            temp.ruleInfo = Object.assign({}, temp.ruleInfo, ruleItem)
            temp.elements = Object.assign({}, temp.elements, elements)
            setAllValues(temp)
        }
        // 更新存储的ruleInfo的值
        if (current === steps.length - 2) {
            temp.endTime = temp.timeList ? temp.timeList[1].valueOf() : ''
            temp.startTime = temp.timeList ? temp.timeList[0].valueOf() : ''
            temp.preheatStartTime = temp.preheatStartTime ? temp.preheatStartTime.valueOf() : ''
            // 当时是创建
            delete temp.ruleInfo
            // delete temp.timeList
            addActivity(temp).then(res => {
                if (res.ret.errCode === 0) {
                    setStatus('success')
                } else {
                    setStatus('error')
                }
                let tempCurrent = current + 1
                setCurrent(tempCurrent)
            })
        } else {
            let tempCurrent = current + 1
            let stepItem = steps[tempCurrent]
            let curItem = GROUP_RULE_LIST.find(item => item.type === stepItem.type)
            setCurrent(tempCurrent)
            setCurItem(curItem)
        }
    }

    function handlePromotionChange (e) {
        let value = e.target.checked
        let temp = { ...allValues }
        temp.ruleInfo[PROMOTION_KEY].selected = value

        setAllValues(temp)
    }

    return (
        <div className="add-activity-wrapper">
            <Steps current={current}>
                {
                    steps.map(item => (
                        <Step key={item.title} title={item.title}></Step>
                    ))
                }
            </Steps>
            <div className="steps-content">
                {current == 0 && <BasicInfo
                    countries={countries}
                    templateList={templateList}
                    onConfirm={next}
                    allValues={allValues}
                    onCancel={onCancel}
                    TEMPLATE_DEFUALT_VALUE={TEMPLATE_DEFUALT_VALUE}
                />}
                {
                    current != steps.length - 1 && curItem && curItem.name && (
                        curItem.name !== '促销工具' ? (
                            <RuleCommon
                                showModal={showModal}
                                key={curItem.name}
                                curItem={curItem}
                                onCancel={prev}
                                onConfirm={handleRuleConfirm}
                                basicInfo={allValues}
                                ruleInfo={allValues.ruleInfo}
                                languages={languages}
                                type="add"
                            />
                        ) : (
                            <>
                                {allValues.ruleInfo[PROMOTION_KEY] && <Checkbox defaultChecked={allValues.ruleInfo[PROMOTION_KEY].selected} onChange={handlePromotionChange}>开启促销工具</Checkbox>}
                                <br/>
                                {
                                    (allValues.ruleInfo[PROMOTION_KEY] && allValues.ruleInfo[PROMOTION_KEY].selected) ? 
                                    <RulePromotion
                                        showModal={showModal}
                                        key={curItem.name}
                                        curItem={curItem}
                                        onCancel={prev}
                                        onConfirm={handleRuleConfirm}
                                        basicInfo={allValues}
                                        ruleInfo={allValues.ruleInfo}
                                        languages={languages}
                                        type="add"
                                        isLast={current == steps.length - 2}
                                    /> : 
                                    <>  
                                        <div style={{ textAlign: 'right' }}>
                                            <Button style={{ marginRight: 8 }} onClick={prev}>上一步</Button>
                                            <Button type="primary" onClick={() => handleRuleConfirm(null)}>下一步</Button>
                                        </div>
                                    </>
                                }
                            </>
                        )
                    )
                }
                {
                    current == steps.length - 1 && (
                        <>
                            <Result
                                status={status}
                                title={status == 'success' ? '创建成功' : '创建失败'}
                            />
                            <div style={{ textAlign: 'center' }}>
                                { status == 'error' ? <Button style={{ marginRight: 8 }} onClick={prev}>上一步</Button> : <Button type="primary" onClick={onFinish}>完成</Button>}
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default AddActivity