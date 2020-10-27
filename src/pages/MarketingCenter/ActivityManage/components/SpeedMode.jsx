import React,{ useState } from 'react'
import { Row, Col, Card, Pagination } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
const { Meta } = Card

const SpeedMode = (props) => {
    const { dataList, onEdit, onDel, onSelected, NO_DEL_SUBJECT_NAME, total, getData } = props
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 20,
        pagingSwitch: true
    })

    function handleSelected (item) {
        onSelected(item || {})
    }

    function handleEdit (e, item) {
        e.stopPropagation()
        onEdit(item)
    }

    function handleDel (e, {subjectId}) {
        e.stopPropagation()
        onDel(subjectId)
    }

    function changePage (current, pageSize) {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getData(temp)
    }

    return (
        <div style={{ padding: 16, background: '#dedede', minHeight: 500 }} className="speed-mode-wrapper">
            <div className="template-box">
                {
                    dataList.map(item => (
                        NO_DEL_SUBJECT_NAME.includes(item.name) ? (
                            <Card 
                                hoverable
                                className="template-item"
                                key={item.subjectId}
                                onClick={() => handleSelected(item)}
                                bodyStyle={{ textAlign: 'center' }}
                                cover={<img src="https://file.fingo.shop/fingo/webassets/goods.png"/>}
                            >  
                                <Meta title={item.name}/>
                            </Card>
                        ) : (
                            <Card 
                                hoverable
                                className="template-item"
                                key={item.subjectId}
                                onClick={() => handleSelected(item)}
                                bodyStyle={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                actions={[
                                    <EditOutlined key="edit" onClick={(e) => handleEdit(e, item)}/>,
                                    <DeleteOutlined key="del" onClick={(e) => handleDel(e, item)}/>
                                ]}
                            >  
                                <Meta title={item.name}/>
                            </Card>
                        )
                    ))
                }
            </div>

            <Pagination
                style={{ textAlign: 'right' }}
                showSizeChanger={true}
                showQuickJumper={false}
                showTotal={() => `共${total}条`}
                pageSizeOptions={[20, 30, 50, 100]}
                current={page.pageNum}
                pageSize={page.pageSize}
                total={total}
                onChange={changePage}
            />
        </div>
    )
}

export default SpeedMode