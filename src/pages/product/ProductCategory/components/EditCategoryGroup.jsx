import React, { useState } from 'react'
import { Form, Modal } from 'antd'

const EditCategoryGroup = (props) => {
    const { showModal, onCancel, onConfirm, type, buyerList, categoryList } = props

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

    return (
        <Modal
            maskClosable={false}
            destroyOnClose
            width={700}
            visible={showModal}
            title={type === 'edit' ? '编辑类目分组' : '查看类目分组'}
            onCancel={onCancel}
            okButtonProps={{ htmlType: 'submit', form: 'backCategoryEditForm'}}
        >
            <p>1、类目分组名保存后不支持变更</p>
            <p>2、类目分组保存后不支持删除</p>
            <p>3、若有后台类目未被分组，后续产生的采购单将进入采购单列表‘未分组’标签页，须建立对应类目分组后才可操作</p>
            <Form>
                <Form.Item label="类目分组名" rules={[{
                    required: true,
                    message: '类目分组名必填'
                }]} name="groupName">
                    <Input/>
                </Form.Item>
                <Form.Item label="用户" name="userId" rules={[{
                    required: true,
                    message: '用户必选'
                }]}>
                    <Select placeholder="请选择用户" mode="multiple" allowClear>
                        {
                            buyerList.map(item=>{
                            return <Option value={item.sysUserId} key={item.sysUserId}>{item.realName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="后台类目" name="cateId" rules={[
                    {
                        required: true,
                        message: '后台类目必选'
                    }
                ]}>
                    <TreeSelect
                        placeholder="选择后台类目"
                        allowClear
                        treeData={categoryList}
                        loadData={loadCategoryData}
                        multiple
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(EditCategoryGroup)