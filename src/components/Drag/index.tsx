import React, { useState, ReactNode, useEffect, useCallback, useImperativeHandle } from 'react';
import styles from './index.less';
import classnames from 'classnames';

interface DragItemProps {
    // 渲染节点函数
    render: (row: any) => ReactNode
}

interface DragProps {
    // 拖拽列表数据源
    dataSource?: DragItemProps[],
    // 拖动元素唯一标示
    dragKey: string,
    // 拖动修改回调
    onChange?: (info: DragItemProps[]) => void
}

const Drag: React.FC<DragProps> = React.forwardRef((props, ref) => {
    const { dataSource = [], dragKey, onChange } = props;
    const [data, setData] = useState<any>([]);   //当前列表
    const [activeIndex, setActiveIndex] = useState(0);    //当前被拖动元素索引
    const [status, setStatus] = useState('todo');    //当前拖拽状态 1.todo 默认状态 2.doing 进行中 3.done 已完成

    const onDragStart = useCallback((index) => {
        setActiveIndex(index);
        // 更改进行状态
        setStatus('doing');
    }, []);

    const onDragEnd = useCallback((list) => {
        setStatus('done');
        typeof onChange === 'function' && onChange(list);
    }, [])

    const onDragEnter = (key, index) => {
        const arr = [...data];
        arr.splice(activeIndex, 1);
        arr.splice(index, 0, data[activeIndex]);
        if (key != data[activeIndex][dragKey]) {
            setData(arr);
            setActiveIndex(index);
        }
    }

    useImperativeHandle(ref, () => {
        return {
            // 重置拖动
            reset: () => {
                setData(dataSource);
                onDragEnd(dataSource);
            }
        }
    });

    useEffect(() => {
        setData(dataSource);
    }, [dataSource]);

    return (
        <div className={styles.dragContext}>
            {
                data.map((item: DragItemProps, index) => <span
                    className={classnames(styles.item, { [styles.cur]: item[dragKey] == data[index][dragKey] && status == 'doing' })}
                    key={item[dragKey]}
                    onDragStart={() => onDragStart(index)}
                    onDragEnd={() => onDragEnd(data)}
                    onDragEnter={() => onDragEnter(item[dragKey], index)}
                    onDragOver={e => e.preventDefault()}
                    draggable
                >{item.render(item)}</span>)
            }
        </div>
    )
})

export default Drag;