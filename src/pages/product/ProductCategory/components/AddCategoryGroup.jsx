import React, { useState, useImperativeHandle, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Input, Space,Select,Cascader,Checkbox, TreeSelect } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {categoryList} from '@/services/product1'
import { FormInstance } from 'antd/lib/form';
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddCategoryGroup = React.forwardRef((props, ref) => {
    const {buyerList, categoryList} = props // 第一层的类目数据由父组件传入
    const [moreCategoryList, setMoreCategoryList] = useState([])
    const [visible, setVisible] = useState(false);
    const initFrontTypes = [{ label: "选项", value: 4, children: [{ label: "子项", value: 5 }] }, { label: "选项2", value: 5 }, { label: "选项3", value: 6 }];
    const [title, setTitle] = useState('新增类目分组')
    const formRef = React.createRef(FormInstance)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            }
        }
    });

    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const loadCategoryData = useCallback((treeNode) => {
        console.log(treeNode)
        // let params = {
        //     cateType: 2, //类目类型 1 前台类目 2 后台类目
        //     page: {
        //         pageNum: 1,
        //         pageSize: 1000
        //     },
        //     pid
        // }
        // categoryList(params).then(res => {
        //     if (res.ret.errCode === 0) {
        //         let temp = [...moreCategoryList]
        //         temp = temp.concat(res.data.categoryUnitList)
        //     }
        // })
    }, [])

    const handleOk = e => {
       formRef.current.validateFields().then(currentValue=>{
           if(currentValue){
            console.log(currentValue)
            setVisible(false)
           }else{
            console.log('error,submit')
           }
       })
    };

    const handleCancel = e => {
        // console.log(e);
        setVisible(false)
       
    };


    return (
        <div>
            <React.Fragment>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ width: '1000px', fontSize: '20px' }}
                    width='1000px'
                    destroyOnClose
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>,
                    ]}
                >
                    <p>1、类目分组名保存后不支持变更</p>
                    <p>2、类目分组保存后不支持删除</p>
                    <p>3、若有后台类目未被分组，后续产生的采购单将进入采购单列表‘未分组’标签页，须建立对应类目分组后才可操作</p>
                    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}>
                        <Form.List name="categoryForm">
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map(field => (
                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                <Form.Item
                                                    {...field}
                                                    label="类目分组名："
                                                    name={[field.name, 'groupName']}
                                                    fieldKey={[field.fieldKey, 'groupName']}
                                                    rules={[{ required: true, message: '请输入类目分组名' }]}
                                                >
                                                    <Input placeholder="类目分组名" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="后台类目："
                                                    name={[field.name, 'cateId']}
                                                    fieldKey={[field.fieldKey, 'cateId']}
                                                    rules={[{ required: true, message: '请选择后台类目' }]}
                                                    style={{width:'300px'}}
                                                >
                                                    <TreeSelect
                                                        placeholder="选择后台类目"
                                                        allowClear
                                                        treeData={categoryList}
                                                        loadData={loadCategoryData}
                                                        multiple
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="用户："
                                                    name={[field.name, 'userId']}
                                                    fieldKey={[field.fieldKey, 'userId']}
                                                    rules={[{ required: true, message: '请选择用户' }]}
                                                    style={{width:'200px'}}
                                                >
                                                    <Select placeholder="请选择用户" mode="multiple" allowClear>
                                                        {
                                                            buyerList.map(item=>{
                                                            return <Option value={item.sysUserId} key={item.sysUserId}>{item.realName}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>

                                                {/* <MinusCircleOutlined
                                                    
                                                /> */}
                                                <Button type="link" onClick={() => {
                                                        remove(field.name);
                                                    }}>删 除</Button>
                                            </Space>
                                        ))}

                                        <Form.Item>
                                            <Button

                                                onClick={() => {
                                                    add();
                                                }}
                                                block
                                            >
                                                <PlusOutlined /> 新增类目分组
                                            </Button>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>

                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default AddCategoryGroup