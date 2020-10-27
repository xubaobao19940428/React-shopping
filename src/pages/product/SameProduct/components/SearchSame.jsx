import React, { useState, useImperativeHandle,} from 'react';
import { Modal, Space, Table,Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

// 要使用React.forwardRef才能将ref属性暴露给父组件
const SearchProduct = React.forwardRef((props, ref) => {
    let data = [];
    const columnsDefault = [
        {
          title: '原1688链接',
          dataIndex: 'orgLink',
          key: 'orgLink',
          align:'center',
          render: text => <a>{text}</a>,
        },
        {
          title: '同款1688链接',
          dataIndex: 'targetLink',
          align:'center',
          key: 'targetLink',
          render:targetlink=>{
              if(targetlink=='未找到满足条件的同款低价商品'){
                  return <span>未找到满足条件的同款低价商品</span>
              }else{
              return <a>{targetlink}</a>
              }
          }
        },
    ]
    const [tableData,setTableData] = useState(data)
    const [visible, setVisible] = useState(false);
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changeTableData:(newVal)=>{
                setTableData(newVal)
            }
        }

    });
    
    const handleOk = e => {

    };
    const handleCancel = e => {
        setVisible(false)
    };
    
    return (
        <div>
            <React.Fragment>
                <Modal
                    title='任务详情'
                    visible={visible}
                    style={{ width: '900px', fontSize: '20px' }}
                    width="900px"
                    destroyOnClose
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <Table columns={columnsDefault} dataSource={tableData} pagination={false} rowKey="orgLink"/>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default SearchProduct