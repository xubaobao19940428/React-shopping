import React, {useState, useEffect} from 'react'
import { Upload, message } from 'antd'
import { request } from 'umi'
import { dealShowFileSrc } from '@/utils/utils'
import apiBaseUrl from '@/config/apiBaseUrl'
import styles from '../index.less'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const IconUploadItem = (props) => {
    const {item, onChange} = props
    const [loading, setLoading] = useState(false)
    const [unLoading, setUnLoading] = useState(false)
    const [newItem, setNewItem] = useState({
        unselected: '',
        selected: ''
    })

    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )

    const unUploadButton = (
        <div>
        {unLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    useEffect(() => {
        setNewItem(item || {})
    }, [item])

    function handleUploadUnselect (reqInfo) {
        setUnLoading(true)
        const formData = new FormData();
        let fileInfo = {
            fileName: reqInfo.file.name,
            type: 'product'
        }
        formData.append('file', reqInfo.file);
        formData.append('param', JSON.stringify(fileInfo));
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            setUnLoading(false)
            let temp = { ...newItem }
            temp.unselected = res.original_link

            setNewItem(temp)
            onChange(temp)
        }).catch(err => {})
    }

    function handleRemoveUnselect () {
        let temp = { ...newItem }
        temp.unselected = ''

        setNewItem(temp)
        onChange(temp)
    }

    function handleUploadSelect (reqInfo) {
        setLoading(true)
        const formData = new FormData();
        let fileInfo = {
            fileName: reqInfo.file.name,
            type: 'product'
        }
        formData.append('file', reqInfo.file)
        formData.append('param', JSON.stringify(fileInfo));
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            setLoading(false)

            let temp = { ...newItem }
            temp.selected = res.original_link

            setNewItem(temp)
            onChange(temp)
        }).catch(err => {})
    }

    function handleRemoveSelect (file) {
        let temp = { ...newItem }
        temp.selected = ''

        setNewItem(temp)
        onChange(temp)
    }

    return (
        <div>
            <div className="item-row">
                <label><span style={{ color: '#F56C6C' }}>*</span>未选中：</label>
                <Upload
                    listType="picture-card"
                    customRequest={handleUploadUnselect}
                    onRemove={handleRemoveUnselect}
                    showUploadList={false}
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                >
                    {newItem.unselected ? <img src={dealShowFileSrc(newItem.unselected)} alt="avatar" style={{ width: '100%' }} /> : unUploadButton}
                </Upload>
            </div>
            <div className="item-row">
                <label><span style={{ color: '#F56C6C' }}>*</span>已选中：</label>
                <Upload
                    listType="picture-card"
                    customRequest={handleUploadSelect}
                    showUploadList={false}
                    onRemove={handleRemoveSelect}
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                >
                    {newItem.selected ? <img src={dealShowFileSrc(newItem.selected)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </div>
        </div>
    )
}
export default React.memo(IconUploadItem)
