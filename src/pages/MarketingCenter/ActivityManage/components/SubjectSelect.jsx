import React, { useState, useEffect} from 'react'
import { Select } from 'antd'
import { getSubjectList } from '@/services/marketing'

const SubjectSelect = (props) => {
    const { countryCode, change, subjectId } = props
    const [dataList, setDataList] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [curSubjectId, setCurSubjectId] = useState('')
    const [timer, setTimer] = useState(null)
    const [page, setPage] = useState({
        pageNum: 1,
        pageSize: 30
    })

    // 国家改动的时候，需要重新搜索
    useEffect(() => {
        getDataList({type: 'start'})
        setCurSubjectId(subjectId)
    }, [countryCode, subjectId])

    function getDataList (data) {
        setLoading(true)
        let param = {
            countryCode,
            ...page
        }
        param = Object.assign(param, data || {})
        getSubjectList(param).then(res => {
            setLoading(false)
            if (res.ret.errCode === 0) {
                setTotal(res.data.total)
                if (data.type === 'start') {
                    setDataList(res.data.list)

                } else {
                    let tempList = [...dataList]
                    tempList = tempList.concat(res.data.list)
                    setDataList(tempList)
                }
            }
        }).catch(() => {
            setLoading(false)
        })
    }

    function handleSearch (value) {
        if (!timer) {
            let timer = setTimeout(function() {
                getDataList({
                    name: value
                })
                setTimer(null)
            }, 300)
            setTimer(timer)
        }
    }

    function handleScroll (e) {
        if (page.pageNum * page.pageSize >= total) {
            return
        }
        const { target } = e
        const rmHeight = target.scrollHeight - target.scrollTop
        const clHeight = target.clientHeight
        let temp = { ...page }
        if (rmHeight < clHeight + 5) {
            temp.pageNum += 1
            setPage(temp)
            getDataList(temp)
        }
    }

    function handleChange (val) {
        change(val)
    }

    return (
        <div>
            <Select
                showSearch={true}
                placeholder="选择专题"
                filterOption={false}
                style={{ width: '100%' }}
                notFoundContent={null}
                onSearch={handleSearch}
                onPopupScroll={handleScroll}
                onChange={handleChange}
                loading={loading}
                value={curSubjectId}
            >
                {dataList.map(item => (
                    <Select.Option key={item.subjectId} value={item.subjectId}>{item.name}</Select.Option>
                ))}
            </Select>
        </div>
    )
}

export default React.memo(SubjectSelect)