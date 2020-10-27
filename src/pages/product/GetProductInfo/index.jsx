import React, { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import ViewContainer from '@/components/ViewContainer';
import { Button, Space, Form, Table, Input, Select, Pagination } from 'antd';
import { timestampToTime } from '@/utils/index'
// import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import {getProductSkuInfoBySkuCode} from '@/services/product1'
// import arrayMove from 'array-move';
import styles from './styles/GetProductInfo.less'
import { dealShowFileSrc } from '@/utils/utils'
import Gif from './Gif';
/**
 * 获取商品信息
 * 
 */
const GetProductInfo = () => {
    const columns1 = [
        {
            title: '商品编码',
            dataIndex: 'skuCode',
            key: 'skuCode',
        },
        {
            title: '是否有效',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                return <span>{status==1?'有效':'无效'}</span>
            }
        },
        {
            title: '商品名称',
            key: 'title',
            dataIndex: 'title',
        },

        {
            title: 'SKU属性',
            key: 'values',
            dataIndex: 'values',
        },
        {
            title: 'SKU图片',
            key: 'image',
            dataIndex: 'image',
            render: (text, row, index) => {
                return <Space size="middle" key={text}>
                    <img src={dealShowFileSrc(row.image)} alt="" style={{width:100,height:100}}/>
                </Space>
            }
        },
    ];
    const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 18 },
    };
   
    const [tableData, setTableData] = useState([])
    // const [gifs, setGifs] = useState(['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599281741573&di=0738bd691e3ff857c76f046f1d73149b&imgtype=0&src=http%3A%2F%2Fmedia-cdn.tripadvisor.com%2Fmedia%2Fphoto-s%2F01%2F3e%2F05%2F40%2Fthe-sandbar-that-links.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599281741573&di=332cfe8a9f96c0c23aee59f422fd4c67&imgtype=0&src=http%3A%2F%2Fmedia-cdn.tripadvisor.com%2Fmedia%2Fphoto-s%2F07%2F96%2Faf%2F8a%2Ftup-island.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599281741572&di=600719add34edcc03c4fa8ef3fd95eb8&imgtype=0&src=http%3A%2F%2Fimg1.qunarzz.com%2Ftravel%2Fd3%2F1704%2Fdb%2F34de73c353d44db5.jpg_480x360x95_a79b1843.jpg','https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=134996321,633057060&fm=26&gp=0.jpg',]);
    const searchProductRef = useRef()
    const [countryList, setCountryList] = useState([])
    // const SortableGifsContainer = SortableContainer(({ children }) => <div className="gifs">{children}</div>);
    
    // const SortableGif = SortableElement(({ gif }) => <Gif key={gif} gif={gif} />);
    // const onSortEnd = ({ oldIndex, newIndex }) =>{
    //     console.log(oldIndex,newIndex)
    //     setGifs(arrayMove(gifs, oldIndex, newIndex));
    // }
   const search=()=>{
        searchProductRef.current.validateFields().then(currentValue => {
        if (currentValue) {
            console.log(currentValue)
            getProductSkuInfoBySkuCode(currentValue).then(resultes=>{
                if(resultes.ret.errCode==0){
                    setTableData([resultes.data.productSkuInfo])
                }
            }).catch(error=>{
                console.log(error)
            })
        } else {
            return false
        }
    })
   }
   const productDetail =(row)=>{
       console.log(row)
   }
    //得到语种
    useEffect(() => {
        let countryLists = JSON.parse(localStorage.getItem('COUNTRY_LIST'))
        setCountryList(countryLists)
    }, [])

    return (
        <ViewContainer>
            <div className={styles['container']}>
                <Form
                    name="complex-form"
                    ref={searchProductRef}
                    {...formItemLayout}
                    className={styles['contain-form']}
                >
                    <Form.Item label="国家：" name="countryCode" rules={[{ required: true, message: '请选择国家' }]}>
                        <Select
                            style={{ width: '300px' }}
                            placeholder="请选择"
                            allowClear
                        >
                            {
                                countryList.map(item => {
                                    return <Select.Option key={item.shortCode} value={item.shortCode}>{item.nameEn + '/' + item.nameCn}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="商品编码：" name="skuCode" rules={[{ required: true, message: '请输入商品编码' }]}>
                        <Input placeholder="请输入商品编码" allowClear></Input>
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={search}>确定</Button>
                    </Form.Item>
                </Form>
                <Table columns={columns1} dataSource={tableData} pagination={false} bordered className={styles['contain-table']} rowKey="skuCode"/>
                {/* <SortableList items={items} onSortEnd={onSortEnd} /> */}
                {/* <div className={styles['APP']}>
                <h1>Drag those GIFs around</h1>
                <h2>Set 1</h2>
                <SortableGifsContainer axis="x" onSortEnd={onSortEnd}>
                        {gifs.map((gif, i) =>
                            <SortableGif
                            // don't forget to pass index prop with item index
                            index={i}
                            key={gif}
                            gif={gif}
                            />
                        )}
                </SortableGifsContainer>
                </div> */}
                <Pagination defaultCurrent={1} total={50} />
            </div>
        </ViewContainer>
    )
}

export default GetProductInfo