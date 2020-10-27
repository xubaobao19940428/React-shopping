# fingo中台管理系统公共脚手架

仅供fingo内部使用

脚手架基于ant-design-pro二次开发，基础文档可参考官方文档 https://pro.ant.design/docs/getting-started-cn

基本框架 webpack + react + ant.design

## 运行脚本

start: 设置环境变量为dev，使用开发环境api，不进行代码压缩，保留console

dev: 与start基本一致，唯一区别dev使用mock

test: 设置环境变量为test，使用测试环境api，不进行代码压缩，保留console

prd: 设置环境变量为prd，使用生产环境api，进行代码压缩，去除所有console

## 目录结构以及说明

* config 脚手架配置文件目录
  - config：umi基础配置文件
  - defaultSettings.ts：脚手架默认设置文件
  - proxy.ts：服务代理配置
* public 大型文件（视频、字体、高清大图），不使用webpack打包资源文件
* routes 路由文件目录
* scripts nodejs相关代码文件
* src 项目源文件
  - umi：umi自动生成文件目录
  - assets：公共资源文件目录
  - components：公共组件文件目录
  - config：项目配置文件目录
    - api_base_url.js：api域名路径配置
    - assets_base_url.js：其他资源路径配置
  - hooks：通用hook
  - locales：国际化文件目录
  - models：数据管理目录
  - pages：所有页面目录
  - services：数据接口脚本目录
  - utils：通用工具类目录
  - access.ts：权限配置文件
  - app.ts：项目启动文件
  - global.ts： 公共脚本文件
  - global.less： 公共样式文件
  - manifest.json： 文件目录信息文件
  - manifest.json： 文件目录信息文件
  - typings.d.ts：公共类型定义文件

## 版本控制

项目版本号取package.json里的version字段，原则是每次发布生产都需要修改版本号

版本号组成：主版本号.子版本号.阶段版本号

版本号说明：1.主版本号：增加多个模块或整体架构发生变化；2.子版本号：当功能有一定的增加或变化；3.阶段版本号：一些小的改动或者是bug修复；

## 其他说明

如需接入pb接口，倒入proto文件并运行npm run proto，使用services/fetch_proto.js，如有报错，尝试直接去原项目拷贝proto.js文件替换

## 项目搭建完成情况

- 【x】基本架构搭建
- 【x】基础配置
- 【x】接口请求方法
- 【x】全局数据管理
- 【x】权限
- 【x】基本样式覆盖
- 【x】引入pb
- 【 】接口json文件编译
- 【 】工具类
- 【 】业务组件

## 组件完成情况

#### 通用组件

- 【x】页面容器 ViewContainer
- 【x】基本查询表单 QueryForm
- 【x】查询表单表格 QueryTable
- 【x】文件上传 UploadFile
- 【x】图片预览 PhotoPreview
- 【x】下拉分页加载选择器 PagingSelect
- 【 】拓展下拉选择器 ExpandSelect

#### 通用拓展组件

- 【x】多语言商品图片上传 UploadImageByLang

## 待优化

首次打包速度慢

待发现。。。
