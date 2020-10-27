import React, {useState, useEffect} from 'react'
import { Modal, Form, Select, DatePicker, Input, Tabs, message } from 'antd'
import IconUploadItem from './IconUploadItem'
import moment from 'moment'
const { TabPane } = Tabs
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
}
const TAB_LIST = [{
    name: '首页',
    appIconType: 1
}, {
    name: '学院',
    appIconType: 2
}, {
    name: 'PS店铺',
    appIconType: 3
}, {
    name: '购物车',
    appIconType: 4
}, {
    name: '我的',
    appIconType: 5
}]
const BottomIconModal = (props) => {
    const {showModal, modalData, countryList, onConfirm, onCancel} = props
    const [allIcons, setAllIcons] = useState([])

    useEffect(() => {
        setAllIcons(modalData.extJson.appIconValue || [])
    }, [showModal])

    function handleImgChange (data, appIconType, index) {
        console.log('执行')
        let temp = [...allIcons]
        console.log(temp)
        console.log(data)
        let item = temp[index] || {}
        temp[index] = Object.assign(item, data, {
            appIconType
        })

        console.log(temp)
        setAllIcons(temp)
    }

    function onFinish (fieldsValue) {
        let data = JSON.parse(JSON.stringify(fieldsValue))
        data.id = modalData.id
        data.startTime = moment(data.startTime).valueOf()
        data.endTime = moment(data.endTime).valueOf()
        data.name = JSON.stringify({cn: data.name})
        data.extJson = JSON.stringify({appIconValue: allIcons})
        let iconsType = allIcons.map(item => {
            return item.appIconType
        })
        let iconsLen = allIcons.length
        let len = TAB_LIST.length
        if (!iconsLen) {
            message.error('【首页】图标不能为空')
            return
        } else if (iconsLen !== len) {
            for (let i = 0 ; i < len; i++) {
                if (!iconsType.includes(TAB_LIST[i].appIconType)) {
                    message.error(`【${TAB_LIST[i].name}】图标不能为空`)
                    return
                }
            }
        }
        let resItem = allIcons.find(item => !item.unselected || !item.selected)
        
        if (resItem) {
            message.error(`【${resItem.name}】图标值未设置完整`)
            return
        }
        
        if (data.startTime >= data.endTime) {
            message.error('结束时间不能小于开始时间')
            return
        } 

        onConfirm(data)
    }

    return (
        <Modal
            title="首页底部图标"
            destroyOnClose
            visible={showModal}
            onCancel={onCancel}
            maskClosable={false}
            okButtonProps={{ htmlType: 'submit', form: 'bottomIconForm'}}
        >
            <Form id="bottomIconForm" onFinish={onFinish} initialValues={modalData} {...formItemLayout}>
                <Form.Item name="moduleId" label="国家"
                    rules={[{
                        required: true,
                        message: '国家不能为空'
                    }]}
                >
                    <Select>
                    {
                        countryList.map((item) => (
                            <Select.Option value={item.id} key={item.id}>{item.countryName}</Select.Option>
                        ))
                    }
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="名称"
                    rules={[{
                        required: true,
                        message: '名称不能为空'
                    }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="startTime" label="开始时间"
                    rules={[{
                        required: true,
                        message: '开始时间不能为空'
                    }]}
                >
                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} placeholder="请输入开始时间"/>
                </Form.Item>
                <Form.Item name="endTime" label="结束时间"
                    rules={[{
                        required: true,
                        message: '结束时间不能为空'
                    }]}
                >
                    <DatePicker showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} placeholder="请输入结束时间"/>
                </Form.Item>
            </Form>

            <Tabs defaultActiveKey="index" style={{ padding: '0 24px' }}>
                {
                    TAB_LIST.map((tabItem, index) => (
                        <TabPane tab={tabItem.name} key={tabItem.name}>
                            <IconUploadItem item={allIcons[index] || {}} onChange={(data) => {
                                handleImgChange(data, tabItem.appIconType, index)
                            }}/>
                        </TabPane>
                    ))
                }
            </Tabs>
        </Modal>
    )
}

export default React.memo(BottomIconModal)