import React, { useState, useCallback, forwardRef, useEffect, useRef,useImperativeHandle } from 'react';
import { Button, Space, Form, Table, Input, Select,InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles/index.less'
import { FormInstance } from 'antd/lib/form';
import {useModel} from "@@/plugin-model/useModel";
import { dealShowFileSrc } from '@/utils/utils'
/**
/*
/* 规格属性头部表格
/*
*/
const { Option } = Select
const TopTableHeader = React.forwardRef((props, ref) => {
    const form = React.createRef(FormInstance);
    const { commonEnum,hasSelectedAttr,editTopHeader} = useModel('useProEdit'); // 公共枚举

    const [dataSource, setDataSource] = useState([{
        imgUrl: '',
        index: 1
    }])
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setSkuTableDefault()
            },
            getDataSourceNew:()=>{
                return dataSource
            },
            setTopDataSource:(newVal)=>{
                setDataSource(newVal)
            }
        }

    });
    const [attrColumns, setAttrColumns] = useState([
        {
            dataIndex: 'imgUrl',
            width: 150,
            align: 'center',
            fixed: 'left',
            render: (text, row, index) => {
                return <div className={styles['imgContent']}>
                    {
                        row.imgUrl ? <div>
                            <img src={dealShowFileSrc(row.imgUrl)} style={{ width: 90, height: 90 }}></img>
                            <div className={styles['operate-area']} >
                                <DeleteOutlined onClick={(e) => deleteImg(e,dataSource,index)} />
                            </div>
                        </div> : <PlusOutlined onClick={()=>addImg(dataSource,index)}/>
                    }

                </div>
            }
        },
        {
            dataIndex: 'saleWay',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'saleWay']}>
                    <Select style={{ width: "100%" }} placeholder="销售方式" value={row.saleWay}>
                        {
                            commonEnum.saleWay && commonEnum.saleWay.map((item, index) => {
                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            }
        },
        {
            dataIndex: 'deliveryWay',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'deliveryWay']}>
                    <Select style={{ width: "100%" }} placeholder="发货方式" value={row.deliveryWay}>
                        {
                            commonEnum.deliveryWay && commonEnum.deliveryWay.map((item, index) => {
                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>

            }
        },
        {
            dataIndex: 'warehouse',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'warehouse']}>
                    <Select style={{ width: "100%" }} placeholder="入库仓库">
                        {
                            commonEnum.warehourse && commonEnum.warehourse.map((item, index) => {
                                return <Option value={item.warehouseNo} key={item.code}>{item.warehouseName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>

            }
        },
        {
            dataIndex: 'weight',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'weight']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                </Form.Item>

            }
        },
        {
            dataIndex: 'specification',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <span>单品规格(cm)</span>
                    <Form.Item
                        name={['data', index, 'specification','l']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'specification','w']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'specification','h']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                </div>
            }
        },
        {
            dataIndex: 'boxSpecification',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <span>箱体规格(cm)</span>
                    <Form.Item
                        name={['data', index, 'boxSpecification','l']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'boxSpecification','w']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'boxSpecification','h']}
                        className={styles['form-item0']}
                    >
                       <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                </div>
            }
        },
        {
            dataIndex: 'supplyPrice',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'supplyPrice']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                </Form.Item>
            }
        },
        {
            dataIndex: 'commission',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'commission']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            dataIndex: 'price',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'price']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            dataIndex: 'priceVip',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'priceVip']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            dataIndex: 'activePrice',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'activePrice']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            dataIndex: 'supplierCode',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'supplierCode']}>
                    <Input placeholder="请输入商品编码" style={{ width: '100%' }} disabled={props.canEditCountry!=props.countryCode}></Input>
                </Form.Item>

            }
        },
        {
            width: 150,
            align: 'center',
        },
        {
            width: 150,
            align: 'center',
        },
        {
            dataIndex: 'qrCode',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'qrCode']}>
                    <Input placeholder="请输入商品条码" style={{ width: '100%' }} disabled={props.canEditCountry!=props.countryCode}></Input>
                </Form.Item>

            }
        },
        {
            width: 150,
            align: 'center',
        },
        {
            width: 150,
            align: 'center',
        },
        {
            dataIndex: 'saleStatus',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'saleStatus']}>
                    <Select style={{ width: "100%" }} placeholder="销售状态" defaultValue={row.saleStatus}>
                        {
                            commonEnum.status && commonEnum.status.map((item, index) => {
                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            }
        },
    ])
    const setSkuTableDefault = () => {
        props.setInitialValues({data:form.current.getFieldsValue(),imgUrl:dataSource[0].imgUrl})
    }
    //删除图片
    const deleteImg = (e,oldDataSource,index)=>{
       
        props.deleteImg(index)
    }
    const addImg = (oldDataSource,index)=>{
       props.addImg({type:'top',index:index})
    }
    useEffect(()=>{
        console.log(props.countryCode)
    },[props.countryCode])
    return (
        <div>
            <Form ref={form}>
                <Table
                    showHeader={false}
                    pagination={false}
                    scroll={{ x: '100%' }}
                    columns={editTopHeader.length!=0 ? [...editTopHeader,...attrColumns]:attrColumns}
                    dataSource={props.dataSource?props.dataSource:dataSource}
                    rowKey="index"
                />
            </Form>
        </div>

    )
})
export default TopTableHeader;
