import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
    navTheme: 'dark',
    // 拂晓蓝
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: false,
    autoHideHeader: false,
    fixSiderbar: false,
    colorWeak: false,
    showBreadcrumb: false,
    menu: {
        locale: false,
    },
    title: 'fingo运营后台',
    pwa: false,
    iconfontUrl: '//at.alicdn.com/t/font_1971126_7sanr9wcd9f.js',
} as LayoutSettings & {
    pwa: boolean;
};
