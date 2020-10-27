import { useState, useMemo } from 'react';

// 默认分页配置
export const defaultPaginationOption = {
    pageSize: 10,
    pageNum: 1
}

const usePagination = (options: any = defaultPaginationOption) => {
    // 分页配置
    const [pagination, setPagination] = useState({
        pageSize: options.pageSize || defaultPaginationOption.pageSize,
        current: options.pageNum || defaultPaginationOption.pageNum
    });

    const paginationOptions = useMemo(() => {
        return {
            responsive: true,
            showQuickJumper: true,
            pageSize: pagination.pageSize || defaultPaginationOption.pageSize,
            current: pagination.current || defaultPaginationOption.pageNum,
            onChange: (current, pageSize) => {
                if (options.onChange) {
                    options.onChange(current, pageSize);
                }
                setPagination({ current, pageSize });
            },
            onShowSizeChange: (current, pageSize) => {
                if (options.onChange) {
                    options.onChange(current, pageSize);
                }
                setPagination({ current, pageSize });
            }
        }
    }, [options, pagination]);

    return { paginationOptions, setPagination };
}

export default usePagination;
