import React, { useState, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/PriceTemplate.less'
import {Button, message, Table} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import { listPriceTemplate, changeEffectStatus, addPriceTemplate, updatePriceTemplate } from '@/services/product1'
import TemplateDialog from './components/TemplateDialog'
/**
 * 定价模版
 *
 */
const PriceTemplate = () => {
    const [tableData,setTableData] = useState([])
    const [total,setTotal] = useState(0)
    const [page, setPage] = useState({
        pageSize: 10,
        pageNum: 1
    })
    // 编辑弹窗
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalData, setModalData] = useState({})

    // 编辑
    const editTemplate = (row) => {
        setModalData(row)
        setShowModal(true)
    }

    // 复制
    const copyTemplate = (row) => {
        let data = JSON.parse(JSON.stringify(row))
        delete data.templateId
        setModalData(data)
        setShowModal(true)
    }

    // 新增
    const addTemplate = () => {
        setModalData({})
        setShowModal(true)
    }

    // 确认
    const onConfirm = (data) => {
        let fetchUrl = addPriceTemplate
        if (data.templateId) {
            fetchUrl = updatePriceTemplate
        }
        setLoading(true)
        fetchUrl(data).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setShowModal(false)
                message.success('成功')
                getTemplateInfo()
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    // 显示隐藏
    const isShowClick = (data) => {
        changeEffectStatus({
            templateId: data.templateId,
            effectStatus: data.status == 2 ? 1 : 2
        }).then(res=>{
            if (res.ret.errCode === 0) {
                getTemplateInfo()
            }
        })
    }


    // 分页信息改变
    const changeCurrentSize = (pageNum, pageSize) => {
        setPage({
            pageNum: pageNum,
            pageSize: pageSize
        })
        getTemplateInfo({pageSize: pageSize, pageNum: pageNum})
    }

    // 列表
    const getTemplateInfo = (params) => {
        let newParams = params ? params : page
        listPriceTemplate({
            page: newParams
        }).then(res => {
            if (res.ret.errCode === 0) {
                setTableData(res.data.dataList)
                setTotal(res.data.total)
            }
        })
    }

    useEffect(() => {
        getTemplateInfo()
    }, [])

    const columns = [
        {
            title: "模版ID",
            dataIndex: 'templateId',
            width: 150
        },
        {
            title: "模板名称",
            dataIndex: 'templateNameCn',
            width: 150
        },
        {
            title: "国家",
            dataIndex: "countryCode",
            width: 200,
            render:(item, row, index) => <>
                {
                    filterCountry(row.countryCode)
                }
            </>
        },
        {
            title: "适用类目",
            dataIndex: 'category',
            width: 200,
            render:(item, row, index) => <>
                {
                    row.categoryList.map((val,index)=>{
                        return <span key={index}>{val.name}，</span>
                    })
                }
            </>
        },
        {
            title: "原价毛利率",
            dataIndex: 'grossInterestRate',
            width: 200
        },
        {
            title: "VIP毛利率",
            dataIndex: 'activeGrossInterestRate',
            width: 200
        },
        {
            title: "更新人",
            dataIndex: 'operatorName',
            width: 200,
            hideInForm: true
        },
        {
            title: "更新时间",
            dataIndex: 'updateTime',
            width: 200,
            hideInForm: true,
            render:(item, row, index) => <>
                {
                    secondTimeFormat(row.updateTime)
                }
            </>
        },
        {
            title: "操作",
            dataIndex: 'options',
            hideInForm: true,
            fixed: 'right',
            width: 250,
            render: (item, row, index) => <div className={styles.btnBox}>
                <Button type="primary" size="middle" onClick={()=>editTemplate(row)}>编 辑</Button>
                <Button type="primary" size="middle" onClick={()=>copyTemplate(row)}>复 制</Button>
                <Button type="primary" size="middle" onClick={()=>isShowClick(row)}>{row.status===1?'隐 藏':'显 示'}</Button>
            </div>
        }
    ]
    return (
        <ViewContainer>
            <div className={styles.container}>
                <Button type="primary" icon={<PlusOutlined />} size="middle" className={styles.addBtn} onClick={()=>addTemplate()}>新增</Button>
                <Table
                    bordered
                    rowKey={record => record.templateId}
                    scroll={{ x: '100%' }}
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                        pageSize: page.pageSize,
                        pageNum: page.pageNum,
                        pageSizeOptions: [10, 20, 50, 100],
                        total: total,
                        showTotal: () => `共 ${total} 条`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onChange: changeCurrentSize
                    }}
                    style={{ marginTop: 16 }}
                ></Table>
            </div>
            <TemplateDialog
                showModal={showModal}
                loading={loading}
                modalData={modalData}
                onCancel={() => setShowModal(false)}
                onConfirm={onConfirm}
            ></TemplateDialog>
        </ViewContainer>
    )
}

export default PriceTemplate;

