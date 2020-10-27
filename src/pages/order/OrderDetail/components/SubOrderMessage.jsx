import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, Popover } from 'antd';
import styles from './styles/SubOrderMessage.less'
import emnu from '../../Enmu'
import { formatSecondsTo } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'
import { SubOrders } from '@/services/order';

const { Column } = Table

const SubOrderMessage = (props) => {
    const { orderId } = props
    const { statusFilter, outOrderStatus, ponStatus } = emnu
    const [tableData, setTableData] = useState([])
    const getSubOrders = () => {
        SubOrders({orderId}).then(res => {
            if (res.ret.errcode === 1) {
                setTableData(res.subOrder)
            }
        })
    }
    const expandedRowRender = (data) => {
        console.log(data)
        return (
            <Table dataSource={data.skuInfo} bordered pagination={false} >
                <Column title="skuCode" align="center" dataIndex="skuCode" />
                <Column title="商品" align="center" render={ record => {
                    return (
                        <div className={styles.product}>
                            <img src={dealShowFileSrc(record.skuCover)} className={styles["image-box"]} />
                            <div className={styles["product-desc"]}>
                                <div className={styles["product-content"]}>{record.skuName}</div>
                                <div className={styles["product-id"]}>商品Id：{record.skuId}</div>
                            </div>
                        </div>
                    )
                } } />
                <Column title="规格" align="center" dataIndex="attr" />
                <Column title="购买数量" align="center" dataIndex="num" />
                <Column title="已发货数量" align="center" dataIndex="shipNum" />
                <Column title="确认采购数量" align="center" dataIndex="purchasedNum" />
                <Column title="关联出库单" align="center" render={ record => {
                    return (
                        <>
                            { record.outOrder.length === 0 && <div className={styles["status-none"]}>无</div> }
                            {
                                record.outOrder.length !== 0
                                 && 
                                record.outOrder.map(item => {
                                    return (
                                        <div className={styles["out-info"]}>
                                            <div className={styles["out-id"]}>{item.oon}</div>
                                            <div className={styles["out-status"]}>{outOrderStatus[item.outStatus]}</div>
                                            <div>{ formatSecondsTo(item.time) }</div>
                                            { item.label !== '' && <div className={styles.agingOut}>{item.label}</div> }
                                        </div>
                                    )
                                })
                                
                            }
                        </>
                    )
                }}/>
                <Column title="关联采购单" align="center" render={ record => {
                    return (
                        <>
                            { record.purOrder.length === 0 && <div className={styles["status-none"]}>无</div> }
                            {
                                record.purOrder.length !== 0
                                 && 
                                record.purOrder.map(item => {
                                    return (
                                        <div className={styles["out-info"]}>
                                            <div className={styles["out-id"]}>{item.pon}</div>
                                            <div className={styles["out-status"]}>{ponStatus[item.ponStatus]}</div>
                                            <div>{ formatSecondsTo(item.time) }</div>
                                            { item.label !== '' && <div className={styles.agingOut}>{item.label}</div> }
                                        </div>
                                    )
                                })
                                
                            }
                        </>
                    )
                }} />

            </Table>
        )
    }
    useEffect(() => {
        if (orderId !== '') {
            getSubOrders()
        }
    },[orderId])

    return (
        <Table dataSource={tableData} bordered pagination={false} expandable={{expandedRowRender}} >
            <Column title="子订单号" align="center" dataIndex="suborderId" />
            <Column title="发货仓库" align="center" dataIndex="warehouseName" />
            <Column title="订单状态" align="center" render={record => {
                return <div>{statusFilter[record.subStatus]}</div>
            }} />
            <Column title="时间" align="center" render={record => {
                return (
                    <>
                        <div>{ formatSecondsTo(record.time) }</div>
                        { record.label !== '' && <div className={styles.agingOut}>{ record.label }</div> }
                    </>
                )
            }} />
        </Table>
    )
}

export default SubOrderMessage