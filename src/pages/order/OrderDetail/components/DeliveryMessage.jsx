import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import styles from './styles/DeliveryMessage.less'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import { changeToBuyers } from '@/services/order';

const DeliveryMessage = (props) => {
    const {receiverInfo, orderInfo, orderId} = props
    const [defaultValue, setDefaultValue] = useState({

    })
    const changeAdress = () => {

    }
    return (
        <>
            <div className={styles.flex}>
                <div className={styles.label}>收货人姓名：</div>
                <div>{ receiverInfo.receiverName }</div>
            </div>
            <div className={styles.flex}>
                <div className={styles.label}>收货人电话：</div>
                <div>{ receiverInfo.receiverPhone }</div>
            </div>
            <div className={styles.flex}>
                <div className={styles.label}>收货地址：</div>
                <div>{ receiverInfo.receiverAddress + ', ' + receiverInfo.cityCode + ', ' + receiverInfo.stateCode + ', ' + receiverInfo.postcode }</div>
            </div>
            <div className={styles.flex}>
                <div className={styles.label}>用户备注：</div>
                <div>
                    { receiverInfo.remark }
                    {(orderInfo.orderStatus == 1 || orderInfo.orderStatus == 2) && <Button type="primary" size="small" onClick={() => {changeAdress()}}>修改收货信息</Button>}
                </div>
            </div>
        </>
    )
}

export default DeliveryMessage