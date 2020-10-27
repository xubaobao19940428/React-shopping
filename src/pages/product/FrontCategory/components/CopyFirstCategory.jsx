import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Form, Input, Space, Select, Checkbox, Tree, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import {frontCopyFrontCategory} from '@/services/product1'
import styles from './addFirstCategory.less'
const {Option} = Select
// 要使用React.forwardRef才能将ref属性暴露给父组件
const CopyFIrstCategory = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [country, setCountry] = useState('MY')
    const [checkedCountry, setCountryDefault] = useState(['MY'])
    const [countryList, setCountryList] = useState([])
    const [level, setLevel] = useState(2)
    const [treeDataList, setTreeData] = useState([])
    const [defaultSelectedKeys,setSelectedKeys] = useState([])
    const [selectedTreeData,setSelectedTreeData] = useState([])
    const [twoLevelCateId,setTwoLevelCateId] =useState('')
    const formRef = React.createRef(FormInstance)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeCopyVal: (newVal) => {
                setVisible(newVal);
            },
            changeCountry: (newCountry) => {
                setCountry(newCountry)
            },
            changeTreeData: (newTreeData) => {
                setTreeData(newTreeData)
            },
            changeSelectedKeys:(newKeys)=>{
                setSelectedKeys(newKeys)
                setSelectedTreeData(newKeys)
            },
            changeTwoLevelCateId:(cateId)=>{
                setTwoLevelCateId(cateId)
            },
            changeLevel: (newLevalVal) => {
                setLevel(newLevalVal)
            },
            changeDefault: (newValDefault) => {
                console.log(newValDefault)
                setCountryDefault(newValDefault)
            }
        }

    });
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                console.log(currentValue,selectedTreeData)
                let copyUnitList = []
                
                if(level==1){
                    let levelTwo = []
                    selectedTreeData.map(val=>{
                        if(treeDataList[0].children){
                            treeDataList[0].children.map(item=>{
                                if(item.cateId==val){
                                    levelTwo.push({
                                        fromLevelTwoCateId:val
                                    })
                                }
                            })
                        }
                        
                    })
                    currentValue.checkedCountry.map((item,index)=>{
                        copyUnitList.push({
                            fromLevelOneCateId:treeDataList[0].cateId,
                            levelTwoList:levelTwo,
                            toCountryCode:item
                        })
                    })
                    
                }else if(level==2){
                    currentValue.checkedCountry.map(item=>{
                        let levelTwo = []
                        levelTwo.push({
                            fromLevelTwoCateId:twoLevelCateId,
                            oneLevelCateId:currentValue[item]
                        })
                        copyUnitList.push({
                            levelTwoList:levelTwo,
                            toCountryCode:item
                        })
                    })
                }
                console.log(copyUnitList)
                setFrontCopyFrontCategory(copyUnitList)
            } else {
                console.log('error,submit')
            }
        })
    };
    const handleCancel = e => {
        setVisible(false)
    };
    //选择分类复制
    const onCheck = (checkedKeys, info) => {
        setSelectedTreeData(checkedKeys)
    };
    // const onSelect = (selectedKeys, info) => {
    //     setSelectedTreeData(selectedKeys)
    // };
    const changeCountryValue = (val) => {
        console.log(1111)
        console.log(val)
    }
    const setFrontCopyFrontCategory = (data)=>{
        let params={
            copyUnitList:data
        }
        frontCopyFrontCategory(params).then(resultes=>{
            if(resultes.ret.errCode==0){
                message.success('成功复制至其他国家')
                setVisible(false)
            }
        })
    }
    useEffect(() => {
        let countryLists = JSON.parse(localStorage.getItem('COUNTRY_LIST'))
        setCountryList(countryLists)
    }, [])
    return (
        <div>
            <React.Fragment>
                <Modal
                    title="复制一级类目"
                    visible={visible}
                    style={{ fontSize: '20px' }}
                    width={850}
                    destroyOnClose
                    bodyStyle={{ textAlign: 'center' }}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <div style={{ color: "#cccccc", marginBottom: "10px" }}>复制时若发现已存在中文名相同的类目，系统将覆盖更新该类目</div>
                    <Form
                        initialValues={{
                            checkedCountry: checkedCountry,
                        }}
                        {...formItemLayout}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        {
                            level == 1 ?
                                <React.Fragment>
                                    <Form.Item
                                        label="复制至："
                                        name="checkedCountry"
                                    >
                                        <Checkbox.Group onChange={() => changeCountryValue}>
                                            {
                                                countryList.map(item => {
                                                    return <Checkbox
                                                        key={item.shortCode}
                                                        value={item.shortCode}
                                                        style={{
                                                            lineHeight: '32px',
                                                        }}
                                                        disabled={item.shortCode == country ? true : false}
                                                    >
                                                        {item.nameCn}
                                                    </Checkbox>

                                                })
                                            }
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Form.Item
                                        label="复制对象："
                                        name="memo"
                                    >
                                        <Tree
                                            checkable
                                            defaultExpandAll={true}
                                            // defaultSelectedKeys={defaultSelectedKeys}
                                            // defaultCheckedKeys={defaultSelectedKeys}
                                            // onSelect={onSelect}
                                            onCheck={onCheck}
                                            treeData={treeDataList}
                                            checkedKeys={selectedTreeData}
                                        />
                                    </Form.Item>
                                </React.Fragment>
                                : <React.Fragment>
                                    <Form.Item
                                        label="复制至："
                                        name="checkedCountry"
                                    >
                                        <Checkbox.Group onChange={() => changeCountryValue}>
                                            {
                                                countryList.map((item, index) => {

                                                return <div key={index} style={{display: "flex",justifyContent:"space-between",marginBottom:20 }}>
                                                        <Checkbox
                                                key={item.shortCode}
                                                value={item.shortCode}
                                                style={{
                                                    lineHeight: '32px',
                                                }}
                                                disabled={item.shortCode == country ? true : false}
                                            >
                                                {item.nameCn}
                                            </Checkbox>
                                            {
                                                item.shortCode == country ?
                                                    <React.Fragment>
                                                        <p>不能复制同一站点</p>
                                                </React.Fragment>
                                                    : <Form.Item
                                                        name={item.shortCode}
                                                    >
                                                        <Select placeholder="请选择" style={{ width: '200px', marginLeft: 40 }}>
                                                            {
                                                            props.countrySelectOptions[item.shortCode]&&props.countrySelectOptions[item.shortCode].map(option=>{
                                                                console.log(option)
                                                                return <Option value={option.cateId} key={option.cateId}>
                                                                    {option.cateName}
                                                                </Option>
                                                            })
                                                            
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                            }
                                                    </div>
                                                })
                                            }
                                        </Checkbox.Group>
                                    </Form.Item>
                                </React.Fragment>
                        }

                    </Form>
                </Modal>
            </React.Fragment>
        </div >
    );
})
export default CopyFIrstCategory