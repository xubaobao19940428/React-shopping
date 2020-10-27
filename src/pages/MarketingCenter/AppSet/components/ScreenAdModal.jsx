import {useState, useEffect} from 'react'
import { Modal, Form, Select, Input, DatePicker, message, Button } from 'antd'
import { UploadImageByLangModal } from '@/components'
import { dealShowFileSrc } from '@/utils/utils'
import validator from 'validator'
import moment from 'moment'

const { Option } = Select
const ScreenAdModal = (props) => {
    const { countries, modalData, showModal, onClose, onConfirm } = props
    const [showImages, setShowImages] = useState({})
    const [uploadModal, setUploadModal] = useState(false);

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

    useEffect(() => {
        setShowImages(modalData.icon || {})
    }, [showModal])

    function handleCancel () {
        onClose()
    }

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.startTime = moment(data.startTime).valueOf()
        data.endTime = moment(data.endTime).valueOf()
        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        } 
        data.icon = showImages
        if (!data.icon || !data.icon.cn || !data.icon.en) {
            message.error('图片必传')
            return
        }
        
        onConfirm(data)
    }
    
    return (
        <div className="screen-ad-modal-wrapper">
            <Modal 
                destroyOnClose
                title="闪屏广告"
                visible={showModal}
                onCancel={handleCancel}
                maskClosable={false}
                okButtonProps={{ htmlType: 'submit', form: 'screenAdForm'}}
            >
                <Form id="screenAdForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    <Form.Item name="countryCode" label="国家"
                        rules={[{
                            required: true,
                            message: '国家不能为空'
                        }]}
                    >
                        <Select>
                            {
                                countries.map((item) => (
                                    <Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="广告标题"
                        rules={[{
                            required: true,
                            message: '标题不能为空'
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="url" label="广告URL地址"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (value && value.length && !validator.isURL(value, { require_protocol: true })) {
                                        return Promise.reject('广告 Url 格式不正确')
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            })
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item label="广告图" extra="建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。" required>
                        {
                            showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                setUploadModal(true)
                            }}/>) : (<Button onClick={() => {
                                setUploadModal(true)
                            }} type="link">添加图片</Button>)
                        }
                    </Form.Item>
                    <Form.Item label="广告开始时间" name="startTime"
                        rules={[{
                            required: true,
                            message: '广告开始时间不能为空'
                        }]}
                    >
                        <DatePicker 
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            placeholder="请输入开始时间"/>
                    </Form.Item>
                    <Form.Item label="广告结束时间" name="endTime"
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

export default React.memo(ScreenAdModal)