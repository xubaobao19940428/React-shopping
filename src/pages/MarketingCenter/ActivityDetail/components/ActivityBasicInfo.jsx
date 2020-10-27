import React, {useState, useEffect} from 'react'
import { Row, Col, Form, Radio, Select, Input, DatePicker, Button, Upload, message } from 'antd'
import { customTimeFormat, filterCountry } from '@/utils/filter'
import { dealShowFileSrc } from '@/utils/utils'
import { request } from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'
import { UploadImageByLangModal } from '@/components'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import SubjectSelect from '../../ActivityManage/components/SubjectSelect'
import moment from 'moment'

const { RangePicker } = DatePicker

/**
 * 活动基础信息
 * @param {*} props 
 */

const ActivityBasicInfo = (props) => {
    const {basicInfo, onEdit} = props
    const [isEdit, setIsEdit] = useState(false)
    const [uploadModal, setUploadModal] = useState(false)
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)
    const [curType, setCurType] = useState('')
    const [dataParam, setDataParam] = useState({
        icon: {},
        iconList: [],
        baseMap: {},
        baseMapList: []
    })

    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    useEffect(() => {
        let temp = { ...basicInfo }
        setDataParam(temp)
        setImage(temp.image)
    }, [basicInfo])
    
    function handleOpt () {
        setIsEdit(true)
    }

    function handleCancel () {
        setIsEdit(false)
    }

    function onFinish (values) {
        let existVal = {}
        Object.keys(values).forEach(key => {
            if (typeof values[key] !== 'undefined') {
                existVal[key] = values[key]
            }
        })

        let data = Object.assign({}, dataParam, existVal)
        if (!data.name) {
            message.error('活动名称必填')
        } else if (!data.timeList || !data.timeList.length) {
            message.error('活动时间必填')
            return
        } else if (data.baseMapPrice && (!data.baseMap || !data.baseMap.cn)) {
            message.error('价格底图包含价格的时候，须要设置底图')
            return
        }
        data.endTime = data.timeList ? moment(data.timeList[1]).valueOf() : null
        data.startTime = data.timeList ? moment(data.timeList[0]).valueOf() : null
        data.preheatStartTime = data.preheatStartTime ? moment(data.preheatStartTime).valueOf() : null
        data.image = image

        delete data.baseMapList
        delete data.iconList
        onEdit(data)
        setIsEdit(false)
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

    function handleImgUpload(type) {
        setCurType(type)
        setUploadModal(true)
    }

    function handleUploadConfirm(images) {
        setUploadModal(false)
        let icon = {}
        let temp = { ...dataParam }
        images.forEach(item => {
            icon[item.languageCode] = item.name
        })
        if (curType == 'icon') {
            temp = Object.assign({}, temp, {icon, iconList: images})
            setDataParam(temp)
        } else {
            temp = Object.assign({}, temp, {baseMap: icon, baseMapList: images})
            setDataParam(temp)
        }
    }

    function handleSubjectChange (val) {
        let temp = { ...dataParam } 
        temp.subjectId = val

        setDataParam(temp)
    }

    function handleRemove () {
        setImage('')
    }

    return (
        <div style={{ padding: '0 32px' }}>
            <Form onFinish={onFinish}>
                <Form.Item className="basic-opt-box">
                    {
                        isEdit ? 
                        (
                            <>
                                <Button htmlType="button" type="link" onClick={handleCancel}>取消</Button>
                                <Button htmlType="submit" type="link">保存</Button>
                            </>
                        ) : (
                            <Button htmlType="button" type="link" onClick={handleOpt}>编辑</Button>
                        )
                    }
                </Form.Item>
                <Row>
                    <Col span={12}>
                        <Form.Item label="活动模板" required>
                            {dataParam.activityTemplateName}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="活动国家" required>
                            {filterCountry(dataParam.countryCode)}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="活动名称" required>
                    {
                        isEdit ? 
                            <Form.Item name="name">
                                <Input defaultValue={dataParam.name}/>
                            </Form.Item>
                        : dataParam.name
                    }
                </Form.Item>
                <Form.Item label="活动时间" required>
                    {
                        isEdit ? 
                            <Form.Item name="timeList">
                                <RangePicker defaultValue={dataParam.timeList} showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}/>
                            </Form.Item>
                         :  (
                            `${customTimeFormat(dataParam.startTime, 'YYYY-MM-DD HH:mm:ss')} ~ ${customTimeFormat(dataParam.endTime, 'YYYY-MM-DD HH:mm:ss')}`
                        )
                    }   
                </Form.Item>
                <Form.Item label="预热时间" extra="拼团活动设置预热时间无效">
                    {
                        isEdit ?
                            <Form.Item name="preheatStartTime" >
                                <DatePicker defaultValue={dataParam.preheatStartTime} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入预热时间"/>
                            </Form.Item> 
                        : customTimeFormat(dataParam.preheatStartTime, 'YYYY-MM-DD HH:mm:ss')
                    }
                </Form.Item>
                <Form.Item name="subjectId" label="选择专题">
                    {
                        isEdit ? 
                            <SubjectSelect
                                change={handleSubjectChange}
                                countryCode={dataParam.countryCode}
                                subjectId={dataParam.subjectId}
                            />
                        : dataParam.subjectName
                    }
                    
                </Form.Item>
                <Form.Item name="icon" label="活动图标" extra="尺寸100*60">
                    {
                        isEdit ? (
                            dataParam.icon.cn ? (
                                    <img src={dealShowFileSrc(dataParam.icon.cn)} style={{ width: 60 }} onClick={() => handleImgUpload('icon')}/>
                                ) : (
                                    <Button onClick={() => handleImgUpload('icon')} type="link">添加图片</Button>
                                )
                        ) : ( <img src={dealShowFileSrc(dataParam.icon && dataParam.icon.cn)} style={{ width: 60 }}/> )
                    }
                </Form.Item>
                <Form.Item label="活动底图">
                    {
                        isEdit ?
                            (
                                <>
                                    <Form.Item name="baseMapPrice">
                                        <Radio.Group defaultValue={dataParam.baseMapPrice}>
                                            <Radio value={1}>含价格</Radio>
                                            <Radio value={0}>不含价格</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {
                                        dataParam.baseMap.cn ? (
                                            <img src={dealShowFileSrc(dataParam.baseMap.cn)} style={{ height: 40 }} onClick={() => handleImgUpload('baseMap')}/>
                                        ) : (
                                            <Button onClick={() => handleImgUpload('baseMap')} type="link">添加图片</Button>
                                        )
                                    }
                                </>
                            )
                        : (
                            <>
                                {dataParam.baseMapPrice === 1 ? '含价格' : '不含价格'}
                                <img src={dealShowFileSrc(dataParam.baseMap && dataParam.baseMap.cn)} style={{ width: 60 }}/>
                            </>
                            
                        )
                    }
                </Form.Item>
                <Form.Item label="活动链接">
                    { isEdit ? 
                        <Form.Item name="jumpLink">
                            <Input defaultValue={dataParam.jumpLink}/>
                        </Form.Item>
                        : dataParam.jumpLink 
                    }
                </Form.Item>
                <Form.Item label="活动主图" extra="内部使用，尺寸100*100">
                    { isEdit ? (
                        <Upload
                            listType="picture-card"
                            customRequest={handleUpload}
                            showUploadList={false}
                            onRemove={handleRemove}
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        >
                            {image ? <img src={dealShowFileSrc(image)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                        ) : ( <img src={dealShowFileSrc(image)} style={{ width: 60 }}/>)
                    }
                </Form.Item>
                <Form.Item label="活动描述" extra="面向商家，建议英语+该国官方语言">
                    { isEdit ? 
                        <Form.Item name="description">
                            <Input defaultValue={dataParam.description}/>
                        </Form.Item>
                        : dataParam.description }
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

export default React.memo(ActivityBasicInfo)