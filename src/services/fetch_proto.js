import protobuf from 'protobufjs'
import protoRoot from '@/proto/proto'
import { stringToBytes } from '@/utils/utils'
import axios from 'axios';
import apiBaseUrl from '../config/apiBaseUrl';
import {message, notification} from 'antd';

const md5 = require('js-md5')
const BASE = apiBaseUrl.app + '/agent/back/proxystream'

const NO_TOAST_ERRCODE = [] // 不需要弹出其他提示errcode值

const httpService = axios.create({
    timeout: 30000,
    method: 'POST',
    responseType: 'arraybuffer'
})
// 请求体message
const PBMessageRequest = protoRoot.lookupType('agent.AppProxyRequest')
// 响应体的message
const PBMessageResponse = protoRoot.lookupType('agent.AppProxyResponse')

// 将请求数据encode成二进制，encode是proto.js提供的方法
function transformRequest(data) {
    return PBMessageRequest.encode(data).finish()
}
function isArrayBuffer(obj) {
    return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
}

function transformResponseFactory(responseType, returnBuffer) {
    return function transformResponse(rawResponse) {
        // 判断response是否是arrayBuffer
        if (rawResponse == null || !isArrayBuffer(rawResponse)) {
            return rawResponse
        }
        try {
            const buf = protobuf.util.newBuffer(rawResponse)
            // decode响应体
            const decodedResponse = PBMessageResponse.decode(buf)
            if (decodedResponse.res && responseType) {
                const model = protoRoot.lookup(responseType)
                decodedResponse.res = model.decode(decodedResponse.res)
                decodedResponse.res = model.toObject(decodedResponse.res, {
                    longs: String,
                    defaults: true
                })
            }
            if (returnBuffer) {
                return {
                    encodeResponse: buf,
                    decodedResponse: decodedResponse
                }
            }
            return decodedResponse
        } catch (err) {
            return err
        }
    }
}

/**
 * @param {*} serviceName 服务名称
 * @param {*} interfaceName 接口名称
 * @param {*} requestBody 请求体参数
 * @param {*} responseType 返回值
 * returnBuffer 返回二进制
 */
function request({ serviceName, interfaceName, requestBody, responseType, returnBuffer, $header, baseUrl, noToast }) {
    // 构造公共请求体:PBMessageRequest
    const reqData = {
        serviceName: `littlec-${serviceName}`,
        interfaceName: `${interfaceName}`,
        data: requestBody
    }
    // 将对象序列化成请求体实例
    const req = PBMessageRequest.create(reqData)
    let encodeReq = PBMessageRequest.encode(req).finish()
    let token = []
    if (localStorage.adminToken) {
        token = stringToBytes(localStorage.adminToken)
    }
    let md5Req = md5(Int8Array.from([...encodeReq, ...token]))

    // 这里用到axios的配置项：transformRequest和transformResponse
    // transformRequest 发起请求时，调用transformRequest方法，目的是将req转换成二进制
    // transformResponse 对返回的数据进行处理，目的是将二进制转换成真正的json数据
    let begin = Date.now()
    let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : '';
    let userHeader = {}
    if (Object.keys(userInfo).length > 0) {
        userHeader = {
            'Operator-ID': userInfo ? userInfo.id : 1,
        }
    }
    return httpService({
        url: baseUrl || (`${BASE}?serviceName=${interfaceName}`),
        data: req,
        headers: Object.assign({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/octet-stream;charset=UTF-8',
            'Language-Code': 'cn',
            'Device-Type': 'WEB',
            'Signature': md5Req
        }, $header, userHeader),
        transformRequest,
        transformResponse: transformResponseFactory(responseType, returnBuffer)
    }).then((res) => {
        if (res.status !== 200) {
            const err = new Error('服务器异常')
            throw err
        }
        let encodeResponse = res.data
        if (returnBuffer) {
            encodeResponse = res.data.decodedResponse
        }

        if (!noToast) {
            console.log(interfaceName, encodeResponse);
        }

        // 对请求做处理
        if (encodeResponse.ret.errcode === 1) {
            let time = Date.now() - begin
            return returnBuffer ? res.data : encodeResponse.res
        } else if (encodeResponse.ret.errcode === 901) {
            // 登录过期
            message.error('未登录')
            location.href = apiBaseUrl.host + '/#/login'
        } else {
            if (encodeResponse.ret.errname) {
                if (NO_TOAST_ERRCODE.includes(encodeResponse.ret.errcode)) {
                    console.log('errcode, 特殊处理')
                } else {
                    let msg = encodeResponse.ret.msg
                    if (!msg) {
                        msg = encodeResponse.ret.errname
                    }
                    if (!noToast) {
                        notification.error({
                            message: msg
                        });
                    }
                }
            }
            return returnBuffer ? res.data : encodeResponse.res
        }
    }, (err) => {
        if (err.message && !noToast) {
            notification.error({
                message: err.message
            });
        }
        throw err
    })
}
// 在request下添加一个方法，方便用于处理请求参数
request.create = function (protoName, obj) {
    const pbConstruct = protoRoot.lookup(protoName)
    return pbConstruct.encode(obj).finish()
}

export default request
