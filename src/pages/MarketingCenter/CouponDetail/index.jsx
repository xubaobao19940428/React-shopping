import React, { useState, useEffect, useCallback } from 'react'
import QueryTable from '@/components/QueryTable'
import { Descriptions, Button, message, Input } from 'antd'
import { history } from 'umi'
import ViewContainer from '@/components/ViewContainer'
import { getCouponDetail, addCouponPassword } from '@/services/coupon'
import { COUPON_TYPE_ENUM } from '../Coupon/enum'
import { secondTimeFormat, filterCurrencyUnit } from '@/utils/filter'
import assetsBaseUrl from '@/config/assetsBaseUrl'
import { Pie } from '@ant-design/charts'
import styles from './index.less'

const CouponDetail = () => {
    const [dataList, setDataList] = useState([])
    const [detailInfo, setDetailInfo] = useState({})
    const [password, setPassword] = useState('')
    const [page, setPage] = useState({
        pageNum: 10,
        pageSize: 1
    })
    const [couponId, setCouponId] = useState('')
    const [total, setTotal] = useState(0)
    const [pieConfig, setPieConfig] = useState({
        appendPadding: 10,
        data: [],
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
          type: 'spider',
          content: '{name}\n{percentage}',
        },
    })
    const columns = [{
        title: "优惠码",
        hideInForm: true
    }, {
        title: "领取用户ID",
        hideInForm: true
    }, {
        title: "领取方式",
        hideInForm: true
    }, {
        title: "优惠券有效期",
        hideInForm: true
    }, {
        title: "使用状态",
        hideInForm: true
    }, {
        title: "使用时间",
        hideInForm: true
    }, {
        title: "订单编号",
        hideInForm: true
    }]

    const getDataList = useCallback((data) => {
        let param = {
            ...page,
            name
        }
        param = Object.assign(param, data || {})
    }, [page])

    const getDetail = useCallback((couponId) => {
        getCouponDetail({id: couponId}).then(res => {
            if (res.ret.errCode == 0) {
                setDetailInfo(res.data)
                let temp = pieConfig
                let pieData = [{
                    type: '已领取',
                    value: res.data.elementMap.sendNumber || 0
                }, {
                    type: '未领取',
                    value: res.data.elementMap.totalNumber - res.data.elementMap.sendNumber
                }, {
                    type: '已使用',
                    value: res.data.useNumber || 0
                }, {
                    type: '未使用',
                    value: res.data.noUseNumber || 0
                }, {
                    type: '已过期',
                    value: res.data.overdueNumber || 0
                }]

                temp.data = pieData
                setPieConfig(temp)
            }
        })
    }, [])

    const getLangContext= useCallback((lang) => {
        let name = detailInfo.name ? JSON.parse(detailInfo.name) : {}

        return name[lang]
    }, [detailInfo])

    // 提交优惠券口令
    const handleAddCouponPassword = useCallback(() => {
        addCouponPassword({
            id: detailInfo.passwordId,
            password
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('添加口令成功')
                getDetail(couponId)
            }
        })
    }, [detailInfo, password])

    useEffect(() => {
        let query = history.location.query || {}
        let couponId = parseInt(query.couponId)
        if (couponId) {
            setCouponId(couponId)
            getDetail(couponId)
        }
    }, [])

    return (
        <ViewContainer>
            {/* 头部按钮操作区 */}
            <div className={styles.headBox}>
                <Button type="primary" onClick={() => history.goBack()} className={styles.mr8}>返回</Button>
                <Button type="primary" className={styles.mr16}>生成二维码</Button>
                <Input placeholder="输入数字、字母，区分大小写" style={{width: '200px'}} className={styles.mr8} onChange={(e) => {
                    let val = e.target.value
                    console.log(val)
                    setPassword(val)
                }}/>
                <Button type="primary" onClick={() => handleAddCouponPassword()}>提交</Button>
            </div>

            {/* 内容区域 */}
            <div className={styles.contentBox}>
                <Descriptions column={2}>
                    <Descriptions.Item label="中文名称">{getLangContext('cn')}</Descriptions.Item>
                    <Descriptions.Item label="英文名称">{getLangContext('en')}</Descriptions.Item>
                    <Descriptions.Item label="优惠券类型">{COUPON_TYPE_ENUM[detailInfo.couponType]}</Descriptions.Item>
                    <Descriptions.Item label="优惠内容">{
                        <>
                            {(detailInfo.couponType == 1 || detailInfo.couponType == 5) && (
                                `${filterCurrencyUnit(detailInfo.countryCode)}${detailInfo.amount}（满${filterCurrencyUnit(detailInfo.countryCode) || ' '}${detailInfo.fullAmount || 0}）`
                            )}
                            {detailInfo.couponType == 2 && `优惠${detailInfo.amount}%`}
                            {detailInfo.couponType == 3 && filterCurrencyUnit(detailInfo.countryCode) + detailInfo.amount}
                            {detailInfo.couponType == 4 && '免邮'}
                        </>
                    }</Descriptions.Item>
                    <Descriptions.Item label="优惠口令">{detailInfo.password}</Descriptions.Item>
                    <Descriptions.Item label="总发行量">{detailInfo.elementMap && detailInfo.elementMap.totalNumber}</Descriptions.Item>
                    <Descriptions.Item label="已发行量">{detailInfo.elementMap && detailInfo.elementMap.sendNumber}</Descriptions.Item>
                    <Descriptions.Item label="优惠券ID">{detailInfo.id}</Descriptions.Item>
                    <Descriptions.Item label="链接点击次数">{detailInfo.clickNum}</Descriptions.Item>
                    <Descriptions.Item label="优惠券链接">{`${assetsBaseUrl}couponId=${detailInfo.couponNo}`}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{secondTimeFormat(detailInfo.created)}</Descriptions.Item>
                    <Descriptions.Item label="优惠券有效期">{detailInfo.timeType == 1 ? `${secondTimeFormat(detailInfo.startTime)} ~ ${secondTimeFormat(detailInfo.endTime)}` : `发放之日起${detailInfo.day}天`}</Descriptions.Item>
                    <Descriptions.Item label="商品范围"></Descriptions.Item>
                    <Descriptions.Item label="用户范围"></Descriptions.Item>
                </Descriptions>

                <Pie {...pieConfig}/>
            </div>

            {/* 用户领取该优惠券记录 */}
            <QueryTable
                tableItemCenter
                dataSource={dataList}
                columns={columns}
                tableProps={{
                    bordered: true,
                    rowKey: 'id',
                }}
                onQuery={(param) => {
                    getDataList(param)
                }}
            />
        </ViewContainer>
    )
}

export default CouponDetail;