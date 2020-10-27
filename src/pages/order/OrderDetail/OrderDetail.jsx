import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/OrderDetail.less'
import { Button, Card} from 'antd';
import { history } from 'umi';
import { viewOrderDetail } from '@/services/order';
import ViewContainer from '@/components/ViewContainer';
import OrderProgress from './components/OrderProgress';
import OrderMessage from './components/OrderMessage';
import ProductMessage from './components/ProductMessage';
import SubOrderMessage from './components/SubOrderMessage';
import DeliveryMessage from './components/DeliveryMessage';
import PointMessage from './components/PointMessage'

const OrderDetail = () => {
    const [orderId, setOrderId] = useState('')
    const [orderInfo, setOrderInfo] = useState({
        totalAmount: '',
        usePoints: '',
        nickname: '',
        userId: '',
        orderStatus: '',
        paied: '',
        userLevel: '',
        orderType: '',
        transCode: '',
        parentNick: '',
        parentId: '',
        parentLevel: '',
        payWay: '',
        createTime: '',
        paySupplier: '',
        payTime: '',
        receiveTime: '',
        paiedCurrency: '',
        currency: ''
    })
    const [productInfo, setProductInfo] = useState({
        productItem: [],
        totalPrice: '',
        coupon: '',
        promotion: '',
        payable: ''
    })
    const [receiverInfo, setReceiverInfo] = useState({
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        remark: '',
        cityCode: '',
        stateCode: '',
        postcode: ''
    })
    const [pointsInfo, setPointsInfo] = useState({
        title: [],
        skuPointsInfo: [],
        pointsVerticalSum: [],
        pointsHorizontalSum: []
    })
    const getDetail = () => {
        let orderId = history.location.query.orderId;
        setOrderId(orderId)
        viewOrderDetail({orderId}).then(res => {
            console.log(res)
            if (res.ret.errcode === 1) {
                setOrderInfo({
                    ...orderInfo,
                    ...res.orderInfo
                })
                setProductInfo({
                    ...productInfo,
                    ...res.productInfo 
                })
                setReceiverInfo({
                    ...receiverInfo,
                    ...res.receiverInfo
                })
                setPointsInfo({
                    ...pointsInfo,
                    ...res.pointsInfo
                })
            }
        })
    }
    useEffect(()=>{
        getDetail()
    },[])
    return (
        <ViewContainer>
            <Card bordered className={styles.orderCard}>
                <OrderProgress orderId={orderId}></OrderProgress>
            </Card>
            <Card bordered title="订单信息" className={styles.orderCard}>
                <OrderMessage orderInfo={orderInfo} orderNo={orderId} refresh={getDetail}></OrderMessage>
            </Card>
            <Card bordered title="商品信息" className={styles.orderCard}>
                <ProductMessage orderInfo={orderInfo} productInfo={productInfo}></ProductMessage>
            </Card>
            <Card bordered title="子单信息" className={styles.orderCard}>
                <SubOrderMessage orderId={orderId}></SubOrderMessage>
            </Card>
            <Card bordered title="收货信息" className={styles.orderCard}>
                <DeliveryMessage receiverInfo={receiverInfo} orderInfo={orderInfo} orderId={orderId}></DeliveryMessage>
            </Card>
            <Card bordered title="积分信息" className={styles.orderCard}>
                <PointMessage pointsInfo={pointsInfo}></PointMessage>
            </Card>
        </ViewContainer>
    )
}

export default OrderDetail