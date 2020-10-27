import React, { useState, useCallback, useMemo, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './styles/BatchData.less';
import {request} from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl';


const BatchData = (props) => {
    const [loading, setLoading] = useState(false)
    const [param, setParam] = useState({})
    const [uploadAttr,setUploadAttr] = useState('')

    const handleCancel = () => {
        setUploadAttr('')
        props.batchCancel(false)
    }
    const handleOK = () => {
        setUploadAttr('')
        props.batchConfirm(false)
    }
    const customRequest = (reqInfo) => {
       console.log(reqInfo)
       const formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', JSON.stringify(param));
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                console.log(res)
                setUploadAttr(res.original_link)
                setLoading(false)
            }
        })
    }
    const handleBeforeUpload = (file) => {
        console.log(file)
        const fileType = file.type.split('/')[0]
        console.log(fileType)
        // 设置上传文件类型
        let type = fileType

        if (file.type === 'image/gif') {
            type = 'gif';
        } else if (fileType != 'image' && fileType != 'video' && fileType != 'audio') {
            type = 'other';
        }
        const uploadParam = {
            type,
            fileName: file.name
        }
        setParam(uploadParam);

        setLoading(true);
    }
    const downloadTemp = () => {
        let url = 'https://file.fingo.shop/upload/others/2020-01/08/18269459324603773222912.xlsx'
        window.open(`${url}`)
    }
    return (
        <Modal width={700} maskClosable={false} title="批量上传" visible={props.batchVisible} onCancel={handleCancel} onOk={handleOK}>
            <div>
                上传：
                <Upload showUploadList={false} beforeUpload={handleBeforeUpload} customRequest={customRequest} data={{ param: JSON.stringify(param) }}>
                    <Button type="primary" icon={<UploadOutlined />} loading={loading}>选择文件</Button>
                    <span className={styles.fileName}>{uploadAttr}</span>
                </Upload>
            </div>
            <div className={styles.temp}>
                通过上传表格，可批量录入或修改预售商品数据；请<span onClick={downloadTemp} className={styles.downModel}>下载模板</span>并按照模板中的指导说明制作表格。
            </div>
        </Modal>
    )
}

export default BatchData