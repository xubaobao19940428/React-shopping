import React from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './Welcome.less';

export default (): React.ReactNode => (
    <ViewContainer>
        <p className={styles.welcome}>欢迎使用fingo运营支撑系统</p>
    </ViewContainer>
);
