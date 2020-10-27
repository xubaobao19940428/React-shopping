const { apiBuilder } = require('./api');
const path = require('path');

const apiName = "swagger";
const apiJsonFilePath = "./swagger.json";
const apiDirPath = path.resolve(__dirname, './api');

const apiJson = require(apiJsonFilePath);

apiBuilder(apiDirPath, apiName, apiJson, false);
