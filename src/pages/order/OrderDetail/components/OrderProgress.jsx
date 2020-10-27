import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/OrderProgress.less'
import { Button, Card, Progress } from 'antd';
import { OrderStatusFlow } from '@/services/order';
import { secondTimeFormat } from '@/utils/filter'

const OrderProgress = (props) => {
    const { orderId } = props
    const nowTime = (new Date()).valueOf()
    const [timeList, setTimeList] = useState([])

    const getOrderStatusFlow = () => {
        OrderStatusFlow({orderId}).then(res => {
            if (res.ret.errcode === 1) {
                console.log(res)
                setTimeList(res.flowInfo)
            }
        })
    }
    const formatSecondsTo = (now, ms) => {
        let mss = Number(now) - ms
        let duration
        let days = parseInt(mss / (1000 * 60 * 60 * 24))
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
        let seconds = parseInt((mss % (1000 * 60)) / 1000)
        if (days > 0)  duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
        else if (hours > 0)  duration = hours + "小时" + minutes + "分" + seconds + "秒"
        else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
        else if (seconds > 0) duration = seconds + "秒"
        return duration
    }
    useEffect(()=>{
        if (orderId !== '') {
            getOrderStatusFlow()
        }
    },[orderId])
    return (
        <div className={styles['order-progress']}>
            <div className={styles['progress-box']}>
                <div className={styles['progress-line']}>
                    <div className={styles['progress-title']}>提交订单</div>
                    <div className={styles['progress-time']}>{ timeList.length==0?'-':timeList[0] && secondTimeFormat(timeList[0].time[0]) }</div>
                    <div className={styles["progress-show"]}>
                        { !(timeList.length == 0) && <div className={styles["push-b"]}></div> }
                        { timeList.length == 0 && <div className={styles["push-g"]}></div> }
                        <Progress percent={timeList.length==0?0:timeList.length==1?50:99.9} showInfo={false} strokeColor="#409eff"></Progress>
                    </div>
                    <div className={styles['progress-continue']}>{timeList.length==0?'':timeList.length==1?formatSecondsTo(nowTime,timeList[0].time[0]):formatSecondsTo(timeList[1].time[0],timeList[0].time[0])}</div>
                </div>
                <div className={styles['progress-line']}>
                    <div className={styles['progress-title']}>确认支付</div>
                    <div className={styles['progress-time']}>{ timeList.length==1?'-':timeList[1] && secondTimeFormat(timeList[1].time[0]) }</div>
                    <div className={styles["progress-show"]}>
                        { !(timeList.length <= 1) && <div className={styles["push-b"]}></div> }
                        { timeList.length <= 1 && <div className={styles["push-g"]}></div> }
                        <Progress percent={timeList.length<=1?0:timeList.length==2?50:99.9} showInfo={false} strokeColor="#409eff"></Progress>
                    </div>
                    {timeList.length==1 && <div className={styles["progress-continue"]}>{''}</div>}
                    {timeList.length==2 && <div className={styles["progress-continue"]}>{formatSecondsTo(nowTime,timeList[1].time[0])}</div>}
                    {timeList.length>2 && <div className={styles["progress-continue"]}>{formatSecondsTo(timeList[2].time[0],timeList[1].time[0])}</div>}
                </div>
                <div className={styles['progress-line']}>
                    <div className={styles['progress-title']}>发货</div>
                    <div className={styles['progress-time']}>{ timeList.length===2?'-':timeList[2] && secondTimeFormat(timeList[2].time[0]) }</div>
                    <div className={styles["progress-show"]}>
                        { !(timeList.length <= 2) && <div className={styles["push-b"]}></div> }
                        { timeList.length <=2 && <div className={styles["push-g"]}></div> }
                        {timeList.length<=2 && <Progress percent={0} showInfo={false} strokeColor="#409eff"></Progress>}
                        {timeList.length==3 && <Progress percent={50} showInfo={false} strokeColor="#409eff"></Progress>}
                        {(timeList.length>2 && timeList.length!=3) && <Progress percent={99.9} showInfo={false} strokeColor="#409eff"></Progress>}
                    </div>
                    {timeList.length==2 && <div className={styles["progress-continue"]}>{''}</div>}
                    {timeList.length==3 && <div className={styles["progress-continue"]}>{formatSecondsTo(nowTime,timeList[2].time[0])}</div>}
                    {timeList.length>3 && <div className={styles["progress-continue"]}>{formatSecondsTo(timeList[3].time[0],timeList[2].time[0])}</div>}
                </div>
                <div className={styles['progress-line']}>
                    <div className={styles['progress-title']}>收货</div>
                    <div className={styles['progress-time']}>{ timeList.length==3?'-':timeList[3] && secondTimeFormat(timeList[3].time[0]) }</div>
                    <div className={styles["progress-show"]}>
                        { !(timeList.length <= 3) && <div className={styles["push-b"]}></div> }
                        { timeList.length <=3 && <div className={styles["push-g"]}></div> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderProgress