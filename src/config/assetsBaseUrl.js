/**
 * 资源基础url
 */
const assetsBaseUrl = {
    dev: {
        app: 'https://page-dev.fingo.shop/'
    },
    test: {
        app: 'https://page-test.fingo.shop/'
    },
    prd: {
        app: 'https://page.fingo.shop/'
    }
};

const env = process.env['FINGO_APP_ENV'] ? process.env['FINGO_APP_ENV'] : 'dev';

export default assetsBaseUrl[env];

