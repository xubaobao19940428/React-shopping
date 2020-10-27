import React, { useState, useImperativeHandle, useCallback, useEffect } from 'react';
import { Modal, Button, Form, Space, Radio, DatePicker,Pagination,Image } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import {getChilindoImages} from '@/services/product'
import styles from './styles/ImgSearch.less'
import MyIcon from '@/components/IconFont/IconFont'
// 要使用React.forwardRef才能将ref属性暴露给父组件
const { RangePicker } = DatePicker;
const ImgSearch = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const [pageNum, setPageNum] = useState(1) 
    const formRef = React.createRef(FormInstance)
    const [imgData,setImgData] = useState([])
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            }
        }
    });
    const onFinish = values => {
        console.log('Received values of form:', values);
    }

    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                console.log(currentValue)
            } else {
                console.log('error,submit')
            }
        })
    };
    const getProductImg = useCallback(()=>{
        
        var params={
            page:{
                pageNum:pageNum,
                pageSize:pageSize
            },
            filter:0
        }
        if(formRef.current){
            var dataSource = formRef.current.getFieldsValue()
            params.filter = dataSource.filter
            if(dataSource.createTime&&dataSource.createTime.length!=0){
                params.startTime = String(dataSource.createTime[0].valueOf())
                params.endTime = String(dataSource.createTime[1].valueOf())
            }
        }
        
        getChilindoImages(params).then(resultes=>{
            if(resultes.ret.errcode==1){
             setTotal(resultes.total)
             setImgData(resultes.image)
        }
        }).catch(error=>{
            console.log(params)
        })
    })
    const changeCurrentSize = useCallback((page,pagesize) => {
        setPageNum(page)
        setPageSize(pagesize)
        
      })
    const changeStatus=useCallback((index,oldData)=>{
        console.log(index)
        var newData = [...oldData]
        newData[index].checked = true
        setImgData(newData)
    })
    const handleCancel = e => {
        setVisible(false)
    };
    useEffect(()=>{
        getProductImg()
    },[pageNum,pageSize])
    //切换模式
    return (
        <div>
            <React.Fragment>
                <Modal
                    title='以图找货'
                    visible={visible}
                    width={1000}
                    destroyOnClose
                    onCancel={handleCancel}
                >
                    <Form
                        initialValues={{
                            createTime:[],
                            filter:0
                        }}
                        layout="inline"
                        style={{marginBottom:20}}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}>
                        <Form.Item
                            label="创建时间："
                            name="createTime"
                        >
                            <RangePicker showTime style={{ width: 300 }}  />
                        </Form.Item>
                        <Form.Item name="filter">
                            <Radio.Group>
                                <Radio value={1}>只看录用</Radio>
                                <Radio value={2}>只看未录用</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button key="back" type="primary" style={{ marginRight: 10 }} onClick={getProductImg}>
                                搜索
                      </Button>
                            <Button key="submit">
                            重置
                      </Button>
                      
                        </Form.Item>
                    </Form>
                    <div style={{textAlign:'right'}}>
                        <Button key="back" type="primary" style={{ marginRight: 10 }}>
                        <MyIcon type="icon-qizi" />标记为已录用
                      </Button>
                        <Button key="submit">
                        <MyIcon type="icon-qizi" style={{color:'#1890ff'}}/>取消录用标记
                      </Button>
                    </div>
                    <div className={styles['img-div']}>
                        {
                            imgData.map((item,index)=>{
                                 
                                return <div className={styles['img-boder']} key={index} onClick={()=>changeStatus(index,imgData)}>
                                    {
                                        item.status==1?<span className={styles['tag-icon']}><MyIcon type="icon-qizi" style={{color:'#1890ff'}}/></span>:''
                                    }
                                      <Image src={item.imageUrl} key={item.imageUrl} width={140} height={140} preview={false}></Image>
                                      <div className={ item.checked ? styles['active']:''}>
                                            <div>
                                              <MyIcon type="icon-duihao" />
                                            </div>
                                        </div>
                                    </div>
                                
                            })
                        }
                    </div>
                    <Pagination
                    defaultPageSize={15}
                    defaultCurrent={1}
                    pageSize={pageSize}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[15, 25, 35, 45]}
                    showQuickJumper
                    showSizeChanger
                    style={{ marginTop: 20 }}
                />
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default ImgSearch