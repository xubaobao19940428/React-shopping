import React, { useState, useCallback, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Select, Input, Button,Card,Row,Col,Table} from 'antd';
import {MenuUnfoldOutlined} from '@ant-design/icons'
import { dealShowFileSrc } from '@/utils/utils'
import { timestampToTime } from '@/utils'
import './styles/BaseInfo.less'
import TeamCard from './TeamCard'
const BaseInfo = (props) => {
    const columns2 = [
        {
            title: '最近一次登陆时间',
            dataIndex: 'lastLoginTime',
            align: 'center',
            render:(text,row,index)=>{
                return <div>
                    {row.lastLoginTime?timestampToTime(Number(row.lastLoginTime)):'-'}
                </div>  
            }
        },
        {
            title: '最近一次购买时间',
            dataIndex: 'lastBuyTime',
            align: 'center',
            render:(text,row,index)=>{
                return <div>
                    {row.lastBuyTime?timestampToTime(Number(row.lastBuyTime)):'-'}
                </div>  
            }
        },
        {
            title: '已使用优惠劵',
            dataIndex: 'usedCoupon',
            align: 'center'
        },
        {
            title: '已领优惠劵',
            dataIndex: 'hasCoupon',
            align: 'center'
        },
        {
            title: '失效优惠劵',
            dataIndex: 'invalidCoupon',
            align: 'center'
        },
    ]
    const [memberType,setMemberType] =useState({
        0: '普通会员',
        1: '小礼包会员',
        2: '大礼包会员',
        5: '直播会员',
        7: '断绑跃迁会员'
    })
    const [memberLevel,setMemberLevel]= useState({
        2: 'SH',
        3: 'PS',
        4: 'AM',
        5: 'AT'
    })
    const showQrCode = (value)=>{
        console.log(value)
    }
    return (
        <ViewContainer>
            <Card title="基本信息">
                <Row>
                    <Col span={4}>
                    <div className="user-base-info">
                        <div className="user-avatar-box">
                            {/* <img src={dealShowFileSrc(props.basicInfo.headImg)}/> */}
                            <img src="https://file-dev.fingo.shop/fingo/product/2020-09/09/original/18514547962857216540672_original_120x120.png"/>
                        </div>
                        <div className="user-name">{props.basicInfo.nickName}</div>
                    </div>
                    </Col>
                    <Col span={20}>
                    <table className="user-info-table">
                        <tbody>
                        <tr>
                            <td>用户ID</td>
                            <td>{ props.basicInfo.userId || '-'}</td>
                            <td>会员等级</td>
                            <td>{ memberLevel[props.basicInfo.memberLevel]} { props.basicInfo.brandLevel > 0 ? '(Brand)' : '' }</td>
                            <td>注册时间</td>
                            <td>{props.basicInfo.createTime!=''?timestampToTime(Number(props.basicInfo.createTime)):'-' }</td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td>{ props.basicInfo.gender || '-' }</td>
                            <td>绑定时间</td>
                            <td>{ props.basicInfo.inviteTime!=''?timestampToTime(Number(props.basicInfo.inviteTime)):'-'}</td>
                            <td>会员类型</td>
                            <td>{memberType[props.basicInfo.memberType]}</td>
                        </tr>
                        <tr>
                            <td>出生日期</td>
                            <td>{ props.basicInfo.birthday || '-' }</td>
                            <td>上级ID</td>
                            <td>{ props.basicInfo.parentId || '-' }</td>
                            <td>收货地址个数</td>
                            <td>{ props.basicInfo.address || '-' }</td>
                        </tr>
                        <tr>
                            <td>国家</td>
                            <td>{ props.basicInfo.countryCode}</td>
                            <td>上级等级</td>
                            <td>{props.basicInfo.parentLevel || '-' }</td>
                            <td>Facebook账号</td>
                            <td>{props.basicInfo.facebook || '-' }</td>
                        </tr>
                        <tr>
                            <td>电话</td>
                            <td>{ props.basicInfo.mobile || '-' }</td>
                            <td>成为PS时间</td>
                            <td>{props.basicInfo.memberTime!=''?timestampToTime(Number(props.basicInfo.memberTime)):'-' }</td>
                            <td>Google账号</td>
                            <td>{props.basicInfo.googleplay || '-' }</td>
                        </tr>
                        <tr>
                            <td>邮箱</td>
                            <td>{ props.basicInfo.mail || '-' }</td>
                            <td>成为AM时间</td>
                            <td>{props.basicInfo.upgradeAmTime!=''?timestampToTime(Number(props.basicInfo.upgradeAmTime)):'-' }</td>
                            <td>微信号</td>
                            <td>{props.basicInfo.weixinAccount || '-' }</td>
                        </tr>
                        <tr>
                            <td>邀请码</td>
                            <td>{ props.basicInfo.inviteCode || '-' }</td>
                            <td>成为AT时间</td>
                            <td>{props.basicInfo.memberLevel && props.basicInfo.memberLevel === 5? timestampToTime(Number(props.basicInfo.upgradeAtTime)):'-' }</td>
                            <td>微信二维码</td>
                            <td >{props.basicInfo.wechat_qr?<span OnClick={showQrCode(props.basicInfo.wechat_qr)} className="link">查看二维码</span>:'无'}</td>
                        </tr>
                        <tr>
                            <td>账号积分</td>
                            <td>{props.basicInfo.commissionAmount || '-' }</td>
                            <td>会员签约时间</td>
                            <td>{ props.basicInfo.signingAgreementTime?timestampToTime(Number(props.basicInfo.signingAgreementTime)):'未签约'}</td>
                            <td>line账号</td>
                            <td>{props.basicInfo.lineKey?props.basicInfo.lineKey:'无'}</td>
                        </tr>
                        </tbody>
                    </table>
                    </Col>
                </Row>
            </Card>
            <Card title="用户活跃信息" style={{marginTop:20}}>
            <Table columns={columns2} dataSource={props.memberActiveInfo} pagination={false} bordered rowKey="afterId"/>
            </Card>
            <Card title="团队信息" style={{marginTop:20}}>
                <div className="parent-path-container">
                    <h3><MenuUnfoldOutlined style={{padding: '0 8px'}}/>上级链路</h3>
                    <TeamCard cardLists={props.cardLists}></TeamCard>
                </div>
            </Card>
        </ViewContainer>
    )
}

export default BaseInfo;

