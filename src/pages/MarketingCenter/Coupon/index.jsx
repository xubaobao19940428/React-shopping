import { useState } from 'react'
import ViewContainer from '@/components/ViewContainer'
import { Tabs } from 'antd'
import { useModel } from 'umi'
import CouponList from './components/couponList'
import CouponPackageList from './components/couponPackageList'
import ReturnCouponList from './components/ReturnCouponList'
import CouponLimitList from './components/CouponLimitList'
import CouponSearchList from './components/CouponSearchList'
import { HandlerRole } from 'dnd-core'

const { TabPane } = Tabs

const Coupon = () => {
    const [curTab, setCurTab] = useState('couponManage')
    const { countries, languages } = useModel('dictionary')
    function handleTabChange (val) {
        setCurTab(val)
    }
    return (
        <ViewContainer>
            <Tabs defaultActiveKey="couponManage" type="card" onChange={handleTabChange}>
                <TabPane key="couponManage" tab="优惠券管理">
                    <CouponList countries={countries}/>
                </TabPane>
                <TabPane key="couponPackage" tab="优惠券包管理">
                    <CouponPackageList countries={countries}/>
                </TabPane>
                <TabPane key="returnCoupon" tab="商品返券">
                    <ReturnCouponList countries={countries}/>
                </TabPane>
                <TabPane key="couponLimit" tab="用券限制">
                    <CouponLimitList countries={countries}/>
                </TabPane>
                <TabPane key="couponSearch" tab="优惠券查询">
                    <CouponSearchList countries={countries}/>
                </TabPane>
            </Tabs>
        </ViewContainer>
    )
}

export default Coupon