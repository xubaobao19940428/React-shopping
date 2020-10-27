import React, { useState, useCallback, useRef } from 'react';
import styles from './index.less';
import { Select, Empty, Spin } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { CheckOutlined } from '@ant-design/icons';

/**
 * 分页选择器（暂时不支持多选）
 */

interface PagingSelectType extends SelectProps<any> {
    // 分页回调
    pagingCallback?: () => void,
    // 选择回调
    onChange?: (result: any) => void,
    // 分页结束
    finish: Boolean
}

const PagingSelect = (props: PagingSelectType) => {
    const { pagingCallback = () => {}, onChange = () => {}, finish, ...selectProp } = props;
    const listRef: any = useRef();
    const selectRef: any = useRef();
    const [showValue, setShowValue] = useState<any>([]);


    const handleScroll = (e: any) => {
        const hei = e.target.offsetHeight;
        const top = e.target.scrollTop;
        if (listRef.current) {
            const listHei = listRef.current.offsetHeight;
            const isBottom = hei + top >= listHei;
            if (isBottom && !finish) {
                pagingCallback();
            }
        }
    }

    const handleClick = useCallback((item, list) => {
        let result: any = [];
        if (selectProp.mode == "multiple" || selectProp.mode == "tags") {
            const arr = [...list, item.value];
            // result = arr;
            setShowValue(arr);
        } else {
            result = item.value;
            setShowValue(item.label);
        }
        onChange(result);
        if (selectRef.current && !(selectProp.mode == "multiple" || selectProp.mode == "tags")) {
            selectRef.current.blur();
        }
    }, []);

    return (
        <Select
            ref={selectRef}
            style={{ width: 200 }}
            dropdownMatchSelectWidth
            options={selectProp.options}
            value={showValue}
            {...selectProp}
            dropdownRender={(originNode: any) => {
                return <div className={styles.selectBox} onScroll={handleScroll}>
                    <ul className={styles.list} ref={listRef}>
                        {
                            selectProp.options?.length ? selectProp.options.map((item: any, index) => <li className={item.selected ? styles.selected : ''} key={index} onClick={() => handleClick(item, showValue)}>{item.label} <span><CheckOutlined hidden={!(selectProp.mode == "tags" || selectProp.mode == "multiple")} /></span></li>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                        { selectProp.loading && <li className={styles.loading}><Spin /></li> }
                    </ul>
                </div>;
            }}></Select>
    )
}

export default PagingSelect;
