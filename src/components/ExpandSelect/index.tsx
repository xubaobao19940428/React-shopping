import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Select, Checkbox, List } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import { RightOutlined } from '@ant-design/icons';
import { SelectProps } from 'antd/lib/select';

interface baseOptionType {
    // 显示名称
    label: string,
    // 选项唯一值
    value: any,
    // 子项
    children?: baseOptionType[],
    // 是否选中
    checked?: boolean,
    // 是否是叶子节点
    isLeafNode?: boolean
}

interface selectInfoType {
    // 选中节点路径所有信息列表
    selected: any[],
    // 选中节点路径信息列表
    selectValue: any[]
    // 选中节点值列表
    nodeValue: any[],
    // 当前配置树
    option: baseOptionType[]
}

interface OptionProps extends baseOptionType {
    // 父级
    parent?: any,
}

interface CheckListType {
    // 列表唯一标识
    key: any,
    // 列表数据
    values: any[],
    // 当前选中项
    selected: number
}

interface ExpandSelectType extends SelectProps<any> {
    // 选项
    options?: any[],
    // 选中项变化回调函数
    selectedChange?: (info: selectInfoType) => void,
    // 远程加载选项
    loadData?: (value: any, resolve: RequireResolve) => Promise<any>,
    // 选中数据
    selected?: any[]
}

const ExpandSelect = (props: ExpandSelectType) => {
    const { options = [], loadData, selectedChange, ...selectProps } = props;
    const selectRef: any = useRef();
    const [checkList, setCheckList] = useState<CheckListType[]>([]);
    const [showValue, setShowValue] = useState<string[]>([]);
    const [selectValue, setSelectValue] = useState<any>({
        selected: [],
        selectValue: [],
        nodeValue: []
    });

    /**
     * 设置选项以及回调
     * @param opt 修改项
     * @param values 当前显示内容
     * @param selected 当前选中信息
     * @param list 当前列表
     */
    const setOption = useCallback((opt: OptionProps, values: string[], selected = { selected: [], selectValue: [], nodeValue: [] }, list) => {
        const _values = [...values];
        const _selected = { ...selected };

        // 根据parent递归获取所有路径
        const getPath = (item: OptionProps) => {
            let _path: any = [];
            // 递归出口
            if (!item) {
                return _path;
            }

            _path.unshift(item);

            if (item.parent) {
                _path = getPath(item.parent).concat(_path);
            }

            return _path;
        }

        // 删除所有项parent项
        const deleteItemParent = (children: OptionProps[]) => {
            if (!children || children.length <= 0) {
                return [];
            }
            
            const result: any[] = children.map((item: OptionProps) => {
                const obj = {...item};
                if (obj.parent) {
                    delete obj.parent;
                }

                if (obj.children && obj.children.length > 0) {
                    obj.children = deleteItemParent(obj.children);
                }

                return {...obj};
            });

            return result;
        }

        const pathnames: any[] = getPath(opt);

        let pathStr = "";   //路径字符串
        let _selectedList = [];  //返回所有的信息
        let _selectedValue = [];  //返回所欲的值
        let _nodeValue = [..._selected.nodeValue];    //所有的叶子节点

        for (let i = 0; i < pathnames.length; i++) {
            const pathInfo = pathnames[i];
            pathStr = pathStr ? pathStr + " / " + pathInfo.label : pathInfo.label;
            _selectedList.push({
                label: pathInfo.label,
                value: pathInfo.value
            });
            _selectedValue.push(pathInfo.value);
        }

        const index = _values.indexOf(pathStr);

        if (index < 0 && opt.isLeafNode) {
            _values.push(pathStr);
            _selected.selected.push(_selectedList);
            _selected.selectValue.push(_selectedValue);
            _nodeValue.push(opt.value);
        } else {
            _values.splice(index, 1);
            _selected.selected.splice(index, 1);
            _selected.selectValue.splice(index, 1);
            _nodeValue.splice(index, 1);
        }

        _selected.nodeValue = _nodeValue;

        // 设置显示值
        setShowValue(_values);

        const tree = deleteItemParent([...list]);

        _selected.tree = tree;

        setSelectValue(_selected);

        typeof selectedChange == 'function' && selectedChange({..._selected});
    }, []);

    /**
     * 点击选项
     * @param opt 当前选项
     * @param list 当前列表
     * @param index 选中列表索引
     * @param optIndex 选中项索引
     */
    const handleClick = useCallback((opt: OptionProps, list, index, optIndex) => {
        // 如果是叶子节点，不做任何操作
        if (opt.isLeafNode) {
            return;
        }

        let arr = [...list].slice(0, index + 1);

        arr[index].selected = optIndex;

        // 判断子项是否存在，不存在则调用loadData函数
        if (opt.children && opt.children.length) {
            const nodes = opt.children.map(item => {
                return {
                    parent: opt,
                    ...item
                }
            });
            arr.push({
                key: index + 1,
                values: nodes,
                selected: -1
            });

            setCheckList(arr);
        } else {
            if (typeof loadData === 'function') {
                const getLoadData = () => {
                    return new Promise((resolve: any) => {
                        loadData(opt.value, resolve);
                    });
                }

                getLoadData().then((res: any) => {
                    const nodes = res.map((item: any) => {
                        return {
                            parent: opt,
                            ...item
                        }
                    });

                    opt.children = nodes;

                    arr.push({
                        key: index + 1,
                        values: opt.children,
                        selected: -1
                    });

                    setCheckList(arr);
                })
            }
        }
    }, []);

    /**
     * 改变多选状态
     * @param opt 修改项
     * @param list 当前显示列表
     * @param index 修改列表索引
     * @param optIndex 修改项索引
     * @param values 当前显示内容
     */
    const handleChange = useCallback((e, opt, list, index, optIndex, values, selected) => {
        let arr = [...list];

        arr[index].values[optIndex].checked = e.target.checked;

        setOption(opt, values, selected, arr[0].values);
        setCheckList(arr);
    }, []);

    // 设置多选框
    const setValue = useCallback((opts: any, checked = false) => {
        if (!opts || !opts.length) {
            return;
        }
        const arr = opts.map((item: any) => {
            item.checked = checked;

            // 递归设置勾选
            if (item.children && item.children.length) {
                setValue(item.children, checked);
            }

            return item;
        });

        return arr;
    }, []);

    useEffect(() => {
        // 设置初始值
        if (options.length) {
            setCheckList([{
                key: 0,
                values: setValue(options),
                selected: -1
            }]);
        }
    }, [options]);

    return (
        <div className={styles.container}>
            <Select
                {...selectProps}
                value={showValue}
                ref={selectRef}
                mode="multiple"
                // open={true}
                dropdownClassName="expand-select"
                dropdownRender={() => (
                    <div className={styles.expandSelectContainer}>
                        <div className={styles.expandSelectWrap}>
                            {
                                checkList.map((item, index) => <div key={item.key} className={styles.expandSelectBox}>
                                    <List>
                                        {
                                            item.values.map((opt, optIndex) => <List.Item key={opt.value} extra={!opt.isLeafNode ? <RightOutlined style={{ fontSize: 14 }} /> : null}>
                                                {
                                                    opt.isLeafNode && <Checkbox
                                                        checked={opt.checked}
                                                        indeterminate={opt.indeterminate}
                                                        onChange={(e: any) => handleChange(e, opt, checkList, index, optIndex, showValue, selectValue)}>
                                                    </Checkbox>
                                                }
                                                <span onClick={() => handleClick(opt, checkList, index, optIndex)} className={classnames(styles.checkboxLabel, { [styles.cur]: item.selected == optIndex })}>{opt.label}</span>
                                            </List.Item>)
                                        }
                                    </List>
                                </div>)
                            }
                        </div>
                    </div>
                )}
            ></Select>

        </div>
    )
}

export default ExpandSelect;