import React, { useState, useCallback } from 'react'
import { Modal, Tabs, Form, Input, Upload } from 'antd'

const { TabPane } = Tabs
const SendCouponModal = (props) => {
    const { showModal, onCancel, onConfirm, confirmLoading } = props

    const onFinish = useCallback((values) => {
        console.log(values)
    }, [])

    return (
        <Modal
            title="发券"
            visible={showModal}
            onCancel={oncancel}
            width={600}
            okButtonProps={{ htmlType: "submit", form: "sendCouponModal"}}
            confirmLoading={confirmLoading}
        >
            <Form id="sendCouponModal" onFinish={onFinish}>
                <Tabs>
                    <TabPane key="tableSend" label="导表发放">
                        
                    </TabPane>
                    <TabPane key="handSend" label="手动发放">

                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    )
}

export default React.memo(SendCouponModal);