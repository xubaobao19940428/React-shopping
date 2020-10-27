import React, { useCallback, useState, useEffect } from 'react';
import styles from './styles/index.less';
import { useModel } from 'umi';
import UploadFile from '@/components/UploadFile';
import { Button, message, Tooltip } from 'antd';

export interface ImageInfo {
    languageCode: string,
    name: string
}

export interface UploadImageByLangType {
    // 必填项国家code
    requireLangCode?: string[] | ['cn' | 'en' | 'ms' | 'th' | 'id'],
    // 当前显示的图片
    images?: ImageInfo[],
    // 图片变化回调
    onChange?: (images: ImageInfo[]) => void
}

const UploadImageByLang = (props: UploadImageByLangType) => {
    const { requireLangCode = ['cn', 'en'], images = [], onChange } = props;
    const { languages } = useModel('dictionary');
    const [showImages, setShowImages] = useState<ImageInfo[]>(images);

    // 设置图片显示
    const setImage = useCallback((images, langCode) => {
        let imgs = [];
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.languageCode === langCode) {
                imgs.push(img.name);
                break;
            }
        }

        return imgs;
    }, [showImages]);

    // 同步所有
    const syncUploadAll = useCallback(image => {
        if (!image) {
            message.warning('请先上传当前项图片');
            return;
        }
        const newLangImages: ImageInfo[] = languages.map(lang => {
            return {
                languageCode: lang.code,
                name: image
            }
        });

        setShowImages(newLangImages);
        changeImageList(newLangImages);
    }, [languages]);
    // 同步未上传
    const syncUploadSurp = useCallback((image, list) => {
        if (!image) {
            message.warning('请先上传当前项图片');
            return;
        }
        const infos: any = [];
        for (let i = 0; i < list.length; i++) {
            infos.push(list[i].languageCode)
        }
        const newLangImages: ImageInfo[] = languages.map(lang => {
            const info: any = {};
            if (infos.indexOf(lang.code) < 0) {
                info.languageCode = lang.code;
                info.name = image;
            } else {
                for (let i = 0; i < list.length; i++) {
                    const img = list[i];
                    if (img.languageCode == lang.code) {
                        info.languageCode = img.languageCode;
                        info.name = img.name;
                        break;
                    }
                }
            }
            return info;
        });

        setShowImages(newLangImages);
        changeImageList(newLangImages);
    }, [languages]);

    const changeImageList = useCallback(newImages => {
        typeof onChange === 'function' && onChange(newImages);
    }, []);

    useEffect(() => {
        setShowImages(images);
    }, [images]);

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {
                    languages.map(lang => <div key={lang.code} className={styles.box}>
                        <div className={styles.countryName}>{requireLangCode.indexOf(lang.code) >= 0 ? <span>*</span> : null}{lang.desc}</div>
                        <div className={styles.uploadBox}>
                            <UploadFile max={1} values={setImage(showImages, lang.code)}
                                onUploaded={file => {
                                    const newImages: ImageInfo[] = [...showImages, { languageCode: lang.code, name: file.url }];
                                    setShowImages(newImages);
                                    changeImageList(newImages);
                                }} onDelete={() => {
                                    const newImages: ImageInfo[] = showImages.filter(item => item.languageCode != lang.code);
                                    setShowImages(newImages);
                                    changeImageList(newImages);
                                }} />
                        </div>
                        <div className={styles.action}>
                            <Tooltip title="将当前图片同步到其他所有语言项（已上传的会被覆盖）"><Button type="link" onClick={() => syncUploadAll(setImage(showImages, lang.code)[0])}>同步所有</Button></Tooltip>
                            <Tooltip title="将当前图片同步到其他未上传图片的语言项"><Button type="link" onClick={() => syncUploadSurp(setImage(showImages, lang.code)[0], showImages)}>同步未上传</Button></Tooltip>
                        </div>
                    </div>)
                }
            </div>
            <div className={styles.tip}><span>上传图片：</span>支持上传.jpg/.png/.gif格式的文件，请保持各语言版本一致</div>
        </div>
    )
}

export default UploadImageByLang;