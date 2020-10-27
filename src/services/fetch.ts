import { request, RequestConfig } from 'umi';
import { param } from '@/utils/utils'
import apiBaseUrl from '../config/apiBaseUrl';
const md5 = require('js-md5');
import { message } from 'antd';
import pkg from '../../package.json'

interface InterfaceOptions {
    serverName: string,
    interfaceName: string
}

interface FingoFetchType extends RequestConfig {
    interface: InterfaceOptions
    path: string
}

const BASE = apiBaseUrl.shg;
/**
 * 自定义请求接口，处理响应code
 * @param {FingoFetchType} config
 * @param errorToast 是否显示错误提示弹窗
 * @returns 请求promise
 */
function fingoFetch(config: FingoFetchType, errorToast = true) {
    const params = config.data || {};
    // 复制数据
    const signData = params ? JSON.parse(JSON.stringify(params)) : {};
    const date = new Date().getTime();

    Object.assign(signData, {
        timestamp: date
    })
    for (let key in signData) {
        let type = typeof signData[key]
        if (type === 'object' || type === 'array') {
            delete signData[key]
        }
    }
    let md5Req = md5(param(Object.keys(signData)
        .sort().reduce((a, v) => {
            a[v] = signData[v]
            return a
        }, {})))

    const userInfoString = localStorage.getItem('adminUserInfo') || '';

    const userInfo = localStorage.getItem('adminUserInfo') ? JSON.parse(userInfoString) : '';

    const data = {
        sign: md5Req,
        operation: userInfo.name || 'admin',
        timestamp: date,
        ...params
    }

    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Language-Code': 'cn',
        'Country-Code': 'MY',
        'Device-Type': 'boss',
        'Device-Id': 'boss',
        'Version-Code': pkg.version,
        'Signature': md5Req,
        'User-ID': userInfo.id,
        'Operator-ID': userInfo.id,
        ...config.interface
    }

    const cfg = {
        prefix: config.prefix || (BASE + '?interfacename=' + config.interface.interfaceName),
        headers: headers,
        data: data
    };

    const path = config.path || '/';

    return request(path, cfg).then(result => {
        if (!result) return {}
        const errCode = result.ret.errCode;
        if (errCode == 0) { //正常返回
            return result;
        } else if (errCode === 901) {  //登录过期
            //去登陆
            message.error('未登录');
            location.href = apiBaseUrl.host + '/#/login'
        } else {
            const msg = result.ret.msg ? result.ret.msg : result.ret.errName;
            if (errorToast) {
                message.error(msg ? msg : '哇哦，服务器出错啦，请稍候再试~');
            }

            return result;
        }

    }).catch(err => {
        message.error('哇哦，服务器出错啦，请稍候再试~');
        throw err;
    });
}

export default fingoFetch;
