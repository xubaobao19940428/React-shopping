import React, { useState, useEffect } from 'react'
import { Modal, Form, Select, DatePicker, Input, Table, Radio, Button, message } from 'antd'
import { UploadImageByLangModal } from '@/components'
import { dealShowFileSrc } from '@/utils/utils'

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

const ServiceToolsModal = (props) => {
    const { showModal, modalData, countryList, onCancel, onConfirm, languages, OPEN_TYPE_LIST, SERVICE_STATUS_LIST, SERVICE_TOOLS_ENUM } = props 
    const [curName, setCurName] = useState({})
    const [curOpenType, setCurOpenType] = useState(1)
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false)
    const [H5Url, setH5Url] = useState('')
    const [APPType, setAppType] = useState('')

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

    function handleNameChange (e, item) {
        let temp = { ...curName }
        temp[item.code] = e.target.value

        setCurName(temp)
    }

    function handleUrlChange (val) {
        setAppType(val)
    }

    function handleTypeChange (e) {
        setCurOpenType(e.target.value)
    }

    function handleH5UrlChange (e) {
        setH5Url(e.target.value)
    }

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.icon = showImages
        data.openType = curOpenType
        data.name = curName
        
        if (curOpenType == 2) {
            data.url = APPType
            if (!APPType) {
                message.error('跳转链接不能为空')
                return
            }
        } else if (curOpenType == 1) {
            data.url = H5Url
            if (!H5Url) {
                message.error('跳转链接不能为空')
                return
            }
        } else {
            data.url = ''
        }

        if (!data.name || !data.name.cn || !data.name.en) {
            message.error('中英文必填')
            return
        }

        if (!data.icon || !data.icon.cn || !data.icon.en) {
            message.error('图片必传')
            return
        }

        onConfirm(data)
    }

    return (
        <div>
            <Modal
                destroyOnClose
                title="服务与工具"
                visible={showModal}
                onCancel={onCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'serviceToolsForm'}}
            >
                <Form id="serviceToolsForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="moduleId" label="选择国家"
                        rules={[{
                            required: true,
                            message: '国家不能为空'
                        }]}
                    >
                        <Select disabled={modalData.id}>
                            {
                                countryList.map((item) => (
                                    <Select.Option value={item.id} key={item.id}>{item.countryName}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="名称"
                        rules={[{
                            required: true,
                            message: '名称不能为空'
                        }]}
                    >
                        <Table
                            rowKey={record => record.code}
                            bordered
                            columns={columns}
                            dataSource={languages}
                            pagination={{hideOnSinglePage: true}}
                            scroll={{ y: 160 }}
                        ></Table>
                    </Form.Item>
                    <Form.Item name="openType" label="跳转类型"
                        rules={[{
                            required: true,
                            message: '跳转类型不能为空'
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
                    <Form.Item name="url" label="跳转链接">
                        {
                            curOpenType == 1 && 
                            <Input defaultValue={H5Url} onChange={handleH5UrlChange}/>
                        }
                        {
                            curOpenType == 2 && 
                            <Select onChange={handleUrlChange} defaultValue={APPType}>
                                {
                                    Object.keys(SERVICE_TOOLS_ENUM).map((urlItem) => (
                                        <Select.Option value={urlItem} key={urlItem}>{SERVICE_TOOLS_ENUM[urlItem]}</Select.Option>
                                    ))
                                }
                            </Select>
                        }
                    </Form.Item>
                    <Form.Item name="icon" label="图标" extra="建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。">
                        {
                            showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item name="status" label="状态"
                        rules={[{
                            required: true,
                            message: '状态不能为空'
                        }]}
                    >
                        <Radio.Group>
                            {
                                SERVICE_STATUS_LIST.map(radio => (
                                <Radio value={parseInt(radio.key)} key={radio.key}>{radio.name}</Radio>
                                ))
                            }
                        </Radio.Group>
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

export default React.memo(ServiceToolsModal)