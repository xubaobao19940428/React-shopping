import React, { useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Select, Input, Button, Space, Pagination, Tabs, Tree, Modal, message } from 'antd';
import { history } from 'umi';
import styles from './index.less'
import AddFirstCategory from './components/AddFirstCategory'
import { categoryGroupList, frontCategoryGroupAdd, categoryList, frontCategorySort, delCategory, categoryHiddenOrShow, categoryUpdate, frontCategoryStar, frontCategoryGroupListGet } from '@/services/product1'
import { DownloadOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, CopyOutlined, FormOutlined, DeleteOutlined, UpSquareOutlined, ExclamationCircleOutlined, DingtalkSquareFilled } from '@ant-design/icons';
import CopyFirstCategory from './components/CopyFirstCategory'
import SecondCategroyDetail from './components/secondCategory'
import _ from 'lodash'
import MyIcon from '@/components/IconFont/IconFont'
import { resolve } from '@/proto/proto';
const Option = Select.Option;
const { confirm } = Modal;
/**
 * 前台类目
 * 
 */
const FrontCategory = () => {
  const [tableData, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [defaultPageSize, setDefaultPageSize] = useState(10)
  const { TabPane } = Tabs
  const { confirm } = Modal;
  const AddFirstCategoryRef = useRef();
  const CopyFirstCategoryRef = useRef()
  const SecondCategroyDetailRef = useRef()
  const [defaultActiveKey, setDefaultActiveKey] = useState('MY')
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [countryList, setCountryList] = useState([])
  const [expend, setExpend] = useState(false)
  const [pName, setPname] = useState('')
  const [pid, setPid] = useState('')
  const [countrySelectOptions,setCountrySelectOptions] = useState({})
  //树的数据
  const [treeData, setTreeData] = useState([])
  //切换国家
  const changeCountry = (ActiveKey) => {
    setDefaultActiveKey(ActiveKey)
    CopyFirstCategoryRef.current.changeCountry(ActiveKey)
    getCategoryList(0, 1, ActiveKey, 1, 10)
  }
//一级类目点击copy
const copyLevel=(node,level,countryCode)=>{
  let params = {
    cateType: 1, //类目类型 1 前台类目 2 后台类目
    pid:node.cateId,
    level: level,
    countryCode: countryCode
  }
    categoryList(params).then((res) => {
      if(res.ret.errCode==0){
          let oneLevelNode =[JSON.parse(JSON.stringify(node))]
          let selectedKeys = []
          oneLevelNode[0].key= oneLevelNode[0].cateId
          oneLevelNode[0].title= oneLevelNode[0].cateName
          if(res.data.categoryUnitList){
            res.data.categoryUnitList.map(item=>{
              item.key = item.cateId
              item.title = item.cateName
              selectedKeys.push(item.cateId)
            })
          }else{
            selectedKeys.push({})
          }
          
          selectedKeys.push(node.cateId)
          oneLevelNode[0].children = res.data.categoryUnitList
          CopyFirstCategoryRef.current.changeSelectedKeys(selectedKeys)
          CopyFirstCategoryRef.current.changeTreeData(oneLevelNode)
      }
    })
  }
  //粘贴复制
  const copyClick = ((node) => {
    let seletCountry = []
    countryList.map(item => {
      if (item.shortCode != defaultActiveKey) {
        seletCountry.push(item.shortCode)
      }
    })
    if(node.level==1){
      copyLevel(node,2,defaultActiveKey)
    }else{
      CopyFirstCategoryRef.current.changeTwoLevelCateId(node.cateId)
      //用promise去处理循环请求以免拿不到数据
      let levelRequest=[]
      seletCountry.map(countryCode=>{
        levelRequest.push(
          new Promise((resolve,reject)=>{
            return categoryList({cateType: 1, //类目类型 1 前台类目 2 后台类目
              pid:0,
              level: 1,
              countryCode: countryCode}).then((res) => {
              if(res.ret.errCode==0){
                if(res.data.categoryUnitList){
                  resolve({[countryCode]:res.data.categoryUnitList})
                }else{
                  resolve({[countryCode]:[]})
                }
                 
              }
            }).catch(error=>{
              reject(error)
            })
          })
        )
      })
      Promise.all(levelRequest).then(data=>{
        let newOneLevelOption = {}
        data.map(item=>{
          for(var key in item){
            newOneLevelOption[key] = item[key]
          }
        })
        setCountrySelectOptions(newOneLevelOption)
      }).catch(error=>{
        console.log(error)
      })
    }
    CopyFirstCategoryRef.current.changeLevel(node.level)
    CopyFirstCategoryRef.current.changeCopyVal(true)
    CopyFirstCategoryRef.current.changeDefault(seletCountry)

  })
  const defaultNot = () => {
    AddFirstCategoryRef.current.changeTitle('新增一级分类')
    AddFirstCategoryRef.current.changeLevel(1)
    AddFirstCategoryRef.current.changeType('add')
    AddFirstCategoryRef.current.changeDefaultVal({})
    AddFirstCategoryRef.current.changeImageUrl('')
    AddFirstCategoryRef.current.changeSelectImg('')
    AddFirstCategoryRef.current.changeUnselectImg('')
    AddFirstCategoryRef.current.changePAndS({
      standardAttrId: '',
      paramAttrId: '',
      cateId: '',
      categoryList:[]
    })
    AddFirstCategoryRef.current.changePid(0)
    AddFirstCategoryRef.current.changeCheckedCategory([])
    AddFirstCategoryRef.current.changeVal(false)
   

  }
  //编辑
  const editClick = ((node) => {
    console.log(node)
    AddFirstCategoryRef.current.changeVal(true)
    if (node.level == 1) {
      AddFirstCategoryRef.current.changeTitle('编辑一级分类')
      AddFirstCategoryRef.current.changeLevel(1)
      AddFirstCategoryRef.current.changeSelectImg(node.iconInfo.selected)
      AddFirstCategoryRef.current.changeUnselectImg(node.iconInfo.unselected)
    } else {
      AddFirstCategoryRef.current.changeCateVal()
      AddFirstCategoryRef.current.changeTitle('编辑二级分类')
      AddFirstCategoryRef.current.changeLevel(2)
      AddFirstCategoryRef.current.changePid(node.pid)
    }
    AddFirstCategoryRef.current.changeType('edit')
    AddFirstCategoryRef.current.changeDefaultVal(node.nameObj)
    AddFirstCategoryRef.current.changeImageUrl(node.cover)
    AddFirstCategoryRef.current.changePAndS({
      standardAttrId: node.standardAttrId,
      paramAttrId: node.paramAttrId,
      cateId: node.cateId,
      categoryList:node.bindCateInfoList||[]
    })
  })
  //删除
  const deleteClick = (node, newData) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '将永久删除此分类，确定删除？',
      onOk() {
        let params = {
          cateId: node.cateId
        }
        delCategory(params).then(resultes => {
          if (resultes.ret.errCode == 0) {
            message.success('删除成功')
            // if (node.level == 1) {
            getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
            //   } else {
            //     let newDataList = newData.concat([])
            //     newDataList.map(item => {
            //       if (item.pid === node.pid) {
            //         item.children.map((child, index) => {
            //           if (child.cateId === node.cateId) {
            //             item.children.splice(index, 1)
            //           }
            //         })
            //       }

            //     })
            //     setTreeData(newDataList)
            //   }

          }
        }).catch(error => {
          console.log(error)
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //添加二级分组
  const addSecondCategory = (node) => {
    AddFirstCategoryRef.current.changeVal(true)
    AddFirstCategoryRef.current.changeTitle('新增二级分类')
    AddFirstCategoryRef.current.changeLevel(2)
    AddFirstCategoryRef.current.changeType('add')
    AddFirstCategoryRef.current.changePid(node.cateId)
    AddFirstCategoryRef.current.changeCateVal()
  }
  //管理分组
  const groupManage = (node) => {
    // frontCategoryGroupListGet(params).then(response => {
    //   if(response.ret.errCode==0){
    setPname(node.cateName)
    setPid(node.cateId)
    SecondCategroyDetailRef.current.changeVal(true)
    SecondCategroyDetailRef.current.SetGroupList(node.cateId)

    // }

    // }).catch(error => {

    // })

  }
  //置为星标
  const changeStart = (node, oldData) => {
    confirm({
      title: !node.isStar ? '确定将该类目设为星标推荐?' : '确定取消该类目的星标推荐？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        let params = {
          id: node.cateId,
          isStar: node.isStar ? 0 : 1
        }
        frontCategoryStar(params).then(resultes => {
          if (resultes.ret.errCode == 0) {
            let newData = oldData.concat([])
            newData.map(item => {
              if (item.cateId == node.pid) {
                item.children.map(child => {
                  if (child.cateId == node.cateId) {
                    child.isStar = !child.isStar
                  }
                })
              }
            })
            setTreeData(newData)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //排序
  const move = useCallback((node, type, newData) => {
    let obj = {}
    //一级分组排序
    if (node.level == 1) {
      if (type == 1) {
        newData.map((item, index) => {
          if (item.key == node.key) {
            if (index == 0) {
              message.warning('已经是第一个了')
            } else {
              frontCategorySort({
                cateId: node.cateId,
                sortDirection: type
              }).then(res => {
                if (res.ret.errCode === 0) {
                  message.success('排序成功')
                  getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
                }
              })
            }
          }
        })
      } else {
        newData.map((item, index) => {
          if (item.key == node.key) {
            if (index == newData.length - 1) {
              message.warning('已经是最后一个了')
            } else {
              frontCategorySort({
                cateId: node.cateId,
                sortDirection: type
              }).then(res => {
                if (res.ret.errCode === 0) {
                  message.success('排序成功')
                  getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
                }
              })
            }
          }
        })
      }

    } else if (node.level == 2) {
      //二级分类排序
      let newDataList = newData.concat([])
      let data = {}
      if (type == 1) {
        newDataList.map(item => {
          if (item.key == node.pid) {
            item.children.map((child, index) => {
              if (child.cateId == node.cateId) {
                if (index == 0) {
                  message.warning('已经是第一个了')
                } else {
                  frontCategorySort({
                    cateId: node.cateId,
                    sortDirection: type
                  }).then(res => {
                    if (res.ret.errCode === 0) {
                      message.success('排序成功')
                      data = item.children[index - 1];
                      item.children[index - 1] = child;
                      item.children[index] = data;
                    }
                    setTreeData(newDataList)
                  })
                }


              }
            })

          }
        })
      } else {
        newDataList.map(item => {
          if (item.key == node.pid) {
            item.children.map((child, index) => {
              if (child.cateId == node.cateId) {
                if (index == item.children.length - 1) {
                  message.warning('已经是最后一个了')
                } else {
                  frontCategorySort({
                    cateId: node.cateId,
                    sortDirection: type
                  }).then(res => {
                    if (res.ret.errCode === 0) {
                      message.success('排序成功')
                      data = item.children[index + 1];
                      item.children[index + 1] = child;
                      item.children[index] = data;
                    }
                    setTreeData(newDataList)
                  })
                }


              }
            })

          }
        })
      }



      //   if (item.key == node.key) {
      //     if (index == newData.length - 1) {
      //       message.warning('已经是最后一个了')
      //     } else {
      //       frontCategorySort({
      //         cateId: node.cateId,
      //         sortDirection: type
      //       }).then(res => {
      //         if (res.ret.errCode === 0) {
      //           message.success('排序成功')
      //         }
      //       })
      //     }
      //   }
      // })

    }
  }, [])
  //改变状态显示隐藏
  const changeSaleStatus = (node) => {
    let params = {
      cateId: node.cateId,
      status: node.status == 1 ? 2 : 1
    }
    categoryHiddenOrShow(params).then(resultes => {
      if (resultes.ret.errCode == 0) {
        let newData = treeData.concat([])
        if (node.level == 1) {
          newData.map(item => {
            if (item.cateId === node.cateId) {
              item.status = node.status == 2 ? 1 : 2
            }
          })
        } else {
          newData.map(item => {
            if (item.cateId === node.pid) {
              item.children.map(child => {
                if(child.cateId==node.cateId){
                  child.status = node.status == 2 ? 1 : 2
                } 
                
              })
            }
          })
        }

        setTreeData(newData)
        // getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
      }
    })
  }
  //新增一级分类
  const addCategoryFirst = () => {
    AddFirstCategoryRef.current.changeVal(true)
    AddFirstCategoryRef.current.changeTitle('新增一级分类')
    AddFirstCategoryRef.current.changeLevel(1)
    AddFirstCategoryRef.current.changeType('add')
  }
  const getCategoryGroupList = () => {
    categoryGroupList({}).then(resultes => {
      if (resultes.ret.errCode == 0) {

      }
    }).catch(error => {
      console.log(error)
    })
  }
  const addOrUpdate = (data) => {
    console.log(data)
    data.countryCode = defaultActiveKey
    if (data.type == 'add') {
      frontCategoryGroupAdd(data).then(resultes => {
        if (resultes.ret.errCode == 0) {
          message.success('添加成功')
          defaultNot()
          // if (data.level == 1) {
          getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
          // } else {
          //   if (expend){
          //     console.log(data)
          //     let categoryUnitList = []
          //     let nameObj = {}
          //     data.cateNameValueList.forEach(langName => {
          //       nameObj[langName.languageCode] = langName.name
          //     })
          //     data.nameObj = nameObj
          //     data.key = data.nameObj.cn
          //     data.cateName = data.nameObj.cn
          //     data.isLeaf = data.level === 2 ? true : false
          //     categoryUnitList.push(data)
          //     let treeDataList = treeData.concat([])
          //     treeDataList.map(item => {
          //       if (item.cateId == data.pid) {
          //         item.children.push(categoryUnitList) 
          //       }
          //     })
          //     setTreeData(treeDataList)
          //   }
          // }
        }
      })
    } else {
      categoryUpdate(data).then(resultes => {
        if (resultes.ret.errCode == 0) {
          message.success('编辑成功')
          AddFirstCategoryRef.current.changeVal(false)
          defaultNot()
          if(data.level==1){
            getCategoryList(0, 1, defaultActiveKey, pageNum, pageSize)
          }else{
            let newData= treeData.concat([])
            newData.map(item=>{
              if(item.cateId == data.pid){
                item.children.map(child=>{
                  if(child.cateId==data.cateId){
                     child= Object.assign(child,data)
                  }
                })
               
              }
            })
            setTreeData(newData)
          }
        }
      })
    }
  }
  
  //初始化列表树
  const getCategoryList = (pid, level, countryCode, pageNum, pageSize) => {
    let params = {
      cateType: 1, //类目类型 1 前台类目 2 后台类目
      page: {
        pageNum: pageNum,
        pageSize: pageSize,
      },
      pid,
      level: level,
      countryCode: countryCode
    }
    categoryList(params).then((res) => {
      if (res.ret.errCode === 0) {
        let categoryUnitList = []
        _.forEach(res.data.categoryUnitList, (item) => {
          let nameObj = {}
          item.cateNameValueList.forEach(langName => {
            nameObj[langName.languageCode] = langName.name
          })
          item.key = item.cateId
          item.nameObj = nameObj
          item.isLeaf = item.level === 2 ? true : false
          categoryUnitList.push(item)
        })
        if (pid == 0) {
          setTreeData(categoryUnitList)
          setTotal(res.data.total)
        } else {
          let treeDataList = treeData.concat([])
          treeDataList.map(item => {
            if (item.cateId == pid) {
              item.children = categoryUnitList
            }
          })
          setTreeData(treeDataList)
        }

      }
    }).catch((err) => {
      console.error(err)
    })
  }
  const handleCancel = ()=>{
    defaultNot()
  }
  const getSubCategory = (data) => {
    getCategoryList(data.value,2,data.countryCode)
  }
  const onExpand = (key, node) => {
    console.log(key,node)
    if(!node.node.children){
      getSubCategory({ value: node.node.cateId,countryCode:defaultActiveKey})
    }
    setExpend(node.expanded)
  };
  //自定义渲染节点 懒加载
  const onLoadData = (treeNode) => {
    console.log(treeNode)
    return new Promise(resolve => {
      setTimeout(() => {
        getSubCategory({ value: treeNode.cateId,countryCode:defaultActiveKey})
      }, 300)
      resolve()
    })
  }
  //得到countryCode列表
  useEffect(() => {
    let countryLists = JSON.parse(localStorage.getItem('COUNTRY_LIST'))
    setCountryList(countryLists)
    getCategoryList(0, 1, 'MY', 1, 10)
  }, [])
  useEffect(() => {
   
  }, [treeData])

  return (
    <ViewContainer>
      <Tabs defaultActiveKey={defaultActiveKey} type="card" size="small" onChange={changeCountry}>
        {
          countryList.map(item => {
            return <TabPane tab={item.nameCn} key={item.shortCode}></TabPane>
          })
        }
      </Tabs>
      <div className="add_category">
        <Button type="primary" style={{ marginTop: 10 }} icon={<PlusOutlined />} onClick={addCategoryFirst}>添加一级分类</Button>
      </div>
      <div className={styles['tree_costom_list']}>
        <div className={`${styles['custom-tree-node']} ${styles['tree-title']}`}>
          <div>类目ID</div>
          <div className="name-box">类目名称</div>
          <div className={styles['cover-img-box']}>类目图片</div>
          <div className={styles['cover-img-box']}>Icon</div>
          <div className={styles['sort-btn-box']}>排序</div>
          <div className={styles['action-btn-box']}>操作</div>
        </div>
        <Tree
          onExpand={onExpand}
          showIcon={false}
          autoExpandParent={false}
          loadData={onLoadData}
          treeData={treeData}
          titleRender={node => {
            return <div className={`${styles['custom-tree-node']}`}>
              <div className="name-box">{node.cateId}</div>
              <div className="name-box">{node.cateName}</div>
              <div className={styles['cover-img-box']}>
                <img src={node.cover} alt="" style={{ width: 80, height: 80 }} />
              </div>
              <div className={styles['cover-img-box']}>
                {
                  node.pid == 0 ? <div style={{ display: 'flex' }}>
                    <img src={node.iconInfo.selected} alt="" style={{ width: 80, height: 80, marginRight: 20 }} />
                    <img src={node.iconInfo.unselected} alt="" style={{ width: 80, height: 80 }} />
                  </div> : ''
                }
              </div>
              <div className={styles['sort-btn-box']}>
                <Button type="primary" icon={<ArrowUpOutlined />} style={{ marginRight: 10 }} onClick={() => move(node, 1, treeData)} />
                <Button type="primary" icon={<ArrowDownOutlined />} onClick={() => move(node, 2, treeData)} />
              </div>
              <div className={styles['action-btn-box']}>
                <FormOutlined className={styles['button-right']} onClick={() => editClick(node)} />
                <CopyOutlined className={styles['button-right']} onClick={() => copyClick(node)} />
                <DeleteOutlined className={styles['button-right']} onClick={() => deleteClick(node, treeData)} />
                {
                  node.status == 1 ? <MyIcon type="icon-zhengyan1" className={styles['icon-font']} onClick={() => changeSaleStatus(node, treeData)} /> : <MyIcon type="icon-biyan" className={styles['icon-font']} onClick={() => changeSaleStatus(node, treeData)} />
                }
                {
                  node.level == 1 ? <React.Fragment>
                    <Button type="primary" className={styles['button-right-edit']} onClick={() => addSecondCategory(node)}>添加二级分组</Button>
                    <Button type="primary" className={styles['button-right-edit']} onClick={() => groupManage(node)}>管理分组</Button>
                  </React.Fragment> : (
                      node.isLike == true ? <React.Fragment>
                        <UpSquareOutlined className={styles['button-right']} onClick={() => confirmLike(node, true)} />
                      </React.Fragment> : <React.Fragment>
                          {
                            node.isStar ? <MyIcon type="icon-start2-red2" className={styles['icon-font']} onClick={() => changeStart(node, treeData)} /> : <MyIcon type="icon-xing" className={styles['icon-font']} onClick={() => changeStart(node, treeData)} />
                          }
                        </React.Fragment>
                    )
                }
              </div>
            </div>
          }}
        />
        <Pagination
          defaultPageSize={10}
          defaultCurrent={1}
          current={pageNum}
          total={total}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={[10, 20, 50, 100]}
          showTotal={total => `共 ${total} 数据`}
          style={{ marginTop: 20 }}
        />
      </div>

      {/* 一级分类弹窗 */}
      <AddFirstCategory ref={AddFirstCategoryRef} addOrUpdate={addOrUpdate} handleCancel={handleCancel}></AddFirstCategory>
      {/* copy分类 */}
      <CopyFirstCategory ref={CopyFirstCategoryRef} countrySelectOptions={countrySelectOptions}></CopyFirstCategory>
      {/* 分组管理 */}
      <SecondCategroyDetail ref={SecondCategroyDetailRef} name="1111" pName={pName} countryCode={defaultActiveKey} pid={pid}></SecondCategroyDetail>
    </ViewContainer>
  )
}

export default FrontCategory;