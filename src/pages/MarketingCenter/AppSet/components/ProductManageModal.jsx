import react, {useState, useEffect, useRef} from 'react'
import {Modal, Form, Input, Radio, Select, Button, DatePicker, Table, message, Pagination} from 'antd'
import { dealShowFileSrc, filterData, splitData } from '@/utils/utils'
import {SearchOutlined} from "@ant-design/icons";
import { filterCurrencyUnit } from '@/utils/filter'
import { getProductSpu } from '@/services/product'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 26,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
}
const ProductManageModal = (props) => {
    const { showModal, modalLoading, countryCode, onClose, onConfirm, showVipPrice, okText } = props
    const [ dataList, setDataList ] = useState([])
    const [ total, setTotal ] = useState(0)
    const [ loading, setLoading ] = useState(false)
    const [ proList, setProList ] = useState([])
    const [ param, setParam ] = useState({
        page: {
            pageSize: 10,
            pageNum: 1,
            pagingSwitch: true
        },
        countryCode: countryCode,
        productId: [],
        titleKey: ''
    })

    // 搜索
    function onFinish (data) {
        let productId = splitData(data.productId)
        console.log(productId)
        let newParam = { ...param }
        newParam.productId = productId
        newParam.titleKey = data.productName
        newParam.page.pageNum = 1
        newParam.page.pageSize = 10
        setParam(newParam)
        getDataList(newParam)
    }
    // 分页
    function pageChange(pageNum, pageSize) {
        let newParam = { ...param }
        newParam.page.pageNum = pageNum
        newParam.page.pageSize = pageSize
        setParam(newParam)
        getDataList({
            page: newParam.page
        })
    }

    function getDataList(newParam) {
        let data = { ...param }
        if (newParam) {
            Object.assign(data, newParam)
        }
        setLoading(true)
        console.log(data)
        // TODO pb接口改成json
        getProductSpu(filterData(data)).then((res) => {
            setLoading(false)
            if (res.ret.errcode === 1) {
                setDataList(res.spu)
                setTotal(res.total)
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    // 确定
    function handleConfirm() {
        if (proList.length <= 0) {
            return message.warning('请至少选择一件商品~')
        }
        onConfirm(proList)
    }
    // 取消
    function handleCancel () {
        onClose()
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setProList(selectedRows)
        }
    };
    return (
        <div>
            <Modal
                destroyOnClose
                width={800}
                title="添加商品"
                visible={showModal}
                onCancel={handleCancel}
                onOk={handleConfirm}
                maskClosable={false}
                confirmLoading={modalLoading}
                okText={okText || '确定' }
            >
                <Form id="ProManageModelForm" onFinish={onFinish} {...formItemLayout}>
                    <Form.Item name="productId" label="商品ids">
                        <Input placeholder="请输入ID用,号隔开"/>
                    </Form.Item>
                    <Form.Item name="productName" label="商品名称">
                        <Input placeholder="请输入商品名称"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            <SearchOutlined />搜索
                        </Button>
                    </Form.Item>
                </Form>
                <Table
                    bordered
                    rowKey={record => record.productId}
                    scroll={{ x: '100%', y: 440 }}
                    loading={loading}
                    pagination={{
                        pageSize: param.page.pageSize,
                        current: param.page.pageNum,
                        pageSizeOptions: [10, 20, 50, 100],
                        total: total,
                        showTotal: () => `共 ${total} 条`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onChange: pageChange
                    }}
                    rowSelection={{
                        type: 'checkbox',
                        preserveSelectedRowKeys: true,
                        ...rowSelection,
                    }}
                    columns={[
                        {
                            title: "商品ID",
                            dataIndex: "productId",
                            width: 200
                        },
                        {
                            title: "商品名称",
                            dataIndex: "title",
                            ellipsis: true,
                        },
                        {
                            title: "商品图片",
                            dataIndex: "cover",
                            align: 'left',
                            render: (item, row) => <img src={dealShowFileSrc(row.cover)} style={{ width: 80 }}/>
                        },
                        {
                            title: `VIP价(${filterCurrencyUnit(countryCode)})`,
                            dataIndex: 'priceVip',
                            align: 'center',
                            className: !showVipPrice && 'hidden'
                        }
                    ]}
                    dataSource={dataList}
                    style={{ marginTop: 16 }}
                ></Table>
            </Modal>
        </div>
    )
}

export default React.memo(ProductManageModal)
