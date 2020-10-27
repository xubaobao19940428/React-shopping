import React, { useState, useImperativeHandle,useEffect, useCallback,useRef } from 'react';
import { Modal, Button, Space, Table,message } from 'antd';
import { MinusCircleOutlined, PlusOutlined,ArrowUpOutlined,ArrowDownOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import {frontCategoryGroupAddOrUpdate,frontCategoryGroupListGet,frontCategoryGroupDelete,frontCategoryGroupSort} from '@/services/product1'
import { FormInstance } from 'antd/lib/form';
import GroupManage from './groupManage'
import styles from './addFirstCategory.less'

// 要使用React.forwardRef才能将ref属性暴露给父组件
const SecondCategroyDetail = React.forwardRef((props, ref) => {
    let data = [];
    const columnsDefault = [
        {
          title: '分组名称',
          dataIndex: 'name',
          key: 'name',
          width:'120px',
          align:'center',
          render: text => <span>{text}</span>,
        },
        {
          title: '关联二级类目',
          dataIndex: 'cateNames',
          align:'center',
          key: 'age',
        },
        {
          title: '操作',
          dataIndex: 'address',
          align:'center',
          width:'200px',
          key: 'address',
          render:(current, row, index)=><div><ArrowUpOutlined  className={styles['icon-name']} onClick={()=>move(current, row, index,1, tableData)}/><ArrowDownOutlined className={styles['icon-name']} onClick={()=>move(current, row, index,2, tableData)}/><EditOutlined className={styles['icon-name']} onClick={()=>edit(row)}/><DeleteOutlined onClick={()=>deleteGroup(row)}/></div>
        }
    ]

    const [tableData,setTableData] = useState(data)
    const [visible, setVisible] = useState(false);
    const [id,setId] = useState('')
    const GroupManageRef = useRef()
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            SetGroupList:(pid)=>{
                getGroupList(pid)
            }
        }

    });
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const handleOk = e => {

    };

    const handleCancel = e => {
        setVisible(false)
    };
    const move=
        (current, row, index, type, newData)=>{
            const data1 = [...newData];
            let obj={}
            let params={}
            if(type==1){
                if(index==0){
                    message.warning('已经是第一条了')
                    return
                }else{
                    obj = data1[index - 1];
                    data1[index - 1] = row;
                    data1[index] = obj;
                    let arr = []
                    data1.map(item=>{
                        arr.push(item.id)
                    })
                     params={
                        idList:arr,
                        pid:props.pid
                    }
                    
                }
            }else{
                if(index==tableData.length-1){
                    message.warning('已经是最后一条了')
                    return 
                }else{
                    obj = data1[index + 1];
                    data1[index + 1] = row;
                    data1[index] = obj;
                    let arr = []
                    data1.map(item=>{
                        arr.push(item.id)
                    })
                     params={
                        idList:arr,
                        pid:props.pid
                    }
                }
            }
            frontCategoryGroupSort(params).then(resultes=>{
                if(resultes.ret.errCode==0){
                    setTableData(data1)
                }
            })
        }
    const edit=(row)=>{
        setId(row.id)
        GroupManageRef.current.getDetail(row.id)
    }
    const deleteGroup=(row)=>{
        console.log(row)
       let params={
           id:row.id
       }
        frontCategoryGroupDelete(params).then(resultes=>{
            if(resultes.ret.errCode==0){
                message.success('删除成功')
                getGroupList(props.pid)
            }
        })
    }
   const addGroupManage=()=>{
       GroupManageRef.current.secondCategory()
       GroupManageRef.current.changeVal(true)
   }
   const getGroupList = (pid)=>{
    let params = {
        pid:pid
      }
    frontCategoryGroupListGet(params).then(resultes=>{
        if(resultes.ret.errCode==0){
            console.log(resultes)
            setTableData(resultes.data.categoryGroupList)
        }
    })
   }
   const addOrUpdateGroup = (data)=>{
       console.log(data)
       frontCategoryGroupAddOrUpdate(data).then(resultes=>{
           if(resultes.ret.errCode==0){
            getGroupList(props.pid)
            GroupManageRef.current.changeVal(false)
            GroupManageRef.current.resetDefault()
            setId('')
           }
       })
   }
   const childHandleCancel=()=>{
    GroupManageRef.current.changeVal(false)
    GroupManageRef.current.resetDefault()
    setId('')
   }
    return (
        <div>
            <React.Fragment>
                <Modal
                    title='分组管理'
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
                    <div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={addGroupManage}>新增分组</Button>
                    </div>
                    <Table columns={columnsDefault} dataSource={tableData} pagination={false} rowKey="id"/>
                </Modal>
            </React.Fragment>
            <GroupManage ref={GroupManageRef} pName={props.pName} countryCode={props.countryCode} pid={props.pid} id={id} addOrUpdateGroup={addOrUpdateGroup} handleCancel={childHandleCancel}></GroupManage>
        </div>
    );
})
export default SecondCategroyDetail