import React, {useRef, useState} from 'react'
import { history } from 'umi';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import ProductManageModal from "./ProductManageModal";
import {dealShowFileSrc} from "@/utils/utils";
import {Button, Input, InputNumber, message, Modal, Select, Tag} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {
    getModuleProList,
    addModulePro,
    delBatchModulePro,
    sortModulePro
} from '@/services/marketing';
const { confirm } = Modal

const ModuleProductManage = (props) => {
    let query = history.location.query
    const [moduleId, setModuleId] = useState(query.moduleId)
    const [countryCode, setCountryCode] = useState(query.countryCode)
    const [tableData, setTableData] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [selectIds, setSelectIds] = useState([])
    const [total, setTotal] = useState(0);
    const TableRef = useRef();

    // 列表
    function getList () {
        TableRef.current && TableRef.current.refreshList()
    }

    // 排序
    function handleSortChange(val, index) {
        let data = JSON.parse(JSON.stringify(tableData))
        data[index].sort = val
        setTableData(data)
    }

    function handleSort(item) {
        sortModulePro({
            sort: item.sort,
            id: item.id
        }).then((res) => {
            if (res.ret.errCode === 0) {
                message.success('成功')
                getList()
            }
        })
    }
    // 删除
    function deletePro(id) {
        if (!id && !setSelectIds) {
            return message.warning('至少选择一件商品')
        }
        confirm({
            title: '提示',
            content: '此操作将永久删除该项, 是否继续?',
            onOk() {
                delBatchModulePro({
                    ids: id ? [id] : selectIds,
                    moduleId: moduleId
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getList()
                    }
                })
            },
            onCancel() {
                message.info('已取消删除')
            }
        })
    }
    // 新增弹窗
    function showAddProModal() {
        setShowModal(true)
    }

    function onClose() {
        setShowModal(false)
    }

    function onConfirm(data) {
        setModalLoading(true)
        for (let i = 0; i < data.length; i++) {
            data[i]['productName'] = data[i].title
            data[i]['productIcon'] = data[i].cover
        }
        addModulePro({
            productList: data,
            moduleId: moduleId
        }).then((res) => {
            setModalLoading(false)
            if (res.ret.errCode === 0) {
                message.success('成功')
                getList()
                onClose()
            }
        }).catch(() => {
            setModalLoading(false)
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectIds(selectedRowKeys)
        }
    };

    return (
        <ViewContainer>
            <QueryTable
                tableItemCenter
                advance={3}
                ref={TableRef}
                columns={[
                    {
                        title: "商品ID",
                        dataIndex: "productId",
                        width: 150,
                        hideInForm: false
                    },
                    {
                        title: "商品名称",
                        dataIndex: "productName",
                        width: 150,
                        hideInForm: false
                    },
                    {
                        title: "商品图片",
                        dataIndex: "productIcon",
                        width: 150,
                        hideInForm: true,
                        align: 'left',
                        render: (item, row) => <img src={dealShowFileSrc(row.productIcon)} style={{ width: 80 }}/>
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                        width: 200,
                        hideInForm: true,
                        render: (text, item, index) => (
                            <>
                                <InputNumber value={item.sort} min={0} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                                <Button onClick={() => handleSort(item)}>排序</Button>
                            </>
                        )
                    },
                    {
                        title: "操作",
                        dataIndex: 'options',
                        hideInForm: true,
                        fixed: 'right',
                        width: 150,
                        render: (text, item) => <React.Fragment>
                            <a onClick={() => deletePro(item.id)}>删除</a>
                        </React.Fragment>
                    }
                ]}
                onQuery={({ pageNum, pageSize, ...params }) => {
                    setTableLoading(true)
                    getModuleProList({
                        page: {
                            pageNum: pageNum,
                            pageSize: pageSize,
                            pagingSwitch: true
                        },
                        moduleId: moduleId,
                        ...params
                    }).then((res) => {
                        setTableLoading(false)
                        if (res.ret.errCode === 0) {
                            setTableData(res.data.list)
                            setTotal(res.data.total)
                        }
                    }).catch(() => {
                        setTableLoading(false)
                    })
                }}
                dataSource={tableData}
                tableProps={{
                    rowKey: "id",
                    bordered: true,
                    scroll: { x: 'max-content' },
                    loading: tableLoading,
                    rowSelection: {
                        type: 'checkbox',
                        preserveSelectedRowKeys: true,
                        ...rowSelection,
                    },
                    pagination: {
                        pageSizeOptions: [10, 20, 50, 100],
                        total: total,
                        showTotal: () => `共 ${total} 条`,
                        showQuickJumper: true,
                        showSizeChanger: true
                    }
                }}
                buttonRender={<React.Fragment>
                    <Button type="primary" onClick={showAddProModal} style={{ marginRight: 10 }} icon={<PlusOutlined />}>新增商品</Button>
                    <Button type="primary" danger onClick={() => deletePro()} style={{ marginRight: 10 }} icon={<DeleteOutlined />}>批量删除</Button>
                </React.Fragment>}
            />

            <ProductManageModal
                showModal={showModal}
                modalLoading={modalLoading}
                countryCode={countryCode}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </ViewContainer>
    )
}

export default ModuleProductManage
