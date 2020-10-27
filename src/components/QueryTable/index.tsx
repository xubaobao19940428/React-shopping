import React, { useState, useEffect, ReactNode, useRef, useImperativeHandle, useCallback } from 'react';
import { Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PaginationProps } from 'antd/es/pagination';
import { FullscreenOutlined, FullscreenExitOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import ColumnOption from './ColumnOption';
import QueryForm, { QueryFormItem } from '../QueryForm';
import moment from 'moment';

/**
 * @param hideInTable 是否在表格隐藏
 * @param columnDisabled 该项是否禁止修改配置
 * @param align 表格项居中
 * @param format 数据格式化规则
 * @param defaultChecked 列配置，是否默认选择
 */
export interface QueryTableItem extends QueryFormItem, ColumnsType {
    hideInTable?: Boolean;
    columnDisabled?: Boolean;
    align?: 'left' | 'right' | 'center';
    format?: string | 'time';
    defaultChecked?: boolean
}

/**
 * 隐藏工具属性
 * @param fullscreen 全屏
 * @param refresh 刷新
 * @param itemOption {request}控制表格显示项
 */
interface hideToolType {
    fullscreen?: Boolean;
    refresh?: Boolean;
    itemOption?: Boolean;
}

/**
 * 查询表格属性
 * @param request 数据接口请求方法，仅适用返回Promise的异步接口
 * @param pagination 表格分页配置
 * @param totalKey {request}指定数据总数字段，默认字段total
 * @param dataSourceKey {request}指定数据源字段，默认字段result
 * @param dataSource 数据源，如果存在此字段，则忽略request字段
 * @param columns 表格字段
 * @param advance 高级搜索显示个数，0为不进行高级搜索
 * @param tableProps 透传属性
 * @param hideTools 隐藏工具
 * @param tableItemCenter 表格每一项居中
 * @param hideForm 是否隐藏查询表单
 * @example request使用举例
 * - <QueryTable request={(page, pageSize) => fetch({page, pageSize, ...})} />
 * - 具体例子移步 page -> ComponentPage
 */
interface QueryTableProps {
    request?: (params: any) => Promise<{}>,
    dataSource?: [];
    pagination?: PaginationProps;
    totalKey?: string;
    dataSourceKey?: string;
    columns: QueryTableItem[];
    advance?: number;
    initialValues?: Object;
    tableProps: any;
    buttonRender?: ReactNode;
    hideTools?: hideToolType;
    tableItemCenter?: Boolean;
    onQuery?: (params: any) => void;
    changeColumn?: (columns: QueryTableItem) => void;
    hideForm?: boolean
}

const QueryTable: React.FC<QueryTableProps> = React.forwardRef((props, ref) => {
    const { columns = [], advance = 0, hideTools, dataSource, tableProps = {}, initialValues = {}, buttonRender, request, dataSourceKey, tableItemCenter, totalKey, onQuery = () => { }, changeColumn, hideForm } = props;

    const showColumns: any = columns.filter(column => !column.hideInTable);

    const [realDataSource, setDataSource] = useState(dataSource || []);   // {request}表格实际数据源
    const [screenState, setScreenState] = useState(false);  //　全屏状态
    const [tableColumns, setColumns] = useState([]);
    const [page, setPage] = useState(1);    // {request}当前分页
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({})


    const optionRef: any = useRef();
    const formRef: any = useRef();

    useImperativeHandle(ref, () => {
        return {
            // 重置表格显示选项
            reset: () => {
                setTableParams({})
                optionRef.current?.resetCheck();
            },
            getFromData: () => {
                return formRef.current ? formRef.current.getFromData() : {}
            },
            // 刷新表格
            refreshList: () => {
                queryTableData({...tableParams})
            }
        }
    });

    // 表格分页配置
    const paginationOption = {
        responsive: true,
        showQuickJumper: true,
        current: page,
        total: total,
        onChange: (pageNum: number, pageSize: number) => {
            queryTableData({ ...tableParams, pageNum, pageSize });
            setPage(pageNum);
        }
    }

    // 表格配置
    const tableOption = { loading, ...tableProps, pagination: { ...paginationOption, ...tableProps.pagination } };

    // 查询表格数据，dataSource不存在的情况下生效
    const queryTableData = (params: any) => {
        let data = { ...tableParams }
        Object.assign(data, params ? params : {})
        setTableParams(data)
        if (!dataSource?.length && typeof request === 'function') {
            const dataKey = dataSourceKey || 'result';
            const dataTotalKey = totalKey || 'total';

            setLoading(true);
            request(params).then((res: any) => {
                setDataSource(res.data[dataKey]);
                setTotal(res.data[dataTotalKey]);
                setLoading(false);
            });
        } else {
            let paramsAny: any
            paramsAny = Object.assign(initialValues,params)
            onQuery(paramsAny);
        }
    }

    // 修改视图状态
    const changeScreenState = () => {
        const view = document.querySelector("#viewContainer");
        if (screenState && document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            view?.requestFullscreen();
        }

        setScreenState(!screenState);
    };

    // 重置表格数据
    const resetTableData = () => {
        setPage(1);
        queryTableData({ pageNum: page, pageSize: 10 });
    }

    const setColumnShow = useCallback((cols) => {
        const _columns = cols.map((col: QueryTableItem) => {
            if (tableItemCenter) {
                col.align = col.align || 'center';
            }

            let renderNode: any = null;

            if (col.format) {
                switch (col.format) {
                    case 'time':
                        renderNode = value => moment(value - 0).format('YYYY-MM-DD HH:mm:SS');
                        break;

                    default:
                        renderNode = value => moment(value - 0).format(col.format);
                        break;
                }
                if (renderNode) {
                    col.render = renderNode;
                }
            }

            return col;
        });
        setColumns(_columns);
        typeof changeColumn === 'function' && changeColumn(_columns);
    }, []);

    // 进入当前页面执行
    useEffect(() => {
        queryTableData({ pageNum: page, pageSize: 10 });
    }, []);
    // 更新数据源
    useEffect(() => {
        setDataSource(dataSource || []);
    }, [dataSource]);
    // 更新表格
    useEffect(() => {
        const _columns = showColumns.filter(item => item.defaultChecked !== false)
        setColumnShow(_columns);
    }, [columns]);

    return (
        <div className={styles.queryTable} id="queryTable">
            <QueryForm hideForm={hideForm} ref={formRef} columns={columns} advance={advance} onSuccess={params => queryTableData({ pageNum: page, pageSize: 10, ...params })} initialValues={initialValues}></QueryForm>
            <div className={styles.tableContainer}>
                <div className={styles.toolbar}>
                    <div className={styles.action}>
                        <React.Fragment>{buttonRender}</React.Fragment>
                    </div>
                    <div className={styles.tool}>
                        {
                            !hideTools || (hideTools && hideTools.fullscreen) ? <Tooltip getPopupContainer={triggerNode => document.getElementById("queryTable") || document.body} placement="top" title={screenState ? "退出全屏" : "全屏"}>
                                <span className={styles.toolItem} onClick={changeScreenState}>
                                    <Space>
                                        {screenState ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                    </Space>
                                </span>
                            </Tooltip> : ""
                        }
                        {
                            !dataSource?.length && request && (!hideTools || (hideTools && hideTools.refresh)) ? <Tooltip getPopupContainer={triggerNode => document.getElementById("queryTable") || document.body} placement="top" title="刷新">
                                <span className={styles.toolItem} onClick={resetTableData}>
                                    <Space>
                                        <ReloadOutlined />
                                    </Space>
                                </span>
                            </Tooltip> : ""
                        }
                        {
                            !hideTools || (hideTools && hideTools.itemOption) ? <ColumnOption ref={optionRef} columns={showColumns} onChange={(currentColumns: any) => setColumnShow(currentColumns)} /> : ""
                        }
                    </div>
                </div>
                <Table columns={tableColumns} dataSource={dataSource ? dataSource : realDataSource} {...tableOption} />
            </div>
        </div>
    )
})

export default QueryTable;
