// 商品规格属性
import React, { useState, useRef, useCallback, useEffect, useImperativeHandle } from 'react';
import styles from './styles/index.less';
import { Select, Space, Button, Tabs, Table, Form, Input, message } from 'antd';
import { DragTable } from '@/components';
import { DragOutlined } from '@ant-design/icons';
import { productAttrGetById } from '@/services/product1'
import { filterCountry } from '@/utils/filter'
import {deepClone} from '@/utils/index'
import TopTableHeader from './components/TopTableHeader'
import SkuTableData from './components/SkuTableData'
import { FormInstance } from 'antd/lib/form';
import { setData } from './Componse'
import SpecsAttrForm from "./components/SpecsAttrForm"
import SkuImgSelect from './components/SkuImgSelect'//sku图片选择
import {useModel} from "@@/plugin-model/useModel";
const { TabPane } = Tabs;
const { Option } = Select
const ProductSpecsAttr = React.forwardRef((props, ref) => {
    //得到商品属性
    //返回属性中英文
    const [activeKey, setActiveKey] = useState(props.countryList[0])
    const [defaultValue, setDefaultValue] = useState({})//处理默认值
    const topHeaderRef = useRef()
    // const [defaultKey,setDefaultKey] = useState(props.countryList[0])
    const [skuTableRef, setSkuRef] = useState({})//sku国家的ref
    const spaceAttrFormRef = useRef()//具体属性的ref
    const [skuTableData,setSkuTableData] = useState([])
    const [currencyCode,setCurrencyCode] = useState('')
    const [countryCodeTableData,setCountryCodeTableData] = useState({})//处理skutable数据(分国家)
    const [topdataSource,setTopDataSource] = useState([
        {imgUrl:'',
        index:1}
    ])//topHeader的值

    const {selectChangeAttr,selectEndAttr,setTopEditHeaderNew,editHeader,editTopHeader,attrvValue} = useModel('useProEdit');
    //规格属性中底下具体规格的选择
    const [attrSelectValue, setAttrSelect] = useState({})
    //sku图片弹窗
    const skuImgRef = useRef()
    const [type,setType] = useState('top')
    const [index,setIndex] =useState(0)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            spaceAttrValue:()=>{
                let returnData={}
                    returnData['attrValues'] = deepClone(spaceAttrFormRef.current.returnAttrTableData())
                    returnData['skuData'] = deepClone(defaultValue)
                    console.log(returnData)
                    let allDataResult = []
                    if(!returnData['skuData'][activeKey]){
                        message.warning('请填写规格属性')
                        return false
                    }
                    returnData['skuData'][activeKey]['data'].map((item,index)=>{
                        let skuAttrValue=[]
                        //处理skuAttrValue
                        for(var key in returnData['attrValues']){
                            if(item[key]){
                                let newAttrValue= returnData['attrValues'][key].filter(attrValue=>{
                                    return attrValue.valueId==item[key].value
                                })
                                skuAttrValue.push(newAttrValue[0])
                            }   
                        }
                        let obj={}
                        obj={
                                boxSpecification:item.boxSpecification?returnSpecification(item.boxSpecification):'0,0,0,0',
                                currencyCode:currencyCode?currencyCode:'',
                                qrCode: item.qrCode?item.qrCode:'',
                                skuAttrValue: skuAttrValue,
                                specification: item.specification?returnSpecification(item.specification):'0,0,0,0',
                                supplierCode: item.supplierCode?item.supplierCode:'',
                                supplyPrice: item.supplyPrice?item.supplyPrice:'',
                                weight: item.weight*1000,
                        }
                        obj.productSkuCountryInfoList=[]
                        for(var countryCode in returnData['skuData']){
                            let productSkuCountryInfoList={
                                    activePrice: returnData['skuData'][countryCode]['data'][index].activePrice?returnData['skuData'][countryCode]['data'][index].activePrice:'',
                                    activeStock: returnData['skuData'][countryCode]['data'][index].activeStock?returnData['skuData'][countryCode]['data'][index].activeStock:'',
                                    commission: returnData['skuData'][countryCode]['data'][index].commission?returnData['skuData'][countryCode]['data'][index].commission:'',
                                    compositeProduct: returnData['skuData'][countryCode]['data'][index].compositeProduct?returnData['skuData'][countryCode]['data'][index].compositeProduct:'',
                                    countryCode: countryCode,
                                    image: returnData['skuData'][countryCode]['data'][index].imgUrl?returnData['skuData'][countryCode]['data'][index].imgUrl:'',
                                    deliveryWay: returnData['skuData'][countryCode]['data'][index].deliveryWay?returnData['skuData'][countryCode]['data'][index].deliveryWay:'',
                                    price:returnData['skuData'][countryCode]['data'][index].price?returnData['skuData'][countryCode]['data'][index].price:'' ,
                                    priceVip: returnData['skuData'][countryCode]['data'][index].priceVip?returnData['skuData'][countryCode]['data'][index].priceVip:'',
                                    status: returnData['skuData'][countryCode]['data'][index].saleStatus?returnData['skuData'][countryCode]['data'][index].saleStatus:'',
                                    saleWay: returnData['skuData'][countryCode]['data'][index].saleWay?returnData['skuData'][countryCode]['data'][index].saleWay:'',
                                    stock: returnData['skuData'][countryCode]['data'][index].stock?returnData['skuData'][countryCode]['data'][index].stock:'',
                                    warehouse: returnData['skuData'][countryCode]['data'][index].warehouse?returnData['skuData'][countryCode]['data'][index].warehouse:''
                            }
                            obj.productSkuCountryInfoList.push(productSkuCountryInfoList)
                        }
                        allDataResult.push(obj)
                    })
                return allDataResult
            },
            //处理回显信息
            changeSkuTableData:(newData)=>{
                setDefaultValue(newData)
            },
            changeSkuTableDetail:(newVal)=>{
                setCountryCodeTableData(newVal)
            }
        }
        
    })
    //return 单位体积长宽高
    const returnSpecification = (data)=>{
        let str=''
        if(Object.keys(data).length<3){
            str='0,0,0,0'
        }else{
            for(var key in data){
                if(!data[key]){
                    str='0,0,0,0'
                    return str
                }else{
                    str+=data[key]+','
                } 
            }
            str+=data['l']*data['w']*data['h']
        }
        return str
    }
    const returnAttrName = (attrName) => {
        var str = ''
        attrName.map(item => {
            if (item.languageCode == 'cn') {
                str += item.name + '/'
            } else if (item.languageCode == 'en') {
                str += item.name
            }
        })
        return str
    }
    const selectChange = (val) => {
        console.log(val)
        selectChangeAttr(val)
    }
    //子组件选择事件
    const setTableDataEnd = (data) => {
        console.log(data)
        let newVal = [...editTopHeader]
        let newSelectAttrValue = JSON.parse(JSON.stringify(attrSelectValue))
        if (newSelectAttrValue[data.type]) {
            newSelectAttrValue[data.type].push({
                name: data.label,
                value: data.value
            })
        } else {
            newSelectAttrValue[data.type] = []
            newSelectAttrValue[data.type].push({
                name: data.label,
                value: data.value
            })
        }
        setAttrSelect(newSelectAttrValue)
        newVal.map(item => {
            if (item.dataIndex == data.type) {
                item.render = (text, row, index) => {
                    return <Form.Item name={['data', index, item.dataIndex]}>
                        <Select style={{ width: "100%" }} placeholder="请选择" defaultValue={row[item.dataIndex]}>
                            {
                                newSelectAttrValue[data.type].length != 0 && newSelectAttrValue[data.type].map((item, index) => {
                                    return <Option value={item.value} key={index}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                }
            }
        })
        setTopEditHeaderNew(newVal)
        // props.setChildTableSource(data)
        //去处理是否符合渲染规则
        let flag = 0
        let newSkuTableData = []
        let newSkuTableForm = []
        attrvValue.map(item => {
            if (!newSelectAttrValue[item] || newSelectAttrValue[item].length == 0) {
                flag++
            }
        })
        if (flag > 0) {
            console.log('不符合渲染规则')
            let newCountryCodeTableData={}
            props.countryList.map(countryCode => {
                newCountryCodeTableData[countryCode] = [{}]
            })
            setCountryCodeTableData(newCountryCodeTableData)
        }
        else {
            let attrTable = []
            let newSkuTableDataLength = 1
            // 给到初始化数组的长度
            attrvValue.map(key => {
                newSkuTableDataLength = newSkuTableDataLength * newSelectAttrValue[key].length
            })
            //初始化数组的值
            for (var i = 0; i < newSkuTableDataLength; i++) {
                newSkuTableData[i] = {}
            }
            //怎么去处理渲染规则,头疼
            newSkuTableData = setData([], newSelectAttrValue).concat([])
            setSkuTableData(newSkuTableData)
            let defaultValueForm = JSON.parse(JSON.stringify(defaultValue))
            let newCountryCodeTableData = JSON.parse(JSON.stringify(countryCodeTableData))
            props.countryList.map(countryCode => {
            if(!newCountryCodeTableData[countryCode]||newCountryCodeTableData[countryCode].length==0){
                newCountryCodeTableData[countryCode] = newSkuTableData
            }else{
                //table处理
                let newTableData=[]
                newSkuTableData.map((item,index)=>{
                    let obj=JSON.parse(JSON.stringify(item))
                    let returnData = filterCountryData(item,newCountryCodeTableData[countryCode])
                    if(returnData){
                        obj=JSON.parse(JSON.stringify(returnData))
                    }
                    newTableData.push(obj)
                })
                console.log('newTableData',newTableData)
                newCountryCodeTableData[countryCode] = newTableData
            }
              
            if(!defaultValueForm[countryCode]||Object.keys(defaultValueForm[countryCode]).length==0){
                defaultValueForm[countryCode] = {}
                defaultValueForm[countryCode]['data'] = newSkuTableData.concat([])
            }else{ 
                let newFormData=[]
                newSkuTableData.map((item,index)=>{
                    let obj=JSON.parse(JSON.stringify(item))
                    let returnData = filterCountryData(item,defaultValueForm[countryCode]['data'])
                    if(returnData){
                        obj=JSON.parse(JSON.stringify(returnData))
                    }
                    newFormData.push(obj)
                })
                defaultValueForm[countryCode]['data'] = newFormData
            }
            })
            setCountryCodeTableData(newCountryCodeTableData)
            setDefaultValue(defaultValueForm)
        }
    }
    const filterCountryData = (object,oldValue)=>{
        var arr= oldValue ? JSON.parse(JSON.stringify(oldValue)) : []
        for(var key in object){
            arr=arr.filter(val=>{
                return val[key] && val[key].value==object[key].value
            })
        }
        return arr.length > 0 ? arr[0] : null
    }
/**
 * 
 * @param {*}
 */
    //子组件删除事件
    const deleteAttr = (childDeleteData) => {
        console.log(childDeleteData,skuTableData)
        let newVal = [...editTopHeader]//处理头部表单数据
        let defaultValueForm = deepClone(defaultValue)
        let newSelectAttrValue = deepClone(attrSelectValue)
        for(var key in newSelectAttrValue){
            if(key==childDeleteData.type){
                newSelectAttrValue[key].map((item,index)=>{
                    if(item.value==childDeleteData.valueIds){
                        newSelectAttrValue[key].splice(index,1)
                    }
                })
            }
        }
        setAttrSelect(newSelectAttrValue)
        newVal.map(item => {
            if (item.dataIndex == childDeleteData.type) {
                item.render = (text, row, index) => {
                    return <Form.Item name={['data', index, item.dataIndex]}>
                        <Select style={{ width: "100%" }} placeholder="请选择" defaultValue={row[item.dataIndex]}>
                            {
                                newSelectAttrValue[childDeleteData.type].length != 0 && newSelectAttrValue[childDeleteData.type].map((item, index) => {
                                    return <Option value={item.value} key={index}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                }
            }
        })
        setTopEditHeaderNew(newVal)//处理SKUTable数据
        let newSkuTableData = skuTableData.concat([])
        console.log(newSkuTableData)
        for(var i=0;i<newSkuTableData.length;i++){
                if(newSkuTableData[i][childDeleteData.type].value==childDeleteData.valueIds){
                    newSkuTableData.splice(i,1)
            }
        }
        setSkuTableData(newSkuTableData)
        let newCountryCodeTableData = deepClone(countryCodeTableData)
        //判断当前列是否有值
        for(var key in newCountryCodeTableData){
            newCountryCodeTableData[key].map((val,index)=>{
                if(val[childDeleteData.type].value==childDeleteData.valueIds){
                    newCountryCodeTableData[key].splice(index,1)
                }
            })
            // newCountryCodeTableData[key] = newCountryCodeTableData[key].filter(val=>{
            //     return val[childDeleteData.type].value!=childDeleteData.valueIds
            // })
            
        }
        //处理表单数据
        for(var key in defaultValueForm){
            defaultValueForm[key]['data'].map((val,index)=>{
                if(val[childDeleteData.type].value!=childDeleteData.valueIds){
                    defaultValueForm[key]['data'].splice(index,1)
                }
            })
            // defaultValueForm[key]['data'] = defaultValueForm[key]['data'].filter(val=>{
            //     return val[childDeleteData.type].value!=childDeleteData.valueIds
            // })
        }
        console.log('........',defaultValueForm,newCountryCodeTableData)
        setDefaultValue(defaultValueForm)
        setCountryCodeTableData(newCountryCodeTableData)
    }
    const dataSourceToFather=(data)=>{
        console.log(data)
    }
    const returnAttrNameValue = useCallback((attrName, type) => {
        let str = ''
        if (attrName) {
            attrName.map(item => {
                if (item.languageCode == 'cn' && type == 'attr') {
                    str = item.name + '：'
                } else if (item.languageCode == 'cn' && type == 'value') {
                    str = item.name
                }
            })
        }
        return str
    }, [])

    //规格选中的事件
    const selectEnd = (data) => {
        props.setSelectAttrValue(data)
        selectEndAttr(data)
    }
    const tabsChange = (val) => {
        setActiveKey(val)
    }
    //同步该列
    const setDefault=()=>{
        topHeaderRef.current.changeVal()
    }
    //同步该列
    const setInitialValues = (data) => {
        console.log(data)
        let topData = deepClone(data.data)
        //对国家的值去做分国家去处理表单同步数据
        let imgTableSource =deepClone(countryCodeTableData)
        let defaultForm =deepClone(defaultValue)
        if(imgTableSource[activeKey]){
            for(var i=0;i<imgTableSource[activeKey].length;i++){
                imgTableSource[activeKey][i]['imgUrl'] = topdataSource[0].imgUrl
                defaultForm[activeKey]['data'][i] = Object.assign(defaultForm[activeKey]['data'][i],topData.data[0],imgTableSource[activeKey][i])
            }
            setCountryCodeTableData(imgTableSource)
            setDefaultValue(defaultForm)
        }
        
    }
    /**
     * 
     * @param {syncOtherCountry} 同步至其他国家
     */
    const syncOtherCountry = ()=>{
        let syncCountryCodeTableData = deepClone(countryCodeTableData)
        for(var countryCode in syncCountryCodeTableData){
            if(countryCode!=activeKey){
                syncCountryCodeTableData[countryCode] = syncCountryCodeTableData[activeKey]
            }
        }
        let defaultValueForm = deepClone(defaultValue)
        props.countryList.map(item=>{
            defaultValueForm[item] = defaultValueForm[activeKey]
        })
        setDefaultValue(defaultValueForm)
        setCountryCodeTableData(syncCountryCodeTableData)
        message.success('成功同步至其他国家')
    }
    /**
     * 
     * sku主图选择
     */
    const addImg = (data)=>{
        setType(data.type)
        setIndex(data.index)
        let mediaInfo = props.skuImgSelect()
        skuImgRef.current.changeVisible(true)
        let obj={}
        console.log(mediaInfo)
        if(mediaInfo&&Object.keys(mediaInfo).length!=0){
            for(var key in mediaInfo){
                if(key=='cn'){
                    obj['detailPics'] = mediaInfo['cn'].detailPics
                    obj['rotationPics'] = mediaInfo['cn'].rotationPics
                }
            }
        }else{
            obj['detailPics'] = []
            obj['rotationPics'] = []
        }
        skuImgRef.current.setSkuImgLists(obj)
    }
    /**
     * 
     * @param {index}表单的图片数引  
     */
    const deleteTopImg = (index)=>{
        let newTopData = topdataSource.concat([])
          newTopData[0].imgUrl = ''
          setTopDataSource(newTopData)
    }
    /**
     * 
     * @param {index} 下方sku表格图片的数引
     */
    const deleteSkuImg = (index)=>{
        let newSkuData = JSON.parse(JSON.stringify(countryCodeTableData))
        let defaultValueForm = JSON.parse(JSON.stringify(defaultValue))
        newSkuData[activeKey][index].imgUrl = ''
        defaultValueForm[activeKey]['data'][index].imgUrl = ''
        setCountryCodeTableData(newSkuData)
        setDefaultValue(defaultValueForm)
    }
    //图片选择返回值
    const confirm = (returnCover)=>{
        console.log(returnCover)
        if(type=='top'&&index==0){
          let newTopData = topdataSource.concat([])
          newTopData[0].imgUrl = returnCover
          setTopDataSource(newTopData)
        }else{
            let newSkuData = JSON.parse(JSON.stringify(countryCodeTableData))
            let defaultValueForm = JSON.parse(JSON.stringify(defaultValue))
            newSkuData[activeKey][index].imgUrl = returnCover
            defaultValueForm[activeKey]['data'][index].imgUrl = returnCover
            setCountryCodeTableData(newSkuData)
            setDefaultValue(defaultValueForm)
        }
        skuImgRef.current.changeVisible(false)
    }
    const changeSkuFormData=(data)=>{
        let defaultValueForm = JSON.parse(JSON.stringify(defaultValue))
        defaultValueForm[data.countryCode]= data.values
        
        setDefaultValue(defaultValueForm)
    }
    const setCurrency = (value)=>{
        setCurrencyCode(value)
    }
    //初始化新增时的值
    useEffect(() => {
        let refList = {}
        props.countryList.map(countryCode => {
            refList[countryCode] = React.createRef(FormInstance)
        })
        setSkuRef(refList)
    }, [props.standardAttrList, props.countryList])
    return (
        <div className={styles.productSpecsAttr}>
            {
                props.countryList.length != 0 && <div>
                    {/*规格*/}
                    <SpecsAttrForm ref={spaceAttrFormRef} standardAttrList={props.standardAttrList} returnAttrName={returnAttrName} selectChange={selectChange} selectEnd={selectEnd} setTableDataEnd={setTableDataEnd} deleteAttr={deleteAttr} setDefault={setDefault} syncOtherCountry={syncOtherCountry}/>
                    {/*sku列表*/}
                    <div className={styles.skus}>
                        <Tabs onChange={tabsChange}  activeKey={activeKey}>
                            <TopTableHeader
                                ref={topHeaderRef}
                                editTopHeader={editTopHeader}
                                addImg={addImg}
                                deleteImg={deleteTopImg}
                                dataSource={topdataSource}
                                canEditCountry={props.countryList[0]}
                                setInitialValues={setInitialValues}
                                countryCode={activeKey}
                            ></TopTableHeader>
                            {
                                props.countryList.map(countryCode => {
                                    return <TabPane tab={filterCountry(countryCode)} key={countryCode}>
                                        <SkuTableData
                                            dataSourceToFather={dataSourceToFather}
                                            ref={skuTableRef[countryCode]}
                                            countryCode={countryCode}
                                            defaultValue={defaultValue}
                                            editHeader={editHeader}
                                            addImg={addImg}
                                            deleteImg={deleteSkuImg}
                                            dataSource={countryCodeTableData[countryCode]}
                                            changeSkuFormData={changeSkuFormData}
                                            currencyCode={currencyCode}
                                            setCurrencyCode={setCurrency}
                                            canEditCountry={props.countryList[0]}
                                        >
                                        </SkuTableData>
                                    </TabPane>


                                })
                            }
                        </Tabs>
                    </div>
                </div>
            }
            <SkuImgSelect ref={skuImgRef} confirm={confirm}></SkuImgSelect>
        </div>
    )
})

export default ProductSpecsAttr;
