import React, { useState, useCallback, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

interface ImageType {
    // 图片链接
    url: string
}

interface PhotoPreviewTypes {
    // 是否展示，默认值为false
    show?: boolean,
    // 图片列表
    imagesList: ImageType[] | string[],
    // 当前显示图片索引
    initIndex?: number,
    // 关闭回调
    closeCallBack: (show: boolean) => void
}

/**
 * 图片预览
 */

const PhotoPreview = (props: PhotoPreviewTypes) => {
    const { show = false, initIndex = 0, closeCallBack } = props;
    const imagesList: any = props.imagesList;
    const [showIndex, setShowIndex] = useState(0);
    const [images, setImages] = useState([]);

    // 设置图片列表
    const setImageList = useCallback(() => {
        let result: any = [];
        images.map((item: ImageType, index) => {
            result.push(<li className={showIndex == index ? styles.show : ''} key={index}>
                <img src={typeof item === 'object' ? item.url : item} />
            </li>);
        });
        return result;
    }, [images, showIndex]);

    // 上一张
    const handlePrev = useCallback(index => {
        if (index > 0) {
            index -= 1;
            setShowIndex(index);
        }
    }, []);

    // 下一张
    const handleNext = useCallback((index, max) => {
        if (index < max) {
            index += 1;
            setShowIndex(index);
        }
    }, []);

    // 关闭
    const handleClose = useCallback(() => {
        typeof closeCallBack === 'function' && closeCallBack(false);
    }, []);

    let imageIndex = showIndex;

    useEffect(() => {
        setShowIndex(initIndex);
        setImages(imagesList);
        const handleKeyUpEvent = (event: any) => {
            console.log(1);
            switch (event.keyCode) {
                // 按下ESC
                case 27:
                    handleClose();
                    break;
                case 37:
                    if (imageIndex > 0) {
                        imageIndex -= 1;
                    }
                    setShowIndex(imageIndex);
                    break;
                case 39:
                    if (imageIndex < imagesList.length - 1) {
                        imageIndex += 1;
                    }
                    setShowIndex(imageIndex);
                    break;
                default:
                    break;
            }
        }
        if (show) {
            document.addEventListener('keyup', handleKeyUpEvent, false);
        } else {
            document.removeEventListener('keyup', handleKeyUpEvent);
        }
        return () => {
            document.removeEventListener('keyup', handleKeyUpEvent);
        }
    }, [images, show, initIndex]);

    return (
        <div className={styles.container} style={{ display: show ? 'flex' : 'none' }}>
            <div className={styles.top}>
                <div className={styles.close} onClick={handleClose}><CloseOutlined /></div>
            </div>
            <div className={styles.box}>
                <div hidden={imagesList.length == 1} className={classnames(styles.changeSwipe, styles.prev)} onClick={() => handlePrev(showIndex)}><LeftOutlined /></div>
                <div hidden={imagesList.length == 1} className={classnames(styles.changeSwipe, styles.next)} onClick={() => handleNext(showIndex, images.length - 1)}><RightOutlined /></div>
                <ul className={styles.list}>
                    {setImageList()}
                </ul>
            </div>
            {/* <div className={styles.bottom}></div> */}
        </div>
    )
}

const isUpdate = (prevProps: any, nextProps: any) => {
    if (nextProps.show && prevProps.show === nextProps.show) {
        return true;
    } else {
        return false;
    }
}

export default React.memo(PhotoPreview, isUpdate);