import React, { useState, useCallback } from 'react'
import { Form, Descriptions, Table } from 'antd'
import { history } from 'umi'
import ViewContainer from '@/components/ViewContainer'
import styles from './index.less'
import { getCouponPackageDetail } from '@/service/coupon'

const CouponPackageDetail = () => {
    const columns = [{
        title: "优惠券ID",
        width: 200,
        fixed: "left"
    }, {
        title: "中文名称",
        width: 160
    }, {
        title: "英文名称",
        width: 160
    }, {
        title: "类型",
        width: 100
    }, {
        title: "链接",
        width: 220
    }, {
        title: "使用范围",
        width: 140
    }, {
        title: "优惠券有效期",
        width: 280
    }, {
        title: "创建时间",
        width: 180
    }, {
        title: "状态",
        width: 120
    }, {
        title: '操作',
        width: 140,
        fixed: 'right',
        render: (_, item) => (
            <Button type="link" onClick={() => handleDetail(item)}>详情</Button>
        )
    }]

    const handleDetail = useCallback((item) => {
        history.push({
            pathname: 'couponDetail',
            query: {
                couponId: item.id
            }
        })
    }, [])

    const getDetail = useCallback((data) => {
        
    })

    return (
        <ViewContainer>
            {/* 头部按钮操作区 */}
            <div className={styles.headBox}>
                <Button type="primary" onClick={() => history.goBack()} className={styles.mr8}>返回</Button>
                <Button type="primary" className={styles.mr16}>生成二维码</Button>
                <Input placeholder="输入数字、字母，区分大小写" style={{width: '200px'}} className={styles.mr8} onChange={(e) => {
                    let val = e.target.value
                    setPassword(val)
                }}/>
                <Button type="primary" onClick={() => handleAddCouponPassword()}>提交</Button>
            </div>

            {/* 内容区 */}
            <div className={styles.contentBox}>
                <Descriptions column={2}>
                    <Descriptions.Item label="优惠券包" span={1}>{}</Descriptions.Item>
                    <Descriptions.Item label="优惠券ID"></Descriptions.Item>
                    <Descriptions.Item label="数量">{COUPON_TYPE_ENUM[detailInfo.couponType]}</Descriptions.Item>
                    <Descriptions.Item label="中文名称">{COUPON_TYPE_ENUM[detailInfo.couponType]}</Descriptions.Item>
                    <Descriptions.Item label="英文名称">{COUPON_TYPE_ENUM[detailInfo.couponType]}</Descriptions.Item>
                    <Descriptions.Item label="链接" span={1}>{detailInfo.password}</Descriptions.Item>
                    <Descriptions.Item label="点击次数"></Descriptions.Item>
                    <Descriptions.Item label="口令"></Descriptions.Item>
                </Descriptions>
            </div>

            {/* 券包包含的优惠券表格区 */}
            <Table

            />
        </ViewContainer>
    )
}