import { useState, useCallback } from 'react';
import { getCountryList, getLanguageList } from '@/services/i18n';

// 国家语言类型
interface languageType {
    code: string,
    desc: string,
    name: string
}

// 国家数据类型
interface countryType {
    areaCode: string,
    code: string,
    currencyCode: string,
    currencyUnit: string,
    image: string,
    jetLag: string,
    languageInfo: languageType[],
    nameCn: string,
    nameEn: string,
    nameLocal: string,
    shortCode: string,
    timeZone: string
}

export default () => {
    const [countries, setCountries] = useState<countryType[]>([]); // 国家列表　
    const [languages, setLanguages] = useState<languageType[]>([]); // 语言列表

    //查询国家列表
    const queryCountryList = useCallback(() => {
        getCountryList({
            pageSize: 100,
            pageNum: 1
        }).then((res: any) => {
            if (res.ret.errcode === 1) {
                const countryInfo: countryType[] = res.countryInfo;
                setCountries(countryInfo);

                // 缓存国家列表，用于非hook下使用
                localStorage.setItem('COUNTRY_LIST', JSON.stringify(countryInfo));
            }
        });
    }, []);
    const changeCountryVal = (newVal)=>{
        setCountries(newVal)
    }
    //查询语言列表
    const queryLanguageList = useCallback(() => {
        getLanguageList({
            pageSize: 100,
            pageNum: 1
        }).then((res: any) => {
            if (res.ret.errcode === 1) {
                const languageInfo: languageType[] = res.languageInfo;
                setLanguages(languageInfo);
                console.log(languageInfo)
                // 缓存语言列表，用于非hook下使用
                localStorage.setItem('LANGUAGE_LIST', JSON.stringify(languageInfo));
            }
        });
    }, []);

    return { countries, languages, queryCountryList, queryLanguageList,changeCountryVal };
};