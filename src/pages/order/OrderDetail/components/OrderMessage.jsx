import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import enmu from '../../Enmu'
import { useModel } from 'umi';
import styles from './styles/OrderMessage.less'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import { changeToBuyers } from '@/services/order';

const OrderMessage = (props) => {
    const { orderInfo, orderNo, refresh } = props
    const { userLevel, statusFilter, payWay, orderTypeEnum } = enmu;
    const { countries, languages } = useModel('dictionary');
    console.log(orderInfo)
    const changeDelivery = () => {
        changeToBuyers({orderId: orderNo}).then(res => {
            if (res.ret.errcode === 1) {
                message.success('自提成功')
                refresh()
            }
        })
    }
    return(
        <div className={styles.orderMessage}>
            <div>
                <div><span>订单编号：</span>{ orderNo }</div>
                <div><span>订单国家：</span>{ filterCountry(orderInfo.countryCode) }</div>
                <div><span>订单状态：</span>{ statusFilter[orderInfo.orderStatus] }</div>
                <div><span>订单类型：</span>{ orderTypeEnum[orderInfo.orderType]}</div>
                <div>
                    <span>配送方式：</span>
                    快递 
                    <Button type="primary" size="small" className={styles.btn} onClick={() => {changeDelivery()}}>改为自提</Button>
                </div>
                <div><span>下单时间：</span>{ secondTimeFormat(orderInfo.createTime) }</div>
                <div><span>支付时间：</span>{ secondTimeFormat(orderInfo.payTime) }</div>
                <div><span>收货时间：</span>{ secondTimeFormat(orderInfo.receiveTime) }</div>
            </div>
            <div>
                <div><span>订单总价：</span>{ orderInfo.currency + ' ' + orderInfo.totalAmount }</div>
                <div><span>积分抵扣：</span>{ orderInfo.currency + ' ' + orderInfo.usePoints }</div>
                <div><span>实付金额：</span>{ orderInfo.paied ? (orderInfo.paiedCurrency + ' ' + orderInfo.paied) : '-'}</div>
                <div><span>支付交易号：</span>{ orderInfo.transCode || '-' }</div>
                <div><span>支付方式：</span>{ payWay[orderInfo.payWay] || '-' }</div>
                <div><span>支付商户：</span>{ orderInfo.paySupplier || '-'  }</div>
            </div>
            <div>
                <div><span>买家账号：</span>{ orderInfo.nickname }({ orderInfo.userId })</div>
                <div><span>买家等级：</span>{ userLevel[orderInfo.userLevel] }</div>
                <div><span>上级账号：</span>{ orderInfo.parentId ? ( orderInfo.parentNick  + '(' + orderInfo.parentId +  ') ') : '-'}</div>
                <div><span>上级等级：</span>{ orderInfo.parentLevel ? userLevel[orderInfo.parentLevel] : '-' }</div>
            </div>
        </div>
    )
}

export default OrderMessage
