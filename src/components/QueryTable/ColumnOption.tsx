import React, { useState, useCallback, useImperativeHandle } from 'react';
import { Space, Popover, Checkbox, Tooltip } from 'antd';
import styles from './index.less';
import { QueryTableItem } from './index';
import { SettingOutlined } from '@ant-design/icons';

const CheckboxGroup = Checkbox.Group;

interface ColumnOptionProps {
    columns: QueryTableItem[],
    onChange?(checkedList: any[]): void
}

const ColumnOption: React.FC<ColumnOptionProps> = React.forwardRef((props, ref) => {
    const { columns, onChange } = props;
    let hasDisabled = false;

    // 基本值
    const plainOptions: any = columns.map(item => {
        if (item.columnDisabled) {
            hasDisabled = true;
        }
        return {
            value: item.dataIndex,
            label: item.title,
            disabled: item.columnDisabled
        }
    });

    // 选中值
    const valueOptions = columns.map(item => {
        const checked = item.defaultChecked != undefined ? item.defaultChecked : true;
        return checked ? item.dataIndex : "";
    });

    const [indeterminate, setIndeterminateState] = useState(false); // 是否半选
    const [checkedArray, setCheckedState] = useState(valueOptions); // 已选列表
    const [checkAll, setCheckAllState] = useState(true); // 是否全选

    // 获得当前显示列
    const getCurrentColumns = useCallback((checkedList: any[], cols: QueryTableItem[]) => {
        let currentColumns: any[] = [];

        // 过滤没有选中行并触发修改回调函数
        currentColumns = cols.filter(column => {
            return checkedList.indexOf(column.dataIndex) >= 0;
        });

        typeof onChange === 'function' && onChange(currentColumns);
    }, [])

    // 修改所有选中状态
    const handleChangeCheckAll = useCallback((e: any, cols: QueryTableItem[]) => {
        const checkedList = e.target.checked ? valueOptions : [];
        setIndeterminateState(false);
        setCheckedState(checkedList);
        setCheckAllState(e.target.checked);

        getCurrentColumns(checkedList, cols);
    }, []);

    // 修改多选组状态
    const handleChangeCheckGroup = useCallback((checkedList: any[], cols: QueryTableItem[]) => {
        setIndeterminateState(!!checkedList.length && checkedList.length < plainOptions.length);
        setCheckedState(checkedList);
        setCheckAllState(checkedList.length === plainOptions.length);

        getCurrentColumns(checkedList, cols);
    }, []);

    // 重置表格行
    const resetTableRow = useCallback((cols: QueryTableItem[]) => {
        setIndeterminateState(false);
        setCheckAllState(true);
        setCheckedState(valueOptions);

        getCurrentColumns(valueOptions, cols);
    }, []);

    useImperativeHandle(ref, () => {
        return {
            // 重置勾选项
            resetCheck: () => {
                setCheckedState(valueOptions);
            }
        }
    });

    return (
        <Popover
            getPopupContainer={triggerNode => document.getElementById("queryTable") || document.body}
            placement="bottomRight"
            title={<div className={styles.optionTitle}>
                <Checkbox disabled={hasDisabled} indeterminate={indeterminate} checked={checkAll} onChange={(e: any) => handleChangeCheckAll(e, columns)}>列展示</Checkbox>
                <a onClick={() => resetTableRow(columns)}>重置</a>
            </div>}
            content={<CheckboxGroup style={{ width: 150 }} options={plainOptions} value={checkedArray} onChange={(e: any) => handleChangeCheckGroup(e, columns)} />}
            arrowPointAtCenter
            trigger="click">
            <Tooltip getPopupContainer={triggerNode => document.getElementById("queryTable") || document.body} placement="top" title="列设置">
                <span className={styles.toolItem}>
                    <Space>
                        <SettingOutlined />
                    </Space>
                </span>
            </Tooltip>

        </Popover>
    )
})

export default ColumnOption;