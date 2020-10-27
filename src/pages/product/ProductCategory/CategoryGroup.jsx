import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles/BackCategory.less';
import { ViewContainer, QueryTable } from '@/components';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { parseTime } from '@/utils/index';
import { PurCateGroupList } from '@/services/purchase'
import { getCategoryGroupList, categoryList } from '@/services/product1'
import { listSysUserByPage } from '@/services/staff'
import AddCategoryGroup from './components/AddCategoryGroup';

/**
 * 类目分组
 */
const CategoryGroup = () => {
    const [dataList, setDataList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [buyerList, setBuyerList] = useState([])
    const addCategoryGroupRef = useRef()
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 20
    })

    useEffect(() => {
        getDataList({})
        getBuyerList()
    }, [])
    
    const getDataList = useCallback((data) => {
        let param = {
            page,
            cateId: []
        }
        param = Object.assign(param, data || {})
        PurCateGroupList(param).then(res => {
            if (res.ret.errcode === 1) {
                setDataList(res.groupPB)
            }
        })
    })

    const getBuyerList = useCallback(() => {
        listSysUserByPage({
            page: {
                pageNum: 1,
                pageSize: 10,
                pagingSwitch: false
              },
              groupIds: [68, 69, 70]
        }).then(res => {
            if (res.ret.errcode === 1) {
                setBuyerList(res.sysUserPb)
            }
        })
    })

    const handleDetail = useCallback((type, item) => {

    }, [])

    const getCateName = useCallback((cateList) => {
        let res = ''

        cateList.forEach((item, index) => {
            if (index == 0) {
                res = item.cateName
            } else {
                res += `,${item.cateName}`
            }
        })

        return res
    }, [])

    // 类目获取
    const getCategoryList = useCallback(({cateType, level}) => {
        categoryList({}).then(res => {
            let temp = [...res.data.categoryUnitList]
            let list = []
            temp.forEach(item => {
                item.cateList = []
                let cateName = item.cateNameValue.find(name => name.languageCode === 'cn')
                item.cateName = cateName
                item.cateId += '' // 字符串化
                if (cateType == 2) {
                    item.leaf = level > 2
                } else {
                    item.leaf = level > 1
                }
                list.push(item)
            })
            setCategoryList(list)
        })
    }, [])

    return (
        <ViewContainer>
            <QueryTable
                dataSource={dataList}
                tableItemCenter
                advance={3}
                columns={[
                    {
                        title: '序号',
                        width: 80,
                        hideInForm: true,
                        dataIndex: 'index',
                        render: (item, record, index) => index + 1
                    },
                    {
                        title: '用户搜索',
                        dataIndex: 'buyerName',
                        hideInTable: true,
                        formItemProps: {
                            placeholder: "请输入真实姓名"
                        }
                    },
                    {
                        title: '类目分组',
                        dataIndex: 'groupName'
                    },
                    {
                        title: '后台类目',
                        dataIndex: "cateList",
                        queryType: "cascader",
                        formItemProps: {
                            changeOnSelect: true,
                            options: categoryList
                        },
                        width: 250,
                        ellipsis: true,
                        render: (cateList) => getCateName(cateList)
                    },
                    {
                        title: '用户',
                        dataIndex: "buyerList",
                        hideInForm: true,
                        width: 200,
                        render: (buyerList) => buyerList && buyerList.map(buyer => <Tag key={buyer.buyerId}>{buyer.buyerName}</Tag>)
                    },
                    {
                        title: '创建时间',
                        dataIndex: "createTime",
                        hideInForm: true,
                        width: 200,
                        render: createTime => createTime && parseTime(createTime)
                    },
                    {
                        title: '更新时间',
                        dataIndex: "updateTime",
                        hideInForm: true,
                        width: 200,
                        render: updateTime => updateTime && parseTime(updateTime)
                    },
                    {
                        title: "操作",
                        dataIndex: "option",
                        hideInForm: true,
                        render: (_, item) => {
                            return <div className="table-row-option"><a onClick={() => handleDetail('edit', item)} style={{ marginRight: 8 }}>编辑</a><a onClick={() => handleDetail('show', item)}>查看详情</a></div>;
                        }
                    }
                ]}
                onQuery={(params) => {
                    getDataList({...params})
                }}
                tableProps={{ rowKey: "groupId", bordered: true, scroll: { x: 'max-content' } }}
                buttonRender={<React.Fragment>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => {
                        if (addCategoryGroupRef.current) {
                            addCategoryGroupRef.current.changeVal(true);
                        }
                    }}>新增类目分组</Button>
                </React.Fragment>}
            />
            <AddCategoryGroup ref={addCategoryGroupRef} categoryList={categoryList} buyerList={buyerList}/>
        </ViewContainer>
    )
}

export default CategoryGroup;