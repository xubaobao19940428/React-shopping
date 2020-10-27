import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { message } from 'antd';
import { history, RequestConfig, useAccess } from 'umi';
import RightContent from '@/components/RightContent';
import Header from '@/components/Header';
import defaultSettings from '../config/defaultSettings';

//初始化
export async function getInitialState(): Promise<{
    currentUser?: API.CurrentUser;
    settings?: LayoutSettings;
}> {
    // 如果是登录页面，不执行
    if (history.location.pathname !== '/user/login') {
        try {
            const currentUserStr = localStorage.getItem("adminUserInfo") || "{}";
            const currentUser = JSON.parse(currentUserStr);
            return {
                currentUser,
                settings: defaultSettings,
            };
        } catch (error) {
            console.log(error)
            // history.push('/user/login');
        }
    }
    return {
        settings: defaultSettings,
    };
}
export const layout = ({
    initialState,
}: {
    initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
    return {
        rightContentRender: false,
        disableContentMargin: false,
        menuHeaderRender: (menu, data) => {
            return menu;
        },
        postMenuData: (menuData: any) => {
            // const access = useAccess()
            // for (let i = 0; i < menuData.length; i++) {
            //     menuData[i].children = menuData[i].children.filter((item) => {
            //         return access[item.access] || item.noPermission
            //     })
            // }
            // return menuData.filter((item) => item.children.length > 0)
            return menuData
        },
        ...initialState?.settings,
        headerRender: (props: any) => {
            return <Header breadcrumbMap={props.breadcrumb || {}} currentPath={props.location.pathname}><RightContent /></Header>;
        }
    };
};

//接口基础url
const baseUrl = '/';

const defaultOption = {
    prefix: baseUrl,
    // 接口超时时间
    timeout: 45000,
    // 请求方法
    method: "POST"
}

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 请求拦截器
 * @param url 请求参数
 * @param options 请求配置
 */

// 相应拦截器
const responseInterceptor = async (response: any) => {
    if (response.status !== 200) {
        const err = new Error('服务器异常');
        throw err;
    } else {
        let result = await response.clone().json();
        try {
            result.success = result.success.toString();
        } catch (error) {}

        return result;
    }
}

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
    const { response } = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;

        message.error(errorText);
    }

    if (!response) {
        message.error('哇哦，服务器出错啦，请稍候再试~');
    }
};

export const request: RequestConfig = {
    ...defaultOption,
    errorHandler,
    // requestInterceptors: [requestInterceptor],
    responseInterceptors: [responseInterceptor]
};
