import React, {useState, useEffect} from 'react'
import { Modal, Form, Input, Radio, Select, DatePicker, Button, message } from 'antd'
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

const CategoryOperationModal = (props) => {
    const { showModal, modalData, countryList, onCancel, onConfirm, OPEN_TYPE_LIST, categoryListLevelOne, APP_PAGE_ENUM } = props
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false)
    const [curOpenType, setCurOpenType] = useState(1)
    const [APPType, setAppType] = useState('')
    const [H5Url, setH5Url] = useState('')

    useEffect(() => {
        setShowImages(modalData.icon || {})
        setCurOpenType(modalData.openType || 1)
        if (modalData.openType == 2) {
            setAppType(modalData.url)
        } else if (modalData.openType == 1) {
            setH5Url(modalData.url || '')
        }
    }, [showModal])

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.startTime = moment(data.startTime).valueOf()
        data.endTime = moment(data.endTime).valueOf()
        data.name = JSON.stringify({cn: data.name})
        data.extJson = JSON.stringify({cateId: data.cateId})
        data.icon = showImages

        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        } 

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

        if (!data.icon || !data.icon.cn || !data.icon.en) {
            message.error('图片必传')
            return
        }

        onConfirm(data)
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

    return (
        <div>
            <Modal
                destroyOnClose
                title="类目运营"
                visible={showModal}
                onCancel={onCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'categoryOperationForm'}}
            >
                <Form id="categoryOperationForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="moduleId" label="国家"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Select>
                            {
                                countryList.map((item) => (
                                    <Select.Option value={item.id} key={item.id}>{item.countryName}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="标题"
                        rules={[{
                            required: true,
                            message: '标题不能为空'
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="cateId" label="关联一级类目" 
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Select>
                            {
                                categoryListLevelOne.map(category => (
                                <Select.Option value={category.cateId} key={category.cateId}>{category.cateName}</Select.Option>
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
                    <Form.Item name="url" label="跳转链接">
                        {
                            curOpenType == 1 && 
                            <Input defaultValue={H5Url} onChange={handleH5UrlChange}/>
                        }
                        {
                            curOpenType == 2 && 
                            <Select onChange={handleUrlChange} defaultValue={APPType}>
                                {
                                    Object.keys(APP_PAGE_ENUM).map((urlItem) => (
                                        <Select.Option value={urlItem} key={urlItem}>{APP_PAGE_ENUM[urlItem]}</Select.Option>
                                    ))
                                }
                            </Select>
                        }
                    </Form.Item>
                    <Form.Item name="icon" label="类目Banner">
                        {
                            showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item name="startTime" label="开始时间"
                        rules={[{
                            required: true,
                            message: '开始时间不能为空'
                        }]}
                    >
                        <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入开始时间"/>
                    </Form.Item>
                    <Form.Item name="endTime" label="结束时间"
                        rules={[{
                            required: true,
                            message: '结束时间不能为空'
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

export default React.memo(CategoryOperationModal)