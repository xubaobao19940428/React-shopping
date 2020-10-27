
import React, { ReactNode, useEffect } from 'react';
import styles from './index.less';
import { Breadcrumb } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

//公共头部属性
export interface HeaderProps {
    breadcrumbMap?: Object;   //面包屑
    currentPath?: String;   //当前地址
}

//获得所有面包屑元素
function getBreadcrumb(breadcrumbMap: any, currentPath: any) {
    let arr: Array<ReactNode> = [];
    for (const breadcrumbKey in breadcrumbMap) {
        if (breadcrumbKey == currentPath) {
            for (let i = 0; i < breadcrumbMap[breadcrumbKey].pro_layout_parentKeys.length; i++) {
                const route = breadcrumbMap[breadcrumbKey].pro_layout_parentKeys[i];
                // if (breadcrumbMap[route].component) {
                //     arr.push(
                //         <Breadcrumb.Item key={route}><a href={route}>{breadcrumbMap[route].name}</a></Breadcrumb.Item>
                //     );
                // } else {
                //     arr.push(
                //         <Breadcrumb.Item key={route}>{breadcrumbMap[route].name}</Breadcrumb.Item>
                //     );
                // }
                arr.push(
                    <Breadcrumb.Item key={route}><a>{breadcrumbMap[route].name}</a></Breadcrumb.Item>
                );
            }

            arr.push(<Breadcrumb.Item key={breadcrumbKey}>{breadcrumbMap[breadcrumbKey].name}</Breadcrumb.Item>);
            break;
        }
    }

    return arr;
}

const Header: React.FC<HeaderProps> = (props) => {
    const breadcrumb = getBreadcrumb(props.breadcrumbMap, props.currentPath);
    const { queryCountryList, queryLanguageList } = useModel('dictionary');
    const { queryUserInfo } = useModel('user');

    useEffect(() => {
        queryCountryList();
        queryLanguageList();
        queryUserInfo();
    }, []);
    return (
        <div className={styles.header}>
            <div className={styles.nav} hidden={breadcrumb.length <= 0}>
                <Breadcrumb separator={<RightOutlined className={styles.arrow} />}>{breadcrumb}</Breadcrumb>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default Header;