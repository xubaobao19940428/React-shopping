import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input } from 'antd';
import '../styles/detailSale.less'
import { dealShowFileSrc } from '@/utils/utils'
/**
/*  
/*售后单
/*
*/
const SaleDetail = (props) =>{
    const [afterType, setAfterType] = useState({
        7: '仅退款',
        1: '退货退款'
    })
    const [suborderStatus, setSuborderStatus] = useState({
        0: '待支付',
        1: '待发货',
        2: '待收货',
        3: '交易成功',
        4: '交易关闭',
        5: '部分发货'
    })
    return (
        <div className="detail-container">
            <div className="detail-title">
                售后单
         </div>
            <div className="detail-content">
                <div className="detail-content-top">
                    <div className="detail-content-top-model">
                        <div className="top-model-label">售后单号：</div>
                        <div className="top-model-content">{props.refundData.orderId}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">售后类型：</div>
                        <div className="top-model-content">{afterType[props.refundData.afterType]}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">发货状态：</div>
                        <div className="top-model-content">{suborderStatus[props.refundData.orderStatus]}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">退款金额：</div>
                        <div className="top-model-content color-red">{props.refundData.currency}{props.refundData.refundAmount}（含运费{props.refundData.refundFreight}）</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">退款原因：</div>
                        <div className="top-model-content">{props.refundData.refundReason}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">申请时间：</div>
                        <div className="top-model-content">{props.refundData.applyTime}</div>
                    </div>
                </div>

            </div>
            {/* 商品 */}
            <div className="aside-mid">
                <div className="aside-mid-top">
                    <img src={props.refundData.afterSaleProduct && dealShowFileSrc(props.refundData.afterSaleProduct.picture)} />
                    <div className="product-content">
                        <div className="product-id">商品ID：{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.productId}</div>
                        <div className="profuct-name">{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.title}</div>
                        <div className="product-attr">
                            {/* <div v-if="props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.attr && props.refundData.afterSaleProduct.attr.length !== 0">{{ props.refundData.afterSaleProduct.attr[0].valueLabel}}</div> */}
                            <div className="product-num">售后数量：{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.refundNum}</div>
                        </div>
                    </div>
                </div>
                <div className="aside-mid-bottom">
                    <div>
                        <span className="top-name">销售单价：</span><span>{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.saleCurrency}{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.salePrice}</span>
                    </div>
                    <div>
                        <span className="top-name">实付单价：</span><span>{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.paidCurrency}{props.refundData.afterSaleProduct && props.refundData.afterSaleProduct.price}</span>
                    </div>
                </div>
            </div>
            {/* 状态 */}
            <div className="detail-content">
                <div className="detail-content-top">
                    <div className="detail-content-top-model">
                        <div className="top-model-label">子单状态：</div>
                        <div className="top-model-content">{ suborderStatus[props.refundData.suborderStatus]}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">子单编号：</div>
                        <div className="top-model-content">{ props.refundData.suborderId}</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">订单编号：</div>
                        <div className="top-model-content">{ props.refundData.orderId }</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">支付时间：</div>
                        <div className="top-model-content">{ props.refundData.payTime || '-' }</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">发货时间：</div>
                        <div className="top-model-content">{ props.refundData.deliveryTime || '-' }</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">物流公司：</div>
                        <div className="top-model-content">{ props.refundData.expressName || '-' }</div>
                    </div>
                    <div className="detail-content-top-model">
                        <div className="top-model-label">物流单号：</div>
                        <div className="top-model-content">{ props.refundData.expressNo || '-'}</div>
                    </div>
                </div>

            </div>
        </div>

    )
}
export default SaleDetail;