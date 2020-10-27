import React, { useState, useCallback, forwardRef, useEffect,useImperativeHandle } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input } from 'antd';
import {history} from 'umi'
import {listAddress} from '@/services/user' 
import {useModel} from 'umi'

/**
/*  
/*收获地址
/*
*/
const  ReceivingAddressList = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            receiveList: () => {
                getReceiveList()
            }
        }
      })
    const receiveColumns=[
         {
            title: '收获地址ID',
            dataIndex: 'addressId',
            align: 'center',
            width:150
            
        },
        {
            title: '国家',
            dataIndex: 'countryCode',
            align: 'center',
            width:150,
            render:(text,row,index)=>{
                return <div>
                    {
                    countries.map(item=>{
                        if(item.shortCode==row.countryCode){
                            return countries[item.shortCode]
                        }
                    })}
                </div> 
         },
        },
        {
            title: '地址详情',
            dataIndex: 'stateName',
            align: 'center',
        },
        {
            title: '收货人',
            dataIndex: 'detailAddress',
            align: 'center',
        },
        {
            title: '收获手机号',
            dataIndex: 'mobile',
            align: 'center',
        },
        {
            title: '邮编',
            dataIndex: 'postcode',
            align: 'center',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            align: 'center',
        },
    ]
    const [receiveLists,setReceive] = useState([])
    const { countries, languages } = useModel('dictionary');
    const getReceiveList = ()=>{
        let params={
            userId:history.location.query.userId
        }
        listAddress(params).then(resultes=>{
            if(resultes.ret.errcode==1){
                setReceive(resultes.addressDo)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    
  return (
  <ViewContainer>
      <div>
         <Table columns={receiveColumns} dataSource={receiveLists} pagination={false} bordered rowKey="afterId"/>
      </div>
   </ViewContainer>
    )
  })
  export default ReceivingAddressList;