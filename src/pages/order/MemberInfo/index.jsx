import React, { useState, useCallback, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Select, Input, Button, Tabs } from 'antd';
import { history } from 'umi'
import BaseInfo from './components/BaseInfo'
import ReceivingAddressList from './components/ReceivingAddressList'
import BankCardList from './components/BankCardList'
import FavoriteList from './components/FavoriteList'
import TeamMemberList from './components/TeamMemberList'
import TeamMemberOrderList from './components/TeamMemberOrderList'
import OrderList from './components/OrderList'
import CouponList from './components/CouponList'
import { setUserInfo } from '@/utils/auth';
import { getUserManageInfo,getFatherChain } from '@/services/user'
import { FormInstance } from 'antd/lib/form';
import { resolve } from '@/proto/proto';
import { reject } from 'lodash';
const { TabPane } = Tabs;
/**
 * 用户详细信息
 * 
 */
const MemberInfo = () => {
    const callback = (value) => {
        setDefault(value)
        if(value=='receivingAddressList'){
            getList()
        }else if(value=='bankCardList'){
            setTimeout(()=>{
                bankCardListRef.current.getBankList()
            })
        }else if(value=='favoriteList'){
            setTimeout(()=>{
                favoriteListRef.current.getFavoriteList()
            })
        }else if(value=='teamMemberList'){
            setTimeout(()=>{
                teamMemberListRef.current.getTeamData()
            })
        }else if(value=='teamOrderList'){
            setTimeout(()=>{
                teamMemberOrderListRef.current.getTeamOrderData()
            })
        }else if(value=='couponList'){
            setTimeout(() => {
                couponListRef.current.getCouponList()
            });
        }else if(value=='orderList'){
            setTimeout(()=>{
                orderListRef.current.getOrderList()
            })
        }
    }
    const [memberLevel,setMemberLevel]= useState({
        2: 'SH',
        3: 'PS',
        4: 'AM',
        5: 'AT'
    })
    
    const [defaultValue, setDefault] = useState('memberInfo')
    const [userInfo, setUserInfo] = useState([])
    const [memberActiveInfo, setMemberActiveInfo] = useState([])
    const [chainList,setChainList] = useState([])
    //收货地址
    const receiveRef = useRef()
    //银行卡信息
    const bankCardListRef = useRef()
    //收藏列表
    const favoriteListRef = useRef()
    //团队成员列表
    const teamMemberListRef = useRef()
    //团队订单列表
    const teamMemberOrderListRef = useRef()
    //优惠劵列表
    const couponListRef = useRef()
    //订单列表
    const orderListRef = useRef()
    const getUserDetail = () => {
        let params = {
            // userId: history.location.query.userId
            userId: '11204447'
        }
        getUserManageInfo(params).then((response) => {
            let res = response
            console.log(res)
            if (res.userManagePb) {
                setUserInfo(res.userManagePb)
            }
            let memberActiveInfo = [{
                lastLoginTime: '-',
                lastBuyTime: '-',
                usedCoupon: '-',
                hasCoupon: '-',
                invalidCoupon: '-'
            }]
            memberActiveInfo[0].lastLoginTime = res.userManagePb.lastLoginTime
            memberActiveInfo[0].lastBuyTime = res.userManagePb.lastBuyTime
            setMemberActiveInfo(memberActiveInfo)
        }).catch((err) => {
            console.error(err)
        })
    }
    const getFatherChainList = () => {
        let params = {
            userId: history.location.query.userId
            // userId: '11204447'
        }
        getFatherChain(params).then((response) => {
            let res = response
            let chainList=[]
            chainList = res.userFatherPb
            chainList.map(item=>{
                item.memberLevel = memberLevel[item.memberLevel]
            })
            setChainList(chainList)
        }).catch((err) => {
            console.error(err)
        })
    }
    //用户收获地址
    const getList =  ()=>{
        setTimeout(()=>{
            receiveRef.current.receiveList()
        })   
    }
    useEffect(() => {
        if(defaultValue=='memberInfo'){
            getUserDetail(),
          getFatherChainList()
        }
    }, [defaultValue])
    return (
        <ViewContainer>
            
            <Tabs defaultActiveKey={defaultValue} onChange={callback}>
                <TabPane tab="会员详情" key="memberInfo">
                    <BaseInfo basicInfo={userInfo} memberActiveInfo={memberActiveInfo} cardLists={chainList}></BaseInfo>
                </TabPane>
                <TabPane tab="团队成员列表" key="teamMemberList">
                    <TeamMemberList ref={teamMemberListRef}></TeamMemberList>
                </TabPane>
                <TabPane tab="团队订单列表" key="teamOrderList">
                 <TeamMemberOrderList ref={teamMemberOrderListRef}></TeamMemberOrderList>
                </TabPane>
                <TabPane tab="收货地址列表" key="receivingAddressList">
                    <ReceivingAddressList ref={receiveRef}></ReceivingAddressList>
                </TabPane>
                <TabPane tab="订单列表" key="orderList">
                    <OrderList ref={orderListRef}></OrderList>
                </TabPane>
                <TabPane tab="银行卡信息列表" key="bankCardList">
                    <BankCardList ref={bankCardListRef}></BankCardList>
                </TabPane>
                <TabPane tab="优惠券列表" key="couponList">
                    <CouponList ref={couponListRef}></CouponList>
                </TabPane>
                <TabPane tab="收藏列表" key="favoriteList">
                    <FavoriteList ref={favoriteListRef}></FavoriteList>
                </TabPane>
            </Tabs>
        </ViewContainer>
    )
}

export default MemberInfo;

