import React, { useState, useCallback, useEffect, useImperativeHandle } from 'react';
import styles from './index.less';
import { request } from 'umi';
import { Upload, Spin } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import apiBaseUrl from '../../config/apiBaseUrl';
import { message } from 'antd';
import { dealShowFileSrc } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import PhotoPreview from '@/components/PhotoPreview';

// 上传组件属性类型
interface UploadFilePropsType extends UploadProps {
    children?: JSX.Element;
    // 文件是否可下载，默认为false
    download?: boolean,
    // 图片是否可预览，默认为true
    preView?: boolean,
    // 文件上传尺寸限制
    maxSize?: number,
    // 最大上传数，默认值9999
    max?: number,
    // 是否可删除，默认为ture
    del?: boolean,
    // 当前图片列表
    values?: any[] | [],
    // 上传开始前回调
    uploadStart?: (loading: boolean) => void,
    // 上传完成回调函数
    onUploaded?: (file: any, fileList: any[]) => void,
    // 删除回调函数，返回删除文件索引、当前文件列表、删除文件信息
    onDelete?: (index: number, fileList: any[], file: any) => void,
    // 文件路径字段
    pathKey?: string
    update?: boolean
}

/**
 * 上传组件
 * 1.接入数据接口 2.上传校验 3.组件样式 4.数据返回 5.图片预览(fileType为image) 6.下载
 */

const UploadFile = React.forwardRef((props: UploadFilePropsType, ref) => {
    const {
        max = 99999,
        preView = true,
        download = false,
        del = true,
        values = [],
        maxSize,
        pathKey,
        onUploaded,
        onDelete,
        uploadStart,
        update = false,
        ...uploadProps
    } = props;

    // 当前上传文件列表
    const [fileList, setFileList] = useState([]);

    const [param, setParam] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [showIndex, setShowIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const setImageList = useCallback((imagesInfo: any) => {
        const imgList: any = []; // 需要显示的图片列表
        // 判断传入值是否为数组
        if (Object.prototype.toString.call(imagesInfo).toLocaleLowerCase().indexOf('array') < 0) {
            return;
        }
        for (let i = 0; i < imagesInfo.length; i++) {
            const img: any = imagesInfo[i];
            const imgType: string = typeof (img); // 子项数据类型
            // 判断子项是否是对象，如果是对象，根据pathKey字段构建数据，如果没有pathKey，则默认取url字段
            if (imgType === 'object') {
                const imgUrl = !!pathKey ? img[pathKey] : img.url;
                // url不存在则忽略此数据
                if (!imgUrl) {
                    continue;
                }
                // 判断是否有name字段，没有则根据url取文件名
                let filename = '';
                if (!img.name) {
                    const arr = imgUrl.split('/');
                    filename = arr[arr.length - 1];
                } else {
                    filename = img.name;
                }
                imgList.push({
                    uid: i,
                    url: dealShowFileSrc(imgUrl),
                    status: 'done',
                    name: filename
                });
            } else {
                const arr = img.split('/');
                const filename = arr[arr.length - 1];
                imgList.push({
                    uid: i,
                    url: dealShowFileSrc(img),
                    status: 'done',
                    name: filename
                });
            }
        }
        console.log(imgList)
        setFileList(imgList);
    }, []);

    const handleBeforeUpload = (file: any) => {
        const fileType = file.type.split('/')[0];   // 获得上传文件类型
        const isLt2M = file.size / 1024 / 1024 <= 2;   // 2M限制
        const isLt30M = file.size / 1024 / 1024 <= 30;    // 30M限制
        const isLt = maxSize ? file.size <= maxSize : true;
        const limit = maxSize ? isLt : fileType === 'image' ? isLt2M : isLt30M; // 大小限制

        // 提示
        if (!limit) {
            if (maxSize) {
                message.error(`上传图片大小不能超过 ${maxSize / 1024 / 1024}MB!`);
            } else if (isLt2M) {
                message.error('上传图片大小不能超过 2MB!');
            } else {
                message.error('上传图片大小不能超过 30MB!');
            }
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
        console.log(uploadParam)
        setParam(uploadParam);

        setLoading(true);

        typeof uploadStart === 'function' && uploadStart(limit);

        return limit;
    }

    const option: UploadProps = {
        fileList,
        listType: "picture-card",
        headers: {
            token: localStorage.getItem('adminToken') || ''
        },
        beforeUpload: handleBeforeUpload,
        data: {
            param: JSON.stringify(param)
        },
        showUploadList: {
            showDownloadIcon: download,
            showPreviewIcon: preView,
            showRemoveIcon: del
        },
        // 图片预览
        onPreview: file => {
            let index = 0;
            for (let i = 0; i < fileList.length; i++) {
                const f: any = fileList[i];
                if (f.uid === file.uid) {
                    index = i;
                    break;
                }
            }
            setShowIndex(index);
            setShowPreview(true);
            return preView;
        },
        // 文件删除
        onRemove: (file: any) => {
            if (del) {
                const files = fileList.filter((f: any) => f.uid != file.uid);
                setFileList(files);

                // 当前显示列表
                const result: any = [];
                // 被删除文件
                let f: any = {};
                for (let i = 0; i < values.length; i++) {
                    if (file.uid !== i) {
                        result.push(values[i]);
                    } else {
                        f = values[i];
                    }
                }

                typeof onDelete === 'function' && onDelete(file.uid, result, f);
            }
            return del;
        },
        // 自定义上传
        customRequest: (reqInfo: any) => {
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
                    const list: any = [...fileList];
                    const urlStr = res.original_link.split('/');
                    list.push({
                        uid: list.length,
                        url: dealShowFileSrc(res.original_link),
                        status: 'done',
                        name: urlStr[urlStr.length - 1]
                    });
                    console.log(list)
                    setFileList(list);

                    const publicPath = {};
                    const path = {};
                    for (const key in res) {
                        if (key.indexOf('_link') >= 0) {
                            publicPath[key] = dealShowFileSrc(res[key]);
                            path[key] = res[key];
                        }
                    }

                    setLoading(false);

                    typeof onUploaded === 'function' && onUploaded({ publicPath, path, url: res.original_link }, list);
                }
            }).catch(err => {});
        },
        ...uploadProps
    }

    useImperativeHandle(ref, () => {
        return {
            setImages: (imgs: string[]) => {
                setImageList(imgs);
            }
        }
    });

    useEffect(() => {
        setImageList(values);
    }, [update ? values : values.length]);

    return (
        <div className={styles.uploadContainer}>
            <Upload {...option}>
                {
                    fileList.length < max && <span className={styles.upload}>
                        {
                            props.children || loading ? <Spin /> : <PlusOutlined />
                        }
                    </span>
                }
            </Upload>
            <PhotoPreview closeCallBack={show => setShowPreview(show)} initIndex={showIndex} show={showPreview} imagesList={fileList} />
        </div>
    )
});

export default UploadFile;