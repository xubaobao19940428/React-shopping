import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button, Form, Input, Space, Select, Radio,Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined,LoadingOutlined,DeleteOutlined} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import {request} from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'; 
import {dealShowFileSrc} from '@/utils/utils'
import styles from '../styles/BrandManage.less'
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddBrand = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [param, setParam] = useState({});
    const [title, setTitle] = useState('新增品牌')
    const [imageUrl,setImg] =useState('')
    const formRef = React.createRef(FormInstance) 
    const [defaultValue,setDefaultValue] = useState({
        nameCn:'',
        nameEn:'',
        comeFrom:'',
        memo:''
    })
    const [loading,setLoading] = useState(false)
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changeTitle: (newTitle) => {
                setTitle(newTitle)
            },
            changeContent: (newContent) => {
                setDefaultValue({
                    ...defaultValue,
                    nameCn:newContent.nameCn,
                    nameEn:newContent.nameEn,
                    comeFrom:newContent.comeFrom,
                    memo:newContent.memo,
                    brandId:newContent.brandId
                })
                if(newContent.logo){
                    setImg(newContent.logo)
                }else{
                    setImg('')
                }
                
            }
        }

    })
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    }

    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                let params={}
                if(imageUrl!=''){
                    params.logo = imageUrl
                }
                params=Object.assign(params,currentValue)
                props.editAndAdd({params:params,brandId:defaultValue.brandId?defaultValue.brandId:''})
            } else {
                console.log('error,submit')
            }
        })
    }
    //上传前校验
    const handleBeforeUpload = (file) => {
        const fileType = file.type.split('/')[0];   // 获得上传文件类型
        const isLt2M = file.size / 1024 / 1024 <= 2;   // 2M限制
        const isLt30M = file.size / 1024 / 1024 <= 30;    // 30M限制
        if (!isLt2M) {
            message.error('上传图片大小不能超过 2MB!');
        } else if (!isLt30M) {
            message.error('上传图片大小不能超过 30MB!');
        }
        // 设置上传文件类型
        let type = fileType;

        if (file.type === 'image/gif') {
            type = 'gif';
        } else if (fileType != 'image' && fileType != 'video' && fileType != 'audio') {
            type = 'other';
        }
        // 上传参数
        const uploadParam = {
            type,
            fileName: file.name
        }
        setParam(uploadParam);
        setLoading(true);
    }
    const customRequestRotation = (reqInfo) => {
        console.log(reqInfo)
        const formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', reqInfo.data.param);
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                console.log(res)
                setImg(dealShowFileSrc(res.original_link))
                console.log(imageUrl)
                setLoading(false)
                    
            }
        }).catch(err => {

        });
    }
    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
      )
    const handleCancel = e => {
        setVisible(false)

    }
    const deleteImg=(e)=>{
        e.stopPropagation()
        setImg('')
    }
    return (
        <div>
            <React.Fragment>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ width: '700px', fontSize: '20px' }}
                    destroyOnClose
                    bodyStyle={{ textAlign: 'center' }}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <Form
                        initialValues={defaultValue}
                        {...formItemLayout}
                        autoComplete="off" 
                        ref={formRef}
                    >
                        <Form.Item
                            label="中文名称："
                            name="nameCn"
                            rules={[{ required: true, message: '中文名称不能为空' }]}
                        >
                            
                            <Input placeholder="请输入中文品牌名称/最多40个字"/>
                        </Form.Item>
                        <Form.Item
                            label="英文名称："
                            name="nameEn"
                            rules={[{ required: true, message: '英文名称不能为空' }]}
                        >
                            <Input placeholder="请输入英文品牌名称/最多120个字符" />
                        </Form.Item>
                        <Form.Item
                            label="产地："
                            name="comeFrom"
                            rules={[{ required: true, message: '产地名称不能为空' }]}
                        >
                            <Input placeholder="请输入产地名称/最多40" />
                        </Form.Item>
                        <Form.Item
                            label="备注："
                            name="memo"
                        >
                            <Input placeholder="请输入备注" />
                        </Form.Item>
                        <Form.Item label="logo">
                        <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={handleBeforeUpload}
                                customRequest={customRequestRotation}
                                data={{ param: JSON.stringify(param) }}
                            >
                                {imageUrl!='' ? <div className={styles['imgContent']} >
                                    <img src={imageUrl} style={{ width: 90, height: 90 }}></img>
                                    <div className={styles['operate-area']} >
                                        <DeleteOutlined onClick={(e) => deleteImg(e)} />
                                    </div>
                                </div> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        </div>
    );
})
export default AddBrand