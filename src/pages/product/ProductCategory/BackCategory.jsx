import React, { useState, useCallback, useEffect } from 'react';
import styles from './styles/BackCategory.less';
import { Card, List, Row, Col, Button, Modal, message, Checkbox } from 'antd';
import { history, useModel } from 'umi';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { DownloadOutlined, PlusOutlined, FormOutlined, CloseOutlined } from '@ant-design/icons';
import { categoryList, delCategory, productAttrGet, updateCategory, addCategory, sortCategory } from '@/services/product1'
import 'lodash'
import BackCategoryEditModal from './components/BackCategoryEditModal'

const { confirm } = Modal
/**
 * 后台类目
 */
const BackCategory = () => {
    const [selected, setSelect] = useState([0, 0, 0]);  // 当前选择的类目下标位置
    // 一级类目
    const [categoryOne, setCategoryOne] = useState([]);
    // 二级类目
    const [categoryTwo, setCategoryTwo] = useState([]);
    // 三级类目
    const [categoryThree, setCategoryThree] = useState([]);
    const { languages, countries } = useModel('dictionary')
    const [showModal, setShowModal] = useState(false)
    const [curItem, setCurItem] = useState({})
    const [type, setType] = useState('add')
    const [parentCategoryList, setParentCategoryList] = useState([])
    const [productAttrlist, setProductAttrList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [curActiveIndex, setCurActiveIndex] = useState(-1)
    const [selectCountry, setSelectCountry] = useState([])
    const [dropIndex, setDropIndex] = useState(-1) // 最后拖拽到的位置

    // 跳转商品编辑页面
    const routerToProduct = () => {
        if (!selectCountry || !selectCountry.length) {
            message.error('请先选择销售国家')
            return
        }
        const c1 = categoryOne[selected[0]];
        const c2 = categoryTwo[selected[1]];
        const c3 = categoryThree[selected[2]];
        const cateIdStr = encodeURIComponent([c1.cateId, c2.cateId, c3.cateId].join(';'));
        const cateNameStr = encodeURIComponent([c1.nameObj.cn, c2.nameObj.cn, c3.nameObj.cn].join(';'));
        console.log(selectCountry)
        history.push({
            pathname: '/product/edit',
            query: {
                cateId: c3.cateId,
                cateNames: cateNameStr,
                countries: selectCountry.join(';')
            }
        });
    };

    /**
    * 获取类目列表
    */
   const getCategoryList=(pid, level,select)=>{
       let params = {
           cateType: 2, //类目类型 1 前台类目 2 后台类目
           page: {
               pageNum: 1,
               pageSize: 1000
           },
           pid
       }
       categoryList(params).then((res) => {
           if (res.ret.errCode === 0) {
               let categoryUnitList = []
               _.forEach(res.data.categoryUnitList, (item) => {
                    let nameObj = {}
                   item.cateNameValueList.forEach(langName => {
                    nameObj[langName.languageCode] = langName.name
                   })
                   item.nameObj = nameObj
                   categoryUnitList.push(item)
               })
               if (level === 1) {
                   setCategoryOne(categoryUnitList)
                   getCategoryList(categoryUnitList[0].cateId,2)
               }
               if (level === 2) {
                   setCategoryTwo(categoryUnitList)
                   getCategoryList(categoryUnitList[0].cateId,3)
               }
               if (level === 3) {
                   setCategoryThree(categoryUnitList)
               }
           }
       }).catch((err) => {
           console.error(err)
       })
   }

    const selectCategory=useCallback((select,categoryId,level)=>{
        setSelect(select)
        getCategoryList(categoryId,level,select)
    },[])

    // 获取属性    
    const getProductAttrList = useCallback((query) => {
        let params = {
            attrNameKey: query,
            attrNameLanguageCode: 'cn',
            page: {
                pageNum: 1,
                pageSize: 1000
            }
        }
        productAttrGet(params).then((res) => {
            if (res.ret.errCode === 0) {
                setProductAttrList(res.data.productAttrList)
            }
        })
    }, [])

    const handleAdd = useCallback((e, level) => {
        e.stopPropagation()
        let list = []
        if (level == 2) {
            list = categoryOne
        } else if (level == 3) {
            list = categoryTwo
        }
        setCurItem({
            cateId: '',
            nameObj: {},
            paramAttrId: '',
            standardAttrId: '',
            cateType: 2,
            level,
            desc: '',
            cover: '',
            pid: level === 1 ? 0 : list[selected[level - 2]].cateId // 取其上一级的
        })
        setType('add')
        setShowModal(true)
        setParentCategoryList(list)
    }, [categoryOne, categoryTwo])

    const handleDelCategory = useCallback((e, category) => {
        e.stopPropagation()
        confirm({
            title: '提示',
            content: '确定要删除该类目吗？',
            onOk () {
                delCategory({
                    cateId: category.cateId
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        message.success('删除成功')
                    }
                })
            }
        })
    }, [])

    const handleEditCategory = useCallback((e, category) => {
        e.stopPropagation()
        let list = []
        if (category.level == 2) {
            list = categoryOne
        } else if (category.level == 3) {
            list = categoryTwo
        }

        setCurItem({
            nameObj: category.nameObj,
            cateType: category.cateType,
            cover: category.cover,
            desc: category.desc,
            level: category.level,
            paramAttrId: category.paramAttrId,
            standardAttrId: category.standardAttrId,
            pid: category.pid,
            cateId: category.cateId
        })
        setShowModal(true)
        setType('edit')
        setParentCategoryList(list)
    }, [categoryOne, categoryTwo])

    const onCancel = useCallback(() => {
        setShowModal(false)
    }, [])

    const onConfirm = useCallback((data) => {
        setConfirmLoading(true)
        if (type === 'add') {
            addCategory(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('新增成功')
                    setShowModal(false)
                }
                setConfirmLoading(false)
            }).catch(() => {
                setConfirmLoading(false)
            })
        } else {
            updateCategory(data).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('修改成功')
                    setShowModal(false)
                    getCategoryList(0, 1)
                }
                setConfirmLoading(false)
            }).catch(() => {
                setConfirmLoading(false)
            })
        }
    }, [type])

    // 开始拖拽
    const onDragStart = useCallback((index) => {
        setCurActiveIndex(index)
        setDropIndex(index)
    }, [])

    const onDragEnd = useCallback((list) => {
        if (curActiveIndex !== dropIndex) {
            sortCategory({
                cateId: list[curActiveIndex].cateId,
                targetSort: dropIndex + 1
            }).then(res => {
                if (res.ret.errCode === 0) {
                    message.success('排序成功')
                    getCategoryList(0, 1)
                }
            })
        }
    }, [dropIndex, curActiveIndex])

    const onDragEnter = useCallback((index) => {
        if (index != curActiveIndex) {
            setDropIndex(index)
        }
    }, [])

    const handleSubChange = useCallback((list) => {
        setSelectCountry(list)
    }, [])

    useEffect(()=>{
        getCategoryList(0,1)
        getProductAttrList()
    },[])

    return (
        <div className={styles.container}>
            <div className={styles.categoryList}>
                <Row>
                    <Col span={8}>
                        <div className={styles.categoryBox}>
                            <div className={styles.title}>一级类目</div>
                            <div className={styles.list}>
                                <ul>
                                    {
                                        categoryOne.length!=0&&categoryOne.map((category, index) => <li
                                            className={selected[0] == index ? styles.selected : ''}
                                            key={category.cateId}
                                            draggable
                                            onDragStart={() => onDragStart(index)}
                                            onDragEnd={() => onDragEnd(categoryOne)}
                                            onDragEnter={() => onDragEnter(index)}
                                            onDragOver={e => e.preventDefault()}
                                            onClick={() => selectCategory([index, 0, selected[2]],category.cateId,2)}
                                        >{category.cateId} {category.cateName}
                                            {
                                                selected[0] === index && <div className={styles.btnBox}>
                                                    <FormOutlined onClick={(e) => handleEditCategory(e, category)} style={{marginRight: 16}}/> 
                                                    <CloseOutlined onClick={(e) => handleDelCategory(e, category)}/>   
                                                </div>
                                            }
                                        </li>)
                                    }
                                </ul>
                            </div>
                            {
                                Object.keys(history.location.query).length == 0 && <div className={styles.bottom}>
                                    <a onClick={(e) => handleAdd(e, 1)}><PlusOutlined/>新建一级类目</a>
                                </div>
                            }
                        </div>
                    </Col>
                     <Col span={8}>
                        <div className={styles.categoryBox}>
                            <div className={styles.title}>
                                {
                                    categoryOne[selected[0]]?<span className={styles['category-title']}>{categoryOne[selected[0]].nameObj.cn}</span>:''
                                }
                                二级类目</div>
                            <div className={styles.list}>
                                <ul>
                                    {
                                        categoryTwo.length!=0&&categoryTwo.map((category, index) => <li
                                            className={selected[1] == index ? styles.selected : ''}
                                            key={category.cateId}
                                            draggable
                                            onDragStart={() => onDragStart(index)}
                                            onDragEnd={() => onDragEnd(categoryTwo)}
                                            onDragEnter={() => onDragEnter(index)}
                                            onDragOver={e => e.preventDefault()}
                                            onClick={() => selectCategory([selected[0], index, 0],category.cateId,3)}
                                        >{category.cateId}  {category.nameObj.cn}
                                            {
                                                selected[1] === index && <div className={styles.btnBox}>
                                                    <FormOutlined onClick={(e) => handleEditCategory(e, category)} style={{marginRight: 16}}/> 
                                                    <CloseOutlined onClick={(e) => handleDelCategory(e, category)}/>   
                                                </div>
                                            }
                                        </li>)
                                    }
                                </ul>
                            </div>
                            {
                                Object.keys(history.location.query).length == 0 && <div className={styles.bottom}>
                                    <a onClick={(e) => handleAdd(e, 2)}><PlusOutlined/>新建二级类目</a>
                                </div>
                            }
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className={styles.categoryBox}>
                            <div className={styles.title}>
                                {
                                    categoryTwo[selected[1]]?<span className={styles['category-title']}>{categoryTwo[selected[1]].nameObj.cn}</span>:''
                                }
                                
                                三级类目</div>
                            <div className={styles.list}>
                                <ul>
                                    {
                                        categoryThree.length!=0&&categoryThree.map((category, index) => 
                                        <li
                                            className={selected[2] == index ? styles.selected : ''}
                                            key={category.cateId}
                                            onClick={() => setSelect([selected[0], selected[1], index])}
                                            draggable
                                            onDragStart={() => onDragStart(index)}
                                            onDragEnd={() => onDragEnd(categoryThree)}
                                            onDragEnter={() => onDragEnter(index)}
                                            onDragOver={e => e.preventDefault()}
                                        >{category.cateId} {category.nameObj.cn}
                                            {
                                                selected[2] === index && <div className={styles.btnBox}>
                                                    <FormOutlined onClick={(e) => handleEditCategory(e, category)} style={{marginRight: 16}}/> 
                                                    <CloseOutlined onClick={(e) => handleDelCategory(e, category)}/>   
                                                </div>
                                            }
                                        </li>)
                                    }
                                </ul>
                            </div>
                            {
                                Object.keys(history.location.query).length == 0 && <div className={styles.bottom}>
                                    <a onClick={(e) => handleAdd(e, 3)}><PlusOutlined/>新建三级类目</a>
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
            {
                Object.keys(history.location.query).length != 0 && <div className={styles.categoryBot}>
                    <div className={styles.selectedCategory}>
                        <span style={{ color: 'red' }}>*</span>销售国家：
                        <Checkbox.Group
                            onChange={handleSubChange}
                        >
                            {
                                countries.map((item) => (
                                    <Checkbox value={item.shortCode} key={item.shortCode}>{item.nameCn}</Checkbox>
                                )) 
                            }
                        </Checkbox.Group>
                    </div>
                    <div className={styles.selectedCategory}>
                        已选：{
                            (categoryOne[selected[0]]&&categoryTwo[selected[1]]&&categoryThree[selected[2]])?<span>{categoryOne[selected[0]].nameObj.cn} &gt;&gt; {categoryTwo[selected[1]].nameObj.cn} &gt;&gt; {categoryThree[selected[2]].nameObj.cn}</span>:''
                        }
                    </div>
                    <div className={styles.create}>
                        <Button type="primary" onClick={routerToProduct} disabled={!categoryThree[selected[2]]}>开始创建</Button>
                    </div>
                </div>
            }

            <BackCategoryEditModal
                showModal={showModal}
                item={curItem}
                type={type}
                parentCategoryList={parentCategoryList}
                onCancel={onCancel}
                onConfirm={onConfirm}
                languages={languages}
                productAttrlist={productAttrlist}
            />
        </div>
    )
}

export default BackCategory;