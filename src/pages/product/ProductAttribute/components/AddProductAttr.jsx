import React, { useState, useImperativeHandle, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Input, Space, Radio, Table, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { getOneKeyTranslation } from '@/services/i18n'
import { filterData } from '@/utils/filter';
const {confirm} = Modal
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddProductAttr = React.forwardRef((props, ref) => {
    const { Column } = Table
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增属性')
    const formRef = React.createRef(FormInstance)
    const [type,editType] = useState('add')
    const [attrId,setAttrId] =useState('')
    const [defaultValue, setDefaultValue] = useState({
        attrNameTableData: [],
        attrValueTableData: [],
        customize: 1
    })
    const [countryLanage, setCountryLanage] = useState([])
    const [loading,setLoading] = useState(false)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changeType: () => {
                editType('add');
            },
            changeTitle: (newTitle) => {
                setTitle(newTitle)
            },
            changeContent: (newContent) => {
                editType(newContent.type)
                setattrTableData(newContent.attrName)
                setattrTableValData(newContent.attrVal)

            },
            changeAttrId:(newAttrId)=>{
                setAttrId(newAttrId)
            }
        }

    })
    const [attrTable, setattrTableData] = useState([])
    const [attrValTable, setattrTableValData] = useState([])
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 3 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    }
    const onFinish = values => {
        console.log('Received values of form:', values);
    }
    const handleOk = (e) => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                if (verifyRepetValueName()) {
                    message.error('属性值不能重复')
                    return false
                }
                console.log(attrValTable)
                let flag = 0
                attrValTable.map((item, index) => {
                    if (!item['cn'].value || !item['en'].value) {
                        flag++
                    }
                })
                if(flag>0){
                    message.warning('中英文不能为空')
                    return false
                }
                if (attrTable[0]['cn']['value'] != '' && attrTable[0]['en']['value'] != '') {
                    formRef.current.setFieldsValue({
                        attrNameTableData: attrTable,
                        attrValueTableData: attrValTable,
                        customize: currentValue.customize
                    })
                    props.addAttrDetail({data:addAttrAndAttrValue(attrTable,attrValTable,currentValue.customize),attrId:attrId?attrId:''})
                } else {
                    message.warning('中英文不能为空')
                }

            } else {
                console.log('error,submit')
            }
        })
    }
    //新增属性以及属性值
    const addAttrAndAttrValue=(attrTable,attrValTable,customize)=>{
        let attrTableData = []
        let attrValTableData = []
        let returnData = {}
        attrTable.map(item=>{
            for(var key in item)
            if(key!='attrId'&&key!='canBeModify'){
                attrTableData.push({
                    languageCode:key,
                    name:item[key].value
                })
            }

        })
        attrValTable.map((attrVal,index)=>{
            let valueNameList=[]
            for(var key in attrVal)
            if(key!='valueId'&&key!='canBeModify'){
                valueNameList.push({
                    languageCode:key,
                    name:attrVal[key].value
                })
            }
            if(type=='add'){
                attrValTableData[index]={'valueNameList':valueNameList}
            }else{
                attrValTableData[index]={'valueNameList':valueNameList,valueId:attrVal['valueId']}
            }

        })
        returnData={
            attrNameList:attrTableData,
            attrValueList:attrValTableData,
            customize:customize
        }
        console.log(returnData)
        return returnData
    }
    const handleCancel = e => {
        resetDialog()
        setVisible(false)
        editType('add')
    }
    const changeLangContent = (value, index, code, oldTableData, type) => {
        let newData = [...oldTableData]
        newData[index][code]['value'] = value
        setattrTableData(newData)
    }
    const changeLangValContent = (value, index, code, oldTableData, type) => {
        let newData1 = [...oldTableData]
        newData1[index][code]['value'] = value
        setattrTableValData(newData1)
    }
    //新增
    const addAttrVal = (index, oldData) => {
        let newData = [...oldData]
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        var data = {}
        countryCodeLists.map(item => {
            data[item.code] = {
                editable: false,
                value: ''
            }
        })
        newData.push(data)
        setattrTableValData(newData)
    }
    //删除
    const deleteAttrVal = useCallback((index, oldData,name) => {
        var newData = [...oldData]
        confirm({
            title: '删除属性值不影响现有类目和商品，但一经删除无法恢复',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                if (newData.length == 1) {
                    message.warning('最少有一个属性值')
                } else {
                    newData.splice(index, 1)
                }
                setattrTableValData(newData)
            },
            onCancel() {
              console.log('Cancel');
            },
          });

    })
    const formatTranslateParam = (fromLanguageCode, originContentList) => {
        let result = {}
        let oneKeyTranslationUnitList = []
        _.forEach(originContentList, originContent => {
            _.forEach(countryLanage, (item) => {
                let unit = {}
                if (item.code !== 'cn') {
                    unit.fromLanguageCode = fromLanguageCode
                    unit.originContent = originContent
                    unit.toLanguageCode = item.code
                    oneKeyTranslationUnitList.push(unit)
                }
            })
        })
        result.oneKeyTranslationUnit = oneKeyTranslationUnitList
        return result
    }
    //一键翻译
    const translateAttr = () => {
        if (verifyRepetValueName()) {
            message.error('属性值不能重复')
            return false
        }
        var originContent = []
        attrValTable.map((item, index) => {
            if (item['cn'] == '') {
                message.warning('中文不能为空')
                return false
            } else {
                originContent.push(item['cn'].value)
            }
        })
        if (attrTable[0]['cn']['value'] != '') {
            setLoading(true)
            originContent.push(attrTable[0]['cn'].value)
            var params = formatTranslateParam('cn', originContent)

            getOneKeyTranslation(filterData(params)).then(resultes => {
                if (resultes.ret.errcode == 1) {
                    filterTranslate(resultes.oneKeyTranslationUnit)
                } else {

                }
            })
        } else {
            message.warning('中文不能为空')
            return false
        }
    }
    //翻译过后属性返回
    const filterTranslate = (translateVal) => {
        let attrValTableData = []
        attrValTable.map((item, index) => {
            attrValTableData.push(item)
        })
        let attrTableData = [...attrTable]
        //属性名
        attrTableData.map(attr => {
            translateVal.map((item, index) => {
                if (attr['cn']['value'] == item.originContent) {
                    translateVal.map(child=>{
                        for(var key in attr){
                            if(key==child.toLanguageCode){
                                attr[key]['value'] = child.translation
                            }
                        }
                    })
                }
            })
        })
        //属性值
        attrValTableData.map(attr => {
            translateVal.map((item, index) => {
                if (attr['cn']['value'] == item.originContent) {
                    translateVal.map(child=>{
                        for(var key in attr){
                            if(key==child.toLanguageCode&&attr['cn']['value'] == child.originContent){
                                attr[key]['value'] = child.translation
                            }
                        }
                    })
                }
            })
        })
        setattrTableData(attrTableData)
        setattrTableValData(attrValTableData)
        setLoading(false)
    }
    const verifyRepetValueName = () => {
        let valueNames = []
        _.forEach(attrValTable, item => {
            valueNames.push(item.cn.value)
        })
        let temp = Array.from(new Set(valueNames))
        if (valueNames.length > temp.length) {
            return true
        } else {
            return false
        }
    }
    const resetDialog = ()=>{
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        var data = {}
        var attrTableData = []
        var attrTableValData = []
        countryCodeLists.map(item => {
            data[item.code] = {
                editable: false,
                value: ''
            }
        })
        attrTableData.push(JSON.parse(JSON.stringify(data)))
        attrTableValData.push(JSON.parse(JSON.stringify(data)))
        setattrTableData(attrTableData)
        setattrTableValData(attrTableValData)
    }
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        resetDialog()
        setCountryLanage(countryCodeLists)
    }, [])
    return (
        <div>
            <React.Fragment>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ width: '1200px', fontSize: '20px' }}
                    width={1000}
                    destroyOnClose
                    onCancel={handleCancel}
                    footer={[
                        <Button type="primary" style={{ float: 'left' }} key="task" onClick={() => translateAttr()} loading={loading}>
                            一键填充翻译
                        </Button>,
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <Form
                        initialValues={defaultValue}
                        {...formItemLayout}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="属性名："
                            name="attrNameTableData"
                        >

                            <Table dataSource={attrTable} pagination={false}  rowKey="attrId">
                             {  type=='edit'&&<Column title="属性ID" key="attrId" dataIndex="attrId"></Column>}
                                {
                                    countryLanage.map((item, index) => {
                                        return <Column title={(item.code == 'cn' || item.code == 'en') ? '*' + item.desc + item.code : item.desc + item.code} dataIndex={item.code} align='center'
                                                       key={item.code}
                                                       render={(text, row, index) => {
                                                           return <Input onChange={(e) => changeLangContent(e.target.value, index, item.code, attrTable, 'attr')}
                                                                         value={attrTable[0][item.code] ? attrTable[0][item.code]['value'] : ''} disabled={type=='edit'&&!row.canBeModify}/>
                                                       }}>

                                        </Column>
                                    })
                                }
                            </Table>
                        </Form.Item>
                        <Form.Item
                            label="属性值："
                            name="attrValueTableData"
                        >
                            <Table dataSource={attrValTable} pagination={false} rowKey="valueId"
                            >
                                {  type=='edit'&&<Column title="属性值ID" key="valueId" dataIndex="valueId"></Column>}
                                {
                                    countryLanage.map((item, index) => {
                                        return <Column title={(item.code == 'cn' || item.code == 'en') ? '*' + item.desc + item.code : item.desc + item.code} dataIndex={item.code} align='center'
                                                       key={item.code}
                                                       render={(text, row, index) => {
                                                           return <Input onChange={(e) => changeLangValContent(e.target.value, index, item.code, attrValTable, 'attrVal')}
                                                                         value={row[item.code] ? row[item.code]['value'] : ''} disabled={type=='edit'&&!row.canBeModify}
                                                           />
                                                       }}>

                                        </Column>
                                    })
                                }
                                <Column title='操作'  align='center' key="option" render={(text, row, index) => { return <div><a style={{ marginRight: 10 }} onClick={() => addAttrVal(index, attrValTable)}>新增</a><a onClick={() => deleteAttrVal(index, attrValTable)}>删除</a></div> }} width={100}></Column>
                            </Table>
                        </Form.Item>
                        <Form.Item label="自定义：" extra="在编辑商品的该属性时，可以从属性值表中选取，也可以自定义属性值" name="customize" required>
                            <Radio.Group>
                                <Radio value={1} key="1">允许自定义</Radio>
                                <Radio value={0} key="0">禁止自定义</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default AddProductAttr
