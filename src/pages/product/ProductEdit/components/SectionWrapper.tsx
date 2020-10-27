//模块容器
import React, { ReactChildren } from 'react';
import styles from './SectionWrapper.less';

interface SectionWrapperType {
    // 子组件
    children?: ReactChildren,
    // 容器标题
    title?: string
}

const SectionWrapper = (props: SectionWrapperType) => {
    return (
        <div className={styles.sectionWrapper}>
            <div className={styles.title}>{props.title}</div>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    )
}

export default React.memo(SectionWrapper, (prevProps, nextProps) => {
    return prevProps.title != nextProps.title;
});