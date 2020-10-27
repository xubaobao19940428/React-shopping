import React, { useState, useCallback, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Button, Space, Modal, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined, DeleteOutlined,CheckOutlined } from '@ant-design/icons';
import { request } from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'
import { dealShowFileSrc } from '@/utils/utils'
import styles from '../styles/index.less';
/**
/*  
/*图片选择
/*
*/
const SkuImgSelect = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [imageUrl, setImg] = useState('')
    const [param, setParam] = useState({})
    const [loading, setLoading] = useState(false)
    const [cover, setCover] = useState('')
    const [detailPics, setDetailLists] = useState([])
    const [rotationPics, setRotationPics] = useState([])
    const [rotationPicChecked, setRotationPicChecked] = useState([])
    const [detailPicChecked, setDetailPicChecked] = useState([])
    useImperativeHandle(ref, () => {
        return {
            changeVisible: (newVal) => {
                setVisible(newVal);
            },
            setSkuImgLists: (newVal) => {
                setDetailLists(newVal.detailPics)
                setRotationPics(newVal.rotationPics)
            }
        }
    })
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : (cover==''?<PlusOutlined />:'')}
        </div>
    );
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
        let formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', reqInfo.data.param);
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                setImg(dealShowFileSrc(res.original_link))
                setLoading(false)
            }
        }).catch(err => {

        });
    }
    const choiceItem = (item, index) => {
        console.log(imageUrl)
        if (imageUrl != '') {
            message.warning('已从本地上传了，如需从主图中选取请先移除本地上传图片')
            return
        }
        if (!rotationPics[index].check && cover != '') {
            message.warning('最多选择1张')
            return
        }
        if (!rotationPics[index].check && rotationPicChecked.length >= 1) {
            message.warning('最多选择1张')
            return
        }
        let check = rotationPics[index].check
        let newRotationPics = rotationPics.concat([])
        newRotationPics[index].check = check === true ? false : true
        setRotationPics(newRotationPics)
        if (!check) {
            setCover(rotationPics[index].url)
        } else (
            setCover('')
        )
    }
    const choiceDetailItem = (item, index) => {
        if (imageUrl != '') {
            message.warning('已从本地上传了，如需从详情图中选取请先移除本地上传图片')
            return
        }
        if (!detailPics[index].check && cover != '') {
            message.warning('最多选择1张')
            return
        }
        if (!detailPics[index].check && detailPicChecked.length >= 1) {
            message.warning('最多选择1张')
            return
        }
        let check = detailPics[index].check
        let newDetailList = detailPics.concat([])
        newDetailList[index].check = check === true ? false : true
        setDetailLists(newDetailList)
        if (!check) {
            setCover(detailPics[index].url)
        } else (
            setCover('')
        )
    }
    const handleCancel = () => {
        setVisible(false)
    }
    const handleOk = () => {
        let resultCover = ''
        if (cover != '') {
            resultCover = cover
        } else if (imageUrl != '') {
            resultCover = imageUrl
        }
        props.confirm(resultCover)
    }
    useEffect(() => {
        let checkedRotation = [], checkedDetail = []
        _.forEach(rotationPics, (item) => {
            if (item.check) {
                checkedRotation.push(item)
            }
        })
        _.forEach(detailPics, (item) => {
            if (item.check) {
                checkedDetail.push(item)
            }
        })
        setRotationPicChecked(checkedRotation)
        setDetailPicChecked(checkedDetail)
    }, [detailPics, rotationPics])
    return (
        <div className={styles['skuImg']}>
            <Modal
                title='上传SKU详情图'
                visible={visible}
                style={{ fontSize: '20px' }}
                width={850}
                destroyOnClose
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取 消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        确 定
                    </Button>
                ]}>
                <div className={styles['divContainer']}>
                    <span>从主图选取：</span>
                    {
                        rotationPics.length != 0 &&
                        <div className={styles['imgContainer']}>
                            {
                                rotationPics.map((item, index) => {
                                    return <div className={styles['imgContent']} onClick={() => choiceItem(item, index)} key={item.uid}><img src={dealShowFileSrc(item.url)} style={{ width: 90, height: 90 }} key={index}></img>
                                        <div className={item.check ? styles['active'] : styles['notSelected']} >
                                            <div style={{ textAlign: 'center' }}>
                                            <CheckOutlined />
                                            </div>

                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    }
                </div>
                <div className={styles['divContainer']}>
                    <span>从详情图选取：</span>
                    {
                        detailPics.length != 0 &&
                        <div className={styles['imgContainer']}>
                            {
                                detailPics.map((item, index) => {
                                    return <div className={styles['imgContent']} onClick={() => choiceDetailItem(item, index)} key={item.uid}><img src={dealShowFileSrc(item.url)} style={{ width: 90, height: 90 }} key={index}></img>
                                        <div className={item.check ? styles['active'] : styles['notSelected']} >
                                            <div style={{ textAlign: 'center' }}>
                                            <CheckOutlined />
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    }
                </div>
                <div className={styles['divContainer']}>
                    <span>从本地选取：</span>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={handleBeforeUpload}
                        customRequest={customRequestRotation}
                        data={{ param: JSON.stringify(param) }}
                        disabled={cover != ''}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </div>
            </Modal>
        </div>
    )
})
export default SkuImgSelect;