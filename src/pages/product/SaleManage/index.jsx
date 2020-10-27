import React, { useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/SaleManage.less'
import { Select, Input, Button, Space, Pagination, Tag, Form, Table, InputNumber, message } from 'antd';
import { DownloadOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { getProductSales,setProductSalesConfig } from '@/services/sale'
import { dealShowFileSrc, param } from '@/utils/utils'
import { FormInstance } from 'antd/lib/form';
const Option = Select.Option;

/**
 * 销售管理
 * 
 */
const SaleManage = () => {
    const columns = [
        {
            title: '商品ID',
            dataIndex: 'productId',
            align: 'center'
        },
        {
            title: '商品信息',
            width: 300,
            render: (text, row, index) => {
                return <div style={{ display: 'flex' }}>
                    <img src={dealShowFileSrc(row.cover)} alt="" style={{ width: 100, height: 100 }} />
                    <div>{row.title}</div>
                </div>
        }
        },
        {
        title: '增长状态',
        align: 'center',
        render: (text, row, index) => {
            return <div>
            {
                row.growthStatus === 1 ? <Tag color="red">增长中</Tag> : (row.growthStatus == 2 ? <Tag >停止</Tag> : '')
            }
            </div>
        }
        },
        {
            title: '增长倍数',
            align: 'center',
            width: 260,
            dataIndex: 'multiple',
            key: 'multiple',
            render: (text, row, index) => {
                if (row.isInput) {
                return <div>
                    <InputNumber defaultValue={text} min={0} onChange={inputChangeNumber} />
                    <a onClick={() => cancelRow(text, row, index, tableData)} style={{ marginLeft: 10 }}>取消</a>
                </div>

                } else {
                return <span>{text}</span>
                }
            }
        },
        {
            title: '累计增长销量',
            dataIndex: 'grandTotal',
            align: 'center',
            key: 'grandTotal',
        },
        {
        title: '操作',
        align: 'center',
        render: (text, row, index) => {
            if (!row.isInput) {
            return <Space size="middle">
                <a onClick={() => confirmEdit(text, row, index, tableData)}>编辑</a>
            </Space>
            } else {
            return <Space size="middle">
                <a onClick={() => confirmRow(text, row, index, tableData)}>保存</a>
            </Space>
            }
        }
        },
    ];

    const [total, setTotal] = useState(0)
    const [defaultPageSize, setDefaultPageSize] = useState(10)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const formRef = React.createRef(FormInstance)
    const [tableData, setTableData] = useState([])
    const [tableIndex, setIndex] = useState(1)
    const [multipleTypeList, setMultip] = useState([
        {
        label: '=',
        value: 1
        }, {
        label: '>',
        value: 2
        }, {
        label: '<',
        value: 3
        }

    ])
    //编辑
    const confirmEdit = useCallback((text, row, index, newData) => {
        const editData = [...newData];
        editData[index].isInput = true
        setIndex(index)
        setTableData(editData)
    })
    //保存
    const confirmRow = useCallback((text, row, index, newData) => {
        const confirmData = [...newData];
        confirmData[index].isInput = false
        row.originalMultiple = row.multiple
        let params=row
        setProductSalesConfig(params).then(res=>{
        if(res.ret.errCode==0){
            message.success('保存成功')
            getProductSalesList(pageSize,pageNum)
        }
        }).catch(error=>{
        console.log(error)
        })
    })
    //input 输入事件
    const inputChangeNumber = (val) => {
        const inputData = [...tableData];
        inputData[tableIndex].multiple = val
        setTableData(inputData)
    }
    //取消事件
    const cancelRow = useCallback((text, row, index, newData) => {
        const editData = [...newData];
        editData[tableIndex].multiple = row.multiple1
        editData[index].isInput = false
        setTableData(editData)
    })

    const changeCurrentSize = (page, pagesize) => {
        setPageSize(pagesize)
        setPageNum(page)
    }

  const getProductSalesList = (pageNum, pageSize) => {
    var params = {
        pageNum: pageNum,
        pageSize: pageSize
    }
    changeCurrentSize(pageNum, pageSize)
    if (formRef.current) {
        let data = formRef.current.getFieldsValue()
        if (data.address1.multiple) {
            params.multiple = data.address1.multiple
        }
        if (data.address1.multipleType) {
            params.multipleType = data.address1.multipleType
        }
        if (data.address.type == 'productIdKey') {
            params.productId = data.address.street
        } else if (data.address.type == "skuIdKey") {
            params.skuId = data.address.street
        } else if (data.address.type == 'skuCodeKey') {
            params.skuCode = data.address.street
        } else if (data.address.type == 'titleKey') {
            params.title = data.address.street
        }
    }
    getProductSales(params).then(res => {
      if (res.ret.errCode == 0) {
        res.data.salesList.map(item => {
          item.multiple1 = item.multiple
        })
        setTableData(res.data.salesList)
        setTotal(res.data.total)
      }
    }).catch(error => {
      console.log(error)
    })
  }
  useEffect(() => {
    getProductSalesList(pageNum, pageSize)
  }, [])
  return (
    <ViewContainer>
      <div>
        <Form name="complex-form" layout="inline" style={{ marginBottom: "20px" }} ref={formRef}>
          <Form.Item label="商品：">
            <Input.Group compact>
              <Form.Item
                name={['address', 'type']}
                noStyle
              >
                <Select placeholder="请选择" style={{ width: 110 }} allowClear>
                  <Option key="productIdKey">商品ID</Option>
                  <Option key="skuIdKey">skuId</Option>
                  <Option key="skuCodeKey">skuCode</Option>
                  <Option key="titleKey">商品名称</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['address', 'street']}
                noStyle
              >
                <Input style={{ width: '60%' }} placeholder="请输入"  allowClear/>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="增长倍数：">
            <Input.Group compact>
              <Form.Item
                name={['address1', 'multipleType']}
                noStyle
              >
                <Select placeholder="请选择" style={{ width: 110 }} allowClear>
                  {
                    multipleTypeList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.label}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name={['address1', 'multiple']}
                noStyle
              >
                <Input style={{ width: '60%' }} placeholder="请输入增长倍数" allowClear/>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => getProductSalesList(1, 10)} icon={<SearchOutlined />}>搜索</Button>
            <Button onClick={() => { formRef.current.resetFields() }} icon={<RedoOutlined />}>重置</Button>
          </Form.Item>
        </Form>
        <Table columns={columns} bordered  dataSource={tableData} pagination={false} rowKey="productId" />
        <Pagination
          defaultPageSize={10}
          defaultCurrent={1}
          current={pageNum}
          pageSize={pageSize}
          total={total}
          showTotal={total => `共 ${total} 数据`}
          onChange={getProductSalesList}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper
          showSizeChanger
          style={{ marginTop: 20 }}
        />
      </div>
    </ViewContainer>
  )
}

export default SaleManage;