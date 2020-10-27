import React, { useState, useCallback, useEffect,useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import styles from './styles/WordsManage.less'
import { Select, Input, Button, Space, Pagination, Form, Table, Tabs, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { secondTimeFormat } from '@/utils/filter'
import { synonymWordsList, synonymWordsAddOrEdit, synonymWordsDelete, sensitiveWordsList, sensitiveWordsAddOrEdit, sensitiveWordsDelete } from '@/services/product1'
import AddWords from './components/addSynonymWords'
import AddSensitiveWords from './components/addSensitiveWords'
const Option = Select.Option;

/**
 * 词库管理
 * 
 */
const {confirm} = Modal
const WrodsManage = () => {
  const columns = [
    {
        title: '词条ID',
        dataIndex: 'id',
        width: 100,
        align: 'center'
    },
    {
        title: '语种',
        dataIndex: 'languageCode',
        width: 170,
        align: 'center'
    },
    {
        title: '目标词',
        dataIndex: 'leftWord',
        width: 170,
        align: 'center'
    },
    {
        title: '同义词',
        dataIndex: 'rightWord',
        width: 170,
        align: 'center'
    },
    {
        title: '匹配类型',
        dataIndex: 'flag',
        width: 150,
        align: 'center',
        render: (_, item) => (
          item.flag ? '单向' : '双向'
        )
    },
    {
        title: '创建时间',
        key: 'createTime',
        width: 240,
        align: 'center',
        render: (_, item) => (
          secondTimeFormat(item.createTime)
        )
    },
    {
        title: '更新时间',
        key: 'updateTime',
        width: 240,
        align: 'center',
        render: (_, item) => (
          secondTimeFormat(item.updateTime)
        )
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 140,
        render: (text, row) => {
            return <Space size="middle">
                <a onClick={() => handleEdit('synonym', row)} style={{ marginRight: 8 }}>编辑</a>
                <a onClick={() => handleDel('synonym', row)}>删除</a>
            </Space>
        }
    },
  ];
  const columns1 = [
    {
        title: '词条ID',
        dataIndex: 'id',
        width: 100,
        align: 'center'
    },
    {
        title: '语种',
        dataIndex: 'languageCode',
        width: 170,
        align: 'center'
    },
    {
        title: '敏感词',
        dataIndex: 'word',
        width: 170,
        align: 'center'
    },
    {
        title: '屏蔽对象',
        key: 'senseType',
        width: 170,
        align: 'center',
        render: (_, item) => (
          item.senseType == 1 ? '标题' : '属性'
        )
    },
    {
        title: '创建时间',
        key: 'createTime',
        width: 240,
        align: 'center',
        render: (_, item) => (
          secondTimeFormat(item.createTime)
        )
    },
    {
        title: '更新时间',
        key: 'updateTime',
        width: 240,
        align: 'center',
        render: (_, item) => (
          secondTimeFormat(item.updateTime)
        )
    },
    {
        title: '操作',
        key: 'action',
        width: 140,
        fixed: 'right',
        align: 'center',
        render: (text, row) => {
            return <Space size="middle">
            <a onClick={() => handleEdit('sensitive', row)}>编辑</a>
            <a onClick={() => handleDel('sensitive', row)}>删除</a>
            </Space>
        }
    }
  ];

  const synonymTable = []
  const sensitiveTable = []
  const { TabPane } = Tabs;
  //同义词
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [pageNum, setPageNum] = useState(1)
  const [synonymTableData, setSynonymTableData] = useState(synonymTable)
  const addWrodsRef = useRef()
  //敏感词
  const [sensitivePagesize, setSensitivePageSize] = useState(20)
  const [sensitivePageNum, setSensitivePageNum] = useState(1)
  const [sensitiveTotal, setSensitiveTotal] = useState(0)
  const [sensitiveTableData, setsSnsitiveTableData] = useState(sensitiveTable)
  const addSensitiveWordsRef=useRef()
  const [countryLanage, setCountryLanage] = useState([])
  //formRef
  const synonymFormRef = React.createRef()
  const sensitiveFormRef = useRef()
  const changeCurrentSize = useCallback((page, pagesize, type) => {
        if (type === 'sensitive') {
            setSensitivePageNum(page)
            setSensitivePageSize(pagesize)
            getSensitiveDataList({
                pageSize: pagesize,
                pageNum: page
            })
        } else {
            setPageNum(page)
            setPageSize(pagesize)
            getSynonymWordsList({
                pageSize: pagesize,
                pageNum: page
            })
        }
  },[])

  const changeWords = useCallback((keys) => {
    if (keys === 'synonym') {
      getSynonymWordsList({
        page: {
        pageNum: 1,
        pageSize: 10
    }})
    } else {
        getSensitiveDataList({
            pageNum: 1,
            pageSize: 10
        })
    }
  }, [])

  const handleEdit = useCallback((type, row) => {
    if (type === 'synonym') {
        if (addWrodsRef.current) {
            row.type = 2 // 1 新增 2 修改
            addWrodsRef.current.changeDefault(row)
            addWrodsRef.current.changeVal(true)
        }
    } else {
        if (addSensitiveWordsRef.current) {
            row.type = 2 // 1 新增 2 修改
            addSensitiveWordsRef.current.changeDefault(row)
            addSensitiveWordsRef.current.changeVal(true)
        }
    }
  }, [])

  const handleDel = useCallback((type, row) => {
    if (type === 'synonym') {
        confirm({
            title: '删除',
            content: '是否删除同义词',
            onOk() {
                synonymWordsDelete({
                    id: row.id
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getSynonymWordsList()
                    }
                })
            }
        })
    } else {
        confirm({
            title: '删除',
            content: '是否删除敏感词',
            onOk() {
                sensitiveWordsDelete({
                    id: row.id
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                        getSensitiveDataList()
                    }
                })
            }
        })
    }
  }, [])
  
  //请求同义词数据接口
  const getSynonymWordsList = useCallback(() => {
    var params = {
        pageSize: pageSize,
        pageNum: pageNum,
        leftWordList: [],
        rightWordList: []
    }
    if(synonymFormRef.current){
      let currentValue = synonymFormRef.current.getFieldsValue()
      if (currentValue) {
        params = Object.assign({}, params, currentValue)
        if (currentValue.leftWordStr) {
          params.leftWordList = currentValue.leftWordStr.split(',')
        }
        if (currentValue.rightWordStr) {
          params.rightWordList = currentValue.rightWordStr.split(',')
        }
      } else {
        console.log('error,submit')
      }
    }
    synonymWordsList(params).then(res => {
      if (res.ret.errCode == 0) {
        setSynonymTableData(res.data.synonymWordsPbList)
        setTotal(res.data.total)
      }
    }).catch(error => {
      console.log(error)
    })
  })

    const handleAdd = useCallback((type) => {
        if (type === 'synonym') {
            if (addWrodsRef.current) {
                addWrodsRef.current.changeVal(true)
                addWrodsRef.current.changeDefault()
            }
        } else {
            if (addSensitiveWordsRef.current) {
                addSensitiveWordsRef.current.changeVal(true)
                addSensitiveWordsRef.current.changeDefault()
            }
        }
    }, [])

    // 敏感词列表
    const getSensitiveDataList = useCallback(() => {
        let param = {
            pageSize: sensitivePagesize,
            pageNum: sensitivePageNum,
            senseType: null
        }
        if(sensitiveFormRef.current){
          let currentValue = sensitiveFormRef.current.getFieldsValue()
          if (currentValue) {
            param = Object.assign(param, currentValue)
            if (currentValue.wordStr) {
              param.wordList = currentValue.wordStr.split(',')
            }
            delete param.wordStr
          }
        }
        sensitiveWordsList(param).then(res => {
            if (res.ret.errCode === 0) {
                setsSnsitiveTableData(res.data.sensitiveWordsPbList)
                setSensitiveTotal(res.data.total)
            }
        })
    }, [sensitivePagesize, sensitivePageNum])

    // 确认保存
    const handleConfirm = useCallback((type, data) => {
        if (type === 'synonym') {
            synonymWordsAddOrEdit(data).then(res => {
                if (res.ret.errCode === 0) {
                    if (addWrodsRef.current) {
                        addWrodsRef.current.changeVal(false)
                    }
                    if (data.id) {
                        message.success('修改同义词成功')
                    } else {
                        message.success('新增同义词成功')
                    }
                    getSynonymWordsList()
                }
            })
        } else {
            sensitiveWordsAddOrEdit(data).then(res => {
                if (res.ret.errCode === 0) {
                    if (addSensitiveWordsRef.current) {
                        addSensitiveWordsRef.current.changeVal(false)
                    }
                    if (data.id) {
                        message.success('修改敏感词成功')
                    } else {
                        message.success('新增敏感词成功')
                    }
                    getSensitiveDataList()
                }
            })
        }
    }, [])


  //得到语种
  useEffect(() => {
    let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
    setCountryLanage(countryCodeLists)
    getSynonymWordsList()
  }, [])

  return (
    <ViewContainer>
      <div className={styles['container']}>
        <Tabs onChange={changeWords} type="card" defaultActiveKey="synonym">
          //  同义词
          <TabPane tab="同义词" key="synonym">
            <Form
              initialValues={{
                leftWordStr: "",
                rightWordStr: "",
                languageCode: ""
              }}
              name="complex-form"
              layout="inline" style={{ marginBottom: "20px" }}
              ref={synonymFormRef}>
              <Form.Item label="目标词：" name="leftWordStr">
                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
              </Form.Item>
              <Form.Item label="同义词：" name="rightWordStr" >
                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
              </Form.Item>
              <Form.Item label="语种：" name="languageCode" >
                <Select placeholder="请选择" className={styles['form-item-input']} allowClear>
                  {
                    countryLanage.map(item => {
                      return <Option key={item.code} value={item.code}>{item.desc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label=" " colon={false}>
                <Button type="primary" style={{ marginRight: 10 }} onClick={getSynonymWordsList}>搜索</Button>
                <Button>重置</Button>
              </Form.Item>
            </Form>
            <div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                style={{ marginBottom: 10 }} onClick={() => handleAdd('synonym')}>新增</Button>
            </div>
            <Table bordered 
                rowKey={record => record.id}
                columns={columns} dataSource={synonymTableData} pagination={false} />
            <Pagination
                style={{ textAlign: 'right', marginTop: 20 }}
              total={total}
              current={pageNum}
              pageSize={pageSize}
              showTotal={total => `共 ${total} 数据`}
              onChange={(page, pagesize) => changeCurrentSize(page, pagesize, 'synonym')}
              pageSizeOptions={[10, 20, 50, 100]}
              showQuickJumper={false}
              showSizeChanger
            />
          </TabPane>

          //敏感词
          <TabPane tab="敏感词" key="sensitive">
            <Form name="complex-form" layout="inline" style={{ marginBottom: "20px" }} ref={sensitiveFormRef}>
              <Form.Item label="敏感词：" name="wordStr">
                <Input placeholder="多个请用英文逗号,隔开" className={styles['form-item-input']} allowClear />
              </Form.Item>
              <Form.Item label="语种：" name="languageCode" >
                <Select placeholder="请选择" className={styles['form-item-input']} allowClear>
                  {
                    countryLanage.map(item => {
                      return <Option key={item.code} value={item.code}>{item.desc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="敏感对象：" name="senseType">
                <Select placeholder="请选择" className={styles['form-item-input']} allowClear>
                  <Option key={1} value={1}>标题</Option>
                  <Option key={2} value={2}>属性</Option>
                </Select>
              </Form.Item>
              <Form.Item label=" " colon={false}>
                <Button type="primary" style={{ marginRight: 10 }} onClick={getSensitiveDataList}>搜索</Button>
                <Button>重置</Button>
              </Form.Item>
            </Form>
            <div>
              <Button type="primary"  icon={<PlusOutlined />} style={{ marginBottom: 10 }} onClick={() => handleAdd('sensitive')}>新增</Button>
            </div>
            <Table bordered rowKey={record => record.id} columns={columns1} dataSource={sensitiveTableData} pagination={false} />
            <Pagination
                current={sensitivePageNum}
                total={sensitiveTotal}
                style={{ textAlign: 'right', marginTop: 20 }}
                pageSize={sensitivePagesize}
                showTotal={sensitiveTotal => `共 ${sensitiveTotal} 数据`}
                onChange={(page, pagesize) => changeCurrentSize(page, pagesize, 'sensitive')}
                pageSizeOptions={[10, 20, 50, 100]}
                showQuickJumper
                showSizeChanger
            />
          </TabPane>
        </Tabs>
        {/* 同义词 */}
      <AddWords ref={addWrodsRef} onConfirm={handleConfirm}></AddWords>
      {/* 敏感词 */}
      <AddSensitiveWords ref={addSensitiveWordsRef} onConfirm={handleConfirm}></AddSensitiveWords>
      </div>
    </ViewContainer>
  )
}

export default WrodsManage;