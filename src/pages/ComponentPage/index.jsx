import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Select, InputNumber, Cascader, Checkbox, Modal, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ViewContainer, QueryTable, UploadImageByLang, UploadImageByLangModal, PagingSelect, QueryForm, Drag, UploadFile } from '@/components';
import { queryGoldList } from '@/services/shake';
import { filterCountry } from '@/utils/filter';
import { useSetState, usePagination, useTable } from '@/hooks';
import { filterData } from '@/utils/filter'

const CheckboxGroup = Checkbox.Group;

const ComponentPage = () => {
    const dragRef = useRef();
    const pagination = usePagination({
        total: 2,
        pageSize: 1
    });

    const { tableProps } = useTable({
        fetch: queryGoldList,
        dataPathKeys: ['list']
    });

    return (
        <ViewContainer title="页面标题">
            <Drag ref={dragRef} dragKey="id" dataSource={[
                {
                    id: 1,
                    img: "https://file-test.fingo.shop/fingo/product/2020-09/04/original/18509546224529291083776_original_400x400.jpg",
                    render: (row) => <img src={row.img} />
                },
                {
                    id: 2,
                    img: "https://file-test.fingo.shop/fingo/product/2020-09/04/original/18509546224529291083777_original_400x400.jpg",
                    render: (row) => <UploadFile max="8" />
                },
                {
                    id: 3,
                    img: "https://file-test.fingo.shop/fingo/product/2020-09/04/original/18509546224529291083778_original_400x400.jpg",
                    render: (row) => <UploadFile max="1" />
                }
            ]}
                onChange={(info) => {
                    console.log(info);
                }}
            />
            <Button onClick={() => {
                if (dragRef.current) {
                    dragRef.current.reset();
                }
            }}>重置拖动</Button>
            <UploadFile max="8" />
            <Table dataSource={[{
                id: 1,
                name: "名字",
                item: "项"
            }, {
                id: 2,
                name: "名字1",
                item: "项1"
            }, {
                id: 3,
                name: "名字2",
                item: "项2"
            }]} 
            columns={[{
                title: "项目1",
                dataIndex: "name"
            }, {
                title: "项目2",
                dataIndex: "item"
            }]} rowKey="id" {...tableProps} />
        </ViewContainer >
    )
}



export default ComponentPage;