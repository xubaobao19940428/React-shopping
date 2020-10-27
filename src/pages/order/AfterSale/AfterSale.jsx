import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/AfterSale.less'
import { Button, Card, notification, Row, Col, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import { GetAfterSaleProduct, GetUserBankList, AllReturnReason, ComputeReturnAmount, ReturnOperValid } from '@/services/order';
import enmu from '../Enmu'
import { history } from 'umi';
import ViewContainer from '@/components/ViewContainer';
import SaleList from './components/SaleList';
import RefundMethod from './components/RefundMethod';
import FillAfterSale from './components/FillAfterSale';

const { confirm } = Modal;

const AfterSale = () => {
    const [reasonList, setReasonList] = useState([])
    const [tableList, setTableList] = useState([])
    const [loading, setLoading] = useState(true)
    const [refundCardNoList, setRefundCardNoList] = useState([])
    const [refundBankNameList, setRefundBankNameList] = useState([])
    const [bankList, setBankList] = useState([])
    const [defaultValue, setDefaultValue] = useState({
        currency: 'RM',
        refundAmount: '0',
        refundFreight: '0',
        refundType: 1,
        refundCardNo: '',
        refundBankName: '',
        refundCardholder: '',
        mobile: '',
        email: ''
    })
    const [defaultSale, setDefaultSale] = useState({
        afterType: 7,
        reason: '',
        pic: [],
        remark: ''
    })
    const [skuList, setSkuList] = useState([])
    const [choseProduct, setChoseProduct] = useState([])

    const getAfterSaleProduct = () => {
        let orderId = history.location.query.orderId
        GetAfterSaleProduct({orderId}).then(res => {
            setLoading(false)
            if (res.ret.errcode === 1) {
                console.log(res)
                if (res.afterSaleOrderProduct.length === 0) {
                    const btn = (
                    <Button type="primary" size="small" onClick={() => notification.close()}>
                        知道了
                    </Button>
                    );
                    notification.open({
                        message: '提示',
                        description:
                        '暂无可售后商品！',
                        btn,
                        onClose: close,
                    });
                } else {
                    getUserBankList(res.userId)
                    let data = []
                    for (let index = 0; index < res.afterSaleOrderProduct.length; index++) {
                        Object.assign(res.afterSaleOrderProduct[index],{num:res.afterSaleOrderProduct[index].calAfterSalesAmount.refundNum,freight:false,ischose:false,id:Math.random()})
                        data.push(res.afterSaleOrderProduct[index])
                    }
                    setTableList(data)
                }
            } 
        })
    }
    const close = () => {
        history.push({
            pathname: '/order/orderList'
        })
    }
    const getAllReturnReason = () => {
        AllReturnReason({}).then(res => {
            if (res.ret.errcode === 1) {
                setReasonList(res.refundReason)
            }
        })
    }
    const getUserBankList = (userId) => {
        GetUserBankList({userId}).then(res => {
            if (res.ret.errcode === 1) {
                setBankList(res.data)
                let card = []
                let bank = []
                for (let index = 0; index < res.data.length; index++) {
                    card.push({val:res.data[index].accountNo,label:res.data[index].accountNo})
                    bank.push({val:res.data[index].bankName,label:res.data[index].bankName})
                }
                setRefundCardNoList(card)
                setRefundBankNameList(bank)
            }
        })
    }
    const changeTable= (data,mark,val,index) => {
        setChoseProduct(data)
        getComputeReturnAmount(data)
        let List = JSON.parse(JSON.stringify(tableList))
        for (const iterator of List) {
            iterator.ischose = false
        }
        switch (mark) {
            case "freight":  List[index].freight = val;break;
            case "num":  List[index].num = val;break;
            case "row":  
                for (const iterator of data) {
                    for (let index = 0; index < List.length; index++) {
                        if (iterator.skuId === List[index].productItem.productSnap.skuId) {
                            List[index].ischose = true
                        }
                    }   
                }
                setSkuList(val)
            ;break;
        }
        console.log(List)
        setTableList(List)
    }
    const getComputeReturnAmount = (prodcut) => {
        let orderId = history.location.query.orderId
        ComputeReturnAmount({orderId,prodcut}).then(res => {
            if (res.ret.errcode === 1) {
                console.log(res)

            }
        })
    }
    const bankChange = (val, mark) => {
        console.log(val, mark)
        if (mark === 'card') {
            for (const iterator of bankList) {
                if (val === iterator.accountNo) {
                    setDefaultValue({
                        ...defaultValue,
                        refundCardNo: val,
                        refundBankName: iterator.bankName,
                        refundCardholder: iterator.accountName,
                        mobile: iterator.mobile,
                        email: iterator.email
                    })
                }
            }
        }else if (mark === 'name') {
            for (const iterator of bankList) {
                if (val === iterator.bankName) {
                    setDefaultValue({
                        ...defaultValue,
                        refundCardNo: iterator.accountNo,
                        refundBankName: val,
                        refundCardholder: iterator.accountName,
                        mobile: iterator.mobile,
                        email: iterator.email
                    })
                }
            }
        }else if (mark === 'type') {
            setDefaultValue({
                ...defaultValue,
                refundType: val
            })
        }
    }
    const saleChange = (val, mark) => {
        switch (mark) {
            case 'type' :
                setDefaultSale({
                    ...defaultSale,
                    afterType: val
                })
            return;
            case 'reason' :
                setDefaultSale({
                    ...defaultSale,
                    reason: val
                })
            return;
            case 'input' :
                setDefaultSale({
                    ...defaultSale,
                    remark: val
                })
            return;
            case 'pic' :
                setDefaultSale({
                    ...defaultSale,
                    pic: val
                })
            return;
        }
    }
    const submitAfterSale = () => {
        console.log(defaultValue)
        console.log(defaultSale)
        if (defaultSale.reason === '') {
            message.error('请选择售后原因！')
        } else if (choseProduct.length === 0) {
            message.error('请选择售后商品！')
        } else {
            if (defaultValue.refundType == 0) {
                if (defaultValue.refundCardNo === '' || defaultValue.refundBankName === '' || defaultValue.refundCardholder === '' ) {
                    message.error('请填写必填信息！')
                    return
                }
            }
            getReturnOperValid()
        }
    }
    const getReturnOperValid = () => {
        let params = {
            operType: 1,
            orderId: history.location.query.orderId,
            product: skuList
        }
        ReturnOperValid(params).then(res => {
            if (res.ret.errcode === 1) {
                console.log(res)
                if(res.popContent){
                    confirm({
                        title: res.popContent.detailContent,
                        icon: <ExclamationCircleOutlined />,
                        content: res.popContent.warnContent,
                        onOk() {
                          
                        },
                        onCancel() {
                            message.warning('已取消')
                        },
                      })
                }else {

                }
            }
        })
    }
    // const getApplyForRefundV1 = () => {
    //     ApplyForRefundV1(params).then(res => {
    //         if (res.ret.errcode === 1) {
    //             console.log(res)
    //             history.push({
    //                 pathname: 'afterSale'
    //             })
    //         }
    //     })
    // }
    useEffect(() => {
        getAfterSaleProduct()
        getAllReturnReason()
    }, [])
    return (
        <ViewContainer>
            <div className={styles["order-after-sale"]}>
                <div className={styles["after-sale"]}>
                    <Card bordered className={styles.btnCard}>
                        <div className={styles["step1-title"]}>
                            <div className={styles["title"]}>Step1 选择售后商品</div>
                            <div className={styles["prompt"]}>多个商品系统将生成多条售后单</div>
                        </div>
                        <SaleList 
                            tableList={tableList} 
                            loading={loading}
                            changeTable={changeTable}
                        ></SaleList>
                    </Card>
                    <Row className={styles.rowCard}>
                        <Col span={12}>
                            <Card bordered className={styles.btnCard}>
                                <div className={styles["title"]}>Step2 选择退款方式</div>
                                <RefundMethod 
                                    refundCardNoList={refundCardNoList}
                                    refundBankNameList={refundBankNameList}
                                    bankList={bankList}
                                    bankChange={bankChange}
                                    defaultValue={defaultValue}
                                >
                                </RefundMethod>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered className={styles.btnCard,styles.willCard}>
                                <div className={styles["title"]}>Step3 填写售后愿意</div>
                                <FillAfterSale 
                                    reasonList={reasonList}
                                    defaultSale={defaultSale}
                                    saleChange={saleChange}
                                >
                                </FillAfterSale>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Card bordered className={styles.btnCard}>
                    <div className={styles.btnBox}>
                        <Button type="primary" onClick={()=>{submitAfterSale()}}>提交售后</Button>
                    </div>
                </Card>
            </div>
        </ViewContainer>
    )
}

export default AfterSale