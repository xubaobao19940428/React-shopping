import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, Table, message, Radio } from 'antd';
import styles from './styles/EditModal.less';
import { useModel } from 'umi';
import { getAdvanceSaleSkuInfoGet, getAdvanceSaleAdd, getAdvanceSaleUpdate } from '@/services/product1'
import { filterData } from '@/utils/filter'
import moment from 'moment'
import { dealShowFileSrc } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const { Column, ColumnGroup } = Table;

// 新增/编辑预售弹窗
const EditModal = (props) => {
    const {type, visible, list, status, defaultValue, wareHouseList, presaleData, handleCancel} = props
    const [form] = Form.useForm();
    const { countries } = useModel('dictionary');
    const [filterCountryList, setFilterCountryList] = useState([])
    const [skuTableData, setSkuTableData] = useState([])
    const [presaleStatus, setPresaleStatus] =useState(1) // 1 未开始， 2 进行中， 3 已结束
    const [saleSpecType, setSaleSpecType] = useState([])
    const [saleSpecInfoList, setSaleSpecInfoList] = useState([])
    const [syncTempData, setSyncTempData] = useState({
        advanceType: '',
        advanceStock: null
    })
    const [productId, setProductId] = useState('')

    const handleSubmit = () => {
        // 表单验证
        form.validateFields().then(vals => {
            console.log(vals);
            const warehouseRules = {
                MY: ["0001", "0004"],
                SG: ["0001", "0004"],
                TH: ["0001", "0003"]
            };
            if (type === 'add') {
                if (warehouseRules[vals.countryCode] && warehouseRules[vals.countryCode].indexOf(vals.warehouseNo) < 0) {
                    message.error("预售国家和出库仓库不匹配，请重新选择！")
                    return
                }
                getAdd(vals)
            } else {
                getUpdate(vals)
            }
        });
    }
    //新增
    const getAdd = (val) => {
        console.log(skuTableData)
        let params = {
            countryCode: val.countryCode,
            deliveryDeadline:val.deliveryDeadline.valueOf(),
            startTime: val.timeList[0].valueOf(),
            endTime: val.timeList[1].valueOf(),
            endConfig: val.endConfig,
            purchaseConfig: val.purchaseConfig,
            warehouseNo: val.warehouseNo,
            advanceProductList: skuTableData
        }
        getAdvanceSaleAdd(params).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                handleCancel()
                message.success('新增预售商品成功！')
            }
        })
    }
    // 编辑
    const getUpdate = (val) => {
        let params = {
            advanceId: presaleData.advanceId,
            countryCode: val.countryCode,
            deliveryDeadline:val.deliveryDeadline.valueOf(),
            startTime: val.timeList[0].valueOf(),
            endTime: val.timeList[1].valueOf(),
            endConfig: val.endConfig,
            purchaseConfig: val.purchaseConfig,
            warehouseNo: val.warehouseNo,
            advanceProductList: skuTableData
        }
        getAdvanceSaleUpdate(params).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                handleCancel()
                message.success('编辑预售商品成功！')
            }
        })
    }
    const countryOptions = useMemo(() => {
        return countries.map(country => { return { label: country.nameCn, value: country.shortCode } });
    }, [countries])
    const searchProduct = () => {
        getProductData(productId)
    }
    const getProductData = (productId) => {
        getAdvanceSaleSkuInfoGet({productIdList: [productId]}).then(res => {
            if (res.ret.errCode === 0) {
                console.log(res)
                processData(res.data.advanceProductList)
            }
        })
    }
    const processData = (advanceProductList) => {
        let countryCodeList = [];
        _.forEach(advanceProductList,advanceProductItem => {
            countryCodeList.push(advanceProductItem.countryCode)
        })
        let filterCountry = []
        _.forEach(_.uniq(countryCodeList),countryCode=>{
        _.forEach(countries, country=>{
            if (countryCode === country.shortCode) {
                filterCountry.push(country)
            }
        })
        })
        setFilterCountryList(filterCountry)
        let data = []
        if (countryCodeList.length > 0) {
            _.forEach(advanceProductList,advanceProductItem => {
                if (advanceProductItem.countryCode === countryCodeList[0]) {
                    data.push(advanceProductItem)
                }
            })
        }
        let SpecInfoList = []
        let SpecType = []
        if (data[0]){
            _.forEach(data[0].skuValueList, item => {
                SpecType.push(item)
                let saleSpecInfoItem = {
                    standardInfo: null,
                    standardValueList: []
                }
                saleSpecInfoItem.standardInfo = {
                    attrId: item.attrId,
                    attrName: item.attrName
                }
                SpecInfoList.push(saleSpecInfoItem)
            })
        }
        setSaleSpecType(SpecType)
        _.forEach(data,rowItem => {
            _.forEach(rowItem.skuValueList,(skuValueItem, index)=>{
                rowItem[skuValueItem.attrId] = skuValueItem.valueName
                rowItem[skuValueItem.attrId+ '_value'] = skuValueItem.valueId
                let standardValueItem = {
                    attrId: skuValueItem.valueId,
                    valueName: skuValueItem.valueName
                }
                // 判断是否已存在规格值
                let flag = false
                _.forEach(SpecInfoList[index]['standardValueList'], item => {
                    if (skuValueItem.valueId === item.attrId) {
                        flag = true
                    }
                })
                if (!flag) {
                    SpecInfoList[index]['standardValueList'].push(standardValueItem)
                }
            })
        })
        setSaleSpecInfoList(SpecInfoList)
        setSkuTableData(data)
    }
    const handleChange = (val,mark,attr) => {
        console.log(val,mark,attr)
        let temp
        if (mark === 'mark') {
            temp = {...syncTempData,[attr]: val}
        } else if (mark === 'advanceType') {
            syncTempData.advanceType = val
        } else if (mark === 'advanceStock') {
            syncTempData.advanceStock = val.currentTarget.value
        }
        let data = JSON.parse(JSON.stringify(syncTempData))
        console.log(data)
        setSyncTempData({
            ...data,
            ...temp
        })
        console.log(syncTempData)
    }
    const syncColumnData = () => {
        let filterCondition = {} // 过滤条件
        let filterList = []
        console.log(syncTempData)
        _.forEach(syncTempData , (value, key) => {
            if (key.indexOf('attr') != -1) {
                console.log(key)
                filterCondition[key.substring(4)+'_value'] = value
            }
        })
        console.log(syncTempData)
        console.log(filterCondition)
        let commonData = filterData(syncTempData)
        console.log(commonData)
        commonData = _.pick(commonData, ['advanceType', 'advanceStock'])
        console.log(commonData)
        let data = JSON.parse(JSON.stringify(skuTableData))
        _.forEach(commonData, (value, key) => {
            _.forEach(data, row => {
                if (isSameSku(row, filterData(filterCondition))) {
                    console.log(row,key,value)
                    row[key] = value
                }
            })
        })
        console.log(data)
        setSkuTableData(data)
        console.log(skuTableData)
        message.success('一键同步完成！')
    }
    const isSameSku = (row, filterCondition) => {
        let flag  = true
        _.forEach(filterCondition, (value, key) => {
            if (row[key]) {
                if (row[key] != value) {
                    flag = false
                }
            } else {
                flag  = false
            }
        })
        console.log(flag)
        return flag
    }
    const disabledDate = (current) => {
        return current && current < moment().endOf('day').subtract(1,'day')
    }
    const changeProduct = (val) => {
        setProductId(val.currentTarget.value)
        form.setFieldsValue({
            productId:val.currentTarget.value
        })
    }
    const cancelModal = () => {
        form.resetFields();
        handleCancel()
    }
    useEffect(() => {
        if (type === 'edit') {
            // setSkuTableData(list)
            processData(list)
            setPresaleStatus(status)
        }
    }, [])
    return (
        <Modal width={1000} className={styles.editModal} maskClosable={false} title={type === 'add'?"新增预售商品":"编辑预售商品"} visible={visible} onCancel={cancelModal} onOk={handleSubmit}>

            <Form form={form} labelCol={{ span: 3 }} initialValues={defaultValue}>
                <FormItem rules={[{ required: true }]} label="商品ID" name="productId">
                    {
                        type === 'add' &&
                        <span>
                            <Input placeholder="请输入商品ID" allowClear style={{ width: 250 }} onChange={changeProduct}/>
                            <Button type="link" onClick={()=>{searchProduct()}}>确定</Button>
                        </span>
                    }
                    {
                        type === 'edit' &&
                        <div className={styles.productInfo}>
                            <img src={dealShowFileSrc(defaultValue.cover)} />
                            <div className={styles.productContent}>
                                <div>{defaultValue.productId}</div>
                                <div>{defaultValue.name}</div>
                            </div>
                        </div>
                    }
                </FormItem>
                <FormItem rules={[{ required: true }]} label="预售国家" name="countryCode">
                    <Select disabled={type === 'add' ? false : true} allowClear options={countryOptions} style={{ width: 200 }} />
                </FormItem>
                <FormItem rules={[{ required: true }]} label="预售时间" name="timeList">
                    <RangePicker disabledDate={disabledDate} disabled={[type === 'add' || presaleStatus === 1?false:true, type === 'add' || presaleStatus != 3?false:true]}/>
                </FormItem>
                <FormItem rules={[{ required: true }]} label="最迟发货时间" name="deliveryDeadline" extra="向用户承诺的最迟发货时间，且将展示于预售商品详情页，请谨慎填写">
                    <DatePicker disabledDate={disabledDate} disabled={!(type === 'add' || presaleStatus === 1)} style={{ width: 200 }} />
                </FormItem>
                <FormItem label="预售库存">
                    <div>
                        <div className={styles.syncBtn}>
                            <Button type="primary" onClick={syncColumnData}>同步该列</Button>
                        </div>
                        <div className={styles.useSelect}>
                            {
                                saleSpecInfoList.map(item => {
                                    return (
                                        <Select key={item.standardInfo.attrId} placeholder="请选择" value={syncTempData['attr'+item.standardInfo.attrId]} onChange={(val)=>{handleChange(val,'mark','attr'+item.standardInfo.attrId)}} style={{ width: 250 }}>
                                            {
                                                item.standardValueList.map(val=>{
                                                    return <Option value={val.attrId} key={val.attrId}>{val.valueName}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                })
                            }
                            <Select placeholder="请选择" defaultValue={syncTempData.advanceType} style={{ width: 120 }} onChange={(val)=>{handleChange(val, 'advanceType')}}>
                                <Option value={1}>预售</Option>
                                <Option value={2}>不预售</Option>
                            </Select>
                            <Input placeholder="预售库存" defaultValue={syncTempData.advanceStock} style={{ width: 120 }} onChange={(val)=>{handleChange(val, 'advanceStock')}}/>
                        </div>
                    </div>
                    <Table dataSource={skuTableData} bordered pagination={false} rowKey={record => record.skuId}>
                        <Column title="SkuCode" dataIndex="skuId" align="center" width={100} />
                        <Column title="SkuId" dataIndex="skuCode" align="center" width={100} />
                        {
                            saleSpecType.map(item => {
                                return <Column title={item.attrName} align="center" dataIndex={item.attrId} key={item.attrId} />

                            })
                        }
                        <Column title="是否预售" align="center" width={150} render={(text,record, index) => {
                            return(
                                <Select value={record.advanceType} style={{ width: 120 }} onChange={(val)=>{itemChange(val, 'advanceType', index)}} disabled={presaleStatus === 3 && type != 'add'}>
                                    <Option value={1}>预售</Option>
                                    <Option value={2}>不预售</Option>
                                </Select>
                            )
                        }} />
                        <Column title="预售库存" align="center" width={150} render={record => {
                            return <Input placeholder="预售库存" value={record.advanceStock} style={{ width: 120 }} disabled={presaleStatus === 3 && type != 'add'}/>
                        }}/>
                    </Table>
                </FormItem>
                <FormItem label="预售期后" required={true} name="endConfig">
                    <Radio.Group>
                        <Radio value={1}>
                            自动下架
                            <p>勾选后该商品将在预售期结束后被自动下架</p>
                        </Radio>
                        <Radio value={2}>
                            维持原样
                            <p>系统不对商品的销售状态进行任何自动修改</p>
                        </Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="采购控制" required={true} name="purchaseConfig">
                    <Radio.Group disabled={presaleStatus != 1 && type === 'edit'}>
                        <Radio value={1}>
                            自动推单
                            <p>每日8时，系统自动对过去一天未生成采购单的有效订单生成采购单</p>
                        </Radio>
                        <Radio value={2}>
                                手动推单
                                <p className={styles.hand}>人工手动在页面控制生成采购单，系统接到手动推单指令后，对预售期开始至昨日23:59:59未生成采购单的有效订单生成采购单；注意：选择此项需请在最迟退单时间前完成全部推单以免影响发货。</p>
                                <Form.Item shouldUpdate={(prevValues, curValues) => curValues.purchaseConfig == 2} className={styles.deadLine}>
                                {({ getFieldValue }) => {
                                    return getFieldValue('purchaseConfig') === 2 ? (
                                    <Form.Item
                                        name="purchaseDeadline"
                                        label="最迟推单时间："
                                        required={true}
                                    >
                                        <DatePicker allowClear showTime/>
                                    </Form.Item>
                                    ) : null;
                                }}
                                </Form.Item>
                        </Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="出库仓库" required={true} name="warehouseNo">
                    <Select placeholder="请选择" style={{ width: 200 }} disabled={!(type === 'add' || presaleStatus === 1)}>
                        {
                            wareHouseList.map(val=>{
                                return <Option value={val.value} key={val.value}>{val.label}</Option>
                            })
                        }
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default React.memo(EditModal);
