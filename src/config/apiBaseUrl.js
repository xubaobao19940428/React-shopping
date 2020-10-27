/**
 * 接口基础url
 */
const apiBaseUrl = {
    // 开发环境
    dev: {
        shg: "https://shg-dev.fingo.shop/api/proxyboss",
        app: "https://back-dev.fingo.shop",
        file: "https://file-dev.fingo.shop",
        host: 'https://boss-dev.fingo.shop'
    },
    // 测试环境
    test: {
        shg: "https://shg-test.fingo.shop/api/proxyboss",
        app: "https://back-test.fingo.shop",
        file: "https://file-test.fingo.shop",
        host: 'https://boss-test.fingo.shop'
    },
    // 线上环境
    prd: {
        shg: "https://shg.fingo.shop/api/proxyboss",
        app: "https://back.fingo.shop",
        file: "https://file.fingo.shop",
        host: 'https://boss.fingo.shop'
    }
};

const env = process.env['FINGO_APP_ENV'] ? process.env['FINGO_APP_ENV'] : 'dev';

export default apiBaseUrl[env];
