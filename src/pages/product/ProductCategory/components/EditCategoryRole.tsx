import React, { useImperativeHandle, useState, useCallback } from 'react';
import { Modal, Form, Row, Col, Input, Select } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from './styles/EditCategoryRole.less';

interface EditCategoryRoleType {
    // 弹窗标题
    type?: 'show' | 'edit',
    curValues?: {},
    groupList?: [],
    onConfirm?: Function
}

const FormItem = Form.Item;

// 编辑类目权限
const EditCategoryRole = React.forwardRef((props: EditCategoryRoleType, ref) => {
    const { type, curValues, groupList, onConfirm } = props;

    const [visible, setVisible] = useState(false); // 弹窗显示
    const [form] = Form.useForm();
    // 类目
    const [category, setCategory] = useState([]);
    const [selected, setSelected] = useState([0, 0, 0]); // 存储选中的下标值

    useImperativeHandle(ref, () => {
        return {
            // 修改弹窗显示
            changeVisible: (show: boolean) => {
                setVisible(show);
            },
            // 设置类目列表
            setCategoryList: (list) => {
                setCategory(list);
            }
        }
    });

    const onFinish = useCallback((values) => {
        let temp = {...values}
        temp.userId = curValues.userId
        onConfirm(temp)
    }, [curValues])

    const handleSelect = useCallback((index, selectIndex) => {
        let temp = [...selected]
        if (index == 0) { // 选择了第一项,把其他的清掉
            temp[1] = -1
            temp[2] = -1
        }
        temp[index] = selectIndex

        setSelected(temp)
    }, [selected, category])

    const cancelModal = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <Modal 
            visible={visible} 
            title={type == 'edit' ? '编辑类目权限' : '查看类目权限'} 
            destroyOnClose
            maskClosable={false}
            okButtonProps={{ htmlType: 'submit', form: 'categoryRoleForm'}}
            width={660} onCancel={cancelModal}>
            <Form form={form} initialValues={curValues} id="categoryRoleForm" onFinish={onFinish}>
                <Row>
                    <Col span={24}>
                        <FormItem name="groupId" rules={[{ required: true }]} label="类目分组" style={{ width: "100%" }}>
                            <Select mode="multiple" disabled={type === 'show'}>
                                {
                                    groupList.map(item => 
                                        <Select.Option key={item.groupId} value={item.groupId}>{item.groupName}</Select.Option>    
                                    )
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem name="realName" label="真实姓名" labelCol={{ span: 6 }}>
                            <Input disabled/>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem name="buyerName" label="用户名" labelCol={{ span: 6 }}>
                            <Input disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className={styles.wrap}>
                            <div className={styles.label}>类目权限：</div>
                            <div className={styles.cateList}>
                                <ul className={styles.list} hidden={category.length <= 0}>
                                    {
                                        category.map((cate, index) => <li key={cate.cateId} 
                                            className={index == selected[0] ? styles.selected : ''}
                                            onClick={() => handleSelect(0, index)}
                                        >
                                            <span>{cate.cateName}</span><RightOutlined />
                                        </li>)
                                    }
                                </ul>
                                <ul className={styles.list} hidden={!category[selected[0]]}>
                                    {
                                        category[selected[0]] && category[selected[0]].cateList && category[selected[0]].cateList.map((cate, index) => <li key={cate.cateId} 
                                            className={index == selected[1] ? styles.selected : ''}
                                            onClick={() => handleSelect(1, index)}>
                                            <span>{cate.cateName}</span><RightOutlined />
                                        </li>)
                                    }
                                </ul>
                                <ul className={styles.list} hidden={!category[selected[1]]}>
                                    {
                                        category[selected[1]] && category[selected[1]].cateList && category[selected[0]].cateList[selected[1]].cateList.map((cate, index) => <li 
                                            className={index == selected[2] ? styles.selected : ''}
                                            onClick={() => handleSelect(2, index)}
                                            key={cate.cateId}>
                                            <span>{cate.cateName}</span>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </div>

                    </Col>
                </Row>
            </Form>
        </Modal>
    )
});

export default EditCategoryRole;
