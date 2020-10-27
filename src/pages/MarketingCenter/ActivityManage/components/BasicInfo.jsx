import React, {useState, useRef, useEffect} from 'react'
import { Form, Input, Select, DatePicker, Upload, Button, Radio, message } from 'antd'
import moment from 'moment'
import { dealShowFileSrc } from '@/utils/utils'
import { request } from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'
import { UploadImageByLangModal } from '@/components'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import SubjectSelect from './SubjectSelect'

const { RangePicker } = DatePicker
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 3,
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
const BasicInfo = (props) => {
    const {templateList, onCancel, onConfirm, countries, TEMPLATE_DEFUALT_VALUE, allValues} = props
    const [elements, setElements] = useState([])
    const [templateName, setTemplateName] = useState('')
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [uploadModal, setUploadModal] = useState(false)
    const [curType, setCurType] = useState('')
    const [dataParam, setDataParam] = useState({
        activityTemplateId: '',
        name: '',
        countryCode: 'MY',
        timeList: [],
        preheatStartTime: '',
        icon: {},
        baseMap: {},
        baseMapPrice: 1,
        jumpLink: '',
        description: '',
        promotionLabel: {},
        ruleDesc: {}
    })

    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    function handleTemplateSelect (value) {
        let item = templateList.find(item => item.templateId === value)
        setTemplateName(item.name)
        setElements(item.elements)
    }

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
            setImage(res.original_link)
        }).catch(err => {})
    }

    function handleRemove () {
        setImage('')
    }

    function handleImgUpload(type) {
        setCurType(type)
        setUploadModal(true)
    }

    function handleCancel () {
        onCancel()
    }

    function onFinish (values) {
        let existVal = {}
        Object.keys(values).forEach(key => {
            if (typeof values[key] !== 'undefined') {
                existVal[key] = values[key]
            }
        })
        let data = Object.assign({}, dataParam, existVal)
        data.image = image
        let defaultValues = TEMPLATE_DEFUALT_VALUE[data.activityTemplateId] || {}
        let ruleInfo = {}
        if (data.baseMapPrice && (!data.baseMap || !data.baseMap.cn)) {
            message.error('价格底图包含价格的时候，须要设置底图')
            return
        }
        if (elements.length) {
            elements.forEach(el => {
                ruleInfo[el] = defaultValues[el] || {
                    selected: 0,
                    param: [] // 传输的值
                }
            })
            data.ruleInfo = ruleInfo
        }
        onConfirm(data)
    }

    function handleSubjectChange (val) {
        let temp = { ...dataParam } 
        temp.subjectId = val

        setDataParam(temp)
    }

    function handleUploadConfirm(images) {
        setUploadModal(false)
        let icon = {}
        images.forEach(item => {
            icon[item.languageCode] = item.name
        })
        let temp = { ...dataParam }
        if (curType == 'icon') {
            temp = Object.assign({}, temp, {icon, iconList: images})
            setDataParam(temp)
        } else {
            temp = Object.assign({}, temp, {baseMap: icon, baseMapList: images})
            setDataParam(temp)
        }
    }

    // 新建活动国家修改，需要清空专题的选择
    function handleCountryCodeChange (val) {
        let temp = {...dataParam}
        temp.countryCode = val
        temp.subjectId = ''

        setDataParam(temp)
    }
 
    useEffect(() => {
        setDataParam(Object.assign({
            activityTemplateId: '',
            name: '',
            countryCode: 'MY',
            timeList: [],
            subjectId: '',
            preheatStartTime: '',
            icon: {},
            baseMap: {},
            baseMapPrice: 1,
            jumpLink: '',
            description: '',
            promotionLabel: {},
            ruleDesc: {}
        }, allValues))
    }, [])

    return (
        <div>
            <Form onFinish={onFinish} 
                initialValues={allValues} {...formItemLayout}>
                <Form.Item name="activityTemplateId" label="活动模板"
                    rules={[
                        {
                            required: true,
                            message: '活动模板必选'
                        }
                    ]}
                >
                    <Select onChange={handleTemplateSelect}>
                        {
                            templateList.map(template => (
                                <Select.Option value={template.templateId} key={template.templateId}>{template.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="活动名称"
                    rules={[
                        {
                            required: true,
                            message: '活动名称必填'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="countryCode" label="活动国家"
                    rules={[
                        {
                            required: true,
                            message: '活动国家必选'
                        }
                    ]}
                >
                    <Select onChange={handleCountryCodeChange}>
                        {
                            countries.map((item) => (
                                <Select.Option value={item.shortCode} key={item.shortCode}>{item.nameCn}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="timeList" label="活动时间"
                    rules={[
                        {
                            required: true,
                            message: '活动时间必填'
                        }
                    ]}
                >
                    <RangePicker showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                </Form.Item>
                <Form.Item name="preheatStartTime" label="预热时间">
                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入预热时间"/>
                </Form.Item>
                <Form.Item label="选择专题">
                    <SubjectSelect
                        change={handleSubjectChange}
                        countryCode={dataParam.countryCode}
                        subjectId={dataParam.subjectId}
                    />
                </Form.Item>
                <Form.Item label="活动图标">
                    {
                        dataParam.icon.cn ? (
                            <img src={dealShowFileSrc(dataParam.icon.cn)} style={{ width: 60 }} onClick={() => handleImgUpload('icon')}/>
                        ) : (
                            <Button onClick={() => {
                                handleImgUpload('icon')
                            }} type="link">添加图片</Button>
                        )
                    }
                </Form.Item>
                <Form.Item label="活动底图">
                    <Form.Item name="baseMapPrice">
                        <Radio.Group>
                            <Radio value={1} key={1}>含价格</Radio>
                            <Radio value={0} key={0}>不含价格</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        dataParam.baseMap.cn ? (
                            <img src={dealShowFileSrc(dataParam.baseMap.cn)} style={{ height: 40 }} onClick={() => handleImgUpload('baseMap')}/>
                        ) : (
                            <Button onClick={() => handleImgUpload('baseMap')} type="link">添加图片</Button>
                        )
                    }
                </Form.Item>
                <Form.Item name="jumpLink" label="活动链接">
                    <Input/>
                </Form.Item>
                <Form.Item label="活动主图">
                    <Upload
                        listType="picture-card"
                        customRequest={handleUpload}
                        showUploadList={false}
                        onRemove={handleRemove}
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    >
                        {image ? <img src={dealShowFileSrc(image)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item name="description" label="活动描述">
                    <Input/>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button onClick={handleCancel} htmlType="button" size="large" style={{ marginRight: 16 }}>取消</Button>
                    <Button htmlType="submit" type="primary" size="large">下一步</Button>
                </Form.Item>
            </Form>

            {uploadModal && <UploadImageByLangModal 
                show={uploadModal}
                onSure={handleUploadConfirm}
                onClose={() => setUploadModal(false)}
                images={curType == 'icon' ? dataParam.iconList : dataParam.baseMapList}
            />}
        </div>
    )
}

export default React.memo(BasicInfo)