import React, { useState } from 'react'
import { DatePicker, Form, Radio, Modal } from 'antd'
import moment from 'moment'

const TimeSelect = (props) => {
    const { timeList, showModal, onCancel, onNext, needDay } = props
    const curValues = {
        date: null,
        time: timeList[0].value
    }

    function disabledDate(current) {
        return current && current < moment().startOf('day')
    }
    
    function onFinish (values) {
        let date = values.date.format('YYYY-MM-DD')
        let preheatStartTime = moment(date + ' 00:00:00').valueOf()
        let startTime = moment(date + ' ' + values.time).valueOf()
        let endTime = preheatStartTime + 3600 * 1000 * 24 * needDay - 1
        onNext({
            startTime,
            endTime,
            preheatStartTime
        })
    }

    return (
        <Modal
            destroyOnClose
            title="添加商品-选择时段"
            visible={showModal}
            onCancel={onCancel}
            okText="下一步"
            width={600}
            okButtonProps={{ htmlType: 'submit', form: 'timeSelectForm'}}
        >
            <Form id="timeSelectForm" onFinish={onFinish} initialValues={curValues}>
                <Form.Item name="date" label="选择日期" rules={[{required: true,message: '必选'}]}>
                    <DatePicker disabledDate={disabledDate} style={{ width: '80%' }}/>
                </Form.Item>
                <Form.Item name="time" label="选择时段" rules={[{required: true,message: '必选'}]}>
                    <Radio.Group
                        options={timeList}
                        optionType="button"
                        buttonStyle="solid"
                        className="time-select-box"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default React.memo(TimeSelect)