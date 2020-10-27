import apiBaseUrl from '../src/config/apiBaseUrl';
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
    dev: {
        '/agent/back/proxystream': {
            target: apiBaseUrl.app,
        },
    },
    // test: {
    //     '/api/': {
    //         target: 'https://back-test.fingo.shop',
    //         changeOrigin: true,
    //         pathRewrite: { '^/api': '' },
    //     },
    // }
};
