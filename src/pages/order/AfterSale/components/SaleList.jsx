import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, InputNumber, Switch, message} from 'antd';
import { dealShowFileSrc } from '@/utils/utils'
import styles from './styles/SaleList.less'
import enmu from '../../Enmu'

const { Column } = Table

const SaleList = (props) => {
    const { tableList, loading, changeTable } = props
    const { subStatus } = enmu
    const [product, setProduct] = useState([])

    const rowSelection = {
        // selectedRowKeys: tableList.length === 1 ? [tableList[0].productItem.productSnap.productId] : [],
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            let data = []
            let skuList = []
            for (const iterator of selectedRows) {
                data.push({
                    skuId:iterator.productItem.productSnap.skuId,
                    num: iterator.num,
                    returnFreight: iterator.freight
                })
                skuList.push({skuId:iterator.productItem.productSnap.skuId})
            }
            setProduct(data)
            changeTable(data,'row',skuList)
        }
    }
    const onChange = (val,record,index) => {
        if (product.length === 0) {
            message.error('请选择售后商品！')
        }else {
            console.log(val,record,index)
            let data = product
            for (const iterator of data) {
                if (iterator.skuId === record.productItem.productSnap.skuId) {
                    iterator.num = val
                }
            }
            setProduct(data)
            changeTable(data,'num',val,index)
        }
    }
    const switchChange = (event,record,index) => {
        if (product.length === 0) {
            message.error('请选择售后商品！')
        }else {
            console.log(event,record,index)
            let data = product
            for (const iterator of data) {
                if (iterator.skuId === record.productItem.productSnap.skuId) {
                    iterator.returnFreight = !record.freight
                }
            }
            setProduct(data)
            changeTable(data,'freight',!record.freight,index)
        }
    }
    return (
        <Table bordered rowSelection={rowSelection} dataSource={tableList} loading={loading} pagination={false} rowKey={record=>record.productItem.productSnap.productId}> 
            <Column title="商品信息" align="center" render={record => {
                return (
                    <div className={styles["produt"]}>
                        <img src={ dealShowFileSrc(record.productItem.productSnap.skuCover) }/>
                        <div className={styles["product-content"]}>
                            <div className={styles["product-content-supplier"]}>商品ID：{record.productItem.productSnap.productId}</div>
                            <div className={styles["product-content-supplier"]}>skuID：{record.productItem.productSnap.skuId}</div>
                            <div className={styles["product-content-name"]}>{record.productItem.productSnap.productName}</div>
                            { record.productItem.productSnap && record.productItem.productSnap.attr && record.productItem.productSnap.attr.length !== 0 &&
                                <div className={styles["product-content-supplier"]}>
                                    规格：
                                    {
                                        record.productItem.productSnap.attr.map((item, index) => {
                                            return <span key={index}>{item.attrLabel}：{ item.valueLabel } </span>
                                        })
                                    }
                                </div>
                            }
                            <div className={styles["product-pledge"]}>
                                {
                                    record.productItem.productSnap.afterPledge.map((item, index) => {
                                        return <div key={index} className={record.ischose?styles.pricess:''}>{item.label}</div>
                                    })
                                }
                                {
                                    record.productItem.productSnap.arrivalPledge.map((item, index) => {
                                        return <div key={index} className={record.ischose?styles.pricess:''}>{item.label}</div>
                                    })
                                }
                            </div>
                            <div className={styles["promotion-coupon-wrapper"]}>
                                {
                                    record.productItem.productSnap.promotion.length > 0 && 
                                    <div className={styles.promotion}>
                                        <em>促销</em>
                                        <div>
                                            {
                                                record.productItem.productSnap.promotion.map((item,index) => {
                                                    return <span key={index} className={styles.promptColor}>{ item.label }</span>
                                                })
                                            }
                                        </div>
            
                                    </div>
                                }
                                {
                                    record.productItem.productSnap.coupon.length > 0 && 
                                    <div className={styles.coupon}>
                                        <em>用劵</em>
                                        <div>
                                            {
                                                record.productItem.productSnap.coupon.map((item, index) => {
                                                    return <span key={index}>{ item.label }</span>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
            }}/>
            <Column title="子单编号" align="center" render={record => {
                return (
                    <>
                        {
                            record.productItem.suborderItem.map((item, index) => {
                                return (
                                    <div className={styles["sub-order-wrapper"]} key={index}>
                                        <div>发货仓库名称：{item.warehouseName}</div>
                                        <div>{item.suborderId}</div>
                                    </div>
                                )
                            })
                        }
                    </>
                )
            }} />
            <Column title="子单状态" align="center" render={ record => {
                return (
                    <>
                        {
                            record.productItem.suborderItem.map((item, index) => {
                                return(
                                    <div className={styles["sub-order-wrapper"]} key={index}>
                                        <div>{subStatus[item.status]}</div>
                                    </div>
                                )
                            })
                        }
                    </>
                )
            }} />
            <Column title="售后数量" align="center" render={(text,record,index) => {
                return (
                    <>
                        <div>最多可退 { record.calAfterSalesAmount.refundNum }</div>
                        <InputNumber min={0} max={record.calAfterSalesAmount.refundNum} defaultValue={record.num} onChange={(value)=>{onChange(value,record,index)}} />
                    </>
                )
            }} />
            <Column title="是否退运费" align="center" render={(text,record,index) => {
                return (
                    <div className={styles["amount-box"]}>
                        <Switch checked={record.freight} onChange={()=>{switchChange(event,record,index)}} />
                    </div>
                )
            }}/>
        </Table>
    )
}

export default SaleList