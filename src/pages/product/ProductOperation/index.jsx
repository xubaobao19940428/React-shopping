import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input, Row, Col,Card } from 'antd';
import styles from './styles/index.less'
import MyIcon from '@/components/IconFont/IconFont'
import {history} from 'umi'
/**
/*  
/*
/*
*/
const style = { padding: '10px',height:'200px',boxShadow:'0 2px 12px 0 rgba(0,0,0,.1)',boxSizing:'border-box' };
const ProductOperation = () => {
    const clickPage=(type)=>{
        if(type=='sale'){
            history.push({
                pathname:'/product/saleManage'
            })
        }else if(type=='category'){
            history.push({
                pathname:'/product/frontCategory'
            })
        }else if(type=='words'){
            history.push({
                pathname:'/product/wordsManage'
            })
        }else if(type=='same'){
            history.push({
                pathname:'product/sameProduct'
            })
        } else if (type === 'sort') {
            history.push({
                pathname: '/product/categorySort'
            })
        }
    }
    return (
        <div className={styles['container']}>
            <Row gutter={16}>
                <Col className="gutter-row" span={8} style={{cursor:'pointer'}} onClick={()=>clickPage('sale')}>
                    <div style={style}>
                    <Card bordered={false}>
                        <p className={styles['title']}><MyIcon type="icon-xiaoshou" style={{fontSize:28,marginRight:6}}></MyIcon>销售管理</p>
                        <div className={styles['content']}><span>查看、控制商品在APP端呈现的销量数据</span></div>
                    </Card>
                    </div>
                </Col>
                <Col className="gutter-row" span={8} style={{cursor:'pointer'}} onClick={()=>clickPage('category')}>
                    <div style={style}>
                    <Card bordered={false}>
                        <p className={styles['title']}><MyIcon type="icon-classifi-xz" style={{fontSize:28,marginRight:6}}></MyIcon>前台类目</p>
                        <div className={styles['content']}><span>管理APP前台类目</span></div>
                    </Card>
                    </div>
                </Col>
                <Col className="gutter-row" span={8} style={{cursor:'pointer'}} onClick={()=>clickPage('sort')}>
                    <div style={style}>
                    <Card bordered={false}>
                        <p className={styles['title']}><MyIcon type="icon-paixu" style={{fontSize:28,marginRight:6}}></MyIcon>分类排序</p>
                        <div className={styles['content']}><span>查看、控制APP类目列表中，各个商品的展示顺序</span></div>
                    </Card>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} style={{marginTop:20}}>
                <Col className="gutter-row" span={8} style={{cursor:'pointer'}} onClick={()=>clickPage('words')}>
                    <div style={style}>
                        <Card bordered={false}>
                        <p className={styles['title']}><MyIcon type="icon-Page-" style={{fontSize:28,marginRight:6}}></MyIcon>词库管理</p>
                        <div className={styles['content']}><span>管理商品标题/属性中的敏感词；维护能够提升商品搜索丰富度的的同义词</span></div>
                        </Card>
                    </div>
                </Col>
                <Col className="gutter-row" span={8} style={{cursor:'pointer'}} onClick={()=>clickPage('same')}>
                    <div style={style}>
                    <Card bordered={false}>
                        <p className={styles['title']}><MyIcon type="icon-chaxiangsi" style={{fontSize:28,marginRight:6}}></MyIcon>同款商品</p>
                        <div className={styles['content']}><span>输入1688商品链接，系统自动为你寻找同款价更优的商品</span></div>
                    </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default ProductOperation;