import React, { useState, useEffect } from 'react'
import {Form, Button, Input, InputNumber, Table, Select, message } from 'antd'
import BackAddress from "@/components/AddressSelect/backAddress";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import commonEnum from '../../ActivityManage/enum'
import { getCurrencyUnit } from '@/utils/index'
import {dealShowFileSrc, splitData} from '@/utils/utils'
import { getSpuInfoBySku } from '@/services/product'
import { queryCouponPackageDetails } from '@/services/coupon_proto.js'
import CouponModal from './CouponModal'
import '../index.less'

const { PROMOTION_TYPE_OBJ, GROUP_RULE_LIST } = commonEnum
let promotionEnum = GROUP_RULE_LIST.find((val) => {
    return val.isPromotion
})

const RulePromotion = (props) => {
    const { ruleInfo, basicInfo, onCancel, onConfirm, languages, type } = props
    const [curValues, setCurValues] = useState(promotionEnum.content)
    const [countryCode, setCountryCode] = useState('MY')
    const [showModal, setShowModal] = useState(false)
    const [curRuleI, setCurRuleI] = useState(-1)
    const [propStateList, setPropStateList] = useState([])
    const [threshold, setThreshold] = useState('')
    const [skuValue, setSkuValue] = useState('')
    const [showCouponDetail, setShowCoupon] = useState(false)
    const [editData, setEditData] = useState({
        name: {}
    })

    useEffect(() => {
        let temp = JSON.parse(JSON.stringify(ruleInfo))
        let tempBasicInfo = JSON.parse(JSON.stringify(basicInfo))
        let item = temp[100]
        if (item) {
            let param = {}
            let originParam = item.originParam ? JSON.parse(item.originParam) : {
                type: 1,
                value: []
            }
            param.promotionLabel = tempBasicInfo.promotionLabel
            param.ruleDesc = tempBasicInfo.ruleDesc
            param.curType = originParam.type
    
            if (originParam.type == 9 || originParam.type == 10) {
                // 赠品 { "type": 9,  "value": { "giftSkuList": [], "threshold": '' }}
                param.ruleList = originParam.value.giftSkuList
                setThreshold(originParam.value.threshold)
            } else if (originParam.type == 6 || originParam.type == 7) {
                // 发券的 {"type": 6, "value": [{"threshold": 100, "couponId": "4234", "name": "4324"}]}
                // for (let i = 0; i < originParam.value.length; i++) {
                //     originParam.value[i] = [originParam.value[i].threshold, originParam.value[i].couponId]
                // }
                param.ruleList = originParam.value
            } else if (originParam.type == 11 || originParam.type == 12) {
                // 11 满件包邮 12 满额包邮  {  "type": "11", "value": [{ "region":["SABAH","SARAWAK"], "threshold":10 }] }
                param.ruleList = originParam.value
            } else {
                // 其他 { "type": 9,  "value": ["100;50","200;100"]}
                for (let i = 0; i < originParam.value.length; i++) {
                    originParam.value[i] = originParam.value[i].split(';')
                }
                param.ruleList = originParam.value
            }
    
            setCurValues(param) // 只保存促销的相关内容
            setCountryCode(tempBasicInfo.countryCode)
        }
    }, [])

    // 规则文案
    function handleDescChange (e, item) {
        let newData = { ...curValues }
        newData.ruleDesc[item.code] = e.target.value
        setCurValues(newData)
    }
    // 标签
    function handleLabelChange (e, item) {
        let newData = { ...curValues }
        newData.promotionLabel[item.code] = e.target.value
        setCurValues(newData)
    }
    // 删除
    function handleDel (index) {
        let newData = { ...curValues }
        newData.ruleList.splice(index, 1)
        setCurValues(newData)
    }
    // 新增
    function handleAdd() {
        let newData = { ...curValues }
        if (curValues.curType == 11 || curValues.curType == 12) {
            newData.ruleList.push({
                region: [],
                threshold: ''
            })
        } else if (curValues.curType == 6 || curValues.curType == 7) {
            newData.ruleList.push([{threshold: '', packageId: ''}])
        } else {
            newData.ruleList.push(['', ''])
        }
        setCurValues(newData)
    }

    // 类型更改
    function typeChange(val) {
        let newData = { ...curValues }
        newData.curType = val
        newData.ruleList = []
        setCurValues(newData)
    }

    // 输入内容改变
    function ruleChange(val, listI, valI) {
        let newData = { ...curValues }
        if (curValues.curType == 6 || curValues.curType == 7) {
            newData.ruleList[listI][valI] = val // 对于优惠券valI是对应的属性名
        } else {
            newData.ruleList[listI][valI] = val
        }
        setCurValues(newData)
    }

    // 获取优惠券的详情
    function handleCouponPackageSearch(e, i) {
        let val = e.target.value
        let newData = { ...curValues }
        queryCouponPackageDetails({
            couponPackageId: val,
            type: 2
        }).then(res => {
            if (res.ret.errcode === 1) {
                let data = res.couponPackageQueryResultPb
                let name = {}
                data.couponPackageDopb.name.forEach(lang => {
                    name[lang] = data.couponPackageDopb.name[lang]
                })
                newData.ruleList[i].name = name
                newData.ruleList[i].couponList = data.couponQueryResultPb.map(coupon => {
                    let couponName = {}
                    coupon.name.forEach(lang => {
                        couponName[lang] = coupon.name[lang]
                    })
                    return {
                        couponId: coupon.couponId,
                        name: couponName
                    }
                })
                setCurValues(newData)
            } else {
                message.error(`优惠券包ID【${val}】错误`)
            }
        })
    }

    function handleView(i) {
        setEditData(curValues.ruleList[i])
        setShowCoupon(true)
    }

    // 包邮条件改变
    function freeThresholdChange(val, listI) {
        let newData = { ...curValues }
        newData.ruleList[listI].threshold = val
        setCurValues(newData)
    }

    // 显示地址选择弹窗
    function showAddressDialog(item, i) {
        setShowModal(true)
        setPropStateList(item)
        setCurRuleI(i)
    }
    // 关闭地址选择弹窗
    function onAddressClose() {
        setShowModal(false)
    }
    // 地址确认弹窗
    function onAddressConfirm(addressList) {
        let newData = { ...curValues }
        newData.ruleList[curRuleI].region = addressList
        setCurValues(newData)
        onAddressClose()
    }

    function cloneData(data, defaultData) {
        return data ? JSON.parse(JSON.stringify(data)) : (defaultData || '')
    }

    // 搜索sku
    function searchSku() {
        getSpuInfoBySku({
            skuId: splitData(skuValue),
            countryCode: countryCode
        }).then((res) => {
            if (res.ret.errcode === 1) {
                let newData = { ...curValues }
                let skuInfo = cloneData(res.skuInfo, [])
                for (let i = 0; i < skuInfo.length; i++) {
                    let item = curValues.ruleList.find((val) => {
                        return val.skuId == skuInfo[i].skuId
                    })
                    if (!item) {
                        skuInfo[i]['skuCover'] = cloneData(skuInfo[i].cover)
                        skuInfo[i]['spuTitle'] = cloneData(skuInfo[i].title)
                        skuInfo[i]['vipPrice'] = cloneData(skuInfo[i].priceVip)
                        delete skuInfo[i].cover
                        delete skuInfo[i].title
                        delete skuInfo[i].priceVip
                        newData.ruleList.push({
                            ...skuInfo[i],
                            giftNum: 1
                        })
                    }
                }
                setCurValues(newData)
            }
        })
    }

    // 赠品数量改变
    function giftNumChange(val, i) {
        let newData = { ...curValues }
        newData.ruleList[i].giftNum = val
        setCurValues(newData)
    }

    // 确认
    function handleConfirm() {
        let newData = { ...curValues }
        newData.ruleList = newData.ruleList.filter((item) => {
            if (newData.curType == 4) {
                return item[0] && item[1] && item[2]
            } else if (newData.curType == 11 || newData.curType == 12) {
                return item.region.length && item.threshold
            } else if (newData.curType == 9 || newData.curType == 10) {
                return item.giftNum
            } else if (newData.curType == 6 || newData.curType == 7) {
                return item
            }
            return item[0] && item[1]
        })
        if (!newData.promotionLabel.cn || !newData.promotionLabel.en) {
            return message.warning('促销标签中英文必填')
        } else if (!newData.curType) {
            return message.warning('请选择促销类型')
        } else if (newData.ruleList.length <= 0) {
            return message.warning('促销规则必填')
        } else if (!newData.ruleDesc.cn || !newData.ruleDesc.en) {
            return  message.warning('规则文案必填')
        }

        let value = newData.ruleList
        if (newData.curType == 9 || newData.curType == 10) {
            // 买赠
            value = {
                giftSkuList: newData.ruleList,
                threshold: threshold
            }
        } else if (newData.curType == 6 || newData.curType == 7) {
            // 发券
            value = []
            for (let i = 0; i < newData.ruleList.length; i++) {
                value.push({
                    threshold: newData.ruleList[i][0],
                    couponId: newData.ruleList[i][1]
                })
            }
        } else if (!(newData.curType == 11 || newData.curType == 12)) {
            // 包邮
            for (let i = 0; i < newData.ruleList.length; i++) {
                newData.ruleList[i] = newData.ruleList[i].join(';')
            }
        }
        newData['activityElementInfos'] = [{
            selected: 1,
            elementType: 100,
            param: {
                type: newData.curType,
                value: value
            }
        }]
        onConfirm(newData, true)
    }

    return (
        <div>
            {ruleInfo[100] && <Form>
                <Form.Item label="促销标签" required>
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={
                            [{
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
                                    <Input value={curValues.promotionLabel[item.code]} onChange={(e) => handleLabelChange(e, item)}/>
                                )
                            }]
                        }
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>
                <Form.Item label="促销类型" required>
                    <Select value={curValues.curType} onChange={typeChange}>
                        {
                            Object.keys(PROMOTION_TYPE_OBJ).map(key => (
                                <Select.Option value={Number(key)} key={Number(key)}>{PROMOTION_TYPE_OBJ[key]}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {
                    !(curValues.curType == 9 || curValues.curType == 10 || curValues.curType == 11 || curValues.curType == 12) &&
                    <Form.Item label="促销规则" extra="提醒：每级优惠不叠加，如：满足二级优惠条件后则不再享有一级优惠。最多支持五级优惠。" required>
                        <div>
                            {
                                curValues.ruleList.map((item, i) => {
                                    let components = ''
                                    switch (parseInt(curValues.curType)) {
                                        // 满额减
                                        case 1:  components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[0]} onChange={(value) => ruleChange(value, i, '')} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }，减</em>
                                            <InputNumber placeholder="优惠金额" precision="2"  value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                        </div>
                                            break;
                                        // M元N件
                                        case 2: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }，任选</em>
                                            <InputNumber placeholder="购买件数" precision="0"  value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件</em>
                                        </div>
                                            break;
                                        // M件N折
                                        case 3: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="商品件数" precision="0" value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件，优惠</em>
                                            <InputNumber placeholder="82折填18" value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>%</em>
                                        </div>
                                            break;
                                        // M件N折封顶
                                        case 4: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="商品件数" precision="0"  value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件，优惠</em>
                                            <InputNumber placeholder="82折填18" value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>%，{ getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[2]} onChange={(value) => ruleChange(value, i, 2)} min={0}/>
                                            <em>封顶</em>
                                        </div>
                                            break;
                                        // 满件减
                                        case 5: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="购买件数" precision="0"  value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件，减</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                        </div>
                                            break;
                                        // 满额发券
                                        case 6: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item.threshold} onChange={(value) => ruleChange(value, i, threshold)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }，送</em>
                                            <Input placeholder="优惠券包ID" value={item.packageId} onBlur={(e) => handleCouponPackageSearch(e, i)}/>
                                        </div>
                                            break;
                                        // 满件发券
                                        case 7: components = <div>
                                            <em>满</em>
                                            <InputNumber placeholder="购买件数" precision="0"  value={item.threshold} onChange={(value) => ruleChange(value, i, threshold)} min={0}/>
                                            <em>件，送</em>
                                            <Input placeholder="优惠券包ID" value={item.packageId} onBlur={(e) => handleCouponPackageSearch(e, i)}/>
                                        </div>
                                            break;
                                        // 满件免
                                        case 8: components = <div>
                                            <em>每满</em>
                                            <InputNumber placeholder="购买件数" precision="0" value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件，免</em>
                                            <InputNumber placeholder="免单件数" precision="0" value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <span>件</span>
                                        </div>
                                            break;
                                        // 每满额减
                                        case 13: components = <div>
                                            <em>每满</em>
                                            <InputNumber placeholder="购买件数" precision="0"  value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }，减</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                        </div>
                                            break;
                                        // 每满件减
                                        case 14: components = <div>
                                            <em>每满</em>
                                            <InputNumber placeholder="购买件数" precision="0"  value={item[0]} onChange={(value) => ruleChange(value, i, 0)} min={0}/>
                                            <em>件，减</em>
                                            <InputNumber placeholder="商品金额" precision="2"  value={item[1]} onChange={(value) => ruleChange(value, i, 1)} min={0}/>
                                            <em>{ getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                        </div>
                                            break;
                                    }
                                    return <div className='promotion-rule-box' key={i}>
                                        <span>{i + 1}级优惠</span>
                                        { components }
                                        {curValues.curType == 6 || curValues.curType == 7 && item.packageId && <EyeOutlined onClick={() => handleView(i)}/>}
                                        {i > 0 && <DeleteOutlined onClick={() => handleDel(i)}/>}
                                    </div>
                                })
                            }
                            {
                                (curValues.ruleList.length < 5 && !((curValues.curType == 13 || curValues.curType == 14) && curValues.ruleList.length) && <div className='promotion-add-btn' onClick={handleAdd}>在加一级优惠</div>)
                            }
                        </div>
                    </Form.Item>
                }
                {
                    (curValues.curType == 11 || curValues.curType == 12) &&
                    <Form.Item label="促销规则" extra="未特别指定的地区，视为不参与包邮优惠" required>
                        {/*11 满件包邮 12 满额包邮*/}
                        <div>
                            <ul className="free-address-wrapper">
                                <li>
                                    <div className="flex1 border-r">包邮地区</div>
                                    <div className="w30 border-r">包邮门槛</div>
                                    <div className="w20">操作</div>
                                </li>
                                {
                                    curValues.ruleList.map((item, i) => {
                                        return <li key={i}>
                                            <div className="flex1 free-address pointer border-r" onClick={() => showAddressDialog(item.region, i)}>{ item.region && item.region.join(', ') }</div>
                                            <div className="w30 promotion-rule-box border-r">
                                                <span>满</span>
                                                <InputNumber value={item.threshold} onChange={(value) => freeThresholdChange(value, i)} min={0}/>
                                                <em>{ curValues.curType == 11 ? '件' : getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                                            </div>
                                            <div className="w20">
                                                <Button onClick={() => handleDel(i)}>删除</Button>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="promotion-add-btn" onClick={handleAdd}>新增指定地区</div>
                        </div>
                    </Form.Item>
                }
                {(curValues.curType == 9 || curValues.curType == 10) &&
                    <Form.Item label="促销规则" required>
                        {/*9 满件赠品 10 满额赠品*/}
                        <div>
                            <div className="promotion-rule-box">
                                达到条件: 满 <InputNumber value={threshold} onChange={(value) => setThreshold(value)} min={0}/>
                                <em>{ curValues.curType == 9 ? '件' : getCurrencyUnit(countryCode, 'currencyUnit') }</em>
                            </div>
                            <div className="promotion-rule-box">
                                赠送商品: <Input className="w30" placeholder="多个sku使用,号隔开" value={skuValue} onChange={(e) => setSkuValue(e.target.value)}/>
                                <Button onClick={searchSku} type='primary'>添加</Button>
                            </div>
                            <ul className="free-address-wrapper">
                                <li>
                                    <div className="w30 border-r">SKUID</div>
                                    <div className="flex1 giveaway-wrapper border-r">赠品</div>
                                    <div className="w20 border-r">赠品数量</div>
                                    <div className="w20">操作</div>
                                </li>
                                {
                                    curValues.ruleList.map((item, i) => {
                                        return <li key={i}>
                                            <div className="w30 border-r">{ item.skuId }</div>
                                            <div className="flex1 border-r giveaway-wrapper">
                                                <div className="giveaway-thumb">
                                                    <img src={dealShowFileSrc(item.skuCover)}/>
                                                </div>
                                                <div className="giveaway-info">
                                                    <div className="spu-title">{item.spuTitle && typeof item.spuTitle == 'string' ? JSON.parse(item.spuTitle).cn : item.spuTitle.cn || ''}</div>
                                                    <div>{item.skuAttr && typeof item.skuAttr == 'string' ? JSON.parse(item.skuAttr).cn : item.skuAttr.cn || ''}</div>
                                                </div>
                                            </div>
                                            <div className="w20 border-r">
                                                <InputNumber value={item.giftNum} precision="0" onChange={(value) => giftNumChange(value, i)} min={0}/>
                                            </div>
                                            <div className="w20">
                                                <Button onClick={() => handleDel(i)}>删除</Button>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </Form.Item>
                }
                <Form.Item label="规则文案" required>
                    <Table
                        rowKey={record => record.code}
                        bordered
                        columns={
                            [{
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
                                    <Input value={curValues.ruleDesc[item.code]} onChange={(e) => handleDescChange(e, item)}/>
                                )
                            }]
                        }
                        dataSource={languages}
                        pagination={{hideOnSinglePage: true}}
                        scroll={{ y: 160 }}
                    />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={onCancel}>取消</Button>
                    <Button type="primary" onClick={handleConfirm} htmlType="submit">{type === 'edit' ? '确认' : '下一步'}</Button>
                </Form.Item>
            </Form>}
            {
                showModal && <BackAddress
                    propStateList={propStateList}
                    showModal={showModal}
                    countryCode={countryCode}
                    onCancel={onAddressClose}
                    onConfirm={onAddressConfirm}
                ></BackAddress>
            }

            <CouponModal 
                showModal={showCouponDetail} 
                editData={editData} 
                onCancel={() => {
                    setShowCoupon(false)
                }}
            />
        </div>
    )
}

export default React.memo(RulePromotion)
