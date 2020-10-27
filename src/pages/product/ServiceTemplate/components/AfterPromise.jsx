import React, { useState, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Table, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { filterCountry, secondTimeFormat } from '@/utils/filter'
import styles from './styles/AfterPromise.less'
import AfterPromiseEdit from './AfterPromiseEdit'
import {getMultiLangShowInfo, filterData} from "@/utils/utils";
import {ListArrival, AddArrival, EditArrival, StartArrival, StopArrival} from "@/services/serviceTemplate";

const showType = {
    1: '只外显于商品详情页',
    2: '全部外显',
    3: '不外显'
}
const AfterPromise = () => {
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState({
        pageSize: 10,
        pageNum: 1
    })
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalData, setModalData] = useState({})

    // 列表
    const getTemplateInfo = (params) => {
        let newParams = params ? params : page
        newParams['type'] = 1
        ListArrival(newParams).then(res => {
            if (res.ret.errCode === 0) {
                setTableData(res.data.arrivalPledgeList)
                setTotal(res.data.total)
            }
        })
    }

    // 新增
    const addArrival = () => {
        setModalData({
            countryCode: 'MY',
            payment: 1,
            showType: 1,
            status: 1,
            arrivalDistributionList: [{
                areaCodeList: ['MY'],
                timeLimitMax: '',
                timeLimitMin: ''
            }]
        })
        setShowModal(true)
    }
    // 编辑
    const ediArrival = (data) => {
        console.log(data)
        setModalData(data)
        setShowModal(true)
    }
    // 确定
    const onConfirm = (data) => {
        let fetchUrl = AddArrival
        if (data.arrivalId) {
            fetchUrl = EditArrival
        }
        setLoading(true)
        fetchUrl(filterData(data)).then((res) => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                message.success('成功~')
                setShowModal(false)
                getTemplateInfo()
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    // 状态更改
    const updateStatus = (item) => {
        if (item.status === 2) {
            StartArrival({arrivalId: item.arrivalId}).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('启用成功！')
                    getTemplateInfo()
                }
            })
        }else {
            StopArrival({arrivalId: item.arrivalId}).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('停用成功！')
                    getTemplateInfo()
                }
            })
        }
    }
    // 分页信息改变
    const changeCurrentSize = (pageNum, pageSize) => {
        setPage({
            pageNum: pageNum,
            pageSize: pageSize
        })
        getTemplateInfo({pageSize: pageSize, pageNum: pageNum})
    }

    useEffect(() => {
        getTemplateInfo()
    }, [])

    return (
        <ViewContainer>
            <Button type="primary" icon={<PlusOutlined/>} onClick={addArrival} style={{ marginRight: 8 }}>新增</Button>
            <Table
                bordered
                rowKey={record => record.arrivalId}
                scroll={{ x: '100%' }}
                columns={[
                    {
                        title: "模版ID",
                        dataIndex: 'arrivalId',
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
                        title: "标签",
                        dataIndex: 'label',
                        width: 200,
                        render:(item, row, index) => <>
                            {
                                getMultiLangShowInfo(row.labelList)
                            }
                        </>
                    },
                    {
                        title: "文案",
                        dataIndex: 'document',
                        width: 150,
                        render:(item, row, index) => <>
                            {
                                getMultiLangShowInfo(row.documentList)
                            }
                        </>
                    },
                    {
                        title: "外显方式",
                        dataIndex: 'showType',
                        width: 200,
                        render:(item, row, index) => <>
                            {
                                showType[row.showType]
                            }
                        </>
                    },
                    {
                        title: "更新人",
                        dataIndex: 'operatorName',
                        width: 200
                    },
                    {
                        title: "更新时间",
                        dataIndex: 'updateTime',
                        width: 200,
                        render:(item, row, index) => <>
                            {
                                secondTimeFormat(row.updateTime)
                            }
                        </>
                    },
                    {
                        title: "操作",
                        dataIndex: 'options',
                        fixed: 'right',
                        width: 150,
                        render: (item, row, index) => <div className={styles.btnBox}>
                            <Button type="primary" size="small" onClick={() => ediArrival(row)}>编 辑</Button>
                            <Button type="primary" size="small" onClick={() => updateStatus(row)}>{ row.status == 2 ? '启 用' : '停 用' }</Button>
                        </div>
                    }
                ]}
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
            <AfterPromiseEdit
                showModal={showModal}
                loading={loading}
                modalData={modalData}
                onCancel={() => setShowModal(false)}
                onConfirm={onConfirm}
            ></AfterPromiseEdit>
        </ViewContainer>
    )
}
export default AfterPromise
