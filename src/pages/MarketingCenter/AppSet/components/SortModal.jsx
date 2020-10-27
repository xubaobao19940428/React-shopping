import React, { useState, useEffect } from 'react'
import { Modal, Table, Select, Row, Col, InputNumber, Button, message } from 'antd'
import { getHomeSortItems, homeSort } from '@/services/marketing'
import { filterCountry } from '@/utils/filter'

const LIMIT_SORT_COMPONENT = ['INDEX_BANNER', 'INDEX_SERVER_CONTENT', 'INDEX_FUNCTION_LIST', 'INDEX_NEWER_SURPRISE_BUY_MODULE']
const SortModal = (props) => {
    const { showModal, countries, onCancel } = props
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState('MY') 
    const [personnelType, setPersonnelType] = useState(1)

    const columns = [{
        title: '适应国家',
        key: 'countryCode',
        render: (text, item) => (
            <span>{filterCountry(item.countryCode)}</span>
        )
    }, {
        title: '名称',
        key: 'name',
        render: (text, item) => (
            <span>{JSON.parse(item.name).cn}</span>
        )
    }, {
        title: '当前排序',
        key: 'sort',
        render: (text, item, index) => (
            <>
                {
                    LIMIT_SORT_COMPONENT.includes(item.groupCode) ? item.sort : <>
                        <InputNumber value={item.sort} min={5} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                        <Button onClick={() => handleSort(item)}>排序</Button>
                    </>
                }
            </>
        )
    }]

    useEffect(() => {
        getDataList({})
    }, [])

    function getDataList (data) {
        setLoading(true)
        let params = {
            countryCode,
            pageNum: 1,
            pageSize: 20,
            personnelType,
            pageId: 2
        }
        if (data) {
            params = Object.assign({}, params, data)
        }
        getHomeSortItems(params).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setDataList(res.data.list)
            }
        })
    }

    function handleSortChange (val, index) {
        let temp = [...dataList]
        let item = temp[index]
        item.sort = val
        
        setDataList(temp)
    }

    function handleSort (item) {
        homeSort({
            id: item.id,
            sort: item.sort,
            countryCode: item.countryCode,
            personnelType: item.personnelType
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('排序成功')
                getDataList({})
            }
        })
    }

    function handleCountryChange(val) {
        setCountryCode(val)
        getDataList({
            countryCode: val
        })
    }

    function handlePersonChange(val) {
        setPersonnelType(val)
        getDataList({
            personnelType: val
        })
    }
    return (
        <Modal 
            destroyOnClose
            title="首页排序"
            visible={showModal}
            maskClosable={false}
            onCancel={onCancel}
            footer={[
                <Button onClick={onCancel} key="sort-close">关闭</Button>
            ]}
        >
            <Row gutter={16}>
                <Col span={12}>
                    适用国家：<Select onChange={handleCountryChange} defaultValue="MY" style={{ width: '60%' }}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
                <Col span={12}>
                    人群：<Select onChange={handlePersonChange} defaultValue={1} style={{ width: '60%' }}>
                        <Select.Option value={1}>新用户</Select.Option>
                        <Select.Option value={2}>老用户</Select.Option>
                        <Select.Option value={0}>所有用户</Select.Option>
                    </Select>
                </Col>
            </Row>

            <Table
                bordered
                rowKey={record => record.id}
                columns={columns}
                loading={loading}
                dataSource={dataList}
                style={{ marginTop: 16 }}
                pagination={false}
            />
        </Modal>
    )
}

export default React.memo(SortModal)