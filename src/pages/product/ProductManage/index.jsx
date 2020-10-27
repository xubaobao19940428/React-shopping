import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styles from './index.less';
import QueryTable from '@/components/QueryTable';
import ViewContainer from '@/components/ViewContainer';
import { Select, Input, DatePicker, Button, Tag, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import { dealShowFileSrc } from '@/utils/utils'

import { queryProductList } from '@/services/product1';

const Option = Select.Option;

/**
 * 商品管理
 * @author weidongdong
 */
const ProductManage = () => {
    const { countries, languages } = useModel('dictionary');
    const initFrontTypes = [{ label: "选项", value: 4, children: [{ label: "子项", value: 5 }] }, { label: "选项2", value: 5 }, { label: "选项3", value: 6 }];
    const [tableLoading, setTableLoading] = useState(false);    //表格loading
    const [tableData, setTableData] = useState([]);    //表格数据源
    const [total, setTotal] = useState(0);
    const [queryKey, setQueryKey] = useState("productIdKey");
    const [frontTypes, setFrontTypes] = useState(initFrontTypes);
    const [selectCountryCode, setSelectCountryCode] = useState('MY');

    const tableRef = useRef();

    // 查询商品列表
    const getProductList = useCallback(params => {
        setTableLoading(true);
        queryProductList(params).then(res => {
            setTableLoading(false);
            console.log(res)
            if (res.ret.errCode === 0) {
                setTableData(res.data.list);
                setTotal(res.data.total);
            }
        });
    }, []);

    const getCurrentCountryInfo = useCallback((countries) => {
        let info = {};
        for (let i = 0; i < countries.length; i++) {
            const code = countries[i].countryCode;
            if (code.toLocaleLowerCase() == selectCountryCode.toLocaleLowerCase()) {
                info = countries[i];
                break;
            }
        }

        return info;
    }, []);
    //编辑商品
    const getProductDetail = (row) => {
        console.log(row)
        const countries = row.spuCountry || [];
         let countryList = countries.reduce((accumulator, currentValue) => {
            if (typeof accumulator === 'string') {
                return accumulator + ';' + currentValue.countryCode;
            } else {
                return accumulator.countryCode + ';' + currentValue.countryCode;
            }
        })
        let str = ''
        row.backCate.parentPathNameList.map(item=>{
            str+=item+';'
        })
        const cateNameStr = str+row.backCate.cateName
        history.push({
            pathname:'/product/edit',
            query:{
                type:'edit',
                productId:row.productId,
                cateId:row.backCate.cateId,
                cateNames: cateNameStr,
                countries:countryList
            }
        })
    }
    return (
        <ViewContainer>
            <QueryTable
                ref={tableRef}
                tableItemCenter
                advance={3}
                columns={[
                    {
                        title: "商品ID",
                        dataIndex: "productId",
                        width: 150,
                        fixed: 'left',
                        hideInForm: true,
                        columnDisabled: true
                    },
                    {
                        title: "商品信息",
                        dataIndex: "title",
                        width: 200,
                        fixed: 'left',
                        hideInForm: true,
                        columnDisabled: true,
                        render: (item, row) => <div className={styles.productInfo}>
                            <div className={styles.imgBox}>
                                <img src={dealShowFileSrc(row.image)} />
                            </div>
                            <div className={styles.tableText}>{item}</div>
                        </div>
                    },
                    {
                        title: "商品",
                        dataIndex: "productQueryValue",
                        queryType: "render",
                        hideInTable: true,
                        width: 150,
                        renderFormItem: (form) => <div style={{ width: 300 }}>
                            <Select style={{ width: 100 }} allowClear onChange={val => {
                                setQueryKey(val);
                            }}>
                                <Option key="productIdKey">商品ID</Option>
                                <Option key="skuIdKey">skuId</Option>
                                <Option key="skuCodeKey">skuCode</Option>
                                <Option key="titleKey">商品名称</Option>
                            </Select>
                            <span><Input onChange={e => { form.setFieldsValue({ productQueryValue: e.target.value }); }} style={{ width: 190, marginLeft: 5 }} allowClear /></span>
                        </div>
                    },
                    {
                        title: `上架状态(${selectCountryCode})`,
                        formItemTitle: "上架状态",
                        dataIndex: 'spuCountry',
                        queryType: "select",
                        width: 120,
                        valueEnum: [
                            {
                                value: 1,
                                label: "上架"
                            },
                            {
                                value: 2,
                                label: "下架"
                            }
                        ],
                        render: (countries) => {
                            const status = getCurrentCountryInfo(countries).shelveStatus;
                            return status == 1 ? <Tag color="green">上架</Tag> : <Tag color="red">下架</Tag>
                        }
                    },
                    {
                        title: "销售国家",
                        dataIndex: 'saleCountry',
                        queryType: "select",
                        width: 150,
                        valueEnum: countries.map(country => {
                            return {
                                value: country.shortCode,
                                label: country.nameCn
                            }
                        }),
                        render: (item, row) => {
                            const countries = row.spuCountry || [];
                            return countries.reduce((accumulator, currentValue) => {
                                if (typeof accumulator === 'string') {
                                    return accumulator + '/' + currentValue.countryCode;
                                } else {
                                    return accumulator.countryCode + '/' + currentValue.countryCode;
                                }
                            })
                        }
                    },
                    {
                        title: `划线价(${selectCountryCode})`,
                        dataIndex: "price",
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        render: (item, row) => {
                            const countries = row.spuCountry || [];
                            const price = getCurrentCountryInfo(countries).price;
                            return price ? price : '-';
                        }
                    },
                    {
                        title: `VIP价(${selectCountryCode})`,
                        dataIndex: "priceVip",
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        render: (item, row) => {
                            const countries = row.spuCountry || [];
                            const priceVip = getCurrentCountryInfo(countries).priceVip;
                            return priceVip ? priceVip : '-';
                        }
                    },
                    {
                        title: `佣金率(${selectCountryCode})`,
                        dataIndex: "commission",
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        render: (item, row) => {
                            const val = selectCountryCode == 'MY' ? row.commissionMY : selectCountryCode == 'TH' ? row.commissionTH : row.commissionSG;
                            return val ? val : "-";
                        }
                    },
                    {
                        title: "累计销量",
                        dataIndex: "trueSales",
                        width: 150,
                        hideInForm: true,
                        render: (sale) => sale ? sale : '-'
                    },
                    {
                        title: "前台类目",
                        dataIndex: 'frontCategory',
                        queryType: "cascader",
                        width: 150,
                        defaultChecked: false,
                        formItemProps: {
                            showSearch: true,
                            options: frontTypes
                        },
                        render: (item, row) => {
                            const frontCates = row.frontCate || [];
                            const cates = [];
                            frontCates.forEach(item => {
                                cates.push(item.parentPathName.join(">") + ">" + item.cateName)
                            });
                            return cates.join("; ");
                        }
                    },
                    {
                        title: "后台类目",
                        dataIndex: 'backCate',
                        queryType: "cascader",
                        width: 150,
                        formItemProps: {
                            showSearch: true,
                            options: frontTypes
                        },
                        render: (backCate) => {
                            return backCate ? backCate.parentPathNameList.join(">") + ">" + backCate.cateName : '-';
                        }
                    },
                    {
                        title: "销售方式",
                        dataIndex: 'saleWay',
                        queryType: "select",
                        hideInTable: true,
                        width: 150,
                        valueEnum: [
                            {
                                label: '售完即止',
                                value: 1
                            }, {
                                label: '边售边采',
                                value: 2
                            }
                        ]
                    },
                    {
                        title: "商品类型",
                        dataIndex: 'productType',
                        queryType: "select",
                        hideInTable: true,
                        width: 150,
                        valueEnum: [
                            {
                                label: '类型1',
                                value: 1
                            }, {
                                label: '类型2',
                                value: 2
                            }
                        ]
                    },
                    {
                        title: "供应商",
                        dataIndex: 'supplierId',
                        queryType: "select",
                        formItemProps: {
                            showSearch: true
                        },
                        hideInTable: true
                    },
                    {
                        title: "供应商",
                        dataIndex: 'supplierName',
                        width: 150,
                        defaultChecked: false,
                        hideInForm: true
                    },
                    {
                        title: "商品来源",
                        dataIndex: 'sourceKey',
                        queryType: "select",
                        width: 150,
                        hideInTable: true,
                        valueEnum: [
                            {
                                label: '来源1',
                                value: 1
                            }, {
                                label: '来源2',
                                value: 2
                            }
                        ]
                    },
                    {
                        title: "原始链接",
                        dataIndex: 'productUrl',
                        width: 150,
                        hideInTable: true,
                    },
                    {
                        title: "时间查询",
                        dataIndex: 'timeType',
                        width: 150,
                        queryType: "render",
                        hideInTable: true,
                        renderFormItem: () => <div style={{ width: 300 }}>
                            <Select style={{ width: 100 }} getPopupContainer={triggerNode => document.getElementById("queryForm")}>
                                <Option key="1">创建时间</Option>
                                <Option key="2">更新时间</Option>
                            </Select>
                            <DatePicker.RangePicker style={{ width: 190, marginLeft: 5 }} getPopupContainer={triggerNode => document.getElementById("queryForm")} />
                        </div>
                    },
                    {
                        title: "品牌",
                        dataIndex: 'brandInfo',
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        render: brand => brand.brandNameCn
                    },
                    {
                        title: "创建时间",
                        dataIndex: 'createTime',
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        format: 'time'
                    },
                    {
                        title: "更新时间",
                        dataIndex: 'updateTime',
                        width: 150,
                        hideInForm: true,
                        defaultChecked: false,
                        format: 'time'
                    },
                    {
                        title: "操作",
                        dataIndex: 'options',
                        hideInForm: true,
                        fixed: 'right',
                        width: 120,
                        render: (text, row, index) => {
                            return <Space className="table-row-option">
                                <a>查看</a>
                                <a onClick={() => getProductDetail(row)}>编辑</a>
                                <a className="table-row-option-del">删除</a>
                            </Space>
                        }

                    }
                ]}
                onQuery={({ pageNum, pageSize, ...params }) => {
                    const productInfo = {};
                    if (params.productQueryValue) {
                        productInfo[queryKey] = params.productQueryValue;
                    }
                    delete params.productQueryValue;
                    const queryParams = { ...params, ...productInfo }
                    getProductList({
                        page: {
                            pageNum: pageNum,
                            pageSize: pageSize
                        },
                        ...queryParams
                    });
                    setSelectCountryCode(params.saleCountry || 'MY');

                    if (params.saleCountry) {
                        tableRef.current.reset();
                    }
                }}
                dataSource={tableData}
                tableProps={{
                    rowKey: "productId",
                    bordered: true,
                    scroll: { x: 'max-content' },
                    loading: tableLoading,
                    pagination: {
                        total: total
                    }
                }}
                buttonRender={<React.Fragment>
                    <Button type="primary" onClick={() => history.push({
                        pathname: '/product/backCategory',
                        query: {
                            type: 'addProduct'
                        }
                    })} style={{ marginRight: 10 }} icon={<PlusOutlined />}>新增商品</Button>
                    <Button icon={<DownloadOutlined />}>导出</Button>
                </React.Fragment>}
            />
        </ViewContainer>
    )
}

export default ProductManage;
