import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, Popover } from 'antd';
import styles from './styles/ProductMessage.less'
import emnu from '../../Enmu'
import { dealShowFileSrc } from '@/utils/utils'

const { Column } = Table

const ProductMessage = (props) => {
    const { orderInfo, productInfo } = props
    const { statusFilter, afterStatus } = emnu
    console.log(orderInfo, productInfo)
    return (
        <div>
            <Table dataSource={productInfo.productItem} bordered pagination={false} >
                <Column key={1} title="商品信息" align="center" render={(record) =>  {
                    return(
                        <div className={styles.productInfo}>
                            <div className={styles.flex}>
                                {/* <Popover content={<img src={dealShowFileSrc(record.productSnap.skuCover)} className={styles.previewImage}/>} title="" trigger="hover"> */}
                                    <img src={dealShowFileSrc(record.productSnap.skuCover)} className={styles.thumbnail}/>
                                {/* </Popover> */}
                            </div>
                            <div className={styles.productDetail}>
                                <div className={styles.productId}>
                                    <span>商品ID：{ record.productSnap.productId }</span>
                                </div>
                                {
                                    record.productSnap.activity.map((item,index) => {
                                        return <img src={ dealShowFileSrc(item.icon) } key={index}/>
                                    })
                                }
                                <div className={styles.productName}>{ record.productSnap.productName }</div>
                                {
                                    (record.productSnap.arrivalPledge.length > 0 || record.productSnap.afterPledge.length > 0) && 
                                    <Popover content={<div>
                                        {
                                            record.productSnap.arrivalPledge.map(val => {
                                                return <span key={val.pledgeId}>{ val.label}</span>
                                            })
                                        }
                                        {
                                            record.productSnap.afterPledge.map(val => {
                                                return <span key={val.pledgeId}>{ val.label}</span>
                                            })
                                        }
                                    </div>} title="" trigger="hover">
                                        <div className={styles.serviceWrapper}>
                                            {
                                                record.productSnap.arrivalPledge.map(val => {
                                                    return <span key={val.pledgeId}>{ val.label}</span>
                                                })
                                            }
                                            {
                                                record.productSnap.afterPledge.map(val => {
                                                    return <span key={val.pledgeId}>{ val.label}</span>
                                                })
                                            }
                                        </div>
                                    </Popover>
                                }
                                {
                                    (record.productSnap.promotion.length > 0 || record.productSnap.coupon.length > 0) &&
                                    <Popover content={<div className={styles['promotion-coupon-wrapper']}>
                                        <div className={styles.promotion}>
                                            <em>促销</em>
                                            {
                                                record.productSnap.promotion.map(val => {
                                                    return (
                                                        <div key={val.label}>
                                                            <span className={styles.mar}>{val.label}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className={styles.coupon}>
                                            <em>用劵</em>
                                            {
                                                record.productSnap.coupon.map(val => {
                                                    return (
                                                        <div key={val.label}>
                                                            <span className={styles.mar}>{val.label}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>} title="" trigger="hover">
                                        <div className={styles['promotion-coupon-wrapper']}>
                                            {record.productSnap.promotion.length>0 && <div className={styles.promotion}>
                                                <em>促销</em>
                                            </div>}
                                            {record.productSnap.coupon.length>0 && <div className={styles.coupon}>
                                                <em>用劵</em>
                                            </div>}
                                        </div>
                                    </Popover>
                                }
                            </div>
                        </div>
                    )
                }}/>
                <Column key={2} title="规格" align="center" render={(record) => {
                    return(
                        <div>
                            <div>skuId：{ record.productSnap.skuId }</div>
                            {
                                record.productSnap.attr.map((val,index) => {
                                    return (
                                        <div key={index}>
                                            <span>{ val.attrLabel }：{ val.valueLabel }</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }}/>
                <Column key={3} title="数量" align="center" render={ record => {
                    return <div>{ record.productSnap.num }</div>
                } }/>
                <Column key={4} title={ '销售单价' + orderInfo.currency } align="center" render={ record => {
                    return <div>{ record.productSnap.price }</div>
                } }/>
                <Column key={5} title={ '用劵优惠' + orderInfo.currency } align="center" render={ record => {
                    return <div>{ record.productSnap.couponDiscount }</div>
                } }/>
                <Column key={6} title={ '促销优惠' + orderInfo.currency } align="center" render={ record => {
                    return <div>{ record.productSnap.promotionDiscount }</div>
                } }/>
                <Column key={7} title={ '实付单价' + orderInfo.currency } align="center" render={ record => {
                    return <div>{ record.productSnap.payable }</div>
                } }/>
                <Column key={8} title="子单编号" align="center" render={record => {
                    return (
                        <>
                            {
                                record.suborderItem.map( val => {
                                    return (
                                        <div key={val.suborderId}>
                                            <div>{ val.suborderId }</div>
                                            <div>{ val.warehouseName }</div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    )
                }}/>
                <Column key={9} title="子单状态" align="center" render={record => {
                    return (
                        <>
                            {
                                record.suborderItem.map((val,index) => {
                                    return (
                                        <div key={index}>{ statusFilter[val.status] }</div>
                                    )
                                })
                            }
                        </>
                    )
                }} />
                <Column key={10} title="售后状态" align="center" render={ record => {
                    return (
                    <div>{ afterStatus[record.productSnap.afterStatus] || '无售后' }</div>
                    )
                }} />
            </Table>
            <div className={styles["product-footer"]}>
                <div>商品总价：{ orderInfo.currency + ' ' +  productInfo.totalPrice }</div>
                <div>总用券优惠：{ productInfo.coupon }</div>
                <div>总促销优惠：{ orderInfo.currency + ' ' +  productInfo.promotion }</div>
                <div>实付金额：{ orderInfo.paiedCurrency + ' ' + orderInfo.paied }(含运费)</div>
                <div>{ statusFilter[orderInfo.orderStatus] }</div>
            </div>
        </div>
    )
}

export default ProductMessage