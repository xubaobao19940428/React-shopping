import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table } from 'antd';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import createBackend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { TableProps } from 'antd/es/table';

const RNDContext = createDndContext(createBackend);

const type = 'DragableBodyRow';

interface DragTableProps extends TableProps<any> {
    // 拖拽回调
    change: (res: any) => {}
}

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
    const ref: any = React.useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item: any) => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        item: { type, index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));
    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};

const DragTable: React.FC<DragTableProps> = (props) => {
    const [data, setData] = useState<any>([]);

    const components = {
        body: {
            row: DragableBodyRow,
        },
    };

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = data[dragIndex];
            const updateData = update(data, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            });
            setData(updateData);

            typeof props.change === 'function' && props.change(updateData);
        },
        [data],
    );

    const manager = useRef(RNDContext);

    useEffect(() => {
        setData(props.dataSource);
    }, [props.dataSource]);

    return (
        <DndProvider manager={manager.current.dragDropManager}>
            <Table
                {...props}
                dataSource={data}
                components={components}
                onRow={(record, index) => ({
                    index,
                    moveRow,
                })}
            />
        </DndProvider>
    );
};

export default DragTable;