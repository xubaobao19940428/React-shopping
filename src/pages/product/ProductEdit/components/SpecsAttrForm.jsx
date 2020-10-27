import {Button, Select, Space} from "antd";
import ServerAttrDetail from './ServerAttrDetail'
import React, {useCallback, useState,useEffect, useRef,forwardRef,useImperativeHandle} from "react";
import styles from '../styles/index.less';
import {productAttrGetById} from "@/services/product1";
import {useModel} from "@@/plugin-model/useModel";
import { FormInstance } from 'antd/lib/form';
const {Option} = Select
const SpecsAttrForm = React.forwardRef((props,ref) => {
    const { standardAttrList, returnAttrName, setTableData, deleteAttr } = props
    const {hasSelectedAttr,deleteAttrSelected} = useModel('useProEdit');
    const [ selectStandAttr, setSelectStandAttr] = useState([]) // 已选中规格
    const [ standAttrDetail, setStandAttrDetail] = useState({}) // 规格对应属性信息
    const [serverAttrDetailRef,setServerAttrDetailRef] = useState({})
    useImperativeHandle(ref,()=>{
        return {
            returnAttrTableData:()=>{
                return getAttrTableData()
            }
        }
    })
    // 选中某一规格，获取改规格属性信息
    function selectHandler (val) {
        productAttrGetById({
            attrId: val,
            attrType: 2
        }).then(res => {
            if (res.ret.errCode == 0) {
                let newData = { ...standAttrDetail }
                newData[val] = res.data
                props.selectEnd(res.data)
                setStandAttrDetail(newData)
            }
        })
    }
    // 所选规格
    const  changeHandler = (value)=> {
       props.selectChange(value)
        setSelectStandAttr(value)
    }
    const getAttrTableData = ()=>{
        let attrValueTableData={}
        selectStandAttr.map(item=>{
            attrValueTableData[item] = serverAttrDetailRef[item].current.returnAttrTableData()
        })
        return attrValueTableData
    }
    useEffect(()=>{
        deleteAttrSelected(standAttrDetail,selectStandAttr)
        let refList = {}
        selectStandAttr.map(item=>{
            refList[item] = React.createRef(FormInstance)
        })
        setServerAttrDetailRef(refList)
    },[standAttrDetail,selectStandAttr])
    return (
        <div>
            <div className={styles.row}>
                <div className={styles.label}>选择规格：
                    <Select mode="multiple" style={{ width: 400 }} onSelect={selectHandler} onChange={changeHandler}>
                        {
                            standardAttrList.length != 0 && standardAttrList.map(item => {
                                return <Option value={item.attrId} key={item.attrId}>{returnAttrName(item.attrNameList)}</Option>
                            })
                        }
                    </Select>
                </div>
                <div className={styles.content}>
                    <div className={styles.tips}>请确保所选规格正确完整！一旦创建好商品，无法再修改规格</div>
                </div>
            </div>
            {/* 商品属性的具体值 */}
            <div className={styles.row}>
                {
                    selectStandAttr.map((item, index) => {
                        console.log(item)
                        return standAttrDetail[item] && <ServerAttrDetail ref={serverAttrDetailRef[item]} key={item} attrId={item} attr={standAttrDetail[item]} setTableDataEnd={props.setTableDataEnd} deleteAttr={props.deleteAttr}></ServerAttrDetail>
                    })
                }
            </div>
            <div className={styles.row}>
                <div className={styles.label} style={{ verticalAlign: 'top' }}>销售规格：</div>
                <div className={styles.content}>
                    <div className={styles.tips}>
                        <ol>
                            <li>纵向同步数据：如果商品规格较多，且同规格下某字段值相同，可在批量填充栏选择需同步的规格并在右侧目标字段中输入目标值，最后点击同步该列；</li>
                            <li>横向同步数据：如果商品适用多国，且某字段值在各国都相同，可在相应的输入框输入内容，最后并点击同步国家；</li>
                            <li>自动定价：输入各规格重量、单品体积、箱体体积、供货价、佣金率，选择自动定价，选择需要自动定价的国家和价格项，即可完成定价，自动定价不会覆盖已录入的价格；</li>
                            <li>销售信息至关重要，保存前请仔细检查每个国家每一项信息。</li>
                        </ol>
                    </div>
                    <div className={styles.actions}>
                        <Space>
                            <Button type="primary" size="small" onClick={props.setDefault}>同步该列</Button>
                            <Button type="primary" size="small" onClick={props.syncOtherCountry}>同步至其他国家</Button>
                            <Button type="primary" size="small">自动定价</Button>
                        </Space>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default SpecsAttrForm
