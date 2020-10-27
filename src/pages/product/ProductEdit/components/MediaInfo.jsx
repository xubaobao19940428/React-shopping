import React, { useRef, useState, useCallback, useEffect, useImperativeHandle } from 'react';
import styles from '../styles/index.less';
import { Button, Tabs, Space, Input, Upload, message } from 'antd';
import { UploadFile } from '@/components'
import { Drag } from '@/components'
import { useModel, request } from 'umi';
import apiBaseUrl from '@/config/apiBaseUrl';
import { dealShowFileSrc } from '@/utils/utils'
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import PhotoPreview from '@/components/PhotoPreview'
const { TabPane } = Tabs;
const { TextArea } = Input;
/**
/*
/*图片视频
/*
*/
const MediaInfo = React.forwardRef((props, ref) => {

    const [showPreview, setShowPreview] = useState(false);
    const [imgLists, setImgLists] = useState([])
    const [previewIndex, setPreviewIndex] = useState(0)
    const { languages } = useModel('dictionary');
    const [tabActiveKey, setTabActiveKey] = useState('cn')
    //商品主图
    const [param, setParam] = useState({});
    const dragRef = useRef()
    const [rotationPics, setRotationPics] = useState([])
    const [setRotationDataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    //商品详情图
    const { dragDetailRef } = useRef()
    const [detailParams, setDetailParams] = useState({})
    const [detailDataSource, setDetailDataSource] = useState([])
    const [detailPics, setDetailList] = useState([])
    const [detailLoading, setDetailLoading] = useState(false)
    const [newVal, setNewVal] = useState({})
    //商品视频
    const [videoInfo, setVideoInfo] = useState({})
    const [videoLoading, setVideoLoading] = useState(false)
    const [videoParams, setVideoParams] = useState({})
    //文本描述
    const [desc,setDesc] = useState('')
    //图片预览
    const previewImg = (list, index) => {
        setPreviewIndex(index)
        setImgLists(list)
        setShowPreview(true)
    }
    //tabs切换
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                imgRenderDetail(newVal)
                imgRender(newVal)
                videoRender(newVal)
            },
            getData: () => {
                console.log(rotationPics)
                console.log(detailPics)
                console.log(videoInfo)
            }
        }

    });
    const imgRender = (val) => {
        var arr = []
        if (val) {
            if (val[props.lang]) {
                val[props.lang].rotationPics.map((item, index) => {
                    arr.push({
                        name: item.name,
                        status: item.status,
                        uid: item.uid,
                        url: item.url,
                        render: (row) => <div className={styles['imgContent']} onClick={() => previewImg(rotationPics, index)}><img src={dealShowFileSrc(item.url)} style={{ width: 90, height: 90 }} key={item.uid}></img>
                            <div className={styles['operate-area']} >
                                <DeleteOutlined onClick={(e) => deleteImgDetail(e, rotationPics, index, 'rotation', props.lang)} />
                            </div>
                        </div>
                    })
                })
                setDataSource(arr)
            }
        }
    }

    //删除商品主图和详情图
    const deleteImgDetail = (e, oldData, index, type, lang) => {
        e.stopPropagation()
        let newData
        if(type!='rotation'&&type!='detail'){
             newData = JSON.parse(JSON.stringify(oldData))
        }else{
             newData = [...oldData]
            // newData.splice(index, 1)
            if (type == 'rotation') {
                setRotationPics(newData)
            } else if (type == 'detail') {
                setDetailList(newData)
            }
        }
        props.deleteImg(index, type, lang)
    }
    //自定义上传内容商品主图
    const customRequestRotation =useCallback((reqInfo) => {
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
                let list = []
                if(props.mediaInfo[props.lang]){
                     list = [...props.mediaInfo[props.lang]['rotationPics']];
                }else{
                   list =[...rotationPics]
                }
                let urlStr = res.original_link.split('/');
                list.push({
                    uid: res.original_link,
                    url: res.original_link,
                    status: 'done',
                    name: urlStr[urlStr.length - 1],
                });
                setLoading(false)
                setRotationPics(list)
                props.resetMediaInfo({
                    lang: props.lang,
                    detailPics: props.mediaInfo[props.lang]?props.mediaInfo[props.lang]['detailPics']:detailPics,
                    rotationPics: list,
                    videoInfo: videoInfo,
                })


                const publicPath = {};
                const path = {};
                for (const key in res) {
                    if (key.indexOf('_link') >= 0) {
                        publicPath[key] = dealShowFileSrc(res[key]);
                        path[key] = res[key];
                    }
                }


            }
        }).catch(err => {

        });
    })
    //上传前校验
    const handleBeforeUpload = (file) => {
        const fileType = file.type.split('/')[0];   // 获得上传文件类型
        const isLt2M = file.size / 1024 / 1024 <= 2;   // 2M限制
        const isLt30M = file.size / 1024 / 1024 <= 30;    // 30M限制
        // const isLt = maxSize ? file.size <= maxSize : true;
        // const limit = maxSize ? isLt : fileType === 'image' ? isLt2M : isLt30M; // 大小限制
        // 提示
        if (setRotationDataSource.length >= 8) {
            message.error('最多上传8张主图')
            return false
        }
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
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    )
    /**          */
    //商品详情图
    const customRequestDetail =useCallback((reqInfo) => {
        const formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', reqInfo.data.param);
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                let list = []
                if(props.mediaInfo[props.lang]){
                     list = [...props.mediaInfo[props.lang]['detailPics']];
                }else{
                   list =[...detailPics]
                }
                let urlStr = res.original_link.split('/');
                list.push({
                    uid: res.original_link,
                    url: res.original_link,
                    status: 'done',
                    name: urlStr[urlStr.length - 1],
                });
                setDetailList(list)
                props.resetMediaInfo({
                    lang: props.lang,
                    detailPics: list,
                    rotationPics: props.mediaInfo[props.lang]?props.mediaInfo[props.lang]['rotationPics']:rotationPics,
                    videoInfo: videoInfo,
                    
                })
                const publicPath = {};
                const path = {};
                for (const key in res) {
                    if (key.indexOf('_link') >= 0) {
                        publicPath[key] = dealShowFileSrc(res[key]);
                        path[key] = res[key];
                    }
                }

                setDetailLoading(false)
            }
        }).catch(err => {

        });
    })
    //上传前校验
    const handleBeforeUploadDetail = (file) => {
        console.log(file)
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
        setDetailParams(uploadParam);
        setDetailLoading(true);
    }
    const uploadButtonDetail = (
        <div>
            {detailLoading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    )
    const imgRenderDetail = (val) => {
        var arr = []
        if (val) {
            if (val[props.lang]) {
                val[props.lang].detailPics.map((item, index) => {
                    arr.push({
                        name: item.name,
                        status: item.status,
                        uid: item.uid,
                        url: item.url,
                        render: (row) => <div className={styles['imgContent']} onClick={() => previewImg(detailPics, index)}><img src={dealShowFileSrc(item.url)} style={{ width: 90, height: 90 }} key={item.uid}></img>
                            <div className={styles['operate-area']}>
                                <DeleteOutlined onClick={(e) => deleteImgDetail(e,detailPics, index, 'detail', props.lang)} />
                            </div>
                        </div>
                    })
                })
                setDetailDataSource(arr)
            }

        }

    }
    //上传视频
    const uploadButtonVideo = (
        <div>
            {videoLoading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    )
    const handleBeforeUploadVideo = (file) => {
        console.log(file)
        const fileType = file.type.split('/')[0];
        const fileTypeVideo = file.type.split('/')[1];   // 获得上传文件类型
        const isLt10M = file.size / 1024 / 1024 <= 10;    // 10M限制
        if (!isLt10M) {
            message.error('上传视频大小不能超过10MB!');
            return
        }
        // 设置上传文件类型
        console.log(fileType)
        let type = fileType;
        if (fileType != 'video') {
            message.error('请上传视频文件')
            return
        } else {
            console.log(fileTypeVideo)
            if (fileTypeVideo != 'mp4' && fileTypeVideo != 'avi' && fileTypeVideo != 'MP4' && fileTypeVideo != 'AVI') {
                message.error('请上传MP4或AVI视频文件')
                return
            } else {
                type = 'other'
            }

        }
        // 上传参数
        const uploadParam = {
            type,
            fileName: file.name
        }
        setVideoParams(uploadParam);
        setVideoLoading(true);
    }
    const customRequestVideo = (reqInfo) => {
        const formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', reqInfo.data.param);
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                let video = {
                    src: res.original_link
                }
                setVideoInfo(video)
                props.resetMediaInfo({
                    lang: props.lang,
                    detailPics: detailPics,
                    rotationPics: rotationPics,
                    videoInfo: video,
                })
                setVideoLoading(false)
            }
        }).catch(err => {

        });
    }
    //
    const videoRender = (val) => {
        var arr = []
        if (val) {
            if (val[props.lang]) {
                if(val[props.lang]['videoInfo']){
                    setVideoInfo(val[props.lang]['videoInfo'])
                }
            }

        }
    }
    const changeDesc = (e)=>{
        setDesc(e.target.value)
        props.resetMediaInfo({
            lang: props.lang,
            detailPics: props.mediaInfo[props.lang]?props.mediaInfo[props.lang]['detailPics']:detailPics,
            rotationPics: props.mediaInfo[props.lang]?props.mediaInfo[props.lang]['rotationPics']:rotationPics,
            videoInfo:  props.mediaInfo[props.lang]?props.mediaInfo[props.lang]['videoInfo']:videoInfo,
            desc:e.target.value
        })
    }
    useEffect(() => {
        if (props.mediaInfo) {
            if (props.mediaInfo[props.lang]) {
                imgRenderDetail(props.mediaInfo)
                imgRender(props.mediaInfo)
                videoRender(props.mediaInfo)
                setDesc(props.mediaInfo[props.lang].desc)
            }
        }
    }, [props.mediaInfo])
    return (
        <div>
            <div className={styles.row}>
                <div className={styles.mediaName}>商品主图：</div>
                <div className={styles.mediaContent}>
                    <div className={styles.mediaDesc}>建议710*270像素以上，大小2M以下；支持jpg、jpeg、png；至少3张最多8张，第一张为主图；支持拖拽排序</div>
                    <div className={styles.mediaInfo}>
                        <Drag ref={dragRef} dragKey="uid" dataSource={setRotationDataSource}
                            onChange={(info) => {
                                console.log(info);
                            }}
                        />
                        <Upload
                            name="avatar"
                            multiple={true}
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleBeforeUpload}
                            customRequest={customRequestRotation}
                            data={{ param: JSON.stringify(param) }}
                        >
                            {uploadButton}
                        </Upload>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.mediaName}>商品视频：</div>
                <div className={styles.mediaContent}>
                    <div className={styles.mediaDesc}>建议720*1080像素以上，大小10M以下；支持mp4、avi</div>
                    <div className={styles.mediaInfo}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleBeforeUploadVideo}
                            customRequest={customRequestVideo}
                            data={{ param: JSON.stringify(videoParams) }}
                        >
                            {videoInfo['src'] ?
                                <div className={styles['imgContent']}>
                                    <video width="100%" height="100%">
                                        <source src={dealShowFileSrc(videoInfo.src)} />
                                        <object data={dealShowFileSrc(videoInfo.src)} width="100%" height="100%" >
                                        </object>
                                    </video>
                                    <div className={styles['operate-area']}>
                                        <DeleteOutlined onClick={(e) =>deleteImgDetail(e,videoInfo,0,'video',props.lang)} />
                                    </div>
                                </div>
                                : uploadButtonVideo
                            }
                        </Upload>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.mediaName}>商品详情图：</div>
                <div className={styles.mediaContent}>
                    <div className={styles.mediaDesc}>建议710*270像素以上，大小2M以下；支持jpg、jpeg、png；支持拖拽排序</div>
                    <div className={styles.mediaInfo}>
                        <Drag ref={dragDetailRef} dragKey="uid" dataSource={detailDataSource}
                            onChange={(info) => {
                                console.log(info);
                            }}
                        />
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={handleBeforeUploadDetail}
                            customRequest={customRequestDetail}
                            data={{ param: JSON.stringify(detailParams) }}

                        >
                            {uploadButtonDetail}
                        </Upload>
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.mediaName}>文本描述：</div>
                <div className={styles.mediaContent}>
                    <div className={styles.mediaDesc}>如有需要可为商品填写文本描述，它将展示在详情图上方，可为不同国家不同语言单独设置 <Button hidden={props.lang.code !== 'cn'} size="small" type="primary">一键翻译</Button></div>
                    <div className={styles.mediaInfo}>
                        <TextArea onChange={(e)=>changeDesc(e)} value={desc}/>
                    </div>
                </div>
            </div>
            <PhotoPreview imagesList={imgLists} initIndex={previewIndex} closeCallBack={show => setShowPreview(show)} show={showPreview}></PhotoPreview>
        </div>
    )
})
export default MediaInfo;
