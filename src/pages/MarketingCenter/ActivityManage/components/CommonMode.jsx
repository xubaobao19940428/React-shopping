import React,{ useState, useEffect } from 'react'
import { Table, Form, Button, Input, Select } from 'antd'
import { history } from 'umi'
import { secondTimeFormat } from '@/utils/filter'

const CommonMode = (props) => {
    const { dataList, ACTIVITY_STATUS_OBJ, getData, total, subjectName } = props
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10,
        pagingSwitch: true
    })

    const columns = [{
        title: '活动名称',
        key: 'name',
        width: 160,
        dataIndex: 'name',
        align: 'center',
        fixed: 'left'
    }, {
        title: '活动ID',
        key: 'activityId',
        width: 160,
        dataIndex: 'activityId',
        align: 'center',
        fixed: 'left'
    }, {
        title: '开始时间',
        key: 'startTime',
        align: 'center',
        width: 200,
        render: (text, item) => (
            secondTimeFormat(item.startTime)
        )
    }, {
        title: '结束时间',
        key: 'endTime',
        align: 'center',
        width: 200,
        render: (text, item) => (
            secondTimeFormat(item.endTime)
        )
    }, {
        title: '活动模板',
        key: 'activityTemplateName',
        align: 'center',
        width: 120,
        dataIndex: 'activityTemplateName'
    }, {
        title: '活动专题',
        key: 'subjectName',
        align: 'center',
        width: 140,
        dataIndex: 'subjectName'
    }, {
        title: '更新人',
        align: 'center',
        width: 140,
        render: (text, item) => (
            `${item.operatorName}(${item.operatorId})`
        )
    }, {
        title: '操作',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (text, item) => (
            <Button type="link" onClick={() => handleDetail(item)}>详情</Button>
        )
    }]

    function handleDetail (item) {
        history.push({
            pathname: 'activityDetail',
            query: {
                activityId: item.activityId
            }
        })
    }

    function handleSearch (values) {
        setPage({
            pageNum: 1,
            pageSize: 10
        })
        getData(values)
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getData(temp)
    }

    return (
        <div>
            <Form layout="inline" onFinish={handleSearch} initialValues={{
                subjectName
            }}>
                <Form.Item label="活动状态" name="activityStatus">
                    <Select style={{ width: 240 }} allowClear>
                        {
                            Object.keys(ACTIVITY_STATUS_OBJ).map(key => (
                            <Select.Option key={key} value={key}>{ACTIVITY_STATUS_OBJ[key]}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="活动名称" name="activityName">
                    <Input/>
                </Form.Item>
                <Form.Item label="专题名称" name="subjectName">
                    <Input/>
                </Form.Item>
                <Form.Item label="活动ID" name="activityId">
                    <Input/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>

            <Table
                rowKey={record => record.activityId}
                scroll={{ x: '100%' }}
                columns={columns} 
                dataSource={dataList} 
                style={{ marginTop: 16 }}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: () => `共${total}条`,
                    pageSize: page.pageSize,
                    pageSizeOptions: [10, 20, 50, 100],
                    current: page.pageNum,
                    total: total,
                    onChange: changePage
                }}
            />
        </div>
    )
}

export default CommonMode