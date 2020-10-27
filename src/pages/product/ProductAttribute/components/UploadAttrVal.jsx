import React, { useState, useCallback, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Modal, Upload, message} from 'antd';
import { LoadingOutlined, MessageFilled, UploadOutlined } from '@ant-design/icons';
import {request} from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl';
import {uploadAttrValueTranslate} from '@/services/product1'
/**
/*  
/*
/*
*/
const UploadAttrVal = React.forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState({})
    const [uploadAttrValStr,setUploadAttrVal] =useState('')
    const [tempUrl,setTempUrl] = useState('https://file.fingo.shop/upload/others/2020-02/06/18298469759992971395072.xlsx')
    const handleOk = () => {
       
        if(uploadAttrValStr==''){
            props.cancel()
        }else{
            let params={
                uploadUrl:uploadAttrValStr
            }
            uploadAttrValueTranslate(params).then(resultes=>{
                if(resultes.ret.errCode==0){
                    message.success('上传成功')
                    setUploadAttrVal('')
                    props.cancel()
                }
            })
        }
        
    }
    const handleCancel = () => {
        setUploadAttrVal('')
        props.cancel()
    }
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <Button icon={<UploadOutlined />}>选择文件</Button>}
        </div>
    )
    const handleBeforeUpload = (file) => {
        console.log(file)
        const fileType = file.type.split('/')[0];   // 获得上传文件类型
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
        setParams(uploadParam);
        setLoading(true);
    }
    const customRequest = (reqInfo) => {
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
                setUploadAttrVal(res.original_link)
                setLoading(false)
            }
        }).catch(err => {

        });
    }
    const uploadDetail=()=>{
        window.open(tempUrl)
    }
    return (
        <div>
            <Modal
                title="上 传"
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Upload
                    // name="avatar"
                    // listType="picture-card"
                    // className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    customRequest={customRequest}
                    data={{ param: JSON.stringify(params) }}
                >
                    {
                        uploadButton
                    }
                    {``}
                    <div>
                    通过上传表格，可批量修改未被商品使用的属性名称； 请<a onClick={uploadDetail}>下载模版</a>并按照模板中的指导说明制作表格{uploadAttrValStr}
                    </div>
                </Upload>
            </Modal>
        </div>
    )
})
export default UploadAttrVal;