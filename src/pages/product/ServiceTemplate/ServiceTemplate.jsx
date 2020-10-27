import React, { useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/ServiceTemplate.less'
import { Select, Input, Button, Pagination, Tag, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AfterSale from './components/AfterSale'
import AfterPromise from './components/AfterPromise'

const { TabPane } = Tabs;

const ServiceTemplate = () => {
    const tabChange = () => {

    }
    return(
        <ViewContainer>
            <Tabs onChange={()=>{tabChange}} type="card">
                <TabPane tab="售后政策" key="1">
                    <AfterSale></AfterSale>
                </TabPane>
                <TabPane tab="到货承诺" key="2">
                    <AfterPromise></AfterPromise>
                </TabPane>
            </Tabs>
        </ViewContainer>
    )
}
export default ServiceTemplate