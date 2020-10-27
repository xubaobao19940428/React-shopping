import React, { useState, useCallback, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Button, Space, Form, Table, Input, Modal } from 'antd';
import _ from 'lodash'
/**
/*  
/* 商品
/*
*/
const { Column } = Table
const ShelveUp = React.forwardRef((props, ref) => {
    const [tableData, setTableData] = useState([])
    const [type,setType] = useState('up')
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeTableData: (newTableData) => {
                setTableData(newTableData)
            },
            changeType:(newType)=>{
                setType(newType)
            }
        }
    })
    const handleCancel = () => {
        props.upCancel()
    }
    const handleOk = () => {
        let productList = []
        _.forEach(tableData, item => {
            if ((item.offReason === 0 || item.offReason === 1 || item.offReason === 4 || item.offReason === 7) && item.ret.errcode != 4354) {
                productList.push(item.productId)
            }
        })
        if (productList.length === 0) {
            message.warning('无可直接上架商品！')
            return
        }

        props.upConfirm({productList:productList,type:type})
    }
    return (
        <div>
            <Modal
                title="上 传"
                visible={props.upUisible}
                style={{ width: 900 }}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Table dataSource={tableData} pagination={false} rowKey="productId">
                    <Column title="商品ID" dataIndex="productId" render={(text, row, index) => {
                        return <div style={{ "color": "#02A7F0" }}>{text}</div>
                    }}>

                    </Column>
                    <Column title="提醒" render={(text, row, index) => {
                        if (row.ret.errcode === 4353) {
                            return <div><p>该商品最近一次因【{row.reason}】被下架，你确认要重新上架吗？</p></div>
                        } else if (row.ret.errcode === 4354) {
                            return <div style={{ 'color': 'red' }}>{row.reason}</div>
                        } else {
                            return <div>{row.reason}</div>
                        }
                    }}>

                    </Column>
                    <Column title="操作" render={(text, row, index) => {
                        if (row.offReason === 2 || row.offReason === 3 || row.offReason === 5 || row.offReason === 6) {
                            return <Button type="primary" size="small">仍要上架</Button>
                        }
                    }}>
                    </Column>
                </Table>
            </Modal>
        </div>
    )
})
export default ShelveUp;