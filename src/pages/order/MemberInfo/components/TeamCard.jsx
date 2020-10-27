import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Card } from 'antd';
import './styles/BaseInfo.less'
import { dealShowFileSrc } from '@/utils/utils'
/**
/*  
/*上级链路
/*
*/
const  TeamCard = (props) => {
    
  return (
        <div>
            {
                props.cardLists.map((item,index)=>{
                    return  <Card className="team-item-card" key={index}>
                             <div className="user-avatar-box">
                            <img src={dealShowFileSrc(item.headImg)}/>
                            {/* <img v-else src="../../../assets/img/user-header.png"> */}
                        </div>
                          <p>{item.nickName}</p>
                        <button className="member-level">{item.memberLevel}</button>
                    </Card>
                })
            }
           
        </div>
    )
  }
  export default TeamCard;