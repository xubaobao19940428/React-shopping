import { useCallback, useMemo } from 'react';
import usePagination, { defaultPaginationOption } from './usePagination';
import useFetch from './useFetch';
import useRowSelection from './useRowSelection';
import { Pagination } from 'antd';

interface UseTableType {
    // 表格请求接口
    fetch: Promise<any>,
    // 请求参数
    params?: any,
    // 列表数据路径
    dataPathKeys: string[],
    // 表格分页、排序、筛选变化时触发回调
    onChange: (pagination, filter, sorter, extra) => void
}

const useTable = (options: UseTableType) => {
    const { fetch, params = {}, dataPathKeys, onChange } = options;

    const { data, loading, fetchData, reFetchData } = useFetch(options.fetch, { ...defaultPaginationOption, ...options.params });

    const dataSource = useMemo(() => {
        let arr: any = [];
        if (dataPathKeys.length > 1) {
            arr = dataPathKeys ? dataPathKeys.reduce((acc, cur) => typeof acc === 'string' ? data[acc][cur] : acc[cur]) : [];
        } else {
            arr = dataPathKeys[0] && data[dataPathKeys[0]] ? data[dataPathKeys[0]] : [];
        }
        return arr;
    }, [data]);

    const tableProps = {
        dataSource,
        loading,
        onChange: (
            pagination,
            filter,
            sorter,
            extra: { currentDataSource: [] }
        ) => {
            typeof onChange === 'function' && onChange(pagination, filter, sorter, extra);
        }
    }

    return { tableProps };
}

export default useTable;