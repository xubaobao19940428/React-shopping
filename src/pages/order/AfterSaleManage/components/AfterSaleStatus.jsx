import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input, Modal, message } from 'antd';
import '../styles/AfterSaleStatus.less'
import { ReturnOperValid, AuditPass, RejectApply, DelayProcessing, RefundSuccess,ModifyAfterSale } from '@/services/order'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import RefundAmount from './RefundAmount'
import RefundMethod from './RefundMethod'
/**
/*  
/* 待审核状态
/*
*/
const { TextArea } = Input;
const { confirm } = Modal;
const AfterSaleStatus = (props) => {
    const [mark, setMark] = useState(0)
    const [name, setName] = useState(0)
    const [markTwo, setMarkTwo] = useState(0)
    const [useType, setUseType] = useState(0)
    const [toChange, setToChange] = useState(0)
    const [textarea, setTextarea] = useState('')
    const [visible, setVisible] = useState(false)
    const [RefundMethodVisible, setRefundMethodVisible] = useState(false)
    const [refundDefaultValue,setRefundDefaultValue] = useState({})
    
    const refundMethod = () => {
        if(props.refund.refundType==1){
            setRefundDefaultValue({
                refundType:props.refund.refundType
            })
        }else{
            setRefundDefaultValue({
                refundType:props.refund.refundType,
                email: props.refund.email,
                mobile: props.refund.mobile,
                refundBankName: props.refund.refundBankName,
                refundCardNo: props.refund.refundCardNo,
                refundCardholder:props.refund.refundCardholder
            })
        }
        
        setRefundMethodVisible(true)
    }
    const modifyClick = () => {
        setVisible(true)
    }
    const onChange = e => {
        setTextarea(e.target.value)
    }
    //标记为等待中
    const DelayProcessClick = () => {
        if (textarea === "") {
            message.warning('请填写客服留言！')
        } else {
            let params = {
                refundId: props.refund.refundId,
                message: props.textarea,
            };
            DelayProcessing(params).then((res) => {
                if (res.ret.errcode === 1) {
                    props.confirm()
                }
            });
        }
    }
    //同意申请
    const auditPassClick = () => {
        getReturnOperValid()
    }
    //拒绝申请
    const rejectClick = () => {
        if (textarea == '') {
            message.warning('请填写客服留言！')
        } else {
            let params = {
                refundId: props.refund.refundId,
                message: props.textarea,
            };
            RejectApply(params).then((res) => {
                if (res.ret.errcode === 1) {
                    props.confirm()
                }
            })
        }
    }
    //提交修改
    const submitClick = () => {
        let params = {
            refundId: props.refund.refundId,
            refundProductAmount: props.refund.refundProductAmount,
            refundFreight: props.refund.refundFreight,
            message: textarea,
            refundType: Number(props.refund.refundType),
            refundCardNo: props.refund.refundCardNo,
            refundBankName: props.refund.refundBankName,
            refundCardholder: props.refund.refundCardholder,
            refundTel: props.refund.mobile,
            refundMail: props.refund.email,
        };
        console.log(params);
        ModifyAfterSale(params).then((res) => {
            if (res.ret.errcode === 1) {
                setToChange(0)
                props.confirm
            }
        });
    }
    //标记为已完成
    const refundSuccessClick = () => {
        let params = {
            refundId: props.refund.refundId,
        };
        RefundSuccess(params).then((res) => {
            if (res.ret.errcode === 1) {
                props.confirm()
            }
        });
    }
    const getReturnOperValid = () => {
        let params = {
            operType: 2,
            orderId: props.refund.orderId,
            product: [
                { skuId: props.refund.skuId, suborderId: props.refund.suborderId },
            ],
        };
        ReturnOperValid(params).then(resultes => {
            if (resultes.ret.errcode == 1) {
                if (resultes.popContent) {
                    confirm({
                        title: resultes.popContent.detailContent,
                        icon: <ExclamationCircleOutlined />,
                        content: resultes.popContent.warnContent,
                        okText: '仍要直接过审',
                        okType: 'primary',
                        cancelText: '取消',
                        onOk() {
                            getAuditPass();
                        },
                        onCancel() {
                            message.info('已取消')
                        },
                    });
                } else {
                    getAuditPass()
                }

            }
        })
    }
    const getAuditPass = () => {
        let params = {
            refundId: props.refund.refundId,
            message: textarea,
        };
        AuditPass(params).then((res) => {
            if (res.ret.errcode === 1) {
                props.confirm()
            }
        });
    }
    //修改退款金额
    const confirmDetail = (val) => {
        setVisible(false)
        if (val.amount !== props.refund.refundProductAmount) {
            setToChange(1)
            setMark(1)
        }
        if (val.freight !== props.refund.refundFreight) {
            setToChange(1)
            setMark(1)
        }
        props.setAmount({
            refundAmount: (Number(val.amount) + Number(val.freight)).toString(),
            refundFreight: val.freight,
            refundProductAmount: val.amount,
        })
    }
    const confirmCancel = () => {
        setVisible(false)
    }
    const refundMethodCancel = () => {
        setRefundDefaultValue({
            refundType:1
        })
        setRefundMethodVisible(false)
        
    }
    const refundMethodConfirm=(val)=>{
        setRefundMethodVisible(false)
        if (val.refundBankName !== props.refund.refundBankName) {
            setName(1)
            setToChange(1)
          }
          if (val.refundType !== props.refund.refundType) {
            setToChange(1)
            setUseType(1)
          }
          props.setAmount(val)

    }
    return (
        <div className="after-sale-status">
            <div className="status-title">{props.refund.status}</div>
            <div className="module top"><div className="top-name">退款金额：</div>
                <div className="money">{props.refund.currency}
                    <div className={mark === 1 ? 'pricess' : ''}>{props.refund.refundAmount}</div><div className={markTwo === 1 ? 'pricess' : ''}>（含运费{props.refund.refundFreight}）</div></div>
                {
                    (props.refund.refundStatus === 1 || props.refund.refundStatus === 2) && <div className="modify" onClick={() => modifyClick()}>修改</div>
                }
            </div>
            <div className="top">
                <div className="module">
                    <div className="top-name">退款方式：</div>
                    <div className={useType === 1 ? 'pricess' : ''}>{props.refund.refundType == 1 ? '积分' : '银行卡'}</div>
                    {
                        (props.refund.refundStatus !== 4 && props.refund.refundStatus !== 5 && props.refund.refundStatus !== 6) && <div className="modify" onClick={() => refundMethod()}>修改</div>
                    }
                </div>
                {/* 产看详情 */}
                {
                    props.refund.refundType == 0 && <div className="status-mid">
                        <div className="module-box">
                            <div className="module">
                                <div className="top-name">银行卡号：</div>
                                <div className={name === 1 ? 'pricess' : ''}>{props.refund.refundCardNo}</div>
                            </div>
                            <div className="module">
                                <div className="top-name">银行名称：</div>
                                <div className={name === 1 ? 'pricess' : ''}>{props.refund.refundBankName}</div>
                            </div>
                        </div>
                        <div className="module-box">
                            <div className="module">
                                <div className="top-name">电话号码：</div>
                                <div className={name === 1 ? 'pricess' : ''}>{props.refund.mobile}</div>
                            </div>
                            <div className="module">
                                <div className="top-name">电子邮箱：</div>
                                <div className={name === 1 ? 'pricess' : ''}>{props.refund.email}</div>
                            </div>
                        </div>
                    </div>
                }
                {
                    (props.refund.refundStatus === 1 || props.refund.refundStatus === 2) &&
                    <div className="footer">
                        <div className="footer-title">对客户说：</div>
                        <TextArea
                            size="medium"
                            placeholder="如有需要，可在此为客户留言，建议语言：English"
                            style={{ width: 500 }}
                            autoSize={{ minRows: 5, maxRows: 10 }}
                            allowClear onChange={onChange}
                        ></TextArea>
                    </div>
                }
                {
                    (props.refund.refundStatus !== 4 && props.refund.refundStatus !== 5 && props.refund.refundStatus !== 6) &&
                    <div className="btn-box">
                        <div className="btn-box-title">
                            <span className="font-blond">*</span>你的决定：
                        </div>
                        {
                            (toChange === 0 && props.refund.refundStatus === 1) &&
                            <div>
                                <Button type="primary" className="right-button" onClick={() => auditPassClick()}>同意申请</Button>
                                <Button className="right-button" onClick={() => rejectClick()}>拒绝申请</Button>
                                <Button className="right-button" onClick={() => DelayProcessClick()}>标记为等待中</Button>
                            </div>
                        }
                        {
                            (toChange === 0 && props.refund.refundStatus === 2) &&
                            <div>
                                <Button type="primary" className="right-button" onClick={() => auditPassClick()}>同意申请</Button>
                                <Button className="right-button" onClick={() => rejectClick()}>拒绝申请</Button>
                            </div>
                        }
                        {
                            (toChange === 1 && (props.refund.refundStatus === 1 || props.refund.refundStatus === 2)) &&
                            <div><Button type="primary" onClick={() => submitClick()}>提交修改</Button></div>
                        }
                        {
                            (props.refund.refundStatus === 3 && props.refund.refundType == 0) &&
                            <div><Button type="primary" onClick={() => refundSuccessClick()}>标记为退款完成</Button></div>
                        }
                        {
                            (props.refund.refundStatus === 3 && props.refund.refundType == 1) &&
                            <div><Button type="primary" onClick={() => submitClick()}>提交修改</Button></div>
                        }
                    </div>
                }

            </div>
            {/* 金额 */}
            <RefundAmount defaultValue={{ amount: props.refund.refundProductAmount, freight: props.refund.refundFreight }} visible={visible} confirm={(data) => confirmDetail(data)} cancel={() => confirmCancel()}></RefundAmount>
            {/* 方式 */}
            <RefundMethod RefundMethodVisible={RefundMethodVisible} cancel={() => refundMethodCancel()} defaultValue={refundDefaultValue} userId={props.refund.userId} confirm={(data)=>refundMethodConfirm(data)}></RefundMethod>
        </div>
    )
}
export default AfterSaleStatus;