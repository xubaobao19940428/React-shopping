import React, { useState, useCallback, forwardRef, useRef, useEffect, Children } from 'react';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/BrandManage.less'
import { Select, Input, Button, Space, Pagination, Tag, message, Modal } from 'antd';
import { history } from 'umi';
import { brandInfoGet, brandInfoAdd, brandInfoModify, brandDelete, brandChangeStatus } from '@/services/product1';
import { DownloadOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { resolve } from '@/proto/proto';
const Option = Select.Option;
import AddBrand from './components/addBrand'
import { parseTime } from '@/utils';
const { confirm } = Modal;
/**
 * 品牌管理
 * 
 */
const BrandManage = () => {
    const [tableData, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [defaultPageSize, setDefaultPageSize] = useState(10)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [params, setParams] = useState({})
    const [tableLoading, setTableLoading] = useState(false)
    const AddBrandRef = useRef();
    const getBrandInfo = useCallback((params) => {
        setParams(params)
        setTableLoading(true)
        brandInfoGet(params).then(res => {
            if (res.ret.errCode == 0) {
                setData(res.data.list)
                setTotal(res.data.total)
                setTableLoading(false)
            }
        }).catch(error => {
            reject(error)
        })
    })
    const addBrand = () => {
        AddBrandRef.current.changeVal(true)
        AddBrandRef.current.changeTitle('新增品牌')
    }
    const editBrand = (row) => {
        console.log('edit', row)
        AddBrandRef.current.changeVal(true)
        AddBrandRef.current.changeTitle('编辑品牌')
        AddBrandRef.current.changeContent(row)
    }
    const editAndAdd = (data) => {
        if (data.brandId != '') {
            data.params.brandId = data.brandId
            brandInfoModify(data.params).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    message.success('编辑成功')
                    let queryParams = Object.assign(params, {
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    })
                    AddBrandRef.current.changeVal(false)
                    AddBrandRef.current.changeContent({})
                    getBrandInfo(queryParams)
                }
            })
        } else {
            brandInfoAdd(data.params).then(resultes => {
                if (resultes.ret.errCode == 0) {
                    message.success('添加成功')
                    let queryParams = Object.assign(params, {
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    })
                    AddBrandRef.current.changeVal(false)
                    AddBrandRef.current.changeContent({})
                    getBrandInfo(queryParams)
                }
            })
        }
    }
    const deleteBrand = (row) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '是否删除此品牌',
            onOk() {
                let data = {
                    brandId: row.brandId
                }
                brandDelete(data).then(resultes => {
                    if (resultes.ret.errCode == 0) {
                        message.success('删除成功')
                    }
                    let queryParams = Object.assign(params, {
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    })
                    getBrandInfo(queryParams)
                })
            },
            onCancel() {

            },
        })
    }
    const changeStatus = (row) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: row.status == 2 ? `是否启用此品牌` : `是否禁用此品牌`,
            onOk() {
                let data = {
                    brandId: row.brandId,
                    status: row.status == 1 ? 2 : 1
                }
                brandChangeStatus(data).then(resultes => {
                    if (resultes.ret.errCode == 0) {
                        message.success('状态修改成功')
                    }
                    let queryParams = Object.assign(params, {
                        page: {
                            pageNum: 1,
                            pageSize: 10
                        }
                    })
                    getBrandInfo(queryParams)
                })
            },
            onCancel() {

            },
        })
    }
   
    useEffect(() => {
        
    }, [])
    return (
        <ViewContainer>
            <div className={styles.container}>
                <QueryTable
                    tableItemCenter
                    dataSource={tableData}
                    columns={[
                        {
                            title: "品牌名:",
                            dataIndex: "name",
                            width: 150,
                            hideInTable: true
                        },
                        {
                            title: "状态：",
                            dataIndex: "status",
                            width: 150,
                            queryType: "select",
                            hideInTable: true,
                            valueEnum: [
                                {
                                    value: 1,
                                    label: "有效"
                                },
                                {
                                    value: 2,
                                    label: "失效"
                                }
                            ]
                        },
                        {
                            title: "来源",
                            dataIndex: 'comeFrom',
                            queryType: "text",
                            width: 150,
                            hideInForm: true
                        },
                        {
                            title: "中文名称",
                            dataIndex: "nameCn",
                            width: 200,
                            hideInForm: true
                        },

                        {
                            title: "英文名称",
                            dataIndex: 'nameEn',
                            width: 200,
                            hideInForm: true
                        },
                        {
                            title: "状态",
                            dataIndex: 'status',
                            width: 150,
                            hideInForm: true,
                            render: (item, row, index) => <React.Fragment>
                                {
                                    row.status == 1 ? <Tag color="green">有效</Tag> : <Tag color="red">失效</Tag>
                                }
                            </React.Fragment>
                        },
                        {
                            title: "操作",
                            dataIndex: 'options',
                            hideInForm: true,
                            fixed: 'right',
                            width: 150,
                            render: (item, row, index) => <div className={styles.btnBox}>
                                {row.status == 2 ? <Button type="primary" size="small" onClick={() => changeStatus(row)}>启 用</Button> : <Button danger size="small" onClick={() => changeStatus(row)}>禁 用</Button>}
                                <Button type="primary" size="small" onClick={() => editBrand(row)}>编 辑</Button>
                                <Button type="primary" size="small" danger onClick={() => deleteBrand(row)}>删 除</Button>
                            </div>
                        }
                    ]} onQuery={({ pageNum, pageSize, ...params }) => {
                        const queryParams = { ...params }
                        getBrandInfo({
                            page: {
                                pageNum: pageNum,
                                pageSize: pageSize
                            },
                            ...queryParams
                        })
                    }}
                    tableProps={{
                        rowKey: 'brandId',
                        bordered: true, scroll: { x: 'max-content' }, pagination: {
                            total: total
                        },
                        loading: tableLoading,
                    }}
                    buttonRender={<React.Fragment>
                        <Button type="primary" style={{ marginRight: 10 }} icon={<PlusOutlined />} onClick={addBrand}>新增品牌</Button>
                    </React.Fragment>}
                />
                <AddBrand ref={AddBrandRef} editAndAdd={editAndAdd}></AddBrand>
            </div>
        </ViewContainer>
    )
}

export default BrandManage;