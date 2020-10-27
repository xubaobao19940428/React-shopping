import React, { useState, useEffect, useImperativeHandle } from 'react';
import {TreeSelect, Tag} from "antd";
import {categoryList} from "@/services/product1";
import styles from './index.less';
const { SHOW_ALL } = TreeSelect;

interface categoryProps {}

const BackCategorySelect: React.FC<categoryProps> = React.forwardRef((props, ref) => {
    const [categoryOptions, setCategoryOptions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(props.categoryList ? props.categoryList : [])
    const [propKey, setPropKey] = useState(props.propKey ? props.propKey : {
        id: 'cateId',
        name: 'cateName'
    })
    const [treeSelect, setTreeSelect] = useState([])

    useImperativeHandle(ref, () => {
        return {
            getData () {
                return selectedOptions
            }
        }
    });

    // 获取下一级分类
    const getSubCategory = (data) => {
        fetchCategory({
            pid: data.value,
            cateType:  2
        })
    }
    // 获取分类
    const fetchCategory =({ cateType, pid, }) => {
        categoryList({
            pid: pid,
            cateType: cateType
        }).then((res) => {
            if (res.ret.errCode === 0) {
                let data = []
                if (res.data.categoryUnitList) {
                    data = res.data.categoryUnitList.map(item => {
                        let obj = {
                            level: item.level
                        }
                        obj[propKey.id] = item.cateId
                        obj[propKey.name] = item.cateName
                        return {
                            pId: item.pid,
                            value:  JSON.stringify(obj),
                            cateId: item.cateId,
                            id: item.cateId,
                            title: item.cateName,
                            key: JSON.stringify(obj),
                            selectable: item.level === 3 ? true : false,
                            checkable: item.level === 3 ? true : false,
                            isLeaf: item.level === 3 ? true : false
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
    const onLoadData = (treeNode) => {
        return new Promise(resolve => {
            setTimeout(() => {
                getSubCategory({value: treeNode.cateId})
            },300)
            resolve()
        })
    }
    // 分类改变
    const categoryChange = (data) => {
        setTreeSelect(data)
    }
    // 删除分类
    const deleteCategory = (i) => {
        let data = JSON.parse(JSON.stringify(selectedOptions))
        data.splice(i, 1)
        setSelectedOptions(data)
    }
    // 失去焦点
    const blurHandler = () => {
        let newData = JSON.parse(JSON.stringify(selectedOptions))
        for (let i = 0; i < treeSelect.length; i++) {
            let item = newData.find((val) => {
                return val == treeSelect[i]
            })
            if (!item) {
                newData.push(JSON.parse(treeSelect[i]))
            }
        }
        setSelectedOptions(newData)
        setTreeSelect([])
    }

    useEffect(() => {
        getSubCategory({
            value: 0
        })
    }, [])

    return (
        <div className={styles.categoryContainer}>
            <div className={styles.tabContent}>
                {
                    selectedOptions.map((item, i) => {
                        return  <Tag closable key={i} onClose={() => deleteCategory(i)}>{ item[propKey.name]}</Tag>
                    })
                }
            </div>
            <TreeSelect
                treeDataSimpleMode
                treeData={categoryOptions}
                value= {treeSelect}
                onChange= {categoryChange}
                loadData={onLoadData}
                treeCheckable= {true}
                multiple={true}
                onBlur={blurHandler}
                showCheckedStrategy= {SHOW_ALL}
                placeholder= '请选择商品后台分组'
                style= {{width: '100%'}}
            />
        </div>
    )
})

export default BackCategorySelect;
