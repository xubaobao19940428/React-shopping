import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Form, Input, Space, Select, Radio, Upload, uploadButton, message, Cascader, Tag, TreeSelect } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from './addFirstCategory.less'
import { request } from 'umi'
import apiBaseUrl from '@/config/apiBaseUrl'
import { dealShowFileSrc } from '@/utils/utils'
import { categoryList } from '@/services/product1'
const { SHOW_PARENT, SHOW_ALL } = TreeSelect;
// 要使用React.forwardRef才能将ref属性暴露给父组件
const AddFirstCategory = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增一级分类')
    const [defaultValue, setDefaultValue] = useState({})
    const [pid, setPid] = useState(0)
    const [countryLanage, setCountryLanage] = useState([])
    const formRef = React.createRef(FormInstance)
    const [imageUrl, setImg] = useState('')
    const [param, setParam] = useState({})
    const [loading, setLoading] = useState(false)
    const [imageSelectUrl, setSelectImg] = useState('')
    const [selectParam, setSelectParam] = useState({})
    const [selectLoading, setSelectLoading] = useState(false)
    const [imageUnselectUrl, setUnselectImg] = useState('')
    const [unselectParam, setUnselectParam] = useState({})
    const [unselectLoading, setUnselectLoading] = useState(false)
    const [level, setLevel] = useState(1)
    const [type, setType] = useState('add')
    const [cateId, setCateId] = useState('')
    const [cateNameValue, setCateNameValue] = useState([])
    //paramAttrId和standardAttrId
    const [standardAttrId, setStandardAttrId] = useState('')
    const [paramAttrId, setParamAttrId] = useState('')
    //二级类目
    const [categoryOptions, setCategoryOptions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [defaultValueCategory,setDefaultValueCategory] = useState([])
    const [checkedCategory, setCategoryCheck] = useState([])
    useImperativeHandle(ref, () => {
        // changeVal 就是暴露给父组件的方法
        return {
            changeVal: (newVal) => {
                setVisible(newVal);
            },
            changeTitle: (newTitle) => {
                setTitle(newTitle)
            },
            changeLevel: (newLevalVal) => {
                setLevel(newLevalVal)
            },
            changeType: (newVal) => {
                setType(newVal);
            },
            changeDefaultVal: (newVal) => {
                setDefaultValue(newVal)
            },
            changePid: (newVal) => {
                setPid(newVal)
            },
            changeImageUrl: (newVal) => {
                setImg(newVal)
            },
            changeSelectImg: (newVal) => {
                setSelectImg(newVal)
            },
            changeUnselectImg: (newVal) => {
                setUnselectImg(newVal)
            },
            changePAndS: (data) => {
                setStandardAttrId(data.standardAttrId)
                setParamAttrId(data.paramAttrId)
                setCateId(data.cateId)
                setCategoryCheck(data.categoryList)
            },
            //二级分类的后台类目
            changeCateVal: () => {
                fetchCategory({
                    cateType: 2,
                    pid: 0,
                    level:1,
                })
            },
            changeCheckedCategory:(newVal)=>{
                setCategoryCheck(newVal)
            }
        }

    });
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
    const onFinish = values => {
        console.log('Received values of form:', values);
    }
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const uploadButtonSelect = (
        <div>
            {selectLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const uploadButtonUnselect = (
        <div>
            {unselectLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const handleOk = e => {
        formRef.current.validateFields().then(currentValue => {
            if (currentValue) {
                let nameValueList = nameValueListReturn(currentValue)
                if (imageUrl == '') {
                    message.warning('请上传类目图')
                    return
                }

                if (level == 1) {
                    if (imageSelectUrl == '') {
                        message.warning('请上传Icon已选中图片')
                        return
                    }
                    if (imageUnselectUrl == '') {
                        message.warning('请上传Icon未选中图片')
                        return
                    }
                    if(checkedCategory.length==0){
                        message.warning('请挑选后台类目分组')
                    }
                    let params = {
                        pid: pid ? pid : 0,
                        cateNameValueList: nameValueListReturn(currentValue),
                        cateType: 1,
                        cover: imageUrl,
                        level: level,
                        iconInfo: {
                            selected: imageSelectUrl,
                            unselected: imageUnselectUrl
                        },
                        countryCode: '',
                        bindId: '',
                        paramAttrId: paramAttrId,
                        standardAttrId: standardAttrId,
                        type: type,
                        cateId: cateId,
                        bindCateInfoList:[]
                    }
                    props.addOrUpdate(params)
                } else {
                    let str=[]
                    let nameObj = {}
                    nameValueListReturn(currentValue).forEach(langName => {
                            nameObj[langName.languageCode] = langName.name
                        })
                    let bindCateInfoList=[]
                    checkedCategory.map(item=>{
                        str.push(item.cateId)
                        bindCateInfoList.push({
                            cateId:item.cateId,
                            cateName:item.cateName
                        })
                    })
                    let params = {
                        pid: pid,
                        cateNameValueList: nameValueListReturn(currentValue),
                        cateType: 1,
                        cover: imageUrl,
                        level: level,
                        countryCode: '',
                        bindId: str.join(','),
                        paramAttrId: paramAttrId,
                        standardAttrId: standardAttrId,
                        type: type,
                        cateId: cateId,
                        cateName:currentValue.cn,
                        bindCateInfoList:bindCateInfoList,
                        nameObj:nameObj
                    }
                    props.addOrUpdate(params)
                }


            } else {
                console.log('error,submit')
            }
        })
    };
    //数据格式化name
    const nameValueListReturn = (currentValue) => {
        let nameValueList = []
        countryLanage.map(item => {
            for (var key in currentValue) {
                if (item.code == key) {
                    nameValueList.push({
                        languageCode: key,
                        name: currentValue[key] ? currentValue[key] : ''
                    })
                }
            }
        })
        return nameValueList
    }
    //上传前校验
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
    //选中图片
    const selectBeforeUpload = (file) => {
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
        const selectUploadParam = {
            type,
            fileName: file.name
        }
        setSelectParam(selectUploadParam);
        setSelectLoading(true);
    }
    const customRequestRotationSelect = (reqInfo) => {
        let formData = new FormData();
        formData.append('file', reqInfo.file);
        formData.append('param', reqInfo.data.param);
        request('/file/rest/uploadservices/uploadfile', {
            prefix: apiBaseUrl.file,
            data: formData,
            headers: reqInfo.headers
        }).then(res => {
            if (res.status === "600") {
                setSelectImg(dealShowFileSrc(res.original_link))
                setSelectLoading(false)

            }
        }).catch(err => {

        });
    }
    //未选中图片
    const unselectBeforeUpload = (file) => {
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
        setUnselectParam(uploadParam);
        setUnselectLoading(true);
    }
    const customRequestRotationUnselect = (reqInfo) => {
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
                setUnselectImg(dealShowFileSrc(res.original_link))
                setUnselectLoading(false)

            }
        }).catch(err => {

        });
    }
    const handleCancel = e => {
        props.handleCancel()
    };
    /**
     * 二级分类
     */
    const fetchCategory = ({ cateType, pid,level, page, countryCode }) => {
        categoryList({
            pid: pid,
            cateType: cateType,
            countryCode: countryCode
        }).then((res) => {
            if (res.ret.errCode === 0) {
                console.log(res)
                let data = []
                if (res.data.categoryUnitList) {
                    data = res.data.categoryUnitList.map(item => {
                        return {
                            pId: item.pid,
                            value: item.cateId,
                            cateId: item.cateId,
                            id: item.cateId,
                            title: item.cateName,
                            cateName:item.cateName,
                            key: item.cateId,
                            level:level,
                            isLeaf:level === 3 ? true : false
                        }
                    })
                } else {
                    data = []
                }
                if (pid == 0) {
                    setCategoryOptions(data)
                } else {
                    setCategoryOptions(categoryOptions.concat(data))

                }
            }
        })
    }
    const categoryChange = (val) => {
        console.log(val,categoryOptions)
        let filterData=[]
        categoryOptions.map(item => {
            val.map(selected => {
                if (item.cateId == selected.value&&item.level==3) {
                    filterData.push(item)
                }
            })  
        })
        console.log(filterData)
        let arr = checkedCategory.concat([])
        for (let i = 0; i < filterData.length; i++) {
            let data = filterData[i]
            let item = arr.find((val) => {
                return val.cateId == data.cateId;
            })
            if (!item) {
                arr.push(data);
            }

        }
        console.log(arr)
        setCategoryCheck(arr)
    }
    // 获取下一级分类
    const getSubCategory = (data) => {
        fetchCategory({
            pid: data.value,
            cateType:  2,
            level:data.level
        })
    }
    const onLoadData = (treeNode) => {
        console.log(treeNode)
        return new Promise(resolve => {
            setTimeout(() => {
                getSubCategory({ value: treeNode.cateId,level:treeNode.level+1})
            }, 300)
            resolve()
        })


    }
    useEffect(() => {
        let countryCodeLists = JSON.parse(localStorage.getItem('LANGUAGE_LIST'))
        setCountryLanage(countryCodeLists)
    }, [])
    return (
        <div>
                <Modal
                    title={title}
                    visible={visible}
                    style={{ fontSize: '20px' }}
                    width={850}
                    destroyOnClose
                    bodyStyle={{ textAlign: 'center' }}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取 消
                      </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            确 定
                      </Button>
                    ]}
                >
                    <Form
                        initialValues={defaultValue}
                        {...formItemLayout}
                        name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" ref={formRef}
                    >
                        <Form.Item
                            label="类目名称："
                            name="cateNameValue"
                        >
                            <table className="table table-bordered table-info">
                                <tbody>
                                    {
                                        countryLanage.map((item, index) => {
                                            return <tr key={index}>
                                                {
                                                    (item.code == 'cn' || item.code == 'en') ? <th key={item.code} className={styles['th']}><span className="required" style={{ color: 'red' }}>*</span><span>{item.desc + item.code}</span></th> : <th key={item.code} className={styles['th']}><span>{item.desc + item.code}</span></th>
                                                }
                                                <td className={styles['td']}>
                                                    <Form.Item name={item.code} rules={item.code == 'cn' || item.code == 'en' ? [{ required: true, message: '不能为空' }] : [{ required: false }]} style={{ marginBottom: 0 }}>
                                                        <Input placeholder="请输入" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </Form.Item>
                        <Form.Item
                            label="类目图："
                            name="cover1"
                            required
                        // rules={[{ required: true, message: '类目图不能为空' }]}
                        >
                            <div style={{ color: '#666666' }}>尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式</div>
                            <Form.Item name="cover">
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={handleBeforeUpload}
                                    customRequest={customRequestRotation}
                                    data={{ param: JSON.stringify(param) }}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </Form.Item>

                        </Form.Item>
                        {
                            level == 1 ?
                                <React.Fragment>
                                    <Form.Item
                                        label="Icon："
                                        name="icon"
                                        required
                                    // rules={[{ required: true, message: '类目图不能为空' }]}
                                    >
                                        <div style={{ color: '#666666' }}>尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式</div>
                                        <div className={styles["upload-icon"]}>
                                            <div className={styles["upload-selected"]}>
                                                <Upload
                                                    name="avatar"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    beforeUpload={selectBeforeUpload}
                                                    customRequest={customRequestRotationSelect}
                                                    data={{ param: JSON.stringify(selectParam) }}
                                                >
                                                    {imageSelectUrl ? <img src={imageSelectUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButtonSelect}
                                                </Upload>
                                                <p style={{ textAlign: 'left' }}>已选中</p>
                                            </div>
                                            <div className={styles["upload-noselected"]}>
                                                <Upload
                                                    name="avatar"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    beforeUpload={unselectBeforeUpload}
                                                    customRequest={customRequestRotationUnselect}
                                                    data={{ param: JSON.stringify(unselectParam) }}
                                                >
                                                    {imageUnselectUrl ? <img src={imageUnselectUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButtonUnselect}
                                                </Upload>
                                                <p style={{ textAlign: 'left' }}>未选中</p>
                                            </div>

                                        </div>
                                    </Form.Item>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div className={styles["cate-name"]}>
                                        {
                                            checkedCategory.map((item, index) => {
                                                return <Tag key={item.cateId} key={index} closable>{item.cateName}</Tag>
                                            })
                                        }
                                    </div>
                                    <Form.Item
                                        label="后台类目："
                                        name="category"
                                        required
                                    >
                                        <TreeSelect
                                            treeDataSimpleMode
                                            treeCheckStrictly={true}
                                            treeData={categoryOptions}
                                            value={selectedOptions}
                                            onChange={categoryChange}
                                            loadData={onLoadData}
                                            treeCheckable={true}
                                            // defaultValue={defaultValueCategory}
                                            showCheckedStrategy={SHOW_PARENT}
                                            placeholder='请选择商品后台类目'
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </React.Fragment>
                        }
                    </Form>
                </Modal>
        </div>
    );
})
export default AddFirstCategory