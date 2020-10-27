export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}
// 秒数转换时分秒
export function formatSeconds(value) {
    let secondTime = parseInt(value) // 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时
    if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60)
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60)
        }
    }
    let result = '' + parseInt(secondTime) + '秒'

    if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + '分' + result
    }
    if (hourTime > 0) {
        result = '' + parseInt(hourTime) + '小时' + result
    }
    return result
}

export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

/**
 * 获得字符串长度
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1
        } else {
            len += 0.5
        }
    }
    return Math.floor(len)
}

export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

export function param(json) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

export function objectMerge(target, source) {
    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

export function scrollTo(element, to, duration) {
    if (duration <= 0) return
    const difference = to - element.scrollTop
    const perTick = (difference / duration) * 10
    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick
        if (element.scrollTop === to) return
        scrollTo(element, to, duration - 10)
    }, 10)
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

// 防抖函数
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

//对数字取千分位
export const numberReg=(value)=> {
    if (value.toString().indexOf('.') !== -1) {
        //含小数情况
        var b = value.toLocaleString();
        return b;
    } else {
        var c = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return c;
    }
}
//时间戳转化为年/月/日 时:分:秒
export const timestampToTime =(timestamp)=> {
    var date = new Date(timestamp) 
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
      var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
      var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
      return Y+M+D+h+m+s;
}
//时间戳转天：小时：分：秒
export const formatSecondsTo = (mss) => {
    let duration
    let days = parseInt(mss / (1000 * 60 * 60 * 24))
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = parseInt((mss % (1000 * 60)) / 1000)
    if (days > 0)  duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
    else if (hours > 0)  duration = hours + "小时" + minutes + "分" + seconds + "秒"
    else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
    else if (seconds > 0) duration = seconds + "秒"
    return duration
}
  //时间转时间戳
  export const timeTotimestamp=(val)=>{
      var time = new Date(val)
      var timer=time.getTime()
      return timer
  }
  //对象数组去重
  export const  deleteObject=(obj)=> {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return Number(a) - Number(b);
      });
      var str = "";
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  }
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
/**
 * 随机ID
 * @param data
 * @returns data
 */
export function createRandomId() {
    return 'front_' + parseInt(Math.random() * 100000000000)
}
export function randomText(len) {
    return Math.random().toString(10).substr(2, len)
}

// 获得国家列表
export const getCountryList = () => {
    return localStorage.getItem('COUNTRY_LIST') ? JSON.parse(localStorage.getItem('COUNTRY_LIST')) : []
}
// 获得多语言列表
export const getLanguageList = () => {
    return localStorage.getItem('LANGUAGE_LIST') ? JSON.parse(localStorage.getItem('LANGUAGE_LIST')) : []
}

/**
 * 对象数组转map对象
 * @example const result = objectArrayToMap([{lang: 'cn', name: '/xxx/img1.png'}, {lang: 'en', name: '/xxx/img2.png'}], 'lang', 'name');
 * @example console.log(result); => {cn: '/xxx/img1.png', en: '/xxx/img2.png'}
 */
export const objectArrayToMap = (arr, keyname, valname) => {
    const newArr = arr || [];
    const result = {};
    for (let i = 0; i < newArr.length; i++) {
        const item = newArr[i];
        if (Object.prototype.toString.call(item) !== '[object Object]') {
            continue;
        } else {
            const key = keyname ? item[keyname] : i;
            const val = valname ? item[valname] : "";
            result[key] = val;
        }
    }

    return result;
}

/**
 * map对象转数组
 * @example const result = objectMapToArray({cn: '/xxx/img1.png', en: '/xxx/img2.png'}, 'lang', 'name');
 * @example console.log(result); => [{lang: 'cn', name: '/xxx/img1.png'}, {lang: 'en', name: '/xxx/img2.png'}]
 */
export const objectMapToArray = (obj, keyname, valname) => {
    const newObj = obj || {};
    const result = [];
    for (const key in newObj) {
        if (newObj.hasOwnProperty(key)) {
            const val = newObj[key];
            const res = {};
            res[keyname] = key;
            res[valname] = val;
            result.push(res);
        }
    }
    return result;
}


// 获取积分单位
export const getCurrencyUnit = (code, key) => {
    let countryList = getCountryList();
    let item = countryList.find((val) => {
        return val.shortCode == code
    })
    if (key) {
        return item ? item[key] : null
    }
    return item ? key : null
}
export function deepClone(originObject){
    var deepObject=Array.isArray(originObject) ? [] :{}
    if(originObject && typeof(originObject)==='object'){
        for(var key in originObject){
            // 如果子属性为引用数据类型，递归复制
            if(originObject.hasOwnProperty(key)){
                if(originObject[key]&&typeof originObject[key] ==="object"){
                    deepObject[key] = deepClone(originObject[key])
                }else{
                    deepObject[key] = originObject[key]
                }
               
            }
        }
        
    }
    return deepObject
}