import React, { useState, useEffect } from 'react'
import { Tabs, Button, message, Spin } from 'antd'
import { useModel, history } from 'umi'
import {
    getActivityBasicInfo, updateActivityBasicInfo,
    getActivityGroup, updateActivityGroup,
    getActivityProductList,
    getActivityRule
} from '@/services/marketing'
import { customTimeFormat, filterCountry } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { objectMapToArray } from '@/utils/index'
import ActivityBasicInfo from './components/ActivityBasicInfo'
import ActivityRuleInfo from './components/ActivityRuleInfo'
import ActivityProductInfo from './components/ActivityProductInfo'
import ActivityGroupInfo from './components/ActivityGroupInfo'
import moment from 'moment'
import './index.less'
import commonEnum from '../ActivityManage/enum'
/**
 * 活动详情
 * @param {*} props
 */

const { TabPane } = Tabs
const { FOLLOW_TYPE_OBJ, GROUP_RULE_LIST, PROMOTION_TYPE_OBJ } = commonEnum

const ActivityDetail = (props) => {
    const [activityId, setActivityId] = useState('')
    const [basicInfo, setBasicInfo] = useState({})
    const [groupList, setGroupList] = useState([])
    const [productList, setProductList] = useState([])
    const [ruleInfo, setRuleInfo] = useState({})
    const { countries, languages } = useModel('dictionary')
    const [loading, setLoading] = useState(false)
    const [gotDataList, setGotDataList] = useState(['basic'])
    const [curTab, setCurTab] = useState('basic')
    const [productTotal, setProductTotal] = useState(0)

    useEffect(() => {
        let query = history.location.query || {}
        let activityId = parseInt(query.activityId)
        if (activityId) {
            setActivityId(activityId)
            getBasicInfo(activityId)
        }
    }, [])

    function handleTabChange (val) {
        setCurTab(val)
        if (gotDataList.includes(val)) return
        let temp = [...gotDataList]
        switch (val) {
            case 'rule':
                getRuleInfo()
                break;
            case 'product':
                getProductList()
                getGroupList()
                temp.push('group')
                break;
            case 'group':
                getGroupList();
                break;
        }
        temp.push(val)
        setGotDataList(temp)
    }

    function getBasicInfo (activityId) {
        setLoading(true)
        getActivityBasicInfo({activityId}).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                let tempData = JSON.parse(JSON.stringify(res.data))
                tempData.startTime = tempData.startTime ? moment(parseInt(tempData.startTime)) : null
                tempData.endTime = tempData.endTime ? moment(parseInt(tempData.endTime)) : null
                if (tempData.preheatStartTime) {
                    tempData.preheatStartTime = moment(parseInt(tempData.preheatStartTime))
                }
                tempData.timeList = [tempData.startTime, tempData.endTime]
                tempData.iconList = objectMapToArray(tempData.icon, 'languageCode', 'name')
                tempData.baseMapList = objectMapToArray(tempData.baseMap, 'languageCode', 'name')

                setBasicInfo(tempData)
            }
        }).catch(err => {
            setLoading(false)
        })
    }
    function handleBasicEdit (data) {
        setLoading(true)
        updateActivityBasicInfo(data).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                message.success('编辑成功')
            }
            getBasicInfo(activityId)
        }).catch(() => {
            setLoading(false)
        })
    }

    function getRuleInfo () {
        setLoading(true)
        getActivityRule({
            activityId,
            activityTemplateId: basicInfo.activityTemplateId
        }).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                let temp = JSON.parse(JSON.stringify(res.data))
                let tempObj = {}
                temp.forEach(item => {
                    tempObj[item.elementType] = {
                        selected: item.selected,
                        originParam: item.param,
                        param: item.param ? item.param.split(',') : []
                    }
                })
                setRuleInfo(tempObj)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 获取商品列表
    function getProductList (data) {
        setLoading(true)
        let param = {
            countryCode: basicInfo.countryCode,
            activityId,
            pageNum: 1,
            pageSize: 10
        }
        param = Object.assign(param, data || {})
        getActivityProductList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setProductTotal(res.data.total)
                setProductList(res.data.list)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 获取分组列表
    function getGroupList () {
        setLoading(true)
        getActivityGroup({activityId}).then(res => {
            setLoading(false)
            if (res.ret && res.ret.errCode === 0) {
                setGroupList(res.data.activityGroupInfos || [])
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    function onGroupSave (list) {
        updateActivityGroup({
            activityId,
            subjectId: basicInfo.subjectId,
            activityGroupInfos: list
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('更新成功')
                getGroupList()
            }
        })
    }


    return (
        <div className="activity-detail-wrapper">
            <Spin spinning={loading}>
                <div className="message-box basic-flex">
                    <div className="img-box">
                        <img src={dealShowFileSrc(basicInfo.image) || 'https://file.fingo.shop/fingo/webassets/goods.png'}/>
                    </div>
                    <div className="right-box">
                        <h5 className="activity-title">{basicInfo.name} <span>{basicInfo.subjectName}</span></h5>
                        <p>活动国家：<span>{filterCountry(basicInfo.countryCode)}</span></p>
                        <p>活动预热时间：<span>{customTimeFormat(basicInfo.preheatStartTime, 'YYYY-MM-DD HH:mm:ss')}</span></p>
                        <p>活动时间：<span>{`${customTimeFormat(basicInfo.startTime, 'YYYY-MM-DD HH:mm:ss')} ~ ${customTimeFormat(basicInfo.endTime, 'YYYY-MM-DD HH:mm:ss')}`}</span></p>
                        <p>活动说明：<span>{basicInfo.description}</span></p>
                    </div>
                </div>
                <Tabs defaultValue="product" className="message-box" type="card" onChange={handleTabChange}>
                    <TabPane key="basic" tab="基础信息">
                        { curTab == 'basic' && <ActivityBasicInfo
                            basicInfo={basicInfo}
                            onEdit={handleBasicEdit} countries={countries}/>
                        }
                    </TabPane>
                    <TabPane key="rule" tab="活动规则">
                        { curTab == 'rule' && <ActivityRuleInfo
                            activityId={activityId}
                            ruleInfo={ruleInfo}
                            basicInfo={basicInfo}
                            getRuleInfo={getRuleInfo}
                            getBasicInfo={getBasicInfo}
                            languages={languages}
                            PROMOTION_TYPE_OBJ={PROMOTION_TYPE_OBJ}
                            GROUP_RULE_LIST={GROUP_RULE_LIST}/>
                        }
                    </TabPane>
                    <TabPane key="product" tab="商品列表">
                        { curTab == 'product' && <ActivityProductInfo
                                preheat={basicInfo.preheat}
                                total={productTotal}
                                name={basicInfo.name}
                                activityId={activityId}
                                groupList={groupList}
                                languages={languages}
                                countryCode={basicInfo.countryCode}
                                productList={productList}
                                getList={getProductList}
                            />
                        }
                    </TabPane>
                    <TabPane key="group" tab="便捷分组">
                        {
                            curTab == 'group' &&
                            <ActivityGroupInfo
                                basicInfo={basicInfo}
                                groupList={groupList}
                                preheat={basicInfo.preheat}
                                onSave={onGroupSave}
                                FOLLOW_TYPE_OBJ={FOLLOW_TYPE_OBJ}
                                languages={languages}/>
                        }
                    </TabPane>
                </Tabs>
            </Spin>
        </div>
    )
}

export default ActivityDetail
