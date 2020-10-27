import React, { useMemo, useState, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import styles from './styles/index.less';
import { Form, Row, Col, Input, Button, Checkbox, Radio, Select, message } from 'antd';
import { useModel, history } from 'umi';
import { TranslateLang } from '@/components'
import PagingSelect from '@/components/PagingSelect/index'
import { supplierBasePage } from '@/services/supplier';
import { brandInfoGet } from "@/services/product1";
import { FormInstance } from 'antd/lib/form';

const FormItem = Form.Item;
const { Option } = Select
// 商品基础信息
const ProductBaseInfo = React.forwardRef((props, ref) => {
    const { data: { cates }, editType = 'add', updateSaleCountries,titleData } = props;
    console.log('ProductBaseInfo------')
    const form = React.createRef(FormInstance);
    const { countries = [] } = useModel('dictionary');
    const { commonEnum } = useModel('useProEdit'); // 公共枚举
    const [defaultFormVal,setDefaultFormVal] = useState({
        productType:'',
        productNature:'',
        brandId:'',
        supplierId:'',
        orgUrl:''
    })
    // 销售国家
    const [saleCountry, setSaleCountry] = useState([]);
    // 供应商
    const [supplierList, setSupplierList] = useState([]);
    const [supplierParam, setSupplierParam] = useState({
        pageNum: 0,
        pageSize: 10,
        loading: false,
        finish: false,
        supplierName: ''
    })
    const [titleDataDefault,setTitleData] =useState(titleData||{})
    // 品牌
    const [brandList, setBrandList] = useState([])
    // 标题描述
    const titleRef = useRef()
    const descRef = useRef()

    // 设置商品分类显示
    const setCate = useMemo(() => {
        return cates && cates.cateNames ? cates.cateNames.join(" >> ") : ""
    }, [cates]);

    // 初始化销售国家
    const initSaleCountry = useCallback(() => {
        const arr = countries.map(item => {
            let checked = props.countryList.find((key) => key == item.shortCode)
            return {
                countryName: item.nameCn,
                countryCode: item.shortCode,
                checked: checked ? true : false,
                status: item.status?item.status:"1",
                disable: true
            }
        });
        setSaleCountry(arr);
    }, [countries, props.countryList]);

    // 修改销售国家上下架状态
    const changeSaleCountryActive = (value, arr, index) => {
        const newArr = [...arr];
        newArr[index].status = value;
        setSaleCountry(newArr);
    }

    // 分页获取供应商列表
    function handleSearchSupplier(data) {
        let param = data ? { ...data } : { ...supplierParam }
        setTimeout(() => {
            if (param.loading || param.finish) {
                return
            }
            param.pageNum += 1
            param.loading = true
            setSupplierParam(param)
            supplierBasePage({
                supplierName: param.supplierName,
                page: {
                    pageNum: param.pageNum,
                    pageSize: param.pageSize,
                }
            }).then(res => {
                param.loading = false
                if (res.ret.errcode === 1) {
                    const SupplierEnum = res.list.map(item => {
                        return {
                            label: item.supplierName,
                            value: item.supplierId
                        }
                    });
                    let list = supplierList.concat(SupplierEnum)
                    if (data) {
                        list = SupplierEnum
                    }
                    setSupplierList(list);
                    if (param.pageSize * param.pageNum >= res.total) {
                        param.finish = true
                    }
                }
                setSupplierParam(param)
            })
        }, 800)
    }

    // 模糊搜索供应商
    function searchSupplier(val) {
        let param = { ...supplierParam }
        param.pageNum = 0
        param.supplierName = val ? val : ''
        param.finish = false
        setSupplierParam(param)
        handleSearchSupplier(param)
    }
    // 品牌
    const brandGet = useCallback(() => {
        brandInfoGet({
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }).then(res => {
            if (res.ret.errCode == 0) {
                setBrandList(res.data.list)
            }
        })
    }, [])

    useEffect(() => {
        initSaleCountry();
    }, [countries, props.countryList]);

    useEffect(() => {
        handleSearchSupplier()
        brandGet()
    }, [])


    useImperativeHandle(ref, () => {
        return {
            // 获取基本信息数据
            getData: () => {
                // 验证表单并返回promise
                // return new Promise((resolve, reject) => {
                    let title=[],desc=[]
                    if(!titleRef.current.getData()){
                        return 
                    }
                    if(descRef.current.getData()){
                        desc = descRef.current.getData()
                        // .map(item=>{
                        //     desc.push({
                        //         languageCode:item.languageCode,
                        //         name:item.name
                        //     })
                        // })
                    }
                    
                    title = titleRef.current.getData()
                    // .map(item=>{
                    //       console.log(item)
                    //     title.push({
                    //         languageCode:item.languageCode,
                    //         name:item.name
                    //     })
                    // })
                    console.log(desc,title)
                    let values=form.current.getFieldsValue()
                    // .then(values => {
                        // 是否选择国家
                       
                        const isSelectCountry = () => {
                            return saleCountry.some(item => item.checked);
                        }

                        // 统一使用请提示报错
                        let errMsg = "";
                        // 根据字段设置错误提示
                        if (!isSelectCountry()) {
                            errMsg = "请选择销售国家";
                        } else if (values.productType == undefined) {
                            errMsg = "请选择商品类型";
                        } else if (values.productNature == undefined) {
                            errMsg = '请选择货物性质'
                        } else if (!values.brandId) {
                            errMsg = '请选择品牌'
                        } else if (!values.supplierId) {
                            errMsg = '请选择供应商'
                        }
                        if (errMsg) {
                            message.warning(errMsg)
                            return false
                        }
                        const params = {
                            saleCountry: saleCountry.filter(country => {
                                return country.checked
                            }),
                            brandId: values.brandId,
                            supplierId: values.supplierId,
                            productType:values.productType,
                            productNature:values.productNature,
                            cateId: cates.cateId ? cates.cateId : history.location.query.cateId,
                            title:title,
                            orgUrl:values.orgUrl,
                            subTitle:desc,
                        }
                        return params
                    //     resolve(params);
                    // }).catch(err => {
                    //     reject(err);
                    // })
                // });
            }
        }
    });
    useEffect(() => {
        form.current.setFieldsValue(props.defaultFormVal)
    },[props.defaultFormVal])
    return (
        <div className={styles.baseInfo}>
            <Form ref={form} initialValues={defaultFormVal}>
                <Row>
                    <Col>
                        <FormItem label="商品分类" required name="cateId"><span className={styles.cateType}>{setCate} <a onClick={() => history.push({
                            pathname: '/product/backCategory',
                            query: {
                                type: 'addProduct'
                            }
                        })}>修改分类/销售国家</a></span></FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="销售国家" required name="saleCountry">
                            <div className={styles.activeCountry}>
                                {
                                    saleCountry.map((country, index) => <div key={country.countryCode} className={styles.activeItem}>
                                        <div className={styles.check}>
                                            <Checkbox disabled={country.disable} checked={country.checked}>{country.countryName}</Checkbox>
                                        </div>
                                        <div hidden={!country.checked} className={styles.radio} onChange={e => changeSaleCountryActive(e.target.value, saleCountry, index)}>
                                            <Radio.Group value={country.status}>
                                                <Radio value="1">上架</Radio>
                                                <Radio value="2">下架</Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>)
                                }
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="商品类型" required name="productType">
                            <Select allowClear>
                                {commonEnum.type && commonEnum.type.map(item => {
                                    return <Option value={item.code} key={item.code}>{item.name}</Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="货物性质" required name="productNature">
                            <Radio.Group>
                                {commonEnum.nature && commonEnum.nature.map((item, index) => {
                                    return <Radio value={item.code} key={index}>{item.name}</Radio>
                                })}
                            </Radio.Group>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="品牌" required name="brandId">
                            <Select allowClear>
                                {brandList.length != 0 && brandList.map(item => {
                                    return <Option value={item.brandId} key={item.brandId}>{item.nameCn}</Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="供应商" required name="supplierId">
                            <PagingSelect options={supplierList}
                                pagingCallback={handleSearchSupplier}
                                onSearch={searchSupplier}
                                loading={supplierParam.loading}
                                finish={supplierParam.finish}
                                showSearch={true}></PagingSelect>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="商品标题">
                              <TranslateLang requiredLang={['cn', 'en']} ref={titleRef} defaultData={titleData.title}>请仔细填写商品标题，一键翻译功能将帮助你从中文快速翻译到其他语种，且不会覆盖您已填写的内容</TranslateLang>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="宣传文案">
                            <TranslateLang ref={descRef} defaultData={titleData.subTitle}>如有需要可为商品填写宣传文案，它将展示在商品标题的下方</TranslateLang>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="原始链接" name="orgUrl">
                            <Input />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
});

export default React.memo(ProductBaseInfo, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
});
