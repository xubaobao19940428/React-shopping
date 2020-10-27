import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/OrderTable.less'
import { Button, Pagination, Table, Popover, DatePicker, Row, Col} from 'antd';
import { ZoomInOutlined ,UpOutlined, DownOutlined, UndoOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { dealShowFileSrc } from '@/utils/utils'
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import enmu from '../../Enmu'
import { history } from 'umi';
import OrderDetail from '../../OrderDetail/OrderDetail'

const { Column } = Table

const OrderTable = (props) => {
    const { dataList, countryList } = props;
    const { userLevel, statusFilter } = enmu;
    const [trackInfo, setTrackInfo] = useState({})

    const getCountryImg = (code) => {
        let item = countryList.find((val) => {
            return val.shortCode == code
        })
        return item ? dealShowFileSrc(item.image) : ''
    }
    const getTotalDiscount = (data, key) => {
        let count = 0
        if (data[key]) {
            for (let i = 0; i < data[key].length; i++) {
                count += parseFloat(data[key][i].discountAmount)
            }
        }
        return count.toFixed(2)
    }
    const haveAfterSale = () => {

    }
    const openOrderDetail = (data) => {
        console.log(data)
        history.push({
            pathname: '/order/orderDetail',
            query: {
                orderId: data.orderId
            }
        })
    }
    const afterSale = (data) => {
        history.push({
            pathname: '/order/afterSale',
            query: {
                orderId: data.orderId
            }
        })
    }
    return (
        <div className={styles.mainContent}>
            {
                dataList.map(item => {
                    return(
                        <div key={item.orderId} className={styles.orderItem}> 
                            <div className={styles.orderHeader}>
                                <div className={styles.headerBox}>
                                    <img src={getCountryImg(item.countryCode)} />
                                    <span>NO：{ item.orderId }</span>
                                </div>
                                <div className={`${styles.borderCenter} ${styles.headerCenter}`}>
                                    <span>创建：{ secondTimeFormat(item.createTime) }</span>
                                    <span>支付：{ secondTimeFormat(item.payTime) }</span>
                                </div>
                                <div className={styles.headerR}>{ statusFilter[item.status] }</div>
                            </div>
                            <Table dataSource={item.productItem} bordered scroll={{x: '100vw'}} pagination={false} rowKey={item.orderId} loading={item.productItem?false:true}>
                                <Column title="商品信息" width={600} align="center" render={(record) =>  {
                                    return(
                                        <div className={styles.productInfo}>
                                            <div className={styles.flex}>
                                                <Popover content={<img src={dealShowFileSrc(record.productSnap.skuCover)} className={styles.previewImage}/>} title="" trigger="hover">
                                                    <img src={dealShowFileSrc(record.productSnap.skuCover)} className={styles.thumbnail}/>
                                                </Popover>
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
                                <Column title="规格" align="center" width={200} render={(record) => {
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
                                <Column title="数量" width={100} align="center" render={ record => {
                                    return <div>{ record.productSnap.num }</div>
                                } }/>
                                <Column width={150} title={ '售价' + (item.payCurrency ? item.payCurrency : '') } align="center" render={ record => {
                                    return <div>{ record.productSnap.price }</div>
                                } }/>
                                <Column width={150} title={ '实付单价' + (item.payCurrency ? item.payCurrency : '') } align="center" render={ record => {
                                    return <div>{ item.status?record.productSnap.payable:'-' }</div>
                                } }/>
                                <Column width={200} title="子单编号" align="center" render={record => {
                                    return (
                                        <>
                                            {
                                                record.suborderItem.map( val => {
                                                    return (
                                                        <div key={val.suborderId}>
                                                            <div>{ val.suborderId }</div>
                                                            {val.splitType === 'SHOP_DIRECT' && <div>商家直邮</div>}
                                                            {val.splitType !== 'SHOP_DIRECT' && <div>{val.warehouseName}</div>}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                }}/>
                                <Column width={150} title="子单状态" align="center" render={record => {
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
                                <Column width={150} title="售后状态" align="center" render={ record => {
                                    return (
                                        <>
                                            { record.productSnap.dataVersion === 0 && <div>{record.productSnap.afterStatus === -1 ? '无售后':'有售后' }</div>}
                                            { record.productSnap.dataVersion === 1 && 
                                                <div>
                                                    { record.productSnap.afterStatus === -1 && <div>无售后</div> }
                                                    { record.productSnap.afterStatus !== -1 && <div onClick={haveAfterSale} className={styles.haveSale}>有售后</div> }
                                                </div> 
                                            }
                                        </>
                                    )
                                }} />
                                <Column title="操作" align="center" width={150} fixed="right" render={ (record) => {
                                    return{
                                        children:(<div>
                                            <Button type="primary" className={styles.btn} onClick={()=>{openOrderDetail(item)}}>订单详情</Button>
                                            <Button type="primary" className={styles.btn} onClick={() => {afterSale(item)}}>发起售后</Button>
                                        </div>),
                                        props: {
                                            rowSpan: record.row
                                        },
                                    }
                                }} />
                            </Table>
                            <div className={styles['order-bottom-wrapper']}>
                                <div className={styles['l-box']}> 
                                    <div><span>买家账号：</span><em>{ (item.username ? ('昵称: ' + item.username) : '') + ' ID: ' + item.userId }</em>{item.userLevel && <i>{ userLevel[item.userLevel] }</i>}</div>
                                    <div>
                                        <span>上级账号：</span>
                                        {
                                            (item.userParentId && item.userParentName) && 
                                            <>
                                                <em>{ (item.userParentName ? ('昵称: ' + item.userParentName) : '') + ' ID: ' + item.userParentId }</em>
                                                {item.userParentLevel && <i>{ userLevel[item.userParentLevel] }</i>}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className={`${styles['center-box']} ${styles['border-lr']}`}>
                                        <div><span>实付金额：</span><em>{ (item.payCurrency ? item.payCurrency : '') + ' ' + item.paied }</em></div>
                                        <div><span>订单运费：</span><em>{ (item.payCurrency ? item.payCurrency : '') + ' ' + item.freight }</em></div>
                                        <div><span>促销优惠：</span><em>{ getTotalDiscount(item, 'promotionInfo') }</em></div>
                                        <div><span>积分抵扣：</span><em>{ (item.currency ? item.currency : '') + ' ' + item.usePoints }</em></div>
                                        <div>
                                            <span>用券优惠：</span>
                                            {
                                                item.couponInfo.length>0 && item.couponInfo.map( (val,index) => {
                                                    return (
                                                        <em key={index}>{ '[' + val.couponId + ']' + val.label }</em>
                                                    )
                                                } )
                                            }
                                        </div>
                                    </div>
                                <div className={styles['r-box']}>
                                        <div>
                                            <span>收货信息：</span>
                                            <Popover content={<em>{ item.receiverName + '/' + item.receiverPhone + '/' + item.receiverAddress  + ', ' + item.cityCode + ', ' + item.stateCode + ', ' +  item.postcode }</em>} title="">
                                                <em>{ item.receiverName + '/' + item.receiverPhone + '/' + item.receiverAddress  + ', ' + item.cityCode + ', ' + item.stateCode + ', ' +  item.postcode }</em>
                                            </Popover>
                                        </div>
                                        <div><span>买家备注：</span><em>{ item.remark }</em></div>
                                        <div>
                                            <span>客服备注：</span>
                                            { !item.editFlg && <em>{ item.remarkBack ? item.remarkBack : '+ 备注' }</em>}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OrderTable