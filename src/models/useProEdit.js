import { useState, useCallback } from "react";
// import {Form,Select} from 'antd';
// const {Option} = Select
export default () => {
    const [spuCountryInfo, setSpuCountryInfo] = useState([]) // 国家信息
    const [commonEnum, setCommonEnum] = useState({})
    const [hasSelectedAttr, setSelectedAttr] = useState({})
    const [deleteSelectAttr, setDeleteSelectAttr] = useState({})
    const [attrvValue, setAttrValue] = useState([])
    const [editHeader, setEditHeader] = useState([])
    const [editTopHeader, setTopEditHeader] = useState([])
    const [attrSelectValue, setAttrSelect] = useState({})

    // 更改国家信息
    const updateSpuCountryInfo = function (countryCode, countryItem,newVal){
        let newData
        if(newVal){
            newData = JSON.parse(JSON.stringify(newVal))
        }else{
            newData = JSON.parse(JSON.stringify(spuCountryInfo))
        }
        let index = newData.findIndex((item) => {
            return item.countryCode == countryCode
        })
        if (index == -1) {
            newData.push(Object.assign({
                countryCode: countryCode
            }, countryItem))
        } else {
            Object.assign(newData[index], countryItem)
        }
        console.log('服务承诺',newData)
        setSpuCountryInfo(newData)
    }
    // 获取国家信息
    const getSpuCountryInfo = function (countryCode) {
        if (countryCode) {
            let item = spuCountryInfo.find((item) => {
                return item.countryCode == countryCode
            })
            return item ? item : {
                'freightType': '1',
                'freightId': '',
                'afterSalePledge': '',
                'arrivalPledge': ''
            }
        }
        return spuCountryInfo
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
    //规格属性选择
    const deleteAttrSelected = (selectedAttr, selectedVal) => {
        let obj = {}
        for (var key in selectedAttr) {
            if (selectedAttr[key]['value']) {

            } else {
                selectedAttr[key]['value'] = []
            }
            let item = selectedVal.find(val => {
                return val == key
            })
            if (item) {
                obj[key] = selectedAttr[key]
            }
        }
        setSelectedAttr(obj)
    }
    const selectChangeAttr = (val) => {
        const oldSelect = JSON.parse(JSON.stringify(attrvValue))
        // 做删除判断
        if (oldSelect.length > val.length) {
            let deleteData = oldSelect.filter(function (attrId) { return val.indexOf(attrId) == -1 })
            // props.detleteAttrDetail(deleteData)
            //做表头删除判断
            let deleteTableHeader = [...editHeader]
            deleteTableHeader.map((item, index) => {
                deleteData.map(attrId => {
                    if (attrId == item.dataIndex) {
                        deleteTableHeader.splice(index, 1)
                    }
                })
            })
            let deleteTopHeader = [...editTopHeader]
            deleteTopHeader.map((item, index) => {
                deleteData.map(attrId => {
                    if (attrId == item.dataIndex) {
                        deleteTopHeader.splice(index, 1)
                    }
                })
            })
            setTopEditHeader(deleteTopHeader)
            setEditHeader(deleteTableHeader)
        }

        setAttrValue(val)
    }
    const selectEndAttr = (data) => {
        let addHeader = [...editHeader]
        addHeader.unshift(
            {
                title: returnAttrNameValue(data.attrNameList, 'value'),
                dataIndex: data.attrId,
                width: 150,
                align: 'center',
                fixed: 'left',
                render: (text, row, index) => {
                    return row[data.attrId] ? row[data.attrId].name : ''
                   
                }
            }
        )
        let addEditTopHeader = [...editTopHeader]
        addEditTopHeader.unshift(
            {
                dataIndex: data.attrId,
                width: 150,
                align: 'center',
                fixed: 'left',
                render: (text, row, index) => {
                    return ''
                }
            }
        )
        setTopEditHeader(addEditTopHeader)
        setEditHeader(addHeader)
    }
    //回显时多的表头
    const changeSkuTableHeader = (concatData) =>{
        let addHeader = [...editHeader]
        
        concatData.map(item=>{
            for(var key in item){
                addHeader.unshift(
                    {
                        title: item[key].title,
                        dataIndex: key,
                        width: 150,
                        align: 'center',
                        fixed: 'left',
                        render: (text, row, index) => {
                            return row[key] ? row[key].name : ''
                        }
                    }
                )
            }
            
        })
        addHeader.unshift({
            title: 'skuId',
            dataIndex: 'skuId',
            width: 150,
            align: 'center',
            fixed: 'left',
        })
        setEditHeader(addHeader)
    }
    //子组件具体规格选择事件
    const topHeaderReset = (header) => {
        setTopEditHeader(header)
    }
    const setSelectAttrValue = (value) => {
        setAttrSelect(value)
    }
    const setTopEditHeaderNew = (val) => {
        setTopEditHeader(val)
    }
    return {
        spuCountryInfo,
        updateSpuCountryInfo,
        getSpuCountryInfo,
        commonEnum,
        setCommonEnum,
        //商品规格所用到的信息
        hasSelectedAttr,//已经选择的规格
        deleteAttrSelected,//删除的规格判断
        selectEndAttr,
        selectChangeAttr,
        editTopHeader,//头部表单
        attrvValue,
        editHeader,
        setTopEditHeaderNew,
        //回显处理
        changeSkuTableHeader
    }
}
