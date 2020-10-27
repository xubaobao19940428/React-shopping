import React, { useState, useCallback, forwardRef, useEffect,useImperativeHandle } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input,Pagination} from 'antd';
import {history} from 'umi'
import {listUserProductCollect} from '@/services/user' 
import {useModel} from 'umi'
import styles from './styles/BaseInfo.less'
import { timestampToTime } from '@/utils/index'
import { dealShowFileSrc } from '@/utils/utils'

/**
/*  
/*银行卡信息
/*
*/
const  FavoriteList = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            getFavoriteList: () => {
                getReceiveList(1,20)
            }
        }
      })
    const favoriteColums=[
         {
            title: '商品Id',
            dataIndex: 'productId',
            align: 'center',
            width:100
            
        },
        {
            title: '商品名称',
            dataIndex: 'title',
            align: 'center',
            render:(text,row,index)=>{
                return <div className={styles.productInfo} >
                <div className={styles.imgBox}>
                    <Popover content={<img src={dealShowFileSrc(row.cover)} alt="" style={{ width: '120px', height: '120px' }} />} trigger="hover">
                        <img src={dealShowFileSrc(row.cover)} style={{ width: '100px', height: '100px' }} />
                    </Popover>
                </div>
                <div>
                    <div>{row.title}</div>
                </div>
            </div>
         },
        },
        {
            title: '收藏时间',
            dataIndex: 'createTime',
            align: 'center',
            render:(text,row,index)=>{
            return <div>{timestampToTime(Number(row.createTime))}</div>
            }
        },
    ]
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [favoriteLists,setReceive] = useState([])
    const { countries, languages } = useModel('dictionary');
    const changeCurrentSize = (page, pageSize) => {
        setPageNum(page)
        setPageSize(pageSize)
        getReceiveList(page,pageSize)
    }
    const getReceiveList = (pageNum,pageSize)=>{
        let params = {
            page: {
                pageSize: pageSize,
                pageNum: pageNum,
            },
            userId:history.location.query.userId
        }
        listUserProductCollect(params).then(resultes=>{
            if(resultes.ret.errcode==1){
                setReceive(resultes.data)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    // useEffect(()=>{
    //     getReceiveList(pageNum,pageSize)
    // },[pageNum,pageSize])
  return (
  <ViewContainer>
      <div>
         <Table columns={favoriteColums} dataSource={favoriteLists} pagination={false} bordered rowKey="productId"/>
         <Pagination
                    defaultPageSize={10}
                    defaultCurrent={1}
                    current={pageNum}
                    pageSize={pageSize}
                    total={total}
                    showTotal={total => `共 ${total} 数据`}
                    onChange={changeCurrentSize}
                    pageSizeOptions={[10, 20, 50, 100]}
                    showQuickJumper
                    showSizeChanger
                   style={{marginTop:20}}
                />
      </div>
   </ViewContainer>
    )
  })
  export default FavoriteList;