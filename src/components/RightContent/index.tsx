import { Tag, Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const FINGO_APP_ENV = process.env.FINGO_APP_ENV;

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
    dev: 'orange',
    test: 'green',
    prd: '#87d068',
};

const GlobalHeaderRight: React.FC<{}> = () => {
    const { initialState } = useModel('@@initialState');

    if (!initialState || !initialState.settings) {
        return null;
    }

    const { navTheme, layout } = initialState.settings;
    let className = styles.right;

    if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
        className = `${styles.right}  ${styles.dark}`;
    }
    return (
        <Space className={className}>
            <Avatar />
            {FINGO_APP_ENV && (
                <span>
                    <Tag color={ENVTagColor[FINGO_APP_ENV]}>{FINGO_APP_ENV}</Tag>
                </span>
            )}
            {/* <SelectLang className={styles.action} /> */}
        </Space>
    );
};
export default GlobalHeaderRight;
