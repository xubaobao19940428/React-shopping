import React, { useState, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Row, Col, Card } from 'antd';
import styles from './index.less'
import { history } from 'umi'
import IDAddProduct from './Components/IDAddProduct'
import SearchProduct from './Components/SearchProduct'
import ImgSearch from './Components/ImgSearch';
const ProductPublish = () => {
    const styleInfo = { width: 180, height: 44, fontSize: 20 }
    const styleP = { lineHeight: '24px', fontWeight: 300, fontSize: 14, color: '#333333', marginBottom: 4 }
    const IdAddProductRef = useRef();
    const searchProductRef = useRef()
    const imgSearchRef = useRef()
    const addProduct = () => {
        history.push({
            pathname: '/product/backCategory',
            query: {
                type: 'addProduct'
            }
        })
    }
    const addIdProduct = () => {
        IdAddProductRef.current.changeVal(true);
    }
    const searchAddProduct = () => {
        searchProductRef.current.changeVal(true);
    }
    const imgSearchProduct = () => {
        imgSearchRef.current.changeVal(true)
    }
    return (
        <ViewContainer>
            <div className={styles['product-publish-wrapper']}>
                <div className={styles['product-publish']}>
                    <Row gutter={30}>
                        <Col className="gutter-row" span={6}>
                            <Card title="手工录入" className={styles['box-card']}>
                                <div className="publish-info" style={{ height: 340 }}>
                                    <p style={styleP}>1. 需要提前准备好商品的标题、图片、参数等各项资料；</p>
                                    <p style={styleP}>2. 依次录入商品的各项资料；</p>
                                    <p style={styleP}>3. 完成录入后，商品以草稿形式推送到审核列表中，审核成功即正式生效；</p>
                                    <p style={styleP}>4. 等待商品审核并上架。</p>
                                </div>
                                <div className="operate" style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="publish-button" style={styleInfo} ghost onClick={addProduct}>开始发布</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Card title="ID上货" className={styles['box-card']}>
                                <div className="publish-info" style={{ height: 340 }}>
                                    <p style={styleP}>1. 提前准备好1688等网站的商品ID或商品链接；</p>
                                    <p style={styleP}>2. 点击开始发布&gt;&gt;选择商品来源(目前仅支持1688)&gt;&gt;输入来源平台的商品ID，点击上传，系统将自动获取商品数据并自动填充到新增商品页；</p>
                                    <p style={styleP}>3. 检查并修改或补充商品信息，完成定价，然后点击保存；</p>
                                    <p style={styleP}>4. 等待商品审核并上架。</p>
                                </div>
                                <div className="operate" style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="publish-button" style={styleInfo} ghost onClick={addIdProduct}>开始上货</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Card title="搜索上货" className={styles['box-card']}>
                                <div className="publish-info" style={{ height: 340 }}>
                                    <p style={styleP}>1. 填写搜索关键词；</p>
                                    <p style={styleP}>2. 填写计划上货数量；</p>
                                    <p style={styleP}>3. 选择商品归属的后台类目；</p>
                                    <p style={styleP}>4. 点击确定上货，稍等5分钟后进去商品管理列表即可看到找货结果；</p>
                                    <p style={styleP}>5. 系统已经按照价格、重量等因素去除不符合要求的商品，并为您自动完成图片、标题的处理。</p>
                                </div>
                                <div className="operate" style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="publish-button" style={styleInfo} ghost onClick={searchAddProduct}>开始上货</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Card title="以图找货" className={styles['box-card']}>
                                <div className="publish-info" style={{ height: 340 }}>
                                    <p style={styleP}>1. 本功能为试行版，主要以人工操作为主；</p>
                                    <p style={styleP}>2. 选择目标图片并下载；</p>
                                    <p style={styleP}>3. 将图片上传至1688的以图找货功能中进行识别；</p>
                                    <p style={styleP}>4. 从1688给出的结果中，挑选符合要求的商品并记录商品ID；</p>
                                    <p style={styleP}>5. 最后使用ID上货完成商品发布即可。</p>
                                </div>
                                <div className="operate" style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="publish-button" style={styleInfo} ghost onClick={imgSearchProduct}>开始找货</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <IDAddProduct ref={IdAddProductRef}></IDAddProduct>
                <SearchProduct ref={searchProductRef}></SearchProduct>
                <ImgSearch ref={imgSearchRef}></ImgSearch>
            </div>

        </ViewContainer>
    )
}
export default ProductPublish