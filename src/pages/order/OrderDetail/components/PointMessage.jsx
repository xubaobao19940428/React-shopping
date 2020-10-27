import React, { useState, useCallback, useEffect } from 'react';
import { Button, Table, Popover, Typography } from 'antd';
import enmu from '../../Enmu'
import { dealShowFileSrc } from '@/utils/utils'
import styles from './styles/PointMessage.less'

const { Column } = Table
const { Text } = Typography;

const PointMessage = (props) => {
    const { pointsInfo } = props
    const { userLevel } = enmu;
    console.log(pointsInfo)
    const summaryTotal = (val) => {
        console.log(val)
        if (val.length !== 0) {
            let point1 = "",point2 = ""
            for (const iterator of val) {
                point1+= iterator.points[0]
                point2+= iterator.points[1]
            }
            return (
                <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>小计：</Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text>{point1}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text>{point2}</Text>
                    </Table.Summary.Cell>
                </Table.Summary.Row>
            )
        }
        
    }
    return (
        <Table dataSource={pointsInfo.skuPointsInfo} bordered pagination={false} summary={summaryTotal} >
            <Column title="商品信息" align="center" render={ record => {
                return (
                    <Popover content={<img src={dealShowFileSrc(record.skuCover)} className={styles.thumbnail}/>} title="">
                        <img src={dealShowFileSrc(record.skuCover)} className={styles.previewImage}/>
                    </Popover>
                )
            }}/>
            <Column title="规格ID" align="center" dataIndex="skuId" />
            {
                pointsInfo.title.map((item,index)=> {
                    return <Column key={index} align="center" title={ <div><span>{ item.nickname }({ item.userId })({ item.currency || '-' })</span><span>{ userLevel[item.userLevel] }{ item.pointType }</span></div> } render={record => {
                        return <div>{ record.points[index] }</div>
                    }} />
                })
            }
        </Table>
    )
}

export default PointMessage