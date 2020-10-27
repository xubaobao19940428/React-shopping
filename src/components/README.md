# 组件使用说明

导入方式

```import { ViewContainer } from '@/components'```

## ViewContainer 通用视图容器

### api说明
* title 页面标题

### 使用方式
```<ViewContainer title="这里是标题">这里是业务代码</ViewContainer>```

## UploadFile 图片上传组件

### api说明
* children 点击上传元素
* download 是否支持下载，默认为false
* preView 是否支持预览，默认为true
* maxSize 文件最大上传尺寸
* max 最大上传文件数量
* del 是否可删除
* values 当前图片列表
* uploadStart 开始上传
* onUploaded 上传结束
* onDelete 删除
* pathKey 图片对象url字段

### 使用方式
```<UploadFile values={['imgsrc1', 'imgsrc2']} />```

## Drag 自定义拖拽组件

提示：简单实现，复杂情况可用react-dnd替代，组件不引入

### api说明
* dataSource 拖拽列表数据源
* dragKey 拖动元素唯一标示
* onChange 拖动回调

### 拖动项api
* render 必填，渲染内容

### 使用方式
```<Drag dataSource={[id: 1, src: 'xxx/x.png', render: (row) => <img src={row.src} />]} dragKey="id onChange={(list) => { }} />```

## DragTable 拖拽表格

### api说明
* change 表格修改回调函数

### 使用方式

同 ant-design Table的api一致，组件方式也一致

```<DragTable dataSource={[id: 1, data: 'xxx',]} columns={[{dataIndex: 'data'}]} rowKey="id" />```

## EditableTable 自定义可编辑表格

支持数据同步功能

### api说明
* columns 表格列，替换Table组件columns
* sync 是否支持同步
* change 表格修改回调函数

### columns api
* editableType 该项数据编辑类型，默认为不可编辑
* syncData 是否支持同步数据
* enums 下拉列表数据枚举

### 使用方式

同 ant-design Table的api一致，columns属性新增editableType、syncData、enums属性

```<EditableTable dataSource={[id: 1, data: 'xxx',]} column={[{dataIndex: 'data'}]} rowKey="id" />```

## ExpandSelect 下来选择扩展组件

自定义下拉选择器

### api说明
* options 列表配置项
* selectedChange 选中修改回调函数
* loadData 远程调用方法，需返回promise对象
* selected 列表选中对象，用于回显

### 使用方式

级联选择，仅支持叶子节点多选

```<ExpandSelect selected={[1]} options={[{label: 'xx', value: '1', children: [], checked: true, isLeafNode: false}]} />```

## PagingSelect 分页选择器

自定义下拉选择器

### api说明
* pagingCallback 分页事件回调函数
* onChange 选择事件回调函数

### 使用方式

与Select组件使用一致

```<PagingSelect options={[label: '选项', value: 1]} />```

## PhotoPreview 图片预览组件

### api说明
* show 是否显示
* imagesList 预览图片列表
* initIndex 当前显示图片索引
* closeCallBack 关闭按钮点击事件回调

### 使用方式

```<PhotoPreview show={showPhotoPreview} imagesList={['img1.png', 'img2.png]} closeCallBack={() => setState({ showPhotoPreview: false })} />```


## 待完成组件

## TranslateLang 多语言翻译

...请求接口
