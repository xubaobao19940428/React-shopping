import React, { useState, useEffect } from 'react'
import { Button, Modal, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { editActivityRule } from '@/services/marketing'
import RuleCommon from './RuleCommon'
import RulePromotion from './RulePromotion'

const components = {
    RuleCommon,
    RulePromotion
}

const ModalContent = (props) => {
    const { curItem } = props
    let EleContent = RuleCommon
    if (curItem.isPromotion) {
        EleContent = RulePromotion
    }

    return <EleContent {...props} />
}

const ActivityRuleInfo = (props) => {
    const { GROUP_RULE_LIST, PROMOTION_TYPE_OBJ, ruleInfo, getRuleInfo, getBasicInfo, activityId, languages, basicInfo } = props
    const [showModal, setShowModal] = useState(false)
    const [curItem, setCurItem] = useState([])

    function handleEdit (item) {
        setCurItem(item)
        setShowModal(true)
    }

    function onCancel () {
        setShowModal(false)
    }

    function handleRuleConfirm (data, updateBasicInfo) {
        editActivityRule({
            activityId,
            ...data
        }).then(res => {
            if (res.ret.errCode === 0) {
                message.success('保存成功')
                setShowModal(false)
                setTimeout(() => {
                    if (updateBasicInfo) {
                        getBasicInfo(activityId)
                    }
                    getRuleInfo()
                }, 300)
            }
        })
    }

    return (
        <div>
            <ul>
                {GROUP_RULE_LIST.map(item => (
                    <li className="rule-item" key={item.type} onClick={() => handleEdit(item)}>
                        <span>{item.name}</span>
                        <EditOutlined className="rule-btn"/>
                    </li>
                ))}
            </ul>

            <Modal
                destroyOnClose
                visible={showModal}
                title={curItem.name}
                footer={null}
                width="850px"
                onCancel={onCancel}
                className="rule-box"
            >
                <ModalContent
                    type="edit"
                    showModal={showModal}
                    key={curItem.name}
                    ruleInfo={ruleInfo}
                    onConfirm={handleRuleConfirm}
                    onCancel={onCancel}
                    curItem={curItem}
                    basicInfo={basicInfo}
                    languages={languages}
                />
            </Modal>
        </div>
    )
}

export default React.memo(ActivityRuleInfo)
