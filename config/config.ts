import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from '../routes';
import pkg from '../package.json';

const { FINGO_APP_ENV } = process.env;

export default defineConfig({
    publicPath: '/web/',
    outputPath: 'boss-test-new',
    hash: true,
    antd: {},
    dva: {
        hmr: true,
    },
    layout: {
        name: 'fingo',
        locale: false,
        siderWidth: 186
    },
    locale: {
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        antd: true,
        baseNavigator: false,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
    },
    targets: {
        ie: 11,
    },
    define: {
        'process.env': {
            FINGO_APP_ENV: process.env.FINGO_APP_ENV,
        }
    },
    // 增加左侧导航需添加国家化字段
    routes: routes,
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        // ...darkTheme,
        'primary-color': defaultSettings.primaryColor,
    },
    ignoreMomentLocale: true,
    proxy: proxy[FINGO_APP_ENV || 'dev'],
    manifest: {
        basePath: '/web/',
    },
    //自定义配置
    cssLoader: {
        localsConvention: 'camelCase'
    },
    //提取公共模块
    chunks: ['vendors', 'umi'],
    chainWebpack: function (config, { webpack }) {
        config.merge({
            mode: FINGO_APP_ENV == 'dev' ? 'development' : 'production',
            output: {
                filename: 'app.[hash].' + pkg.version + '.js'
            },
            optimization: {
                minimize: FINGO_APP_ENV == "prd",
                splitChunks: {
                    chunks: 'all',
                    minChunks: 2,
                    cacheGroups: {
                        vendor: {
                            name: 'vendors',
                            test({ resource }: any) {
                                return /[\\/]node_modules[\\/]/.test(resource);
                            },
                            priority: 10,
                        },
                    },
                }
            }
        });
    },
    //用于生成.d.ts类型定义文件
    // cssModulesTypescriptLoader: {
    //     mode: 'emit',
    // },
    //开发服务器配置
    devServer: {
        https: false,
        http2: true
    },
    history: {
        type: 'hash'
    }
});
