import React, { useState, useCallback, useEffect } from 'react'
import { InputNumber, Button, Modal, message, Form, Cascader, Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ViewContainer from '@/components/ViewContainer'
import { dealShowFileSrc } from '@/utils/utils'
import { splitData } from '@/utils/utils'
import { listCategoryProduct, changeCategoryProductSort, setCategoryProductTop, getCategoryGroupList, categoryList } from '@/services/product1'

/**
 * 分类排序
 */
const CategorySort = () => {
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    const [frontCategoryList, setFrontCategoryList] = useState([])
    const [visible, setVisible] = useState(false)
    const [selectCateId, setSelectCateId] = useState('')
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const columns = [
        {
            title: '商品ID',
            dataIndex: 'productId',
            align: 'center'
        },
        {
            title: '商品信息',
            width: 240,
            key: 'product',
            align: 'center',
            render: (text, item) => (
                <div className="product-info-box">
                    <img width={100} src={dealShowFileSrc(item.spuCover)}/>
                    {item.title}
                </div>
            )
        },
        {
            title: '前台商品类目',
            key: 'frontCateList',
            align: 'center',
            render: (text, item) => (
                item.frontCateList ? item.frontCateList.join('/') : ''
            )
        },
        {
            title: '总排序分',
            align: 'center',
            dataIndex: 'totalSort'
        },
        {
            title: '人工权重分',
            align: 'center',
            key: 'sort',
            render: (text, item, index) => (
                <>
                    <InputNumber defaultValue={item.sort} min={0} onChange={(val) => {handleSortChange(val, index)}} style={{ marginRight: 8 }}/>
                    <Button onClick={() => handleSort(item)} type="link">保存</Button>
                </>
            )
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, item) => (
                <Button type="link" onClick={() => handleTop(item)}>置顶</Button>
            )
        }
    ]
    
    const handleTop = useCallback((item) => {
        setCategoryProductTop({
            productId: item.productId,
            top: 1
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('置顶成功')
                getDataList()
            }
        })
    }, [selectCateId])

    const handleSortChange = useCallback((val, index) => {
        let temp = [...dataList]
        let item = temp[index]
        item.sort = val
        
        setDataList(temp)
    }, [dataList])

    const handleSort = useCallback(({ sort, productId }) => {
        changeCategoryProductSort({sort, productId}).then(res => {
            if (res.ret.errCode === 0) {
                message.success('设置成功')
                getDataList()
            }
        })
    }, [selectCateId])

    const changePage = useCallback((current, pageSize) => {
        let temp = { ...page }
        temp.pageNum = current
        temp.pageSize = pageSize
        setPage(temp)
        getDataList(temp)
    }, [page])

    const getDataList = useCallback((data) => {
        setLoading(true)
        let param = {
            ...page,
            frontCateId: selectCateId
        }
        param = Object.assign(param, data || {})
        listCategoryProduct(param).then(res => {
            setLoading(false)
            if (res.ret.errCode == 0) {
                setDataList(res.data.categoryProductUnitList)
                setTotal(res.data.total)
            }
        })
    }, [page, selectCateId])

    const loadFrontCategoryList = useCallback((list) => {
        let selectItem = list[list.length - 1] || {}
        selectItem.loading = true
        categoryList({
            pid: selectItem.cateId,
            cateType: 1,
            level: selectItem.level,
        }).then(res => {
            if (res.ret.errCode === 0) {
                let list = res.data.categoryUnitList || []
                list = list.map(item => {
                    item.label = item.cateName
                    item.value = item.cateId
                    item.isLeaf = true // 现在拿到的数据都是二级的，所以直接设置为true即可

                    return item
                })
                selectItem.children = list.length ? list: [{isLeaf: true, value: '', label: ''}]
            }
            selectItem.loading = false
            setFrontCategoryList([...frontCategoryList])
        }).catch(() => {
            selectItem.loading = false
        })
    }, [frontCategoryList])

    const getFrontCategoryList = useCallback((data) => {
        categoryList(data).then(res => {
            if (res.ret.errCode === 0) {
                let list = res.data.categoryUnitList || []
                list = list.map(item => {
                    item.label = item.cateName
                    item.value = item.cateId
                    item.isLeaf = data.level > 1

                    return item
                })
                
                setFrontCategoryList(list)
            }
        })
    }, [])

    const handleSearch = useCallback((values) => {
        setPage({
            pageNum: 1,
            pageSize: 10
        })
        let param = {
            productIdList: values.productIds ? splitData(values.productIds) : '',
            frontCateId: values.frontCateId[values.frontCateId.length - 1]
        }
        getDataList(param)
    }, [])

    const handleCategoryChange = useCallback((value, selectedOptions) => {
        let len = value.length
        let item = selectedOptions[len - 1]
        setSelectCateId(item.cateId)
        if (item.level === 1) {
            return
        } else {
            getDataList({
                frontCateId: item.cateId
            })
        }
    }, [])

    useEffect(() => {
        getFrontCategoryList({
            cateType: 1,
            level: 1,
            pid: 0
        })
    }, [])

    return (
        <ViewContainer>
            <Form layout="inline" onFinish={handleSearch}>
                <Form.Item name="frontCateId" label="商品前台分组">
                    <Cascader placeholder="请选择商品前台分组" 
                        options={frontCategoryList}
                        onChange={handleCategoryChange}
                        style={{ width: 320 }}
                        loadData={loadFrontCategoryList}/>
                </Form.Item>
                <Form.Item name="productIds" label="">
                    <Input placeholder="商品ID多个之间用,号隔开" style={{ width: 320 }}/>
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined/>} type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>

            <Table
                rowKey={record => record.productId}
                bordered
                dataSource={dataList}
                columns={columns}
                loading={loading}
                style={{ marginTop: 16 }}
                scroll={{ x: '100%' }}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: () => `共${total}条`,
                    pageSize: page.pageSize,
                    pageSizeOptions: [10, 20, 50, 100],
                    current: page.pageNum,
                    total: total,
                    onChange: changePage
                }}
            />
        </ViewContainer>
    )
}

export default CategorySort