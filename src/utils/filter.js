import lodash from 'lodash'
import moment from 'moment';
import { getCountryList } from './index';


export const filterTime = value => {
    if (!value) return ''
    let date = new Date(value)
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let getDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${getDate}`
}

export const filterStatus = status => {
    switch (status) {
        case 0: return '待支付'
        case 1: return '待发货'
        case 2: return '待收货'
        case 3: return '交易成功'
        case 4: return '交易关闭'
        case 5: return '部分发货'
    }
    return '待支付'
}

export const filterAfterStatus = status => {
    switch (status) {
        case 0: return '审核中'
        case 1: return '审核通过'
        case 2: return '售后成功'
        case 3: return '售后关闭(用户取消)'
        case 4: return '售后驳回(拒绝)'
        case 5: return '售后失败(信息有误，重新填写)'
    }
    return '无售后'
}
export const filterGroupStatus = status => {
    switch (status) {
        case 1: return '待成团'
        case 2: return '拼团成功'
        case 3: return '拼团失败'
    }
    return ''
}

export const filterDivide = value => {
    var float = parseFloat(value || 0)
    return (float / 100).toFixed(2)
}

export const filterMultiply = value => {
    var float = parseFloat(value || 0)
    return (float * 100).toFixed(0)
}

/*
* 数组转字符串，逗号分割
*/
export const arrayToString = (array, char) => {
    if (!char) {
        char = ','
    }
    let str = ''
    array.forEach((value, index) => {
        if (index) {
            str += char
        }
        str += value.url
    })
    return str
}

/*
* 字符串转数组：图片
*/
export const stringToArray = (str, char) => {
    if (!str) {
        return []
    }
    if (!char) {
        char = ','
    }
    let array = str.split(char)
    array = array.map((item) => {
        return {
            url: item
        }
    })
    return array
}

export const filterSpec = value => {
    if (!value) {
        return
    }
    let spec = '规格：'
    try {
        let specJson = JSON.parse(value)
        let flag = 0
        for (let key in specJson) {
            if (flag) {
                spec += '，'
            }
            flag = 1
            spec += specJson[key]
        }
    } catch (e) {
        return
    }
    return spec
}

export const filterSpecialChar = value => {
    if (!value) {
        return
    }
    let spec = '规格：'
    try {
        let specJson = JSON.parse(value)
        let flag = 0
        for (let key in specJson) {
            if (flag) {
                spec += '，'
            }
            flag = 1
            spec += specJson[key]
        }
    } catch (e) {
        return
    }
    return spec
}

export const customTimeFormat = (value, formatter) => {
    if (value) { // value传进来的值可能是时间戳。也可能是moment格式的。
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format(formatter)
        }
        return value
    } else {
        return '-'
    }
}

export const dateTimeFormat = value => {
    if (value) {
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD')
        }
        return value
    } else {
        return '-'
    }
}

export const hourTimeFormat = value => {
    if (value) {
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH')
        }
        return value
    } else {
        return '-'
    }
}

export const minuteTimeFormat = value => {
    if (value) {
        value = parseInt(value)
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH:mm')
        }
        return value
    } else {
        return '-'
    }
}

export const secondTimeFormat = value => {
    if (value) {
        value = parseInt(value)
        var mo = moment(value)
        if (mo.isValid()) {
            value = mo.format('YYYY-MM-DD HH:mm:ss')
        }
        return value
    } else {
        return '-'
    }
}

export const filterCountry = code => {
    let countryList = getCountryList();
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    if (code == 'ID') {
        return '印尼'
    }
    if (code == 'CN') {
        return '中国'
    }
    return item ? item.nameCn : code
}

export const filterCurrencyUnit = code => {
    let countryList = getCountryList();
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    return item ? item.currencyUnit : ''
}

// 过滤空数据
export const filterData = (data) => {
    let newData = JSON.parse(JSON.stringify(data))
    for (let item in newData) {
        if (!newData[item] && newData[item] !== 0) {
            delete newData[item]
        } else if (typeof newData[item] === 'string') {
            newData[item] = newData[item].trim()
        } else if (typeof newData[item] === 'object') {
            if (Object.keys(newData[item].length != 0)) {
                newData[item] = filterData(newData[item])
            }
        }
    }
    return newData
}