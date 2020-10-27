import React, { useImperativeHandle, ReactChildren, useEffect, useCallback, useState, useMemo } from 'react'
import styles from './index.less';
import { Button, Input, Table, message } from 'antd';
import { useModel } from 'umi';
import { getOneKeyTranslation } from '@/services/i18n';

interface TranslateType {
    // 语言code
    languageCode: string,
    // 语言中文名
    languageName: string,
    // 翻译内容
    name: string
}

interface TranslateLangType {
    children?: ReactChildren,
    // 必填语言
    requiredLang?: ['cn' | 'en' | 'ms' | 'th' | 'id']
    defaultData
}

const TranslateLang = React.forwardRef((props: TranslateLangType, ref) => {
    const { requiredLang = [], children, defaultData = [] } = props;
    const { languages = [] } = useModel('dictionary');
    const [translateList, setTranslateList] = useState<TranslateType[]>([]);
    useImperativeHandle(ref, () => {
        return {
            getData() {
                for (let i = 0; i < requiredLang.length; i++) {
                    let item = translateList.find((val) => {
                        return val.languageCode == requiredLang[i]
                    })
                    if (!item.name) {
                        message.warning(requiredLang[i] + '不能为空')
                        return false
                    }
                }
                return translateList
            }
        }
    });

    // 初始化语言翻译列表
    const initLangList = () => {
        const arr: any = languages.map(lang => {
            let item = defaultData.find((val) => {
                return val.languageCode == lang.code
            })
            return {
                languageCode: lang.code,
                languageName: lang.desc,
                name: item ? item.name : ''
            }
        });
        setTranslateList(arr);
    };

    // 修改语言翻译列表内容
    const changeLangContent = useCallback((val, index) => {
        const arr: TranslateType[] = [...translateList];
        arr[index].name = val;
        setTranslateList(arr);
    }, [translateList]);

    // 格式化一键翻译数据结构
    const formatTranslateParam = (fromLanguageCode, originContentList) => {
        let result = {}
        let oneKeyTranslationUnitList = []
        originContentList.forEach((originContent) => {
            console.log(translateList)
            languages.forEach((item) => {
                let unit = {}
                if (item.code !== 'cn') {
                    unit['fromLanguageCode'] = fromLanguageCode
                    unit['originContent'] = originContent
                    unit['toLanguageCode'] = item.code
                    oneKeyTranslationUnitList.push(unit)
                }
            })
        })
        result['oneKeyTranslationUnit'] = oneKeyTranslationUnitList
        return result
    }

    // 一键翻译
    const translate = useCallback(text => {
        if (!text) {
            message.warning('请先填写中文内容');
            return;
        }
        getOneKeyTranslation(formatTranslateParam('cn', [text])).then((res) => {
            if (res.ret.errcode === 1) {
                const arr: TranslateType[] = [...translateList];
                for (let i = 0; i < res.oneKeyTranslationUnit.length; i++) {
                    let index = arr.findIndex((val) => {
                        return val.languageCode == res.oneKeyTranslationUnit[i].toLanguageCode
                    })
                    if (index != -1) {
                        arr[index].name = res.oneKeyTranslationUnit[i].translation;
                    }
                }
                console.log(arr)
                setTranslateList(arr);
            }
        })
    }, [translateList]);

    useEffect(() => {
        if (languages.length > 0) {
            initLangList();
        }
    }, [languages]);
    useEffect(() => {
        if (defaultData.length > 0) {
            initLangList();
        }
    }, [defaultData]);
    return (
        <div className={styles.container}>
            <div className={styles.top}>{children}<Button style={{ marginLeft: 10 }} type="primary" size="small" onClick={() => translate(translateList[0].name)}>一键翻译</Button></div>
            <Table pagination={false} dataSource={translateList} showHeader={false} bordered columns={[{
                title: '语言',
                dataIndex: 'languageName',
                align: 'right',
                width: 120,
                render: (item, row: TranslateType) => <span className={requiredLang.indexOf(row.languageCode) >= 0 ? styles.require : ''}>{item}({row.languageCode})</span>
            }, {
                title: '内容',
                dataIndex: 'name',
                render: (item, row, index) => <Input value={row.name} onChange={(e: any) => changeLangContent(e.target.value, index)} />
            }]} rowKey="languageCode" />
        </div>
    )
});

export default React.memo(TranslateLang, (prevProps, nextProps) => {
    // true 不更新 false 更新
    return prevProps.defaultData == nextProps.defaultData;
});
