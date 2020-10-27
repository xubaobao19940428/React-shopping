import { parse } from 'querystring';
import { pathToRegexp } from './pathToRegexp'
import apiBaseUrl from '@/config/apiBaseUrl';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 查询按钮权限
 * @param key
 * @returns boolean
 */
export const hasPermission = (key: string) => {
    const currentUserStr = localStorage.getItem('adminUserInfo') || "";
    let currentUser: API.CurrentUser = currentUserStr ? JSON.parse(currentUserStr) : {};

    return currentUser.account == 'admin' || currentUser.permissionKeyMap[key];
}

export function cleanArray(actual: any) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}
export function param(json: any) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

export function createRandomId() {
    return Math.random().toString(36).slice(-8) + '-' + Math.random().toString(36).slice(-8) + '-' + Math.random().toString(36).slice(-8)
}

// string 转 Bytes
export function stringToBytes(str) {
    let bytes = new Array()
    let len, c
    len = str.length
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0)
            bytes.push(((c >> 12) & 0x3F) | 0x80)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0)
            bytes.push((c & 0x3F) | 0x80)
        } else {
            bytes.push(c & 0xFF)
        }
    }
    return bytes
}

export const dealShowFileSrc = (img: string) => {
    if (img && img.indexOf('http') != -1) {
        return img
    }
    return img ? (apiBaseUrl.file + img) : ''
}
export const getMultiLangShowInfo = (langData: any, type:string) => {
    if (!langData) {
        return ''
    }
    let item = langData.find((val: any) => {
        return val.languageCode == 'cn'
    })
    switch (type) {
        case 'image':
            return item && item.name ? dealShowFileSrc(item.name.split(',')) : ''
        default:
            return item && item.name ? item.name : ''
    }
}
/**
 * 过滤数据中为空的属性, 在数据对象请求前的过滤
 * @param data
 * @returns data
 */
export const filterData = (data) => {
    let newData = JSON.parse(JSON.stringify(data))
    for (let item in newData) {
        if (!newData[item] && newData[item] !== 0) {
            delete newData[item]
        } else if (typeof newData[item] === 'string') {
            newData[item] = newData[item].trim()
        } else if(typeof newData[item] === 'object'){
            if(Object.keys(newData[item].length!=0)){
                newData[item] = filterData(newData[item])
            }else{
                delete newData[item]
            }
        }
    }
    return newData
}
/**
 * 将,号隔开string转数组
 * @param data
 * @returns data
 */
export function splitData(data) {
    if (!data) {
        return  []
    }
    let item = data.split(/,| |，/)
    for (let i = 0; i < item.length; i++) {
        item[i] = item[i].trim()
        if (!item[i]) {
            item.splice(i, 1)
        }
    }
    return item
}
/**
 * 查找当前页面对应路由信息
 * @param data
 * @returns data
 */
export function getCurRouteInfo(routerList, pathName) {
    for (let i = 0; i < routerList.length; i++) {
        let regexp = pathToRegexp(pathName)
        if (regexp.exec(routerList[i].path)) {
            return routerList[i]
        }
        if (routerList[i].routes) {
            let route = routerList[i].routes.find((item) => {
                return regexp.exec(item.path)
            })
            if (route) {
                return route
            }
        }
    }
}
