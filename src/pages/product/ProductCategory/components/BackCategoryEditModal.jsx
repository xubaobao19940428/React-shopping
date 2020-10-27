import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Form, Select, Input, Upload, message } from 'antd'
import { dealShowFileSrc } from '@/utils/utils'
import { LoadingOutlined, PlusOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { request } from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'
import { productAttrGetById, batchGetProductAttr, productAttrGet } from '@/services/product1'
import styles from './styles/BackCategoryEditModal.less'
import { DragTable } from '@/components'
import { objectMapToArray } from '@/utils/index'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
}
const BackCategoryEditModal = (props) => {
    const { showModal, type, parentCategoryList, item, onCancel, onConfirm, languages, productAttrlist, confirmLoading } = props
    const [loading, setLoading] = useState(false)
    const [curValues, setCurValues] = useState({})
    const [paramAttrList, setParamAttrList] = useState([])
    const [standardAttrList, setStandardAttrList] = useState([])
    const [paramOptions, setParamOptions] = useState([]) // 列表值会存在查询匹配出来的
    const [standardOptions, setStandardOptions] = useState([])
    const [paramLoading, setParamLoading] = useState(false)
    const [standardLoading, setStandardLoading] = useState(false)
    const paramColumns = [{
        title: "属性ID",
        dataIndex: 'attrId',
        fixed: 'left',
        width: 100,
        align: 'center'
    }, {
        title: "中文cn",
        dataIndex: 'cn',
        width: 100,
        align: 'center'
    }, {
        title: '英文en',
        dataIndex: 'en',
        width: 100,
        align: 'center'
    }, {
        title: '马来语ms',
        dataIndex: 'ms',
        width: 100,
        align: 'center'
    }, {
        title: '泰语th',
        dataIndex: 'th',
        width: 100,
        align: 'center'
    }, {
        title: '自定义',
        dataIndex: 'customize',
        width: 100,
        align: 'center'
    }, {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (text, item, index) => (
            <>
                <MenuOutlined style={{ marginRight: 8, color: '#409eff' }}/>
                <CloseOutlined onClick={() => handleDel('param', index)} style={{ marginRight: 8, color: '#409eff' }}/>
            </>
        )
    }]

    const standardColumns = [{
        title: "属性ID",
        dataIndex: 'attrId',
        fixed: 'left',
        width: 100,
        align: 'center'
    }, {
        title: "中文cn",
        dataIndex: 'cn',
        width: 100,
        align: 'center'
    }, {
        title: '英文en',
        dataIndex: 'en',
        width: 100,
        align: 'center'
    }, {
        title: '马来语ms',
        dataIndex: 'ms',
        width: 100,
        align: 'center'
    }, {
        title: '泰语th',
        dataIndex: 'th',
        width: 100,
        align: 'center'
    }, {
        title: '自定义',
        dataIndex: 'customize',
        width: 100,
        align: 'center'
    }, {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (text, item, index) => (
            <>
                <MenuOutlined style={{ marginRight: 8, color: '#409eff' }}/>
                <CloseOutlined onClick={() => handleDel('standard', index)} style={{ marginRight: 8, color: '#409eff' }}/>
            </>
        )
    }]

    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    useEffect(() => {
        let temp = { ...item }
        console.log(temp)
        setCurValues(temp)
        setStandardOptions(productAttrlist || [])
        setParamOptions(productAttrlist || [])
        let param = {}
        param.paramAttrIdList = temp.paramAttrId ? temp.paramAttrId.split(',') : null
        param.standardAttrIdList = temp.standardAttrId ? temp.standardAttrId.split(',') : null
        param.filterHiddenAttrValue = true
        // 类目与属性绑定了，则获取数据
        if (param.paramAttrIdList || param.standardAttrIdList) {
            getBatchAttr(param)
        } else {
            setParamAttrList([])
            setStandardAttrList([])
        }
    }, [showModal])

    const getBatchAttr = useCallback((data) => {
        batchGetProductAttr(data).then(res => {
            if (res.ret.errCode === 0) {
                let paramAttrList = res.data.paramAttrList
                paramAttrList.forEach(item => {
                    item.attrNameList.forEach(lang => {
                        item[lang.languageCode] = lang.name
                    })
                    item.customize = item.customize === 1 ? '允许' : '禁止'
                })
                let standardAttrList = res.data.standardAttrList
                standardAttrList.forEach(item => {
                    item.attrNameList.forEach(lang => {
                        item[lang.languageCode] = lang.name
                    })
                    item.customize = item.customize === 1 ? '允许' : '禁止'
                })
                setParamAttrList(paramAttrList)
                setStandardAttrList(standardAttrList)
            }
        })
    })

    function handleUpload (reqInfo) {
        setLoading(true)
        const formData = new FormData();
        let fileInfo = {
            fileName: reqInfo.file.name,
            type: 'product'
        }
        formData.append('file', reqInfo.file);
        formData.append('param', JSON.stringify(fileInfo));
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            setLoading(false)
            let temp = {...curValues}
            temp.cover = res.original_link
            setCurValues(temp)
        }).catch(err => {})
    }

    function handleDel (type, index) {
        if (type === 'param') {
            let temp = [...paramAttrList]
            temp.splice(index, 1)

            setParamAttrList(temp)
        } else {
            let temp = [...standardAttrList]
            temp.splice(index, 1)

            setStandardAttrList(temp)
        }
    }

    const handleParamSeatch = useCallback((type, val) => {
        getSearchAttr(val, type)
    })

    const getSearchAttr = useCallback((data, type) => {
        let params = {
            attrNameKey: data,
            attrNameLanguageCode: 'cn',
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }
        productAttrGet(params).then((res) => {
            if (res.ret.errCode === 0) {
                if (type === 'param') {
                    setParamOptions(res.data.productAttrList)
                } else {
                    setStandardOptions(res.data.productAttrList)
                }
            }
        })
    })

    const handleSortChange = useCallback((list, type) => {
        if (type === 'param') {
            setParamAttrList(list)
        } else {
            setStandardAttrList(list)
        }
    })

    const handleRemove = useCallback(() => {
        let temp = {...curValues}
        temp.cover = ''
        setCurValues(temp)
    })

    const onFinish = useCallback((values) => {
        if (!curValues.nameObj.cn || !curValues.nameObj.en) {
            message.error('类目的中英文必填')
            return
        }

        let resParam = Object.assign({}, curValues, values)
        resParam.cateNameValueList = objectMapToArray(resParam.nameObj, 'languageCode', 'name')
        let paramAttrId = ''
        let standardAttrId = ''
        delete resParam.nameObj
        paramAttrList.forEach((item, index) => {
            if (index == 0) {
                paramAttrId = item.attrId
            } else {
                paramAttrId += `,${item.attrId}`
            }
        })
        standardAttrList.forEach((item, index) => {
            if (index == 0) {
                standardAttrId = item.attrId
            } else {
                standardAttrId += `,${item.attrId}`
            }
        })

        resParam.standardAttrId = standardAttrId
        resParam.paramAttrId = paramAttrId

        onConfirm(resParam)
    })

    const handleParamSelect = useCallback((type, val) => {
        let item = {}
        if (type === 'param') {
            item = paramOptions.find(attr => attr.attrId == val)
        } else {
            item = standardOptions.find(attr => attr.attrId == val)
        }
        let resItem = {
            attrId: item.attrId,
            customize: item.customize === 1 ? '允许' : '禁止',
            cn: item.attrName
        }
        item.attrNameCodeList.forEach(name => {
            resItem[name.languageCode] = name.name
        })

        if (!item) return
        if (type === 'param') {
            let list = [...paramAttrList]
            let exist = list.findIndex(a => a.attrId === item.attrId)
            if (exist === -1) {
                list.push(resItem)
                setParamAttrList(list)
            }
        } else {
            let list = [...standardAttrList]
            let exist = list.findIndex(a => a.attrId === item.attrId)

            if (exist === -1) {
                list.push(resItem)

                setStandardAttrList(list)
            }
        }
    })

    const onNameChange = useCallback((code, e) => {
        let temp = { ...curValues }
        temp.nameObj[code] = e.target.value

        setCurValues(temp)
    })
    
    return (
        <Modal
            maskClosable={false}
            destroyOnClose
            width={800}
            visible={showModal}
            title={type === 'add' ? '新增后台类目' : '编辑后台类目'}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
            okButtonProps={{ htmlType: 'submit', form: 'backCategoryEditForm'}}
        >
            <Form initialValues={item} id="backCategoryEditForm" {...formItemLayout} onFinish={onFinish}>
                <Form.Item label="类目名" required>
                    <table className={styles.tableBox}>
                        <tbody>
                            {
                                languages.map(lang => 
                                    <tr key={lang.code}>
                                        <th>{(lang.code == 'cn' || lang.code == 'en') && <span className={styles.required}>*</span>}{lang.desc}</th>
                                        <td>
                                            <Input 
                                                defaultValue={item.nameObj ? item.nameObj[lang.code] : ''}
                                                onChange={(e) => onNameChange(lang.code, e)}
                                                allowClear size="medium" placeholder="请输入类目名" maxLength="30"/>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </Form.Item>
                {
                    item.level !== 1 && <Form.Item label="父类名" required name="pid">
                        <Select disabled={type === 'add'}>
                            {
                                parentCategoryList.map(item => 
                                    <Select.Option key={item.cateId} value={item.cateId}>{item.cateName}</Select.Option>    
                                )
                            }
                        </Select>
                    </Form.Item>
                }
                <Form.Item label="类目级别" name="level">
                    {item.level === 1 && <span>一级类目</span>}
                    {item.level === 2 && <span>二级类目</span>}
                    {item.level === 3 && <span>三级类目</span>}
                </Form.Item>
                <Form.Item label="类目图" extra="尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式">
                    <Upload
                        listType="picture-card"
                        customRequest={handleUpload}
                        showUploadList={false}
                        onRemove={handleRemove}
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    >
                        {curValues.cover ? <img src={dealShowFileSrc(curValues.cover)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item label="分类描述" name="desc">
                    <Input/>
                </Form.Item>
                <Form.Item label="参数属性">
                    <Select onChange={(val) => handleParamSelect('param', val)}
                        onSearch={(val) => handleParamSeatch('param', val)}
                        showSearch={true}
                    >
                        {
                            paramOptions.map(attr => 
                            <Select.Option key={attr.attrId} value={attr.attrId}>{attr.attrName}</Select.Option>    
                            )
                        }
                    </Select>
                    <DragTable 
                        style={{ marginTop: 8 }}
                        scroll={{ x: '100%' }}
                        columns={paramColumns}
                        dataSource={paramAttrList}
                        change={(list) => handleSortChange(list, 'param')}
                        pagination={{hideOnSinglePage: true}}
                        rowKey="attrId"
                    />
                </Form.Item>
                <Form.Item label="规格属性">
                    <Select onChange={(val) => handleParamSelect('standard', val)}
                        onSearch={(val) => handleParamSeatch('standard', val)}
                        showSearch={true}
                    >
                        {
                            standardOptions.map(attr => 
                            <Select.Option key={attr.attrId} value={attr.attrId}>{attr.attrName}</Select.Option>    
                            )
                        }
                    </Select>
                    <DragTable 
                        style={{ marginTop: 8 }}
                        scroll={{ x: '100%' }}
                        columns={standardColumns}
                        dataSource={standardAttrList}
                        change={(list) => handleSortChange(list, 'standard')}
                        pagination={{hideOnSinglePage: true}}
                        rowKey="attrId"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(BackCategoryEditModal)