import React, {useState, useEffect} from 'react'
import { Modal, Form, Checkbox, Radio, Button, Select, Input, DatePicker, message, Table } from 'antd'
import { UploadImageByLangModal } from '@/components'
import { dealShowFileSrc } from '@/utils/utils'
import moment from 'moment'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
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
const HotSearchModal = (props) => {
    const { showModal, modalData, onClose, onConfirm, countries, languages, OPEN_TYPE_LIST, APP_PAGE_ENUM } = props 
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false)
    const [curOpenType, setCurOpenType] = useState(1)
    const [curName, setCurName] = useState({})
    const [APPType, setAppType] = useState('')
    const [H5Url, setH5Url] = useState('')

    useEffect(() => {
        setShowImages(modalData.icon || {})
        setCurOpenType(modalData.openType || 1)
        setCurName(modalData.name || [])
        if (modalData.openType == 2) {
            setAppType(modalData.url)
        } else if (modalData.openType == 1) {
            setH5Url(modalData.url || '')
        }
    }, [showModal])

    const columns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (text, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (text, item) => (
            <Input value={curName[item.code]} onChange={(e) => handleNameChange(e, item)}/>
        )
    }]

    function handleCancel () {
        onClose()
    }

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.icon = showImages
        data.openType = curOpenType
        data.name = curName
        data.startTime = moment(data.startTime).valueOf()
        data.endTime = moment(data.endTime).valueOf()
        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        } 

        if (curOpenType == 2) {
            data.url = APPType
        } else if (curOpenType == 1) {
            data.url = H5Url
        } else {
            data.url = ''
        }

        if (!data.name || !data.name.cn || !data.name.en) {
            message.error('热搜词的中英文必填')
            return
        }
        
        onConfirm(data)
    }

    function handleTypeChange (e) {
        setCurOpenType(e.target.value)
    }

    function handleUrlChange (val) {
        setAppType(val)
    }

    function handleH5UrlChange (e) {
        setH5Url(e.target.value)
    }

    function handleNameChange (e, item) {
        let temp = { ...curName }
        temp[item.code] = e.target.value

        setCurName(temp)
    }

    return (
        <div className="hot-search-wrapper">
            <Modal
                destroyOnClose
                title={modalData.id ? '修改热搜词' : '新增热搜词'}
                visible={showModal}
                onCancel={handleCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'hotSearchForm'}}
            >
                <Form id="hotSearchForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="countryCode" label="适用国家"
                        rules={[{
                            required: true,
                            message: '国家不能为空'
                        }]}
                    >
                        <Select>
                            {
                                countries.map((item) => (
                                    <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="openType" label="跳转类型"
                        rules={[{
                            required: true,
                            message: '必选'
                        }]}
                    >
                        <Radio.Group onChange={handleTypeChange}>
                            {
                                OPEN_TYPE_LIST.map(radio => (
                                <Radio value={radio.key} key={radio.key}>{radio.name}</Radio>
                                ))
                            }
                        </Radio.Group>
                    </Form.Item>
                    {
                        [1,2].includes(curOpenType) && <Form.Item name="url" label="跳转链接">
                            {
                                curOpenType == 1 && 
                                <Input defaultValue={H5Url} onChange={handleH5UrlChange}/>
                            }
                            {
                                curOpenType == 2 && 
                                <Select onChange={handleUrlChange} defaultValue={APPType}>
                                    {
                                        APP_PAGE_ENUM.map((urlItem) => (
                                            <Select.Option value={urlItem.key} key={urlItem.key}>{urlItem.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            }
                        </Form.Item>
                    }
                    <Form.Item name="icon" label="热搜词图标">
                        {
                            showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item label="热搜词" required>
                        <Table
                            rowKey={record => record.code}
                            bordered
                            columns={columns}
                            dataSource={languages}
                            pagination={{hideOnSinglePage: true}}
                            scroll={{ y: 160 }}
                        ></Table>
                    </Form.Item>
                    <Form.Item name="startTime" label="开始时间"
                        rules={[{
                            required: true,
                            message: '热搜词开始时间不能为空'
                        }]}
                    >
                        <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入开始时间"/>
                    </Form.Item>
                    <Form.Item name="endTime" label="结束时间"
                        rules={[{
                            required: true,
                            message: '广告结束时间不能为空'
                        }]}
                    >
                        <DatePicker showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} placeholder="请输入结束时间"/>
                    </Form.Item>
                </Form>
            </Modal>

            <UploadImageByLangModal 
                show={uploadModal}
                onSure={(images) => {
                    setUploadModal(false);
                    let icon = {}
                    images.forEach(item => {
                        icon[item.languageCode] = item.name
                    })
                    setShowImages(icon);
                }}
                onClose={() => setUploadModal(false)}
                images={modalData.iconList}
            />
        </div>
    )
}

export default React.memo(HotSearchModal)