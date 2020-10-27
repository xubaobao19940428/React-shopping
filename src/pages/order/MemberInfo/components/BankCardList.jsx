import React, { useState, useCallback, forwardRef, useEffect,useImperativeHandle } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input } from 'antd';
import {history} from 'umi'
import {getUserBankList} from '@/services/user' 
import {useModel} from 'umi'

/**
/*  
/*银行卡信息
/*
*/
const  BankCardList = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            getBankList: () => {
                getReceiveList(1,20)
            }
        }
      })
    const bandColums=[
         {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
            width:100
            
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
            title: '银行名称',
            dataIndex: 'bankName',
            align: 'center',
        },
        {
            title: '银行账户名',
            dataIndex: 'accountName',
            align: 'center',
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNo',
            align: 'center',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            align: 'center',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align: 'center',
        },
    ]
    const [bankLists,setReceive] = useState([])
    const { countries, languages } = useModel('dictionary');
    const getReceiveList = ()=>{
        let params={
            userId:history.location.query.userId
        }
        getUserBankList(params).then(resultes=>{
            if(resultes.ret.errcode==1){
                setReceive(resultes.data)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    
  return (
  <ViewContainer>
      <div>
         <Table columns={bandColums} dataSource={bankLists} pagination={false} bordered rowKey="mobile"/>
      </div>
   </ViewContainer>
    )
  })
  export default BankCardList;