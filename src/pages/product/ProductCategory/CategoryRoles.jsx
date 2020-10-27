import React, { useState, useRef, useCallback, useEffect } from 'react';
import { QueryTable, ViewContainer } from '@/components';
import Button from 'antd/es/button';
import { SearchOutlined } from '@ant-design/icons';
import EditCategoryRole from './components/EditCategoryRole';
import { categoryList } from '@/services/product1'
import { PurCateGroupQuery, PurCateGroupBuyerDetail, PurCateGroupEditBuyer, DeletePurCateGroupBuyer, PurCateGroupSelect } from '@/services/purchase'
import { message, Modal } from 'antd';
/**
 * 后台类目
 */
const {confirm} = Modal
const CategoryRoles = () => {
    const initFrontTypes = [{ label: "选项", value: 4, children: [{ label: "子项", value: 5 }] }, { label: "选项2", value: 5 }, { label: "选项3", value: 6 }]
    const [frontTypes, setFrontTypes] = useState(initFrontTypes);
    const editRef = useRef();
    const [backCategoryList, setBackCategoryList] = useState([])
    const [tableData, setData] = useState([]);
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 20
    })
    const [total, setTotal] = useState(0)
    const [type, setType] = useState('edit')
    const [item, setItem] = useState({})
    const [groupList, setGroupList] = useState([])

    const routerPageEdit = useCallback((row) => {
        if (editRef.current) {
            setType('edit')
            getDetailData(row)
        }
    })
    
    const getDetailData = useCallback(({buyerId}) => {
        PurCateGroupBuyerDetail({userId: buyerId}).then(res => {
            if (res.ret.errcode === 1) {
                editRef.current.setCategoryList(res.cateList)
                let groupIds = res.group.map(a => a.groupId)
                setItem({
                    buyerName: res.buyerName,
                    realName: res.realName,
                    group: res.group,
                    groupId: groupIds,
                    userId: res.buyerId
                })
                editRef.current.changeVisible(true);
            }
        })
    }, [])

    const getGroupList = useCallback(() => {
        PurCateGroupSelect({}).then(res => {
            if (res.ret.errcode === 1) {
                setGroupList(res.groupList)
            }
        })
    })

    const getDataList = useCallback((data) => {
        console.log(data)
        let param = {
            page
        }
        param = Object.assign(param, data || {})
        PurCateGroupQuery(param).then(res => {
            if (res.ret.errcode === 1) {
                setData(res.groupPB)
                setTotal(res.total)
            }
        })
    }, [])
    
    const returnGroupName = useCallback((data) => {
        let res = ''
        data.forEach((item, index) => {
            if (index == 0) {
                res = item.groupName
            } else {
                res += `,${item.groupName}`
            }
        })

        return res
    }, [])

    const handleDel = useCallback(({buyerId}) => {
        confirm({
            title: '提示',
            content: '此操作将删除该用户类目权限, 是否继续?',
            onOk() {
                DeletePurCateGroupBuyer({
                    userId: buyerId
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        message.success('删除成功')
                        let tempPage = Object.assign({}, page, {pageNum: 1})
                        getDataList({tempPage})
                    }
                })
            }
        })
    }, [])

    const handleDetail = useCallback((item) => {
        if (editRef.current) {
            setType('show')
            getDetailData(item)
        }
    }, [])

    const changePage = useCallback((current, pageSize) => {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList({page: temp})
    })

    const handleConfirm = useCallback((data) => {
        if (type === 'edit') {
            let param = {...data}
            PurCateGroupEditBuyer(param).then(res => {
                if (res.ret.errcode === 1) {
                    editRef.current.changeVisible(false)
                    message.success('用户权限编辑成功')
                    getDataList()
                }
            })
        } else {
            editRef.current.changeVisible(false)
        }
    }, [item, type])

    const loadBackCategoryList = useCallback((list) => {
        let selectItem = list[list.length - 1] || {}
        selectItem.loading = true
        categoryList({
            pid: selectItem.cateId,
            cateType: 2,
            level: selectItem.level,
        }).then(res => {
            if (res.ret.errCode === 0) {
                let list = res.data.categoryUnitList || []
                list = list.map(item => {
                    item.label = item.cateName
                    item.value = item.cateId
                    item.isLeaf = item.level > 2

                    return item
                })
                selectItem.children = list.length ? list: [{isLeaf: true, value: '', label: ''}]
            }
            selectItem.loading = false
            setBackCategoryList([...backCategoryList])
        }).catch(() => {
            selectItem.loading = false
        })
    }, [backCategoryList])

    const getFrontCategoryList = useCallback((data) => {
        categoryList(data).then(res => {
            if (res.ret.errCode === 0) {
                let list = res.data.categoryUnitList || []
                list = list.map(item => {
                    item.label = item.cateName
                    item.value = item.cateId
                    item.isLeaf = data.level > 2

                    return item
                })
                
                setBackCategoryList(list)
            }
        })
    }, [])

    useEffect(() => {
        getDataList({})
        getGroupList()
        getFrontCategoryList({
            cateType: 2,
            level: 1,
            pid: 0
        })
    }, [])

    return (
        <ViewContainer>
            <QueryTable
                tableItemCenter
                dataSource={tableData}
                columns={[
                    {
                        title: "序号",
                        key: 'index',
                        width: 150,
                        hideInForm: true,
                        render: (_, item, index) => `${index + 1}`
                    },
                    {
                        title: "用户名",
                        dataIndex: 'buyerName',
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "真实姓名",
                        dataIndex: 'realName',
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "组织部门",
                        dataIndex: 'permissionGroup',
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "角色",
                        dataIndex: 'role',
                        width: 150,
                        hideInForm: true,
                        render: (role) => role.join(',')
                    },
                    {
                        title: "用户搜索",
                        dataIndex: 'buyerName',
                        width: 150,
                        hideInTable: true
                    },
                    {
                        title: "类目分组",
                        dataIndex: 'groupName',
                        width: 150,
                        render: (text, item) => returnGroupName(item.group)
                    },
                    {
                        title: "后台类目",
                        dataIndex: 'categoryGroup',
                        width: 150,
                        queryType: 'cascader',
                        formItemProps: {
                            changeOnSelect: true,
                            showSearch: false,
                            options: frontTypes,
                            style: { width: 320 },
                            options: backCategoryList,
                            loadData: loadBackCategoryList
                        },
                        hideInTable: true
                    },
                    {
                        title: "创建时间",
                        dataIndex: 'createTime',
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "更新时间",
                        dataIndex: 'updateTime',
                        width: 150,
                        hideInForm: true
                    },
                    {
                        title: "操作",
                        dataIndex: 'options',
                        hideInForm: true,
                        fixed: 'right',
                        width: 180,
                        render: (_, item) => <div className="table-row-option">
                            <a onClick={() => routerPageEdit(item)} style={{ marginRight: 8 }}>编辑</a>
                            <a onClick={() => handleDetail(item)} style={{ marginRight: 8 }}>查看详情</a>
                            <a className="table-row-option-del" onClick={() => handleDel(item)}>删除</a>
                        </div>
                    }
                ]}
                onQuery={params => {
                    let group = params.categoryGroup
                    let temp = {
                        page: {
                            pageNum: 1,
                            pageSize: params.pageSize
                        },
                        cateId: group ? group[group.length - 1] + '' : '',
                        ...params
                    }
                    delete temp.categoryGroup
                    
                    getDataList({
                        
                    })
                }}
                tableProps={{ 
                    rowKey: "buyerId", 
                    bordered: true, 
                    scroll: { x: 'max-content' },
                    pagination: {
                        showSizeChanger: true,
                        showQuickJumper: false,
                        showTotal: () => `共${total}条`,
                        pageSize: page.pageSize,
                        pageSizeOptions: [10, 20, 50, 100],
                        current: page.pageNum,
                        total: total,
                        onChange: changePage
                    }
                }}
            />
            <EditCategoryRole ref={editRef} type={type} 
                onConfirm={handleConfirm}
                curValues={item} groupList={groupList}/>
        </ViewContainer>
    )
}

export default CategoryRoles;