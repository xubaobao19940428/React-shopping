import { useState, useEffect } from 'react'
import ViewContainer from '@/components/ViewContainer'
import { useModel, history } from 'umi'
import { Tabs, Button, Spin, Modal, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getSubjectList, addSubject, delSubject, editSubject, getActivityList } from '@/services/marketing'
import CommonMode from './components/CommonMode'
import SpeedMode from './components/SpeedMode'
import SubjectModal from './components/SubjectModal'
import AddActivity from './components/AddActivity'
import commonEnum from './enum'
import './index.less'

const { TabPane } = Tabs
const { confirm } = Modal

const { ACTIVITY_STATUS_OBJ, NO_DEL_SUBJECT_NAME } = commonEnum

const ActivityManage = () => {
    const { countries, languages } = useModel('dictionary')
    const [mode, setMode] = useState('speed')
    const [loading, setLoading] = useState(false)
    const [showSubjectModal, setShowSubjectModal] = useState(false)
    const [subjectData, setSubjectData] = useState({})
    const [countryCode, setCountryCode] = useState('MY')
    const [subjectList, setSubjectList] = useState([])
    const [activityList, setActivityList] = useState([])
    const [isAddActivity, setIsAddActivity] = useState(false)
    const [subjectTotal, setSubjectTotal] = useState(0)
    const [activityTotal, setActivityTotal] = useState(0)
    const [curSubjectName, setCurSubjectName] = useState('')

    useEffect(() => {
        getSubjectData()
    }, [])

    function handleModeChange (val) {
        setMode(val)
        setCurSubjectName('') // 切换模式的时候，清空之前可能存在的专题名设置
        if (val === 'speed') {
            getSubjectData()
        } else {
            getActivityData()
        }
    }

    // 获取专题数据
    function getSubjectData (data) {
        setLoading(true)
        let param = {
            countryCode: countryCode,
            pageSize: 20,
            pageNum: 1
        }
        param = Object.assign(param, data || {})
        getSubjectList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setSubjectList(res.data.list)
                setSubjectTotal(res.data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    // 选择新建专题
    function handleAddSubject () {
        setSubjectData({countryCode})
        setShowSubjectModal(true)
    }
    // 选择编辑专题
    function handleSubjectEdit (item) {
        setSubjectData(Object.assign(item, {countryCode}))
        setShowSubjectModal(true)
    }
    // 删除专题
    function handleSubjectDel (id) {
        confirm({
            title: '提示',
            content: '此操作将删除所选专题，是否继续?',
            onOk() {    
                delSubject({
                    subjectId: id
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getSubjectData()
                    }
                })
            },
            onCancel() {
                message.info('已取消删除')
            }
        })
    }
    // 取消设置专题
    function handleSubjectModalCancel () {
        setShowSubjectModal(false)
    }
    // 确认修改、新增专题
    function handleSubjectModalConfirm (data) {
        if (data.subjectId) {
            editSubject(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowSubjectModal(false)
                    getSubjectData()
                }
            })
        } else {
            addSubject(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('创建成功')
                    setShowSubjectModal(false)
                    getSubjectData()
                }
            })
        }
    }
    // 选择专题，实际是切换成活动形式，并传参数。
    function handleSubjectSelected (item) {
        if (item.name === '爆款好物') {
            history.push({
                pathname: 'hotSaleDetail',
                query: { subjectId: item.subjectId }
            })
        } else if (item.name === '限时抢购') {
            history.push('flashSaleDetail')
        } else {
            setMode('common')
            setCurSubjectName(item.name) // 选择专题，同时还设置专题名，要注意清除专题名的设置
            getActivityData({
                subjectName: item.name
            })
        }
    }

    function handleAddActivity () {
        setIsAddActivity(true)
    }

    // 获取活动列表
    function getActivityData (data) {
        setLoading(true)
        let param = {
            countryCode,
            subjectName: curSubjectName,
            pageSize: 10,
            pageNum: 1
        }
        param = Object.assign({}, param, data || {})
        getActivityList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setActivityList(res.data.list)
                setActivityTotal(res.data.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 国家选择修改 
    function handleTabChange (val) {
        setCountryCode(val)
        if (mode === 'speed') {
            getSubjectData({
                countryCode: val
            })
        } else {
            getActivityData({
                countryCode: val
            })
        }
    }

    function handleCancelAdd () {
        setIsAddActivity(false)
    }

    function handleFinishAdd () {
        if (mode == 'common') {
            getActivityData()
        }
        setIsAddActivity(false)
    }

    const Operations = [
        <Select value={mode} onChange={handleModeChange} style={{ marginRight: 8 }} key="mode">
            <Select.Option value="speed">快捷模式</Select.Option>
            <Select.Option value="common">普通模式</Select.Option>
        </Select>,
        <Button icon={<PlusOutlined/>} onClick={handleAddActivity} style={{ marginRight: 8 }} key="addActivity" type="primary">新建活动</Button>,
        <Button icon={<PlusOutlined/>} onClick={handleAddSubject} key="addSubject" type="primary">新建专题</Button>
    ]

    return (
        <ViewContainer>
            <Spin spinning={loading}>
                {
                    isAddActivity ? <AddActivity onCancel={handleCancelAdd} onFinish={handleFinishAdd} languages={languages} countries={countries}/> : (
                        <Tabs activeKey={countryCode} tabBarExtraContent={Operations} onChange={handleTabChange} type="card" size="large">
                            {
                                countries.map(item => (
                                <TabPane key={item.shortCode} tab={item.nameCn}>
                                    {
                                        mode === 'speed' ? (
                                            <SpeedMode
                                                key="speed"
                                                dataList={subjectList}
                                                onEdit={handleSubjectEdit}
                                                onDel={handleSubjectDel}
                                                NO_DEL_SUBJECT_NAME={NO_DEL_SUBJECT_NAME}
                                                onSelected={handleSubjectSelected}
                                                getData={getSubjectData}
                                                total={subjectTotal}
                                            />
                                        ) : (
                                            <CommonMode
                                                key="common"
                                                ACTIVITY_STATUS_OBJ={ACTIVITY_STATUS_OBJ}
                                                dataList={activityList}
                                                getData={getActivityData}
                                                total={activityTotal}
                                                subjectName={curSubjectName}
                                            />
                                        )
                                    }
                                </TabPane>
                                ))
                            }
                        </Tabs>
                    )
                }
            </Spin>

            { showSubjectModal && <SubjectModal
                countries={countries}
                showSubjectModal={showSubjectModal}
                subjectData={subjectData}
                onCancel={handleSubjectModalCancel}
                onConfirm={handleSubjectModalConfirm}
            />}
        </ViewContainer>
    )
}

export default ActivityManage