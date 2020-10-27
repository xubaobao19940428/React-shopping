import React from 'react'
import { Modal, Descriptions, Table } from 'antd'

const CouponModal = (props) => {
    const { editData, showModal, onCancel } = props
    const columns = [{
        title: '优惠券ID',
        dataIndex: 'couponId'
    }, {
        title: '中文名称',
        key: 'nameCn',
        render: (_, item) => item.name && item.name.cn
    }, {
        title: '英文名称',
        key: 'nameEn',
        render: (_, item) => item.name && item.name.en
    }]
    return (
        <Modal
            visible={showModal}
            onCancel={onCancel}
            footer={null}
        >
            <Descriptions title="优惠券包信息">
                <Descriptions.Item label="券包ID">{editData.packageId}</Descriptions.Item>
                {
                    editData.name && Object.keys(editData.name).map(lang => (
                        <Descriptions.Item key={lang} label={lang}>{editData.name[lang]}</Descriptions.Item>
                    ))
                }
            </Descriptions>

            <Descriptions title="包含的优惠券信息" layout="vertical" bordered>
                <Table
                    columns={columns}
                    dataSource={editData.couponList}
                />
            </Descriptions>
        </Modal>
    )
}

export default React.memo(CouponModal)