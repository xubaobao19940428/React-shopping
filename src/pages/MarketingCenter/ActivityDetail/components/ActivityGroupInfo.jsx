import React, { useState, useEffect } from 'react'
import { Input, DatePicker, Radio, Button, message } from 'antd'
import { CloseOutlined, PlusOutlined, MenuOutlined } from '@ant-design/icons'
import { DragTable } from '@/components'
import { customTimeFormat } from '@/utils/filter'
import moment from 'moment'

const ActivityGroupInfo = (props) => {
    const { FOLLOW_TYPE_OBJ, languages, preheat, groupList, onSave, basicInfo } = props
    const [loading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        let list = JSON.parse(JSON.stringify(groupList))
        setDataList(list)
    }, [groupList])

    const columns = [{
        title: '分组名称',
        width: 160,
        key: 'name',
        align: 'center',
        fixed: 'left',
        render: (text, item, index) => (
            <Input 
                value={item.name} 
                onChange={(e) => handleParamChange({'name': e.target.value}, index)} 
                style={{ width: 140 }}
            />
        )
    }, {
        title: '分组ID',
        width: 140,
        align: 'center',
        key: 'id',
        dataIndex: 'id'
    }, {
        title: '活动时间',
        width: 140,
        key: 'follow',
        render: (text, item, index) => (
            <Radio.Group value={item.follow} onChange={(e) => handleParamChange({'follow': e.target.value}, index)}>
                {
                    Object.keys(FOLLOW_TYPE_OBJ).map(followItem => (
                        <Radio value={parseInt(followItem)} key={followItem}>{FOLLOW_TYPE_OBJ[followItem]}</Radio>
                    ))
                }
            </Radio.Group>
        )
    }, {
        title: '预热时间',
        align: 'center',
        key: 'preheatStartTime',
        width: 240,
        className: preheat ? '' : 'hidden',
        render: (text, item, index) => (
            <>
                {
                    item.follow == 0 ? (
                        <DatePicker 
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                            value={item.preheatStartTime ? moment(parseInt(item.preheatStartTime)) : null} 
                            placeholder="请输入预热时间"
                            onChange={(val) => handleParamChange({'preheatStartTime': val}, index)}
                        />
                    ) : customTimeFormat(basicInfo.preheatStartTime, 'YYYY-MM-DD HH:mm:ss')
                }
            </>
        )
    }, {
        title: '开始时间',
        width: 260,
        align: 'center',
        key: 'startTime',
        render: (text, item, index) => (
            <>
                {
                    item.follow == 0 ? (
                        <DatePicker 
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                            value={item.startTime ? moment(parseInt(item.startTime)) : null} 
                            placeholder="请输入开始时间"
                            onChange={(val) => handleParamChange({'startTime': val}, index)}
                        />
                    ) : customTimeFormat(basicInfo.startTime, 'YYYY-MM-DD HH:mm:ss')
                }
            </>
        )
    }, {
        title: '结束时间',
        width: 260,
        align: 'center',
        key: 'endTime',
        render: (text, item, index) => (
            <>
                {
                    item.follow == 0 ? 
                    <DatePicker 
                        showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} 
                        value={item.endTime ? moment(parseInt(item.endTime)) : null} 
                        placeholder="请输入结束时间"
                        onChange={(val) => handleParamChange({'endTime': val}, index)}
                    /> : customTimeFormat(basicInfo.endTime, 'YYYY-MM-DD HH:mm:ss')
                }
            </>
        )
    }, {
        title: '营销文案',
        width: 300,
        align: 'center',
        key: 'promotionDesc',
        render: (text, item, index) => (
            <ul>
                {
                    languages.map((lang, subIndex) => (
                        <li key={lang.code + 'desc'} style={{ marginBottom: 4 }}>
                            <span className="group-desc">{lang.desc}</span> 
                            <Input 
                                key={lang.code + 'desc'}
                                value={item.promotionDesc[lang.code]} 
                                onChange={(e) => handleLangParamChange('promotionDesc', e, lang.code, index)}
                                style={{ width: '62%' }}
                        /></li>
                    ))
                }
            </ul>
        )
    }, {
        title: '商品角标',
        width: 300,
        align: 'center',
        key: 'productCorner',
        render: (text, item, index) => (
            <ul>
                {
                    languages.map((lang, subIndex) => (
                        <li key={lang.code + 'corner'} style={{ marginBottom: 4 }}>
                            <span className="group-desc">{lang.desc}</span> 
                            <Input 
                                key={lang.code + 'corner'}
                                value={item.productCorner[lang.code]} 
                                onChange={(e) => handleLangParamChange('productCorner', e, lang.code, index)}
                                style={{ width: '62%' }}
                            />
                        </li>
                    ))
                }
            </ul>
        )
    }, {
        title: '操作',
        key: 'action',
        align: 'center',
        fixed: 'right',
        render: (text, item, index) => (
            <div className="no-pre">
                <MenuOutlined style={{ marginRight: 8, color: '#409eff' }}/>
                <CloseOutlined onClick={() => handleDel(index)} style={{ marginRight: 8, color: '#409eff' }}/>
                <PlusOutlined onClick={() => handleAdd(index)} style={{ color: '#409eff' }}/>
            </div>
        )
    }]

    function handleLangParamChange (param, e, code, index) {
        let data = [...dataList]
        let list = data[index][param]
        list[code] = e.target.value

        setDataList(data)
    }

    function handleParamChange (param, index) {
        let data = [...dataList]
        data[index] = Object.assign(data[index], param)

        setDataList(data)
    }

    function handleAdd (index) {
        let list = [...dataList]
        let param = {
            name: '',
            follow: 1,
            preheatStartTime: null,
            startTime: null,
            endTime: null,
            promotionDesc: {},
            productCorner: {}
        }

        if (index >= 0) {
            list.splice(index + 1, 0, param)
        } else {
            list.push(param)
        }

        setDataList(list)
    }

    function handleDel (index) {
        let list = [...dataList]
        list.splice(index, 1)

        setDataList(list)
    }

    function handleSave () {
        let list = [...dataList]
        let resList = []
        let len = list.length
        let flag = true
        for(let i = 0; i < len; i++) {
            let item = list[i]
            if (item.name) {
                // 分组的时间可以不填，但是填写的话需要校验
                // if (item.startTime && item.endTime && (moment(item.startTime).isAfter(item.endTime, 'second'))) {
                //     message.error(`【${item.name}】分组的开始时间须不大于结束时间`)
                //     flag = false
                //     break
                // }
                if (item.preheatStartTime) {
                    // if (item.startTime && (item.preheatStartTime.isAfter(item.startTime, 'second'))) {
                    //     message.error(`【${item.name}】分组的预热时间须不大于开始时间`)
                    //     flag = false
                    //     break
                    // }
                    item.preheatStartTime = moment(item.preheatStartTime).valueOf()
                }
                item.startTime = item.startTime ? moment(item.startTime).valueOf() : null
                item.endTime = item.endTime ? moment(item.endTime).valueOf() : null
                resList.push(item)
            }
        }

        if (flag) {
            onSave(resList)
        }
    }

    function handleSortChange (data) {
        setDataList(data)
    }

    return (
        <div className="activity-group-info-wrapper">
            <div className="btn-box">
                <Button onClick={() => handleAdd(-1)} style={{ marginRight: 8 }} icon={<PlusOutlined />}>新增</Button>
                {!!dataList.length && <Button type="primary" onClick={handleSave}>保存</Button>}
            </div>

            <DragTable 
                style={{ marginTop: 8 }}
                scroll={{ x: '100%' }}
                columns={columns}
                dataSource={dataList}
                change={handleSortChange}
                pagination={false}
                rowKey="id"
            />
        </div>
    )
}

export default React.memo(ActivityGroupInfo)