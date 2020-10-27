import React, { useState, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/AfterSale.less'
import {  Button, Pagination, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ListAfterSale, StopAfterSale, StartAfterSale, AddAfterSale, UpdateAfterSale } from '@/services/serviceTemplate'
import SaleStrategy from './SaleStrategy'
import { dealShowFileSrc, getMultiLangShowInfo } from '@/utils/utils'
import {filterData, secondTimeFormat} from '@/utils/filter'
import {GetProductEnumInfo} from "@/services/product1";

const showType = {
    1: '只外显于商品详情页',
    2: '全部外显',
    3: '不外显'
}
const rangeTypeEum = {
    1: '按照后台类目',
    2: '按商品类型'
}

const AfterSale = () => {
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageSize: 10,
        pageNum: 1
    })
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalData, setModalData] = useState({})
    const [productEnum, setProductEnum] = useState([])
    // 获取商品枚举
    const productEnumInfo = () => {
        GetProductEnumInfo(filterData({})).then(res => {
            if (res.ret.errCode == 0) {
                setProductEnum(res.data.map.type)
            }
        })
    }
    // 商品类型对应名称
    const getProType = (key) => {
        let item = productEnum.find((val) => {
            return val.code == key
        })
        return item ? item.name : ''
    }
    // 列表
    const getTemplateInfo = (params) => {
        ListAfterSale(params ? params : page).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                setDataList(res.data.afterSalePledgeList)
                setTotal(res.data.total)
            }
        })
    }
    // 状态更改
    const updateStatus = (item) => {
        if (item.status === 2) {
            StartAfterSale({afterSaleId: item.afterSaleId}).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('启用成功！')
                    getTemplateInfo()
                }
            })
        }else {
            StopAfterSale({afterSaleId: item.afterSaleId}).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('停用成功！')
                    getTemplateInfo()
                }
            })
        }
    }
    // 分页信息改变
    const changeCurrentSize = (pageNum, pageSize) => {
        setPage({
            pageNum: pageNum,
            pageSize: pageSize
        })
        getTemplateInfo({pageSize: pageSize, pageNum: pageNum})
    }
    // 编辑
    const editAfterSale = (data) => {
        console.log(data)
        setModalData(data)
        setShowModal(true)
    }
    // 新增
    const addAfterSale = () => {
        setModalData({
            rangeType: 1,
            showType: 1,
            status: 1
        })
        setShowModal(true)
    }
    // 确定
    const onConfirm = (data) => {
        let fetchUrl = AddAfterSale
        if (data.afterSaleId) {
            fetchUrl = UpdateAfterSale
        }
        setLoading(true)
        fetchUrl(data).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                message.success('成功')
                setShowModal(false)
                getTemplateInfo()
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        getTemplateInfo()
        productEnumInfo()
    }, [])

    return(
        <ViewContainer>
            <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={addAfterSale}>新增</Button>
            {
                dataList.map(item =>{
                    return (
                        <div key={item.afterSaleId} className={styles.item}>
                            <div>
                                <div className={styles.saleId}>{item.afterSaleId}</div>
                                <div className={styles.contentBox}>
                                    <div className={styles.imgBox}>
                                        <img src={dealShowFileSrc(getMultiLangShowInfo(item.detailPictureList))} />
                                    </div>
                                    <div className={styles.describe}>
                                        <div className={styles.desBox}>
                                            <div className={styles.title}>{item.name}</div>
                                            <div className={styles.content}>
                                                {rangeTypeEum[item.rangeType]}
                                                {
                                                    item.rangeType === 1 && item.afterSaleCateList.map((item, index) => {
                                                            return <em key={index}>{item.cateName}</em>
                                                    })
                                                }
                                                {
                                                    item.rangeType === 2 && item.productTypeList.map((val, index) => {
                                                        return <em key={index}>{getProType(val)}</em>
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.detail}>{getMultiLangShowInfo(item.documentList)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.operate}>
                                <div className={styles.show}>
                                    <div className={styles.allShow}>{showType[item.showType]}</div>
                                    <div className={styles.time}>{ item.operatorName }更新于{secondTimeFormat(item.updateTime)}</div>
                                </div>
                                <div className={styles.btnBox}>
                                    <Button type="text" className={styles.btn} onClick={() => editAfterSale(item)}>修改策略</Button>
                                    <Button type="text" className={styles.btn} onClick={() => {updateStatus(item)}}>{ item.status == 2 ? '启用' : '停用' }策略</Button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <Pagination
                current={page.pageNum}
                pageSize={page.pageSize}
                total={total}
                showTotal={total => `共 ${total} 数据`}
                onChange={changeCurrentSize}
                pageSizeOptions={[10, 20, 50, 100]}
                showQuickJumper
                showSizeChanger
                className={styles.pageNation}
            />
            <SaleStrategy
                showModal={showModal}
                modalData={modalData}
                loading={loading}
                productEnum={productEnum}
                onCancel={() => setShowModal(false)}
                onConfirm={onConfirm}></SaleStrategy>
        </ViewContainer>
    )
}
export default AfterSale
