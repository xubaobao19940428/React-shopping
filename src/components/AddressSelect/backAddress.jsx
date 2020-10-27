import React, { useEffect, useState } from "react";
import { Checkbox, Modal } from "antd";
import { getCountryDivision } from '@/services/i18n'
import './index.less'

const BackAddress = (props) => {
    const {showModal, countryCode, propStateList, addressDisableList, onCancel, onConfirm } = props
    const [addressList, setAddressList] = useState([])
    const [select, setSelect] = useState(false)

    // 地址列表
    function getAddress () {
        getCountryDivision({
            countryCode: countryCode
        }).then((res) => {
            if (res.ret.errcode === 1) {
                for (let i = 0; i < res.area.length; i++) {
                    res.area[i]['selectList'] = []
                    if (propStateList && propStateList.length > 0) {
                        for (let j = 0; j < res.area[i].stateName.length; j++) {
                            let item = propStateList.find((val) => {
                                return val == res.area[i].stateName[j]
                            })
                            if (item) {
                                res.area[i].selectList.push(item)
                            }
                        }
                    }
                    res.area[i]['selectAll'] = false
                    if (res.area[i].selectList.length == 0) {
                        res.area[i].selectAll = false
                    } else if (res.area[i].selectList.length == res.area[i].stateName.length) {
                        res.area[i].selectAll = true
                    }
                }
                setAddressList(res.area)
            }
        })
    }

    // 区域 东马西马值改变
    function areaSelectChange (data, areaI, selectAll) {
        let area = JSON.parse(JSON.stringify(data))
        if (selectAll) {
            for (let i = 0; i < area.stateName.length; i++) {
                let stateI = area.selectList.findIndex((val) => {
                    return val == area.stateName[i]
                })
                if (stateI == -1) {
                    let disabledStateI = -1
                    if (addressDisableList) {
                        disabledStateI = addressDisableList.findIndex((item) => {
                            return item === area.stateName[i]
                        })
                    }
                    if (disabledStateI == -1) {
                        area.selectList.push(area.stateName[i])
                    }
                }
            }
        } else {
            area.selectList = []
        }
        area.selectAll = selectAll
        let newList = JSON.parse(JSON.stringify(addressList))
        newList[areaI] = area
        setAddressList(newList)
    }

    // 省改变
    function stateChange (areaI, state, checked) {
        let newList = JSON.parse(JSON.stringify(addressList))
        if (checked) {
            newList[areaI].selectList.push(state)
        } else {
            let i = newList[areaI].selectList.findIndex((val) => {
                return val == state
            })
            if (i != -1) {
                newList[areaI].selectList.splice(i, 1)
            }
        }

        if (newList[areaI].selectList.length == newList[areaI].stateName.length) {
            newList[areaI].selectAll = true
        } else {
            newList[areaI].selectAll = false
        }
        setAddressList(newList)
    }

    function handleConfirm () {
        let selectState = []
        if (countryCode == 'SG') {
            if (select) {
                selectState = ['Singapore']
            }
        } else {
            for (let i = 0; i < addressList.length; i++) {
                if (addressList[i].selectList.length > 0) {
                    selectState = selectState.concat(addressList[i].selectList)
                }
            }
        }
        onConfirm(selectState)
    }

    function handleCancel () {
        onCancel()
    }

    useEffect(() => {
        getAddress()
    }, [])

    return <Modal
        destroyOnClose
        visible={showModal}
        title="后台地址选择"
        onOk={handleConfirm}
        width="850px"
        onCancel={handleCancel}
    >
        {
            countryCode == 'SG' ? (<div>
                <Checkbox value="Singapore" checked={select} onChange={(e) => setSelect(e.target.checked)}>Singapore</Checkbox>
            </div>) : (<div>
                {
                    addressList.map((area, areaI) => {
                        return <div key={areaI} className="area-wrapper">
                            <Checkbox checked={area.selectAll}
                                      onChange={(e) => areaSelectChange(area, areaI, e.target.checked)}
                            >
                                {area.areaName}
                            </Checkbox>
                            <Checkbox.Group className="state-wrapper" value={area.selectList} style={{ width: '100%' }}>
                                {
                                    area.stateName.map((state, stateI) => {
                                        return <Checkbox value={state} key={stateI}
                                                         onChange={(e) => stateChange(areaI, state, e.target.checked)}
                                        >
                                            {state}
                                        </Checkbox>
                                    })
                                }
                            </Checkbox.Group>
                        </div>
                    })
                }
            </div>)
        }
    </Modal>
}
export default React.memo(BackAddress)
