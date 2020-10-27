import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/modal.less';
import { Modal, message } from 'antd';
import { useModel } from 'umi';
import UploadImageByLang, { UploadImageByLangType, ImageInfo } from './index';
import { ModalProps } from 'antd/lib/modal';

interface UploadImageByLangModalType {
    // 确定回调，覆盖antd的onOk
    onSure: (images: ImageInfo[]) => void,
    //关闭回调，覆盖antd的onCancel
    onClose: () => void,
    // 透传antd modal参数
    modalProps?: ModalProps,
    // 多语言上传组件props
    uploadProps?: UploadImageByLangType,
    // 回显图片列表
    images?: ImageInfo[],
    // 是否显示
    show?: boolean
}

const UploadImageByLangModal = (props: UploadImageByLangModalType) => {
    const { onSure, onClose, modalProps = {}, uploadProps = {}, images = [], show = false } = props;
    const [showImages, setShowImages] = useState<ImageInfo[]>(images);
    const { languages } = useModel('dictionary');

    // 语言列表map
    const languageMap = {};

    for (let i = 0; i < languages.length; i++) {
        const language = languages[i];
        languageMap[language.code] = language.desc;
    }

    delete modalProps.onOk;
    delete modalProps.onCancel;
    delete uploadProps.images;

    // 校验并提交
    const checkAndSubmit = useCallback(imgs => {
        const requireCodes = uploadProps.requireLangCode || ['cn', 'en'];

        const imgMap = {};

        // 获得图片map数据
        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            imgMap[img.languageCode] = img.name;
        }

        let pass = true;
        let code = '';

        // 遍历查询
        for (let i = 0; i < requireCodes.length; i++) {
            const elem = requireCodes[i];
            if (!imgMap[elem]) {
                pass = false;
                code = elem;
                break;
            }
        }

        if (typeof onSure === 'function') {
            pass ? onSure(imgs) : message.warning(`${languageMap[code]}图片不能为空`);
        }
    }, []);

    // 根据传入图片长度更新显示图片
    useEffect(() => {
        setShowImages(images);
    }, [show, images.length]);

    return (
        <Modal
            title="添加多语言图片"
            width={900}
            onOk={() => checkAndSubmit(showImages)}
            visible={show}
            onCancel={() => {
                setShowImages(images);
                typeof onClose === 'function' && onClose();
            }}
            {...modalProps}
        >
            <div className={styles.container}><UploadImageByLang images={showImages} onChange={imgs => {
                setShowImages(imgs);
            }} {...uploadProps} /></div>
        </Modal>
    )
}

export default UploadImageByLangModal;
