import React, { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, Space, Select, Cascader, TreeSelect, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Drag } from '@/components'
import { FormInstance } from 'antd/lib/form';
import styles from './addFirstCategory.less'
import { categoryList,frontCategoryGroupGet} from '@/services/product1'
const { SHOW_PARENT, SHOW_ALL } = TreeSelect;
// 要使用React.forwardRef才能将ref属性暴露给父组件
const GroupManage = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('分组管理')
    const [countryLanage, setCountryLanage] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const formRef = React.createRef(FormInstance)
    const dragRef = useRef()
    const [cateGoryDataSource, setDataSource] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [defaultValue,setDefaultValue] = useState({})
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            secondCategory: () => {
                getCategoryList(0, 1)
            },
            setSelected:()=>{
                setDataSource([])
            },
            resetDefault:()=>{
                setDefaultValue({})
                setDataSource([])
            },
            getDetail:(id)=>{
                let params={
                    id:id
                }
                frontCategoryGroupGet(params).then(response=>{
                    if(response.ret.errCode==0){
                        let nameObj = {}
                        response.data.nameValueList.forEach(langName => {
                          nameObj[langName.languageCode] = langName.name
                        })
                        setDefaultValue(nameObj)
                        setVisible(true)
                        imgRender(response.data.secondCategoryList)
                    }
                })
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
                console.log(currentValue)
                if(cateGoryDataSource.length==0){
                    message.warning('请挑选前台二级类目')
                    return
                }
                let arr=[]
                cateGoryDataSource.map(item=>{
                    arr.push(item.cateId)
                })
                let params={
                    nameValueList:nameValueListReturn(currentValue),
                    name:currentValue.cn,
                    categoryIdList:arr,
                    pid:props.pid,
                    id:props.id?props.id:''
                }
                props.addOrUpdateGroup(params)
            } else {
                console.log('error,submit')
            }
        })
    };

    const handleCancel = e => {
        props.handleCancel()

    };
    const imgRender = (val) => {
        var arrSource = []
        val.map((item, index) => {
            arrSource.push({
                title: item.title?item.title:item.name,
                uid: item.cateId?item.cateId:item.id,
                cateId:item.cateId?item.cateId:item.id,
                cover:item.cover,
                render: (row) => <div className={styles['imgContent']} ><img src={item.cover} style={{ width: 90, height: 90 }} key={item.uid}></img>
                    <p>{item.title?item.title:item.name}</p>
                    <div className={styles['operate-area']} >
                        <DeleteOutlined onClick={(e) => deleteCateGory(e, index,arrSource)} />
                    </div>
                </div>
            })
        })
        setDataSource(arrSource)
    }
    //二级分类删除
    const deleteCateGory=(event,index,oldData)=>{
        let arr = oldData.concat([])
        arr.splice(index,1)
        setDataSource(arr)
    }
    //二级分类选择事件
    const categoryChange = (val) => {
        let filterData = []
        categoryOptions.map(item => {
            if (item.children) {
                item.children.map(child => {
                    val.map(selected => {
                        console.log(child,selected)
                        if (child.cateId == selected.value) {
                            filterData.push(child)
                        }
                    })
                })
            }
        })
        let arr = cateGoryDataSource.concat([])
        for (let i = 0; i < filterData.length; i++) {
            let data = filterData[i]
            let item = arr.find((val) => {
                return val.cateId == data.cateId;
            })
            if (!item) {
                arr.push(data);
            }

        }
        imgRender(arr)   
    }
    //初始化列表树
    const getCategoryList = (pid, level) => {
        let params = {
            cateType: 1, //类目类型 1 前台类目 2 后台类目
            level: level,
            pid: pid,
            countryCode: props.countryCode
        }
        categoryList(params).then((res) => {
            if (res.ret.errCode === 0) {
                let categoryUnitList = []
                if (res.data.categoryUnitList) {
                    categoryUnitList = res.data.categoryUnitList.map(item => {
                        return {
                            pId: item.pid,
                            value: item.cateId,
                            cateId: item.cateId,
                            id: item.cateId,
                            title: item.cateName,
                            key: item.cateId,
                            cover:item.cover,
                            isLeaf: item.level === 2 ? true : false
                        }
                    })
                } else {
                    categoryUnitList = []
                }
                if (pid == 0) {
                    setCategoryOptions(categoryUnitList)
                } else {
                    let treeDataList = categoryOptions.concat([])
                    treeDataList.map(item => {
                        if (item.cateId == pid) {
                            item.children = categoryUnitList
                        }
                    })
                    setCategoryOptions(treeDataList)
                }

            }
        }).catch((err) => {
            console.error(err)
        })
    }
    const getSubCategory = (data) => {
        getCategoryList(data.value)
    }
    //自定义渲染节点 懒加载
    const onLoadData = (treeNode) => {
        return new Promise(resolve => {
            setTimeout(() => {
                getSubCategory({ value: treeNode.cateId })
            }, 300)
            resolve()
        })
    }
    //格式化语言
    const nameValueListReturn = (currentValue) => {
        let nameValueList = []
        countryLanage.map(item => {
            for (var key in currentValue) {
                if (item.code == key) {
                    nameValueList.push({
                        languageCode: key,
                        name: currentValue[key] ? currentValue[key] : ''
                    })
                }
            }
        })
        return nameValueList
    }
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
    }, [])
    return (
        <div>
            <React.Fragment>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ width: '900px', fontSize: '20px' }}
                    width="900px"
                    destroyOnClose
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
                    <Form
                        initialValues={defaultValue}
                        {...formItemLayout}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="父类目："
                            name="pName"
                            required
                        >
                            <span>{props.pName}</span>
                        </Form.Item>
                        <Form.Item
                            label="类目名称："
                            name="categoryName"
                        >
                            <table className="table table-bordered table-info">
                                <tbody>
                                    {
                                        countryLanage.map((item, index) => {
                                            return <tr key={index}>
                                                {
                                                    (item.code == 'cn' || item.code == 'en') ? <th key={item.code} className={styles['th']}><span className="required" style={{ color: 'red' }}>*</span><span>{item.desc}</span></th> : <th key={item.code} className={styles['th']}><span>{item.desc}</span></th>
                                                }
                                                <td className={styles['td']}>
                                                    <Form.Item name={item.code} rules={item.code == 'cn' || item.code == 'en' ? [{ required: true, message: '不能为空' }] : [{ required: false }]} style={{ marginBottom: 0 }}>
                                                        <Input placeholder="请输入" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </Form.Item>
                        <Form.Item
                            label="前台二级类目："
                            name="categoryIds"
                            required
                        >
                            <TreeSelect
                                treeDataSimpleMode
                                treeCheckStrictly={true}
                                treeData={categoryOptions}
                                value={selectedOptions}
                                onChange={categoryChange}
                                loadData={onLoadData}
                                treeCheckable={true}
                                showCheckedStrategy={SHOW_PARENT}
                                placeholder='请选择商品后台类目'
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label=".">
                            <Drag ref={dragRef} dragKey="uid" dataSource={cateGoryDataSource}
                                onChange={(info) => {
                                    console.log(info)
                                }}
                            />
                        </Form.Item>

                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default GroupManage