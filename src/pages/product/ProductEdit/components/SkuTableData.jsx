import React, { useState, useCallback, forwardRef, useEffect, useRef,useImperativeHandle } from 'react';
import { Button, Space, Form, Table, Input, Select,InputNumber} from 'antd';
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
const {Columns} = Table
const SkuTableData = React.forwardRef((props, ref) => {
    const detailForm = React.createRef(FormInstance);
    const [dataSource, setDataSource] = useState([{}])
    const [skuTableDataDefault,setSkuTableDataDefault]=useState({data:[]})//sku表单的值
    const {commonEnum,editHeader} = useModel('useProEdit'); // 公共枚举
    // const [newCommOnEnum,setNewCommOnEnum] = useState({})
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            getDataSourceNew:()=>{
                return dataSource
            },
            changeDataSource:(newVal)=>{
                console.log(newVal)
                setDataSource(newVal)
            },
            getSkuFormValues:()=>{
                return detailForm.current.getFieldsValue()
            }
        }
    });
    const [attrColumns, setAttrColumns] = useState([
        {
            title: '规格图',
            dataIndex: 'image',
            width: 150,
            align: 'center',
            fixed: 'left',
            render: (text, row, index) => {
                return <div className={styles['imgContent']}>
                    {
                        row.imgUrl ? <div>
                            <img src={dealShowFileSrc(row.imgUrl)} style={{ width: 90, height: 90 }}></img>
                            <div className={styles['operate-area']} >
                                <DeleteOutlined onClick={(e) => deleteImg(index)} />
                            </div>
                        </div> : <PlusOutlined onClick={()=>addImg(dataSource,index)}/>
                    }

                </div>
            }
        },
        {
            title: '销售方式',
            dataIndex: 'saleWay',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'saleWay']}>
                    <Select style={{ width: "100%" }} placeholder="销售方式" defaultValue={row.saleWay}>
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
            title: '发货方式',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'deliveryWay']}>
                    <Select style={{ width: "100%" }} placeholder="发货方式" defaultValue={row.deliveryWay}>
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
            title: '入库仓库',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'warehouse']}>
                    <Select style={{ width: "100%" }} placeholder="入库仓库">
                        {
                            commonEnum.warehourse && commonEnum.warehourse.map((item, index) => {
                                return <Option value={item.warehouseNo} key={index}>{item.warehouseName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            }
        },
        {
            title: '重量(Kg)',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'weight']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} placeholder="重量(KG)" disabled={props.canEditCountry!=props.countryCode}/>
                </Form.Item>

            }
        },
        {
            title: (currentPageData) => {
                return <div>
                    <div>单品规格(cm)</div>
                    <div>(长,宽,高)</div>
                </div>
            },
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <Form.Item
                        name={['data', index, 'specification', 'l']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'specification', 'w']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'specification', 'h']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                </div>
            }
        },
        {
            title: (currentPageData) => {
                return <div>
                    <div>箱体规格(cm)</div>
                    <div>(长,宽,高)</div>
                </div>
            },
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <div>
                    <Form.Item
                        name={['data', index, 'boxSpecification', 'l']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'boxSpecification', 'w']}
                        className={styles['form-item0']}
                    >
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                    <Form.Item
                        name={['data', index, 'boxSpecification', 'h']}
                        className={styles['form-item0']}
                    >
                        {/* <Input style={{ width: '100%' }} defaultValue={0}></Input> */}
                        <InputNumber min={0}   defaultValue={0} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                    </Form.Item>
                </div>
            }
        },
        {
            title: (currentPageData) => {
                return <div>
                    <div>供货价</div>
                    <div>
                        <Select style={{ width: "100%" }} placeholder="请选择供货价" defaultValue={props.currencyCode}  onChange={(value)=>selectCurrency(value)} disabled={props.canEditCountry!=props.countryCode}>
                        {
                            commonEnum.currency && commonEnum.currency.map((item, index) => {
                                return <Option value={item.currencyCode} key={item.code}>{item.name}</Option>
                            })
                        }
                    
                        </Select></div>
                </div>
            },
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'supplyPrice']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} disabled={props.canEditCountry!=props.countryCode}/>
                </Form.Item>

            }
        },
        {
            title: '佣金率%',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'commission']}>
                    {/* <Input placeholder="佣金率" style={{ width: '100%' }}></Input> */}
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} placeholder="佣金率%"/>
                </Form.Item>

            }
        },
        {
            title: '划线价(MYR)',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'price']}>
                    {/* <Input placeholder="划线价" style={{ width: '100%' }}></Input> */}
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            title: 'VIP价(MYR)',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'priceVip']}>
                   <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            title: '建议活动价(MYR)',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'activePrice']}>
                    <InputNumber min={0}  step={0.01} defaultValue={0.00} style={{width:'100%'}} />
                </Form.Item>

            }
        },
        {
            title: '供应商商品编码',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'supplierCode']}>
                    <Input placeholder="请输入商品编码" style={{ width: '100%' }} disabled={props.canEditCountry!=props.countryCode}></Input>
                </Form.Item>

            }
        },
        {
            title: 'skuCode',
            width: 150,
            align: 'center',
            render:(text,row,index)=>{
                if(row.skuCode){
                return <span>{row.skuCode}</span>
                }else{
                    return <span>-</span>
                }
            }
        },
        {
            title: 'Fingo商品固定编码',
            width: 150,
            align: 'center',
            render:(text,row,index)=>{
                if(row.skuCodeKey){
                return <span>{row.skuCodeKey}</span>
                }else{
                    return <span>-</span>
                }
            }
        },
        {
            title: '商品条形码',
            width: 150,
            align: 'center',
            render: (text, row, index) => {
                return <Form.Item name={['data', index, 'qrCode']}>
                    <Input placeholder="请输入商品条码" style={{ width: '100%' }} disabled={props.canEditCountry!=props.countryCode}></Input>
                </Form.Item>

            }
        },
        {
            title: '商品组合',
            width: 150,
            align: 'center',
        },
        {
            title: '库存',
            width: 150,
            align: 'center',
            render:(text,row,index)=>{
                if(row.inventory){
                return <span>{row.inventory}</span>
                }else{
                    return <span>-</span>
                }
            }
        },
        {
            title: '销售状态',
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
    const addImg = (oldDataSource,index)=>{
        props.addImg({type:'detail',index:index})
     }
     const deleteImg=(index)=>{
         props.deleteImg(index)
     }
     const handleChange = (countryCode,allValues)=>{
         props.changeSkuFormData({countryCode:countryCode,values:allValues})
     }
     const selectCurrency =(value)=>{
        props.setCurrencyCode(value)
     }
    useEffect(() => {
        detailForm.current.setFieldsValue(props.defaultValue[props.countryCode])
    }, [props.defaultValue])
    // useEffect(() => {
    //     let newComm = JSON.parse(JSON.stringify(commonEnum))
    //     setNewCommOnEnum(newComm)
    // }, [commonEnum])
    return (
        <Form ref={detailForm} initialValues={skuTableDataDefault} onValuesChange={(changedValues,allValues) => handleChange(props.countryCode, allValues)}>
            <Table
                pagination={false}
                scroll={{ x: '100%' }}
                columns={editHeader.length!=0?[...editHeader,...attrColumns]:attrColumns}
                dataSource={props.dataSource?props.dataSource:dataSource}
                rowKey="index"
            />
        </Form>

    )
})
export default SkuTableData;
