import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input,Pagination } from 'antd';
import styles from './styles/SameProduct.less'
import { createSameKindTask, sameKindResult } from '@/services/product'
import { timestampToTime } from '@/utils/index'
import SearchProduct from './components/SearchSame'
import { filterData } from '@/utils/filter';

/**
 * 1688同款商品管理
 * 
 */
const SameProduct = () => {
    const columns1 = [
        {
            title: '任务ID',
            dataIndex: 'taskId',
            key: 'taskId',
        },
        {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            render: progress => {
                return <span>{progress + '%'}</span>
            }
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: status => {
                if (status == 0) {
                    return <span>排队中</span>
                } else if (status == 1) {
                    return <span>进行中</span>
                } else if (status == 2) {
                    return <span>已完成</span>
                } else if (status == 3) {
                    return <span>错误</span>
                }
            }
        },

        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            render: createTime => {
                return <span>{timestampToTime(Number(createTime))}</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text, row, index) => {
                return <Space size="middle" key={text}>
                    <a onClick={() => productDetail(row)} >查看结果</a>
                </Space>
            }
        },
    ];
    const { TextArea } = Input;
    const data = [
        {
            createTime: "1599201486000",
            progress: 0,
            status: 2,
            taskId: "1305200280567690",
            action: '111'
        },
        {
            createTime: "1599201486000",
            progress: 0,
            status: 2,
            taskId: "1305200280567692",
            action: '111'
        },
    ]
    const [tableData, setTableData] = useState(data)
    const [defaultVal, setDefault] = useState({wordStr: ''})
    const searchForm = useRef()
    const searchProductRef = useRef()
    const getCreateSameKindTask = useCallback(() => {
        let params = {
            
        }
        if (searchForm.current) {
            if(searchForm.current.getFieldsValue().wordStr!=''){
                 params.productId = searchForm.current.getFieldsValue().wordStr.split(',')
            }
        }
        createSameKindTask(filterData(params)).then(resultes => {
            if (resultes.ret.errcode == 1) {

            }
        }).catch(error => {
            console.log(error)
        })
    });
    const productDetail = useCallback((row) => {
        let params = {
            taskId: row.taskId
        }
        sameKindResult(params).then(resultes => {
            if (resultes.ret.errcode == 1) {
                searchProductRef.current.changeVal(true)
                searchProductRef.current.changeTableData([
                    {
                        orgLink: '111111',
                        targetLink: '22222'
                    }
                ])
            }
        }).catch(error => {
            console.log(error)
        })
    })
    //得到语种
    useEffect(() => {
        getCreateSameKindTask()
    }, [])

    return (
        <ViewContainer>
            <div className={styles['container']}>
                <Form
                    initialValues={
                        defaultVal
                    }
                    name="complex-form"
                    layout="inline"
                    className={styles['contain-form']} ref={searchForm}>
                    <Form.Item label="目标商品：" name="wordStr">
                        <TextArea
                            placeholder="请输入内容"
                            autoSize={{ minRows: 5 }}
                            style={{ width: 400 }}
                        />
                    </Form.Item>
                    <Form.Item label="" colon={false} style={{ lineHeight: '100px' }}>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={getCreateSameKindTask}>确定</Button>
                    </Form.Item>
                </Form>
                <Table columns={columns1} dataSource={tableData} pagination={false} className={styles['contain-table']} rowKey="taskId"/>
                <Pagination defaultCurrent={1} total={50} />
            </div>
            <SearchProduct ref={searchProductRef}></SearchProduct>
        </ViewContainer>
    )
}

export default SameProduct;