// 商品图片视频
import React, {useRef, useState, useCallback, useEffect, useImperativeHandle} from 'react';
import styles from './styles/index.less';
import { Button, Tabs, Space, Input, Upload, message } from 'antd';
import { UploadFile } from '@/components'
import { Drag } from '@/components'
import { useModel, request } from 'umi';
import apiBaseUrl from '@/config/apiBaseUrl';
import { dealShowFileSrc } from '@/utils/utils'
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import PhotoPreview from '@/components/PhotoPreview'
import MediaInfo from './components/MediaInfo'
import { FormInstance } from 'antd/lib/form';
import ImgSynchronous from './components/ImgSynchronous'
const { TabPane } = Tabs;
const { TextArea } = Input;
const ProductMultiMedia = React.forwardRef((props, ref) => {
    const { languages } = useModel('dictionary');
    const [tabActiveKey, setTabActiveKey] = useState('cn')
    const changeTab = useCallback((val) => {
        setTabActiveKey(val)
        mediaInfoRef.current.changeVal(mediaInfo)
    })

    const mediaInfoRef = useRef()
    const [mediaInfo, setMediaInfo] = useState({})
    //同步视频和图片
    const [visible, setVisible] = useState(false)
    const resetMediaInfo = (data) => {
        let originData = JSON.parse(JSON.stringify(data))
        let mediaLangInfo = {}
        mediaLangInfo[originData.lang] = {
            detailPics: originData.detailPics,
            rotationPics: originData.rotationPics,
            videoInfo: originData.videoInfo,
            desc:originData.desc
        }
        mediaLangInfo = Object.assign(mediaInfo, mediaLangInfo)
        setMediaInfo(mediaLangInfo)
        mediaInfoRef.current.changeVal(mediaLangInfo)
    }
    // const setDescdetail =(data)=>{
    //     let mediaLangInfo = JSON.parse(JSON.stringify(mediaInfo))
    //     mediaLangInfo[data.lang].desc = data.value
    //     setMediaInfo(mediaLangInfo)
    // }
    //删除图片
    const deleteImg = (index, type, lang) => {
        let oldData = JSON.parse(JSON.stringify(mediaInfo))
        for (var key in oldData) {
            if (key == lang) {
                if (type == 'rotation') {
                    oldData[key].rotationPics.splice(index, 1)
                } else if (type == 'detail') {
                    oldData[key].detailPics.splice(index, 1)
                } else if (type == 'video') {
                    delete oldData[key]['videoInfo']['src']
                }

            }
        }
        setMediaInfo(oldData)
        mediaInfoRef.current.changeVal(oldData)
    }
    //图片和视频同步
    const changeVisible = () => {
        setVisible(true)
    }
    const resetVisible = () => {
        setVisible(false)
    }
    const syncImg = (data) => {
        if (!mediaInfo[data.sourceLang]) {
            setVisible(false)
        } else {
            let originData = JSON.parse(JSON.stringify(mediaInfo))
            data.targetLang.map(item => {
                originData[item] = originData[data.sourceLang]
            })
            setMediaInfo(originData)
            mediaInfoRef.current.changeVal(originData)
            setVisible(false)
        }
    }
    console.log('ProductMultiMedia-----')

    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            getData: () => {
                if(!mediaInfo['cn']||!mediaInfo['en']){
                    message.warning('未上传简体中文或English商品主图')
                    return false
                }
                for(var key in mediaInfo){
                   if(key=='cn'||key=='en'){
                       if(mediaInfo[key].rotationPics.length<3){
                           message.warning('简体中文、English商品主图不少于三张')
                           return false
                       }
                   }
                }
                return mediaInfo
            }
        }

    });
    useEffect(()=>{
        setMediaInfo(props.mediaInfo)
    },[props.mediaInfo])
    return (
        <div className={styles.productMultiMedia}>
            <div className={styles.uploadMultiMedia}>
                <Space>
                    <Button size="small" type="primary">一键传图</Button>
                    <Button size="small" type="primary" onClick={changeVisible}>同步至其他语言</Button>
                </Space>
            </div>
            <Tabs defaultActiveKey={'cn'} activeKey={tabActiveKey} onTabClick={changeTab}>
                {
                    languages.map(lang => <TabPane tab={lang.desc} key={lang.code}>
                        <MediaInfo ref={mediaInfoRef} lang={lang.code} mediaInfo={mediaInfo} resetMediaInfo={resetMediaInfo} deleteImg={deleteImg}></MediaInfo>
                    </TabPane>)
                }
            </Tabs>
            <ImgSynchronous visible={visible} resetVisible={resetVisible} syncImg={syncImg}></ImgSynchronous>
        </div>
    )
})

export default ProductMultiMedia
