import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/detail.less'
import { history } from 'umi'
import moment from 'moment'
import { AfterSaleInfo,GetUserBankList } from '@/services/order'
import { Button, Space, Form, Table, Input, Layout } from 'antd';
import SaleDetail from './components/DetailSale'
import { timestampToTime } from '@/utils';
import { dealShowFileSrc } from '@/utils/utils'
import AfterSaleStatus from './components/AfterSaleStatus'

/**
/*  
/*售后单详情
/*
*/
const { Header, Footer, Sider, Content } = Layout;

const AfterSaleDetail = () => {
    const [refund, setRefund] = useState({
        refundType: '',
        refundAmount: '',
        refundFreight: '',
        refundBankName: '',
        refundCardNo: '',
        refundCardholder: '',
        userId: '',
        currency: '',
        status: '',
        suborderId: '',
        skuId: '',
        refundProductAmount: '',
        mobile: '',
        email: ''
    })
    const [refundStatus, setRefundStatus] = useState({
        1: '待审核',
        2: '审核中',
        3: '待退款',
        4: '已退款',
        5: '已取消',
        6: '已驳回'
    })
    const [refundData, setRefundData] = useState({})
    const getDetail = () => {
        console.log(history.location.query.refundId)
        let params = {
            refundId: history.location.query.refundId
        }
        AfterSaleInfo(params).then(res => {
            if (res.ret.errcode === 1) {
                let refundData = {}
                refundData = Object.assign(res, {
                    applyTime: moment(Number(res.applyTime)).format('YYYY-MM-DD HH:mm:ss'),
                    payTime: moment(Number(res.payTime)).format('YYYY-MM-DD HH:mm:ss'),
                    deliveryTime: moment(Number(res.deliveryTime)).format('YYYY-MM-DD HH:mm:ss')
                })
                setRefundData(refundData)
                let refund = {}
                Object.assign(refund, {
                    refundType: res.refundType,
                    refundAmount: res.refundAmount,
                    refundFreight: res.refundFreight,
                    refundBankName: res.refundBankName,
                    refundCardNo: res.refundCardNo,
                    refundCardholder: res.refundCardholder,
                    userId: res.userId,
                    currency: res.currency,
                    refundId: history.location.query.refundId,
                    status: refundStatus[res.refundStatus],
                    refundStatus: res.refundStatus,
                    suborderId: res.suborderId,
                    orderId: res.orderId,
                    skuId: res.afterSaleProduct.skuId,
                    currency: res.currency,
                    refundProductAmount: res.refundProductAmount,
                    mobile: res.mobile,
                    email: res.email
                })
                setRefund(refund)

            }
        })
    }
    const onceArgin=()=>{
        getDetail()
    }
    const resetRefundData=(data)=>{
        console.log(data)
        let resetRefund= JSON.parse(JSON.stringify(refund))
        resetRefund = Object.assign(resetRefund,data)
        setRefund(resetRefund)
    }
    
    useEffect(() => {
        getDetail()
    },[])
    return (
        <div className={styles['container']}>
            <div className={styles['container-left']}>
                <SaleDetail refund={refund} refundData={refundData}></SaleDetail>
            </div>
            <div className={styles['container-right']}>
                <div className={styles['right-top']}>
                <AfterSaleStatus refund={refund} confirm={onceArgin} setAmount={(data)=>resetRefundData(data)}></AfterSaleStatus>
                </div>
                {/* 协商历史 */}
                <div className={styles['right-bottom']}>
                    <div className={styles["footer-title"]}>协商历史</div>
                     <div className={styles["footer-content"]}>
                        {
                            refundData.historyItem && refundData.historyItem.map((item, index) => {
                                return <div key={index} className={styles["history"]}>
                                    <div className={styles["item-title"]}>
                                        <div className={styles["item-mark"]}>{refundData.historyItem.length - index}</div>
                                        <div>{item.title}</div>
                                    </div>
                                    {
                                        item.operateTime && <div className={styles["operate-time"]}>{timestampToTime(Number(item.operateTime))}</div>
                                    }
                                    {
                                        item.historyEntry.map((val, index) => {
                                            return <div key={index} className={styles["entry"]}>
                                                {val}
                                            </div>
                                        })
                                    }
                                    {
                                        item.picture.length !== 0 && <div className={styles["certificate"]}>
                                            <div className={styles["entry"]}>售后凭证：</div>
                                            {
                                                item.picture.map((pic, index) => {
                                                    return <div key={index}>
                                                        <img src={dealShowFileSrc(pic)} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AfterSaleDetail