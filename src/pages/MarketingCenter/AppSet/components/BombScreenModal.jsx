import React, {useState, useEffect} from 'react'
import { Modal, Form, Input, Radio, Select, DatePicker, Button, message } from 'antd'
import { UploadImageByLangModal } from '@/components'
import { dealShowFileSrc } from '@/utils/utils'
import moment from 'moment'

const { RangePicker } = DatePicker
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
const BombScreenModal = (props) => {
    const { countries, SHOW_TYPE_LIST, OPEN_TYPE_LIST, APP_PAGE_ENUM, modalData, onClose, onConfirm, showModal } = props
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false)
    const [openType, setOpenType] = useState(modalData.openType ? modalData.openType : 1)


    // 切换跳转类型
    function openTypeChange(e) {
        setOpenType(e.target.value)
    }

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.startTime = moment(data.timeList[0]).valueOf()
        data.endTime = moment(data.timeList[1]).valueOf()
        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        }
        data.type = modalData.type || 1
        data.icon = showImages
        if (!data.icon || !data.icon.cn || !data.icon.en) {
            message.error('图片必传')
            return
        }

        delete data.timeList

        onConfirm(data)
    }

    useEffect(() => {
        setShowImages(modalData.icon || {})
        setOpenType(modalData.openType || 1)
    }, [showModal])

    function handleCancel () {
        onClose()
    }

    return (
        <div className="bomb-screen-modal-wrapper">
            <Modal
                destroyOnClose
                title="弹窗广告"
                visible={showModal}
                onCancel={handleCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'bombScreenForm'}}
            >
                <Form id="bombScreenForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="name" label="弹窗名称"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="timeList" label="弹窗效期"
                        extra="按照所选站点的当地时间填写"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                    </Form.Item>
                    <Form.Item name="showType" label="弹出频率"
                        rules={[{
                            required: true,
                            message: '不能为空'
                        }]}
                    >
                        <Radio.Group>
                            {
                                SHOW_TYPE_LIST.map((radioItem) => (
                                    <Radio value={radioItem.key} key={radioItem.key }>{radioItem.name}</Radio>
                                ))
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="icon" label="弹窗图片" extra="大小2M以下；支持jpg、jpeg、png；只能上传一张图片。">
                        {
                            showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
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

export default React.memo(BombScreenModal)
