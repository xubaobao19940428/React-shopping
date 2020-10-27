import React, { useCallback, useState, useEffect } from 'react';
import './index.less';
import { Table, Input, Select, InputNumber, Button } from 'antd';
import { TableProps, ColumnProps } from 'antd/es/table';
import UploadFile from '../UploadFile';

const { Column, ColumnGroup } = Table;

interface enumType {
    value: any,
    label: any
}

interface EditableColumn extends ColumnProps<any> {
    // 编辑类型 1.text任意输入内容 2.select选择项 3.number数字输入框 4.image图片
    editableType?: 'text' | 'select' | 'number' | 'image' | 'filter',
    // 是否支持同步数据
    syncData?: boolean;
    // 同步编辑当前值
    syncValue?: any;
    // 选项枚举
    enums: enumType[];
    // 数字输入最大值
    max: number;
    // 数字输入最小值
    min: number;
}

interface EditableTableProps extends TableProps<any> {
    // 数据项
    columns: EditableColumn[];
    // 是否支持同步
    sync?: boolean;
    // 表格编辑回调函数
    change?: (data: any) => void;
}

const EditableTable: React.FC<EditableTableProps> = (props) => {
    const { columns, sync, dataSource = [], change, ...tableProps } = props;

    const [currentColumns, setCurrentColumns] = useState(columns);  // 当前columns
    const [currentData, setCurrentData] = useState(dataSource);  // 当前列表数据

    // 同步数据更改
    const handleChange = useCallback((value: any, index: number, type = "value") => {
        const arr = [...currentColumns];
        arr[index].syncValue = type === "image" ? value.publicPath.original_link : value;
        setCurrentColumns(arr);
    }, []);

    // 列表数据更改
    const handleDataChange = useCallback((key: string, value: any, index: number, list, type = "value") => {
        const arr = list ? [...list] : [];
        arr[index][key] = type === "image" ? value.publicPath.original_link : value;
        setCurrentData(arr);
        typeof change === 'function' && change(dataSource);
    }, []);

    // 过滤数据
    const handleFilter = useCallback((key: any, opt: any, value: any) => {
        const arr = value ? dataSource.filter(data => data[key] === opt.label) : dataSource;
        setCurrentData(arr);
    }, []);

    // 设置表头
    const setHeader = useCallback((col: EditableColumn, index: number) => {
        let title: any = null;
        switch (col.editableType) {
            case 'text':
                title = <Input value={col.syncValue} onChange={(e: any) => handleChange(e.target.value, index)} allowClear />
                break;
            case 'select':
                title = <Select value={col.syncValue} options={col.enums} onChange={val => handleChange(val, index)} allowClear />
                break;
            case 'number':
                title = <InputNumber min={col.min} max={col.max} value={col.syncValue} onChange={val => handleChange(val, index)} />
                break;
            case 'image':
                title = <UploadFile values={col.syncValue ? [col.syncValue] : []} max={1} onDelete={() => handleChange("", index)} onUploaded={(file: any) => handleChange(file, index, 'image')} />
                break;
            case 'filter': 
                title = <Select value={col.syncValue} options={col.enums} onChange={(val, opt) => handleFilter(col.dataIndex, opt, val)} allowClear />
            default:
                break;
        }
        return title;
    }, []);

    const setTableColumn = (row, col, index, record) => {
        let renderNode: any = null;
        switch (col.editableType) {
            case 'text':
                renderNode = <Input value={record} onChange={(e: any) => handleDataChange(col.dataIndex, e.target.value, index, currentData)} allowClear />
                break;
            case 'select':
                renderNode = <Select value={record} options={col.enums} onChange={val => handleDataChange(col.dataIndex, val, index, currentData)} allowClear />
                break;
            case 'number':
                renderNode = <InputNumber min={col.min} max={col.max} value={record} onChange={val => handleDataChange(col.dataIndex, val, index, currentData)} />
                break;
            case 'image':
                renderNode = <UploadFile update={true} values={record ? [record] : []} max={1} onDelete={() => handleDataChange(col.dataIndex, "", index, currentData)} onUploaded={(file: any, fileList) => {console.log(fileList)}} />
                break;
            default:
                renderNode = record;
                break;
        }
        return renderNode;
    };

    // 同步数据
    const syncColData = useCallback((columnList, dataList) => {
        const arr = [...columnList];
        const list = [...dataList];
        arr.forEach((col: EditableColumn) => {
            if (col.syncValue) {
                const key: any = col.dataIndex;
                if (key) {
                    list.forEach(d => {
                        d[key] = col.syncValue;
                    }); 
                }
            }
        });

        setCurrentData(list);

        typeof change === 'function' && change(dataSource);
    }, []);

    useEffect(() => {
        setCurrentColumns(columns);
    }, [columns]);

    useEffect(() => {
        setCurrentData(dataSource);
    }, [dataSource]);

    return (
        <div className="editable-table">
            <div className="editable-action" hidden={!sync}><Button onClick={() => syncColData(currentColumns, currentData)} size="small" type="primary">同步该列</Button></div>
            <Table dataSource={currentData} {...tableProps} rowKey="id" >
                {
                    currentColumns.map((col, index) => <ColumnGroup title={setHeader(col, index)} key={index}>
                        <Column {...col} render={(record, row, i) => setTableColumn(row, col, i, record)} />
                    </ColumnGroup>)
                }
            </Table>
        </div>
    )
}

export default EditableTable;