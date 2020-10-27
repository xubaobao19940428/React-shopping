import React from 'react';
import ViewContainer from '@/components/ViewContainer';
import BackCategory from './BackCategory';
import CategoryGroup from './CategoryGroup';
import { Tabs } from 'antd';
import CategoryRoles from './CategoryRoles'
const { TabPane } = Tabs;

// 商品类目选择
const ProductCategory = () => {
    return <ViewContainer>
        <Tabs defaultActiveKey="1">
            <TabPane tab="后台类目" key="1">
                <BackCategory />
            </TabPane>
            <TabPane tab="类目分组" key="2">
                <CategoryGroup />
            </TabPane>
            <TabPane tab="类目权限" key="3">
                <CategoryRoles />
            </TabPane>
        </Tabs>
    </ViewContainer>
}

export default ProductCategory;