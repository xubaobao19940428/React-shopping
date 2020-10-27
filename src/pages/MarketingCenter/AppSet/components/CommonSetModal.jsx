import react, {useState, useEffect, useRef} from 'react'
import {Modal, Form, Input, Radio, Select, Button, DatePicker, Table, message} from 'antd'
import {dealShowFileSrc, filterData} from '@/utils/utils'
import { UploadImageByLangModal } from '@/components'
import moment from 'moment'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 26,
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
const HomeSetModal = (props) => {
    const { modalData, showModal, title, modalLoading, languages, propParam,
        OPEN_TYPE_LIST, APP_PAGE_ENUM, PERSON_TYPE_LIST,
        onClose, onConfirm } = props
    const [showImages, setShowImages] = useState(modalData.icon ? modalData.icon : {})
    const [uploadModal, setUploadModal] = useState(false)
    const [openType, setOpenType] = useState(modalData.openType ? modalData.openType : 1)
    const [name, setName] = useState(modalData.name ? modalData.name: {})
    const [subTitle, setSubTitle] = useState(modalData.subTitle ? modalData.subTitle : {})

    const nameColumns = [{
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
            <Input value={name[item.code]} onChange={(e) => handleNameChange(e, item.code)}/>
        )
    }]

    const subTitleColumns = [{
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
            <Input value={subTitle[item.code]} onChange={(e) => handleSubTitleChange(e, item.code)}/>
        )
    }]

    // 切换跳转类型
    function openTypeChange(e) {
        setOpenType(e.target.value)
    }

    // 名称输入改变
    function handleNameChange(e, code) {
        let temp = { ...name }
        temp[code] = e.target.value
        setName(temp)
    }
    // 副标题输入改变
    function handleSubTitleChange(e, code) {
        let temp = { ...subTitle }
        temp[code] = e.target.value
        setSubTitle(temp)
    }
    // 确定
    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.startTime = data.startTime ? moment(data.startTime).valueOf() : ''
        data.endTime = data.endTime ? moment(data.endTime).valueOf() : ''
        if (data.startTime && data.endTime && data.startTime >= data.endTime) {
            return message.error('结束时间不能小于开始时间')
        }
        data.id = modalData.id
        if (propParam.icon && Object.keys(showImages).length <= 0) {
            return message.error('上传图片')
        }
        if (propParam.name && (!name.cn || !name.en)) {
            return message.error('请输入中英文标题')
        }
        data.icon = JSON.stringify(showImages)
        data.name = JSON.stringify(name)
        data['extJson'] = JSON.stringify(filterData({
            subTitle: propParam.subTitle ? subTitle : '',
            spuId: propParam.spuId ? data.spuId : ''
        }))

        onConfirm(data)
    }
    // 取消
    function handleCancel () {
        onClose()
    }

    useEffect(() => {
        setShowImages(modalData.icon || {})
        setName(modalData.name || {})
        setOpenType(modalData.openType || 1)
    }, [showModal])

    return (
        <div>
            <Modal
                destroyOnClose
                title={title}
                maskClosable={false}
                visible={showModal}
                width={600}
                onCancel={handleCancel}
                confirmLoading={modalLoading}
                okButtonProps={{ htmlType: 'submit', form: 'homeSetModelForm'}}
            >
                <Form id="homeSetModelForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                    {
                        propParam.name &&
                        <Form.Item name="name" label="标题" rules={[{ required: true, message: '不能为空'}]}>
                            <div>
                                <Table
                                    rowKey={record => record.code}
                                    bordered
                                    columns={nameColumns}
                                    dataSource={languages}
                                    pagination={{hideOnSinglePage: true}}
                                    scroll={{ y: 160 }}
                                ></Table>
                            </div>
                        </Form.Item>
                    }
                    {
                        propParam.subTitle &&
                        <Form.Item name="subTitle" label="副标题">
                            <div>
                                <Table
                                    rowKey={record => record.code}
                                    bordered
                                    columns={subTitleColumns}
                                    dataSource={languages}
                                    pagination={{hideOnSinglePage: true}}
                                    scroll={{ y: 160 }}
                                ></Table>
                            </div>
                        </Form.Item>
                    }
                    {
                        propParam.personnelType &&
                        <Form.Item name="personnelType" rules={[{ required: true, message: '不能为空'}]} label={"曝光人群"}>
                            <Radio.Group>
                                {
                                    PERSON_TYPE_LIST.map((item) => {
                                        return <Radio value={item.key} key={item.key}>{item.name}</Radio>
                                    })
                                }
                            </Radio.Group>
                        </Form.Item>
                    }
                    {
                        propParam.openType &&
                        <Form.Item name="openType" label="跳转类型" rules={[{ required: true, message: '不能为空'}]}>
                            <Radio.Group onChange={openTypeChange}>
                                {
                                    OPEN_TYPE_LIST.map((item) => {
                                        return <Radio value={item.key} key={item.key}>{item.name}</Radio>
                                    })
                                }
                            </Radio.Group>
                        </Form.Item>
                    }
                    {
                        (openType === 1 && propParam.url) &&
                        <Form.Item name="url" label="跳转链接" rules={[{ required: true, message: '不能为空'}]}>
                            <Input />
                        </Form.Item>
                    }
                    {
                        (openType === 2 && propParam.url) &&
                        <Form.Item name="url" label="跳转链接" rules={[{ required: true, message: '不能为空'}]}>
                            <Select>
                                {
                                    Object.keys(APP_PAGE_ENUM).map((key) => {
                                        return <Select.Option value={key} key={key}>{APP_PAGE_ENUM[key]}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    {
                        propParam.spuId &&
                        <Form.Item name="spuId" label="展示商品ID">
                            <Input placeholder="请填写商品ID，多个使用,号隔开"/>
                        </Form.Item>
                    }
                    {
                        propParam.icon &&
                        <Form.Item name="icon" label="图片">
                            {
                                showImages.cn ? (<img src={dealShowFileSrc(showImages.cn)} style={{ width: 60 }} onClick={() => {
                                    setUploadModal(true)
                                }}/>) : (<Button onClick={() => {
                                    setUploadModal(true)
                                }} type="link">添加图片</Button>)
                            }
                        </Form.Item>
                    }
                    {
                        propParam.startTime &&
                        <Form.Item name="startTime" label="开始时间">
                            <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入开始时间"/>
                        </Form.Item>
                    }
                    {
                        propParam.endTime &&
                        <Form.Item name="endTime" label="结束时间">
                            <DatePicker showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} placeholder="请输入结束时间"/>
                        </Form.Item>
                    }
                    <Form.Item name="status" label="状态">
                        <Radio.Group value={propParam.status}>
                            <Radio value={1} key={1}>显示</Radio>
                            <Radio value={2} key={2}>隐藏</Radio>
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

export default React.memo(HomeSetModal)
