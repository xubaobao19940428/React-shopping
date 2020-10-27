import request from './fetch_proto'

/**
 * 获取国家列表
 * @export
 * @param {*} params
 * @returns
 */
export function getCountryList(params) {
    const req = request.create('GetCountryListReq', params)
    return request({
        serviceName: 'i18n',
        interfaceName: 'I18nCountryLanguageService.GetCountryList',
        requestBody: req,
        responseType: 'i18n.GetCountryListResp',
        // noToast: true
    })
}

/**
 * 获取语言列表
 * @export
 * @param {*} params
 * @returns
 */
export function getLanguageList(params) {
    const req = request.create('GetLanguageListReq', params)
    return request({
        serviceName: 'i18n',
        interfaceName: 'I18nCountryLanguageService.GetLanguageList',
        requestBody: req,
        responseType: 'i18n.GetLanguageListResp',
        // noToast: true
    })
}
/**
 * 一键翻译
*/
export function getOneKeyTranslation (params) {
    console.log(params)
    const req = request.create('GetOneKeyTranslationReq', params)
    return request({
        serviceName: 'i18n',
        interfaceName: 'I18nTranslationService.GetOneKeyTranslation',
        requestBody: req,
        responseType: 'i18n.GetOneKeyTranslationResp',
    })
}
/**
 * 地址相关
 * @export
 * @param {*} params
 * @returns
 */
// 获取国家区划信信息,只到state级别
export function getCountryDivision(params) {
    const req = request.create('GetCountryDivisionReq', params)
    return request({
        serviceName: 'i18n',
        interfaceName: 'I18nCountryLanguageService.GetCountryDivision',
        requestBody: req,
        responseType: 'i18n.GetCountryDivisionResp'
    })
}
