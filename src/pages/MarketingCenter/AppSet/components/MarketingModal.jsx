import react, { useState, useEffect } from 'react'
import { Modal, Form, Input, Radio, Select, Button, DatePicker, message } from 'antd'
import { dealShowFileSrc } from '@/utils/utils'
import { UploadImageByLangModal } from '@/components'
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
const MarketingModal = (props) => {
    const { countries, modalData, onClose, onConfirm, showModal, APP_PAGE_ENUM, OPEN_TYPE_LIST } = props
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false)
    const [openType, setOpenType] = useState(modalData.openType ? modalData.openType : 1)

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.startTime = moment(data.startTime).valueOf()
        data.endTime = moment(data.endTime).valueOf()
        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        }
        data.type = modalData.type || 2
        data.icon = showImages
        if (!data.icon && !data.icon.cn && !data.icon.en) {
            message.error('图片必传')
            return
        }

        delete data.timeList

        onConfirm(data)
    }

    // 切换跳转类型
    function openTypeChange(e) {
        setOpenType(e.target.value)
    }

    useEffect(() => {
        setShowImages(modalData.icon || {})
    }, [showModal])

    function handleCancel () {
        onClose()
    }

    return (
        <div className="marketing-modal-wrapper">
            <Modal
                destroyOnClose
                title="营销浮窗"
                visible={showModal}
                onCancel={handleCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'marketingModelForm'}}
            >
                <Form id="marketingModelForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="countryCode" label="国家"
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
                    <Form.Item name="name" label="浮窗名称"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="openType" label="跳转类型"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Radio.Group onChange={openTypeChange}>
                            {
                                OPEN_TYPE_LIST.map((item) => {
                                    return <Radio value={item.key} key={item.key}>{item.name}</Radio>
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="url" label="跳转链接"
                               rules={[{
                                   required: true,
                                   message: '不能为空'
                               }]}
                               hidden={openType === 2}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="url" label="跳转链接"
                               rules={[{
                                   required: true,
                                   message: '不能为空'
                               }]}
                               hidden={openType === 1}>
                        <Select>
                            {
                                Object.keys(APP_PAGE_ENUM).map((key) => {
                                    return <Select.Option value={key} key={key}>{APP_PAGE_ENUM[key]}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="icon" label="浮窗图标">
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
                            message: '不能为空'
                        }]}
                    >
                        <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入开始时间"/>
                    </Form.Item>
                    <Form.Item name="endTime" label="结束时间"
                        rules={[{
                            required: true,
                            message: '不能为空'
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

export default React.memo(MarketingModal)
