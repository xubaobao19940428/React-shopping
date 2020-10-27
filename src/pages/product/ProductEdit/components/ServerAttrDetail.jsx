import React, { useState, useCallback, forwardRef, useEffect, useRef,useImperativeHandle} from 'react';
import { Button, Space, Form, Table, Input, Select } from 'antd';
import { DragTable } from '@/components';
import { DragOutlined, CloseOutlined } from '@ant-design/icons';
import AddAttrValueDialog from "./AddAttrValueDialog"
import styles from '../styles/index.less'
// import {useModel} from "@@/plugin-model/useModel";
/**
/*
/*
*/
const { Option } = Select
const ServerAttrDetail = React.forwardRef((props, ref) => {
    const [attrValueList, setAttrValueList] = useState(props.attr.attrValueList ? props.attr.attrValueList : []) // 属性值列表
    const [attrIdList, setAttrIdList] = useState([]) // 选中属性ID
    const [showModal, setShowModal] = useState(false)
    const [selectedValue,setSelectVal] = useState([])
    // const {setTableDataEnd} = useModel('useProEdit')
    useImperativeHandle(ref,()=>{
        return {
            returnAttrTableData:()=>{
                return dealValueData(attrIdList)
            },
        }
        
    })
    const returnAttrName = useCallback((attrName, type) => {
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

    // 增加自定义属性
    function confirmAddAttr(data) {
        let newData = JSON.parse(JSON.stringify(attrValueList))
        for (let i = 0; i < data.length; i++) {
            let item = newData.find((val) => {
                return val.valueId == data[i].valueId
            })
            if (!item) {
                newData.push(data[i])
            }
        }
        setAttrValueList(newData)
        setShowModal(false)
    }

    // 已选属性数据处理
    const dealValueData = (data) => {
        let newData = []
        for (let i = 0; i < data.length; i++) {
            let item = attrValueList.find((val) => {
                return val.valueId == data[i]
            })
            if (!item.valueNameList) {
                item.valueNameList = []
            }
            newData.push({
                valueId: data[i],
                sort:i+1,
                attrId:props.attrId,
                ...Object.fromEntries(item.valueNameList.map(item => [item.languageCode, item.name]))
            })
        }
        return newData
    }
    // 所选属性变更
    const changeHandler = (value)=>{
        let oldSelectedValue = attrIdList.concat([])
        if(oldSelectedValue.length!=0){
            if(oldSelectedValue.length>value.length){
                let deleteValueId = oldSelectedValue.filter(function(valueId){ return value.indexOf(valueId) == -1 })
                props.deleteAttr({valueIds:deleteValueId.join(','),type:props.attr.attrId})
            }
            
        }
           
        setAttrIdList(value)
    }

    // 属性排序
    function sortHandler (data) {
        let attrId = []
        for (let i = 0; i < data.length; i++) {
            attrId.push(data[i].valueId)
        }
        setAttrIdList(attrId)
    }

    // 删除属性
    function deleteAttr(valueId) {
        let newData = JSON.parse(JSON.stringify(attrIdList))
        let i = newData.findIndex((id) => {
            return id == valueId
        })
        if (i != -1) {
            newData.splice(i, 1)
        }
       
        setAttrIdList(newData)
    }
   //选择事件
   const returnValueName = (valueNameList)=>{
       var str=''
       valueNameList.map(item=>{
        if(item.languageCode=='cn'){
            str = item.name
        }
       })
       return str
   }
   const selectVal = (val)=>{
       let newSelect = selectedValue.concat([])
        var obj = {}
        attrValueList.map(item=>{
            if(item.valueId==val){
                obj.type = props.attr.attrId
                obj.label = returnValueName(item.valueNameList)
                obj.value = item.valueId
            }
        })
        let item = newSelect.find(value=>{
            return value.value==val
        })
        if(!item){
            newSelect.push(obj)
        }
        setSelectVal(newSelect)
        props.setTableDataEnd(obj)
   }
    return (
        <div className={styles.attrContent} style={{ marginBottom: 20 }}>
            { props.attr &&
                <div>
                    <div className={styles.label}>{ returnAttrName(props.attr.attrNameList, 'attr')}</div>
                    <div className={styles.content}>
                        <div className={styles.sel}>
                            <Select mode="multiple" style={{ width: 400, marginBottom: 20 }}
                                    value={attrIdList}
                                    onChange={changeHandler}
                                    onSelect={selectVal}
                                    notFoundContent={
                                        <div>
                                            {
                                                props.attr.customize != 1 ? <span>  请联系属性值管理员扩充属性模板</span> : <div onClick={() => setShowModal(true)}><span>没有你想要的属性值？</span><a>新增</a></div>
                                            }
                                        </div>

                                    }>
                                {
                                    attrValueList.length != 0 &&
                                    attrValueList.map(item => {
                                        return <Option value={item.valueId} key={item.valueId}>{returnAttrName(item.valueNameList, 'value')}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className={styles.attrs}>
                            <DragTable
                                columns={[
                                    {
                                        title: "属性ID",
                                        key: 'valueId',
                                        dataIndex: "valueId",
                                    }, {
                                        title: "简体中文cn",
                                        dataIndex: "cn",
                                        render:(text,row,index)=>{
                                            return <span>{row.cn || '-'}</span>
                                        }
                                    }, {
                                        title: "英文en",
                                        dataIndex: "en",
                                        render:(text,row,index)=>{
                                            return <span>{row.en || '-'}</span>
                                        }
                                    }, {
                                        title: "马来语ms",
                                        dataIndex: "ms",
                                        render:(text,row,index)=>{
                                            return <span>{row.ms || '-'}</span>
                                        }
                                    }, {
                                        title: "泰语th",
                                        dataIndex: "th",
                                        render:(text,row,index)=>{
                                            return <span>{row.th || '-'}</span>
                                        }
                                    }, {
                                        title: "印度语id",
                                        dataIndex: "id",
                                        render:(text,row,index)=>{
                                            return <span>{row.id || '-'}</span>
                                        }
                                    }, {
                                        title: "操作",
                                        dataIndex: "options",
                                        render: (text, row) => {
                                            return (<div>
                                                <DragOutlined />
                                                <CloseOutlined onClick={() => deleteAttr(row.valueId)} />
                                            </div>)
                                        }
                                    }
                                ]}
                                dataSource={dealValueData(attrIdList)}
                                pagination={false}
                                change={sortHandler}
                                rowKey="valueId"
                            />
                        </div>
                    </div>
                </div>
            }
            {
                showModal && <AddAttrValueDialog showModal={showModal} attrId={props.attr.attrId} onClose={() => setShowModal(false)} onConfirm={confirmAddAttr}/>
            }
        </div>
    )
})
export default ServerAttrDetail;
