import React, {useEffect, useState} from 'react'
import { useModel } from 'umi'
import {RedoOutlined} from "@ant-design/icons";
import { Tabs, Form, Input, Button, message } from 'antd'
import ViewContainer from '@/components/ViewContainer'
import styles from '@/global.less'
const { TabPane } = Tabs
import { addTriggerUrl, fetchTriggerUrl, bonusPoolsUpdate } from '@/services/shake.js'

const pageContainer = () => {
    const { countries } = useModel('dictionary') // 国家列表
    const [shakeGoldExchange, setShakeGoldExchange] = useState('') // 金币
    const [pointsUrl, setPointsUrl] = useState('') // shop跳转
    const [shakeWithdraw, setShakeWithdraw] = useState('') // withdraw跳转
    const [countryCode, setCountryCode] = useState('MY')
    const [updateLoading, setUpdateLoading] = useState(false)

    // 设置state值
    function setData(val, funcName) {
        funcName(val)
    }
    function init() {
        getGoldExchangeUrl()
        getTriggerUrl()
        getShakeWithdraw()
    }
    // 国家切换
    function handleCountryChange(key) {
        setCountryCode(key)
    }

    // 获取金币兑换
    function getGoldExchangeUrl () {
        fetchTriggerUrl({
            keyword: 'shakeGoldExchange' + countryCode
        }).then((res) => {
            if (res.ret.errCode === 0) {
                setShakeGoldExchange(res.data.value)
            }
        })
    }
    // 金币保存
    function saveShakeGoldExchange () {
        addTriggerUrl({
            keyword: 'shakeGoldExchange' + countryCode,
            value: shakeGoldExchange
        }).then((res) => {
            if (res.ret.errCode === 0) {
                message.success('保存成功')
            }
        })
    }
    // 更新奖池
    function updatePrizePool () {
        setUpdateLoading(true)
        bonusPoolsUpdate({
            countryCode: countryCode
        }).then((res) => {
            setUpdateLoading(false)
            if (res.ret.errCode === 0) {
                message.success('更新成功')
            }
        }).catch(() => {
            setUpdateLoading(false)
        })
    }
    // shop跳转
    function getTriggerUrl () {
        fetchTriggerUrl({
            keyword: 'shakePointsUrl' + countryCode
        }).then((res) => {
            if (res.ret.errCode === 0) {
                setPointsUrl(res.data.value)
            }
        })
    }
    function savePointsUrl () {
        addTriggerUrl({
            keyword: 'shakePointsUrl' + countryCode,
            value: pointsUrl
        }).then((res) => {
            if (res.ret.errCode === 0) {
                message.success('保存成功')
            }
        })
    }
    // withdraw跳转
    function getShakeWithdraw () {
        fetchTriggerUrl({
            keyword: 'shakeWithdraw' + countryCode
        }).then((res) => {
            if (res.ret.errCode === 0) {
                setShakeWithdraw(res.data.value)
            }
        })
    }
    function saveShakeWithdraw () {
        addTriggerUrl({
            keyword: 'shakeWithdraw' + countryCode,
            value: shakeWithdraw
        }).then((res) => {
            if (res.ret.errCode === 0) {
                message.success('保存成功')
            }
        })
    }

    useEffect(() => {
        init()
    }, [countryCode])

    return (
        <ViewContainer>
            <Tabs defaultActiveKey={countryCode} onTabClick={handleCountryChange}>
                {
                    countries.map((item) =>
                        <TabPane key={item.shortCode} tab={item.nameLocal}></TabPane>
                    )
                }
            </Tabs>
            <Form layout={'inline'}>
                <Form.Item label="金币兑换：">
                    <Input value={shakeGoldExchange} onChange={(e) => {setData(e.target.value, setShakeGoldExchange)}}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" onClick={saveShakeGoldExchange}>保存</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updateLoading} onClick={updatePrizePool}>
                        <RedoOutlined />
                        更新数据
                    </Button>
                </Form.Item>
            </Form>
            <Form layout={'inline'} className={styles['mar-t-10']}>
                <Form.Item label="shop跳转：">
                    <Input value={pointsUrl} onChange={(e) => {setData(e.target.value, setPointsUrl)}}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" onClick={savePointsUrl}>保存</Button>
                </Form.Item>
            </Form>
            <Form layout={'inline'} className={styles['mar-t-10']}>
                <Form.Item label="withdraw跳转：">
                    <Input value={shakeWithdraw} onChange={(e) => {setData(e.target.value, setShakeWithdraw)}}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" onClick={saveShakeWithdraw}>保存</Button>
                </Form.Item>
            </Form>
        </ViewContainer>
    )
}

export default pageContainer
