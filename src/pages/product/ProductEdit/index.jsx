import React, { useCallback, useState, useEffect, useRef } from 'react';
import styles from './styles/index.less';
import ViewContainer from '@/components/ViewContainer';
import { Button, message } from 'antd';
import { history } from 'umi';
import { batchGetProductAttr, getUpperRelatedCategoryById, GetProductEnumInfo, createProduct, updateProduct } from '@/services/product1'
// 模块容器
import SectionWrapper from './components/SectionWrapper';
// 主要组成模块
import ProductBaseInfo from './ProductBaseInfo';   //基本信息
import ProductParam from './ProductParam';  //商品参数
import ProductMultiMedia from './ProductMultiMedia';   //图片视频
import ProductServeInfo from './ProductServeInfo';  //服务承诺
import ProductSpecsAttr from './ProductSpecsAttr';  //规格属性
//仓库
import { wmsWarehouse } from '@/services/erp'
//服务承诺
import { filterData } from '@/utils/filter';
import { FormInstance } from 'antd/lib/form';
import 'lodash'
import { useModel } from "@@/plugin-model/useModel";
// 商品编辑页面
const title = [
    {
        languageCode: 'cn',
        name: ''
    },
    {
        languageCode: 'en',
        name: ''
    },
    {
        languageCode: 'ms',
        name: ''
    },
    {
        languageCode: 'th',
        name: ''
    },
    {
        languageCode: 'id',
        name: ''
    },
]
const ProductEdit = () => {
    // 编辑类型：query存在productId则为编辑状态，其他为新增
    const [editType, setEditType] = useState('add');
    const [orgId, setOrgId] = useState('')
    const [productId, setProductId] = useState('')
    const multiMediaRef = React.useRef()
    const { commonEnum, setCommonEnum, updateSpuCountryInfo, changeSkuTableHeader } = useModel('useProEdit'); // 公共枚举
    const { countries, changeCountryVal } = useModel('dictionary');
    // 基本信息
    const [baseInfo, setBaseInfo] = useState({});
    const [defaultBaseInfoData, setDefaultBaseInfoData] = useState({

    })
    const [titleData, setTitleData] = useState({
        title: title,
        subTitle: title
    })
    // 销售国家
    const [saleCountry, setSaleCountry] = useState([])
    const baseInfoRef = useRef()

    //商品参数
    const [paramAttrList, setParamAttrList] = useState([])
    const paramRef = useRef()
    const [paramsDefaultVal, setParamsDefaultVal] = useState({})
    //图片视频
    const [mediaInfo, setMediaInfo] = useState({})
    //规格属性
    const [standardAttrList, setStandardAttrList] = useState([])
    const [selectAttr, setSelectAttr] = useState([])
    const productSpaceRef = useRef()

    //服务承诺
    const productServeInfoRef = useRef()

    // 保存商品编辑数据
    const save = (type) => {
        // 基本信息模块数据
        let arr = []
        let baseInfo = null
        // 商品参数数据
        let attrValueInfo = null
        // 图片视频模块数据
        let allMediaInfo = null
        // 服务承诺模块数据
        let allServiceInfo = null
        // 规格属性模块数据
        let standardAttrInfo = null

        baseInfo = baseInfoRef.current.getData()
        arr.push(
            new Promise((resolve, reject) => {
                if (baseInfo) {
                    resolve(baseInfo)
                } else {
                    reject(false)
                }
            })
        )

        attrValueInfo = paramRef.current.getData()
        arr.push(
            new Promise((resolve, reject) => {
                if (attrValueInfo) {
                    resolve(attrValueInfo)
                } else {
                    reject(false)
                }
            })
        )
        allMediaInfo = multiMediaRef.current.getData()
        arr.push(
            new Promise((resolve, reject) => {
                if (allMediaInfo) {
                    resolve(allMediaInfo)
                } else {
                    reject(false)
                }
            })
        )
        allServiceInfo = productServeInfoRef.current.validateForm()
        arr.push(
            new Promise((resolve, reject) => {
                if (allServiceInfo) {
                    resolve(allServiceInfo)
                } else {
                    reject(false)
                }
            })
        )
        standardAttrInfo = productSpaceRef.current.spaceAttrValue()
        arr.push(
            new Promise((resolve, reject) => {
                if (standardAttrInfo) {
                    resolve(standardAttrInfo)
                } else {
                    reject(false)
                }
            })
        )
        Promise.all(arr).then(data => {
            if (data) {
                if (baseInfo.productType === 10) {
                    const specification = standardAttrInfo[0].skuBase.specification.split(",");
                    // 长宽高和体积其中一个为0，则中断提交，提示：批发商品必须填写好单品体积
                    if (specification.indexOf("0") >= 0) {
                        message.error("批发商品必须填写好单品体积");
                        return;
                    }
                }
                if (baseInfo) {
                    formatProductData(baseInfo, attrValueInfo, allMediaInfo, allServiceInfo, standardAttrInfo)
                }
            }
        }).catch(error => {
            console.log('未填写完全', error)
        })
        // 当商品类型为批发商品（商品id为10），单品体积必填

        // // 提交参数
        // const submitParams = {
        //     cateId,
        // }
        // console.log(submitParams);
        // // 根据访问类型请求接口
        // switch (type) {
        //     case 'add':
        //         // TODO 构建新增提交参数
        //         break;

        //     case 'edit':
        //         // TODO 构建编辑提交参数
        //         break;
        //     default:
        //         break;
        // let allRef = productServeInfoRef
        // productServeInfoRef.map(item=>{
        //     console.log(item)
        // })
        // }

        /**服务承诺的校验 */
        // productServeInfoRef.current.validateForm()
        // for(var i =0;i<saleCountry.length;i++){
        //     if(!defaultProductServeInfo[saleCountry[i].countryCode]['afterSalePledge']){
        //         message.error('售后策略未填写')
        //         return false
        //     }
        // }
    }
    const formatProductData = (baseInfo, attrValueInfo, allMediaInfo, allServiceInfo, standardAttrInfo) => {
        let productReq = {}
        if (productId && editType !== 'copy') {
            productReq.productId = productId
        }
        productReq.cateId = baseInfo.cateId + ''
        productReq.productSaleCountryInfoList = baseInfo.saleCountry
        productReq.productType = baseInfo.productType
        productReq.productNature = baseInfo.productNature
        productReq.brandInfo = {
            brandId: baseInfo.brandId
        }
        productReq.supplierInfo = {
            supplierId: baseInfo.supplierId
        }
        // productReq.title = baseInfo.title
        // productReq.subTitle = baseInfo.subTitle
        productReq.productParams = attrValueInfo
        if (editType !== 'copy') {
            productReq.orgId = orgId
            productReq.orgUrl = baseInfo.orgUrl
        }

        let productCountry = []

        // _.forEach(saleCountry, (country) => {
        // 上下架状态
        let shelveStatus = null
        _.forEach(baseInfo.saleCountry, (shelve) => {
            let productCountryItem = {}
            productCountryItem.countryCode = shelve.countryCode
            productCountryItem.status = shelve.status
            _.forEach(allServiceInfo, (serviceInfo, key) => {
                if (shelve.countryCode == key) {
                    productCountryItem.freightType = serviceInfo.freightType
                    if (serviceInfo.freightType == 2) {
                        productCountryItem.freightId = serviceInfo.freightId
                    } else {
                        productCountryItem.freightId = '0'
                    }
                }
            })
            productCountry.push(productCountryItem)
            // })
        })
        let picAndVideoList = []
        baseInfo.subTitle.map((subTitleName, index) => {
            _.forEach(allMediaInfo, (item, key) => {
                if (subTitleName.languageCode == key) {
                    let picAndVideoItem = {}

                    let rotationPicsList = []
                    _.forEach(item.rotationPics, (rotation) => {
                        rotationPicsList.push(rotation.url)
                    })

                    let detailPicsList = []
                    _.forEach(item.detailPics, (detail) => {
                        detailPicsList.push(detail.url)
                    })
                    picAndVideoItem.languageCode = key
                    picAndVideoItem.image = rotationPicsList[0] //商品主图 rotation 第一张
                    picAndVideoItem.rotation = rotationPicsList.toString()
                    picAndVideoItem.video = item.video ? item.video : ''
                    picAndVideoItem.detail = detailPicsList.toString()
                    picAndVideoItem.form = detailPicsList.toString()
                    picAndVideoItem.desc = item.desc ? item.desc : ''
                    picAndVideoItem.subTitle = subTitleName.name ? subTitleName.name : ''
                    picAndVideoItem.title = baseInfo.title[index].name ? baseInfo.title[index].name : ''
                    picAndVideoList.push(picAndVideoItem)
                }
            })

        })

        let pledgeCountryInfoList = []
        _.forEach(allServiceInfo, (serviceInfo, key) => {
            let pledgeCountryInfoItem = {}
            pledgeCountryInfoItem.countryCode = key
            pledgeCountryInfoItem.afterSalePledge = {
                pledgeId: serviceInfo.afterSalePledge
            }
            pledgeCountryInfoItem.arrivalPledge = {
                pledgeId: serviceInfo.arrivalPledge
            }
            pledgeCountryInfoList.push(pledgeCountryInfoItem)
        })
        productReq.productSpuCountryInfoList = productCountry
        // productReq.productCountry = productCountry
        // productReq.pledgeInfo = pledgeCountryInfoList

        productReq.productSkuInfo = standardAttrInfo
        console.log('pledgeCountryInfoList', pledgeCountryInfoList)
        productReq.productSpuCountryInfoList.map(item => {
            pledgeCountryInfoList.map(child => {
                if (item.countryCode == child.countryCode) {
                    item.pledgeInfo = {
                        afterSalePledge: child.afterSalePledge.pledgeId,
                        arrivalPledge: child.arrivalPledge.pledgeId
                    }
                }
            })
        })
        productReq.productLanguageInfoList = picAndVideoList
        // productReq.productSpuCountryInfoList =[]
        console.log(productReq, '提交数据');

        if (editType === 'add' || editType === 'copy') {
            addProduct(productReq)
        }
        // else if (this.editType === 'edit') {
        //     this.editProduct(productReq)
        // } else if (this.editType === 'check') {
        //     if (!this.checkPass) {
        //         this.updateDraft(productReq)
        //     } else {
        //         this.handleDraftMediaData(productReq)
        //         // this.addProduct(productReq)
        //     }
        // }
    }
    const addProduct = (params) => {
        createProduct(params).then(resultes => {
            if (resultes.ret.errCode == 0) {
                history.push({
                    pathname: '/product/manage',
                })
                message.success('商品添加成功')
            }
        }).catch(error => {
            console.log(error)
        })
    }


    // 返回商品列表
    const routerBack = useCallback(() => {
        history.replace('/product/manage');
    }, []);

    // 获取仓库
    const getWmsWarehouse = () => {
        wmsWarehouse({
            page: {
                pageNum: 1,
                pageSize: 100
            }
        }).then(res => {
            if (res.ret.errcode == 1) {
                console.log(res.list)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    // 获取商品枚举
    const productEnumInfo = () => {
        GetProductEnumInfo(filterData({})).then(res => {
            if (res.ret.errCode == 0) {
                let newMap = { ...commonEnum }
                newMap = Object.assign(newMap, res.data.map)
                console.log(newMap)
                setCommonEnum(newMap)
            }
        })
    }
    // 获取类目的属性和属性值
    const getProductAttrGetByIdBatch = () => {
        let params = {
            cateId: Number(history.location.query.cateId)
        }
        getUpperRelatedCategoryById(params).then(res => {
            if (res.ret.errCode == 0) {
                let paramAttrId = []
                let standardAttr = []
                res.data.categoryUnitList.map(item => {
                    if (item.paramAttrId != '') {
                        let data = item.paramAttrId.split(',')
                        paramAttrId = [...paramAttrId, ...data]
                    }
                    if (item.standardAttrId != '') {
                        let data1 = item.standardAttrId.split(',')
                        standardAttr = [...standardAttr, ...data1]
                    }
                })
                let attrList = {
                    paramAttrIdList: [... new Set(paramAttrId)],
                    standardAttrIdList: [... new Set(standardAttr)],
                    filterHiddenAttrValue: true
                }
                //得到商品参数
                batchGetProductAttr(attrList).then(response => {
                    console.log(response)
                    if (response.ret.errCode == 0) {
                        setParamAttrList(response.data.paramAttrList)
                        setStandardAttrList(response.data.standardAttrList)
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    //规格属性模块
    /**
     * @arr 用于存储已选择的attrID
     * @selectAttrParams 用于存储原已选择的attr
     */
    const setSelectAttrValue = useCallback((val) => {
        console.log(val)
        let arr = []
        let selectAttrParams = JSON.parse(JSON.stringify(selectAttr))
        if (editType == 'add') {
            selectAttrParams.map(item => {
                if (!item.attrTableSource) {
                    item.attrTableSource = []
                }

            })
        }
        if (selectAttrParams.length != 0) {
            selectAttrParams.map((item) => {
                arr.push(item.arrtId)
            })
            if (arr.indexOf(val.attrId) == -1) {
                selectAttrParams.push(val)
            }
        } else {
            selectAttrParams.push(val)
        }
        console.log(selectAttrParams)
        setSelectAttr(selectAttrParams)

    })
    //删除规格属性选择
    const detleteAttrDetail = (deleteAttr) => {
        let selectAttrParams = JSON.parse(JSON.stringify(selectAttr))
        selectAttrParams.map((item, index) => {
            deleteAttr.map(attrId => {
                if (item.attrId == attrId) {
                    selectAttrParams.splice(index, 1)
                }
            })
        })
        setSelectAttr(selectAttrParams)
    }
    //规格属性选择子组件table渲染
    const setChildTableSource = (data) => {
        let arr = []
        let selectAttrParams = JSON.parse(JSON.stringify(selectAttr))
        selectAttrParams.map(item => {
            if (item.attrTableSource) {
                arr = [...item.attrTableSource]
            } else {
                arr = []
            }
            if (item.attrId == data.type) {
                item.attrValue.map(childValue => {
                    if (childValue.valueId == data.value) {
                        childValue.valueName.map(name => {
                            childValue[name.languageCode] = name['name']
                        })
                        arr.push(childValue)
                    }
                })
            }
            item.attrTableSource = arr
        })
        console.log(selectAttrParams)
        setSelectAttr(selectAttrParams)
    }
    //规格属性下具体规格删除
    const deleteChildData = (deleteTableData) => {
        let selectAttrParams = JSON.parse(JSON.stringify(selectAttr))
        console.log(selectAttrParams, deleteTableData)
        selectAttrParams.map((item) => {
            if (item.attrId = deleteTableData.type) {
                item.attrTableSource.map((deleteAttrValue, index) => {
                    deleteTableData.valueIds.map(valueId => {
                        if (deleteAttrValue.valueId == valueId) {
                            item.attrTableSource.splice(index, 1)
                        }
                    })
                })
            }
        })
        setSelectAttr(selectAttrParams)
    }
    //sku主图选择
    const skuImgSelect = () => {
        let productMediaInfo = {}

        if (multiMediaRef.current) {
            productMediaInfo = multiMediaRef.current.getData()
        }
        return productMediaInfo
    }
    const returnNewCountrySaleStatus = (productSaleCountryInfoList) => {
        let newCountry = JSON.parse(JSON.stringify(countries))
        productSaleCountryInfoList.map((item, index) => {
            newCountry.map(country => {
                if (item.countryCode == country.shortCode) {
                    country.status = item.status.toString()
                }
            })
        })
        changeCountryVal(newCountry)
    }
    /**
     * 
     * @param {return} 处理编辑时的回显数据 
     */
    const returnBaseInfoData = (data) => {
        let obj = {
            brandId: data.brandInfo.brandId.toString(),
            supplierId: data.supplierInfo.supplierId,
            orgUrl: data.orgUrl ? data.orgUrl : '',
            productType: data.productType,
            productNature: data.productNature ? data.productNature : ''
        }
        setDefaultBaseInfoData(obj)
    }
    const returnMediaData = (productLanguageInfoList) => {
        let mediaInfo = {}
        let titleData = {
            title: [],
            subTitle: []
        }
        productLanguageInfoList.map(item => {
            mediaInfo[item.languageCode] = {
                videoInfo: item.video,
                desc: item.desc
            }
            titleData.title.push({
                name: item.title,
                languageCode: item.languageCode
            })
            titleData.subTitle.push({
                name: item.subTitle,
                languageCode: item.languageCode
            })
            let detailImgList = []
            item.detail.split(',').map((detailImg, index) => {
                detailImgList.push({
                    url: detailImg,
                    uid: detailImg,
                    name: index,
                    status: 'done',
                })
            })
            mediaInfo[item.languageCode].detailPics = detailImgList
            let rotationImgList = []
            item.rotation.split(',').map((rotationImg, index) => {
                rotationImgList.push({
                    url: rotationImg,
                    uid: rotationImg,
                    name: index,
                    status: 'done',
                })
            })
            mediaInfo[item.languageCode].rotationPics = rotationImgList
        })
        setTitleData(titleData)
        setMediaInfo(mediaInfo)
    }
    //回显商品参数
    const returnParamsData = (productParams) => {
        let paramsDefault = {}
        productParams.map(item => {
            if (!paramsDefault[item.attrId]) {
                paramsDefault[item.attrId] = item.valueId.split(',')
            } else {
                paramsDefault[item.attrId].push(item.value)
            }

        })
        setParamsDefaultVal(paramsDefault)
    }
    //回显服务承诺
    const returnServeInfoData = (productSpuCountryInfoList) => {
        let countryCode = '', countryItem = [], obj = {}
        productSpuCountryInfoList.map(serveInfo => {
            countryCode = serveInfo.countryCode
            obj = {
                freightId: String(serveInfo.freightId),
                freightType: String(serveInfo.freightType),
                arrivalPledge: serveInfo.pledgeInfo.arrivalPledge,
                afterSalePledge: serveInfo.pledgeInfo.afterSalePledge,
            }
            countryItem.push({
                freightId: String(serveInfo.freightId),
                freightType: String(serveInfo.freightType),
                arrivalPledge: serveInfo.pledgeInfo.arrivalPledge,
                afterSalePledge: serveInfo.pledgeInfo.afterSalePledge,
                countryCode: serveInfo.countryCode
            })
            updateSpuCountryInfo(countryCode, obj, countryItem)
        })

    }
    //处理回显时的表头
    const returnSkuTableHeader = (productSkuInfo) => {
        let arr = []
        productSkuInfo[0].skuAttrValue.map(skuAttr => {
            arr.push({
                [skuAttr.attrId]: {
                    title: skuAttr.attrName,
                    value: skuAttr.valueId,
                    name: skuAttr.valueName
                }
            })
        })
        changeSkuTableHeader(arr)
        console.log('skuTableValue', arr)
    }
    const returnSkuTableValue = (productSkuInfo) => {
        let obj = {}
        let countrySkuTableData={}
        history.location.query.countries.split(';').map(item => {
            obj[item] = {}
            obj[item]['data'] = []
            countrySkuTableData[item]=[]
        })
        for (var key in obj) {
            productSkuInfo.map((item,index) => {
                item.productSkuCountryInfoList.map(countrySkuDetail => {
                    if (countrySkuDetail.countryCode == key) {
                        //table表格数据
                        let skuObj={}
                        item.skuAttrValue.map(attrVal=>{
                            skuObj[attrVal.attrId]={
                                name:attrVal.valueName,
                                value:attrVal.valueId
                            }
                        })
                        countrySkuTableData[key][index]={...{
                            skuCode:countrySkuDetail.skuCode,
                            skuId:countrySkuDetail.skuId,
                            imgUrl:countrySkuDetail.image,
                        },...skuObj}
                        //Form表单数据
                        obj[key]['data'].push({
                            activePrice: countrySkuDetail.activePrice,
                            commission: countrySkuDetail.commission,
                            countryCode: countrySkuDetail.countryCode,
                            deliveryWay: countrySkuDetail.deliveryWay,
                            imgUrl: countrySkuDetail.image,
                            price: countrySkuDetail.price,
                            priceVip: countrySkuDetail.priceVip,
                            saleWay: countrySkuDetail.saleWay,
                            skuCode: countrySkuDetail.skuCode,
                            skuId: countrySkuDetail.skuId,
                            status: countrySkuDetail.status,
                            stock: countrySkuDetail.stock,
                            warehouse: countrySkuDetail.warehouse,
                            warehouseName:countrySkuDetail.warehouseName,
                            ///////这是公共的部分
                            boxSpecification:{
                                l:item.boxSpecification.split(',')[0],
                                w:item.boxSpecification.split(',')[1],
                                h:item.boxSpecification.split(',')[2],
                            },
                            cooperationModel: item.cooperationModel,
                            fingoSkuCode: item.fingoSkuCode,
                            qrCode: item.qrCode,
                            weight: item.weight/1000,
                            specification:{
                                l:item.specification.split(',')[0],
                                w:item.specification.split(',')[1],
                                h:item.specification.split(',')[2],
                            },
                            supplierCode: item.supplierCode,
                            supplyPrice: item.supplyPrice
                        })
                    }
                })
            })
        }
        console.log('国家sku信息',obj,countrySkuTableData)
        productSpaceRef.current.changeSkuTableData(obj)
        productSpaceRef.current.changeSkuTableDetail(countrySkuTableData)
        
    }
    useEffect(() => {
        const query = history.location.query;
        // 设置编辑类型
        const type = query.productId ? 'edit' : 'add';
        setEditType(type);
        // 设置选中类目信息
        if (type == 'add') {
            const cateIds = decodeURIComponent(query.cateIds).split(";");
            const cateNames = decodeURIComponent(query.cateNames).split(";");
            const countryList = query.countries ? decodeURIComponent(query.countries).split(";") : [];
            const cates = { cateIds, cateNames }
            setBaseInfo({ cates });
            setSaleCountry(countryList)
        } else if (type == 'edit') {
            setProductId(query.productId)
            const cateIds = query.cateId
            const cateNames = decodeURIComponent(query.cateNames).split(";");
            const countryList = query.countries ? decodeURIComponent(query.countries).split(";") : [];
            const cates = { cateIds, cateNames }
            setBaseInfo({ cates });
            setSaleCountry(countryList)
            let params = {
                productId: query.productId
            }
            updateProduct(params).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    console.log('商品详情', resultes)
                    //取到编辑商品的销售国家状态
                    returnNewCountrySaleStatus(resultes.data.productSaleCountryInfoList)
                    returnBaseInfoData(resultes.data)
                    returnMediaData(resultes.data.productLanguageInfoList)
                    returnParamsData(resultes.data.productParams)
                    returnServeInfoData(resultes.data.productSpuCountryInfoList)
                    returnSkuTableHeader(resultes.data.productSkuInfo)
                    returnSkuTableValue(resultes.data.productSkuInfo)
                }
            })
        }
        productEnumInfo()
        getProductAttrGetByIdBatch()
    }, []);

    return <ViewContainer>
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.action}>
                    <Button type="primary" onClick={() => save(editType)}>保存</Button>
                    <Button onClick={() => routerBack()}>取消</Button>
                </div>
            </div>
            <div className={styles.mian}>
                <SectionWrapper title="基本信息">
                    {
                        saleCountry.length > 0 && <ProductBaseInfo editType={editType}
                            ref={baseInfoRef}
                            data={baseInfo}
                            countryList={saleCountry}
                            defaultFormVal={defaultBaseInfoData}
                            titleData={titleData}
                        />
                    }
                </SectionWrapper>
                <SectionWrapper title="商品参数">
                    <ProductParam ref={paramRef} paramAttrList={paramAttrList} updateParamAttrList={(data) => setParamAttrList(data)} defaultVal={paramsDefaultVal} />
                </SectionWrapper>
                <SectionWrapper title="图片视频">
                    <ProductMultiMedia ref={multiMediaRef} data={[]} mediaInfo={mediaInfo} />
                </SectionWrapper>
                <SectionWrapper title="服务承诺">
                    {
                        saleCountry.length > 0 && <ProductServeInfo ref={productServeInfoRef} countryList={saleCountry} />
                    }
                </SectionWrapper>
                <SectionWrapper title="规格属性">
                    {
                        saleCountry.length > 0 && <ProductSpecsAttr countryList={saleCountry}
                            ref={productSpaceRef}
                            standardAttrList={standardAttrList}
                            selectAttr={selectAttr}
                            setSelectAttrValue={setSelectAttrValue}
                            detleteAttrDetail={detleteAttrDetail}
                            setChildTableSource={setChildTableSource}
                            deleteChildData={deleteChildData}
                            skuImgSelect={skuImgSelect} />

                    }
                </SectionWrapper>
            </div>
        </div>
    </ViewContainer>
}

export default ProductEdit;
