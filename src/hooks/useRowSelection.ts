import { useState, useMemo, useCallback } from 'react';

const useRowSelection = (options) => {
    const [selectedList, setSelectedList] = useState(options.selectedList || []);
    const [selectedRowKey, setSelectedRowKey] = useState(options.selectedRowKey || []);

    const rowSelection = useMemo(() => {
        return {
            ...options,
            selectedList,
            selectedRowKey,
            onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKey(selectedRowKeys);
                setSelectedList(selectedRows);
                if (options.onChange) {
                    options.onChange(selectedRows, selectedRowKeys);
                }
            }
        }
    }, [selectedList, selectedRowKey, options]);

    const reset = useCallback(() => {
        setSelectedList([]);
        setSelectedRowKey([]);
    }, [selectedList, selectedRowKey, options]);

    return { selectedList, selectedRowKey, rowSelection, reset }
}

export default useRowSelection;