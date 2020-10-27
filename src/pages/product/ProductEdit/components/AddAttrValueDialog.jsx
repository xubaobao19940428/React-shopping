import react, {useState, useEffect, useRef} from 'react'
import {Modal, Form, Input, Radio, Select, Button, DatePicker, Table, message} from 'antd'
import {useModel} from "@@/plugin-model/useModel";
import { addCustomizeAttrValue } from '@/services/product1'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 26,
        },
        sm: {
            span: 4,
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
const attrValueDialog = (props) => {
    const { showModal, attrId, onClose, onConfirm } = props
    const [loading, setLoading] = useState(false)
    const { languages } = useModel('dictionary');
    const [name, setName] = useState({})

    const nameColumns = [{
        title: '语言',
        key: 'lang',
        width: '30%',
        render: (text, item) => (
            <span>{item.desc}</span>
        )
    }, {
        title: '内容',
        key: 'desc',
        render: (text, item) => (
            <Input value={name[item.code]} onChange={(e) => handleNameChange(e, item.code)}/>
        )
    }]
    // 名称输入改变
    function handleNameChange(e, code) {
        let temp = { ...name }
        temp[code] = e.target.value
        setName(temp)
    }
    // 确定
    function onFinish () {
        if (!name['cn'] || !name['en']){
            return message.warning('中英文必填')
        }
        let data = []
        for(let key in name) {
            data.push({
                languageCode: key,
                name: name[key]
            })
        }
        setLoading(true)
        addCustomizeAttrValue({
            attrId: attrId,
            valueNameList: data
        }).then((res) => {
            setLoading(false)
            if (res.ret.errCode == 0) {
                onConfirm(res.data.attrValueList)
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    // 取消
    function handleCancel () {
        onClose()
    }

    return (
        <div>
            <Modal
                destroyOnClose
                title="新增属性值"
                visible={showModal}
                onCancel={handleCancel}
                confirmLoading={loading}
                okButtonProps={{ htmlType: 'submit', form: 'attrValueDialog'}}
            >
                <Form id="attrValueDialog" onFinish={onFinish} {...formItemLayout}>
                    <Form.Item name="name" label="属性值" rules={[{ required: true, message: '不能为空'}]}>
                        <div>
                            <Table
                                rowKey={record => record.code}
                                bordered
                                columns={nameColumns}
                                dataSource={languages}
                                pagination={{hideOnSinglePage: true}}
                                scroll={{ y: 160 }}
                            ></Table>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default React.memo(attrValueDialog)

