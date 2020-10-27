# 通用hook使用说明

## useSetState 状态更新hook

### 使用方式

```
const { state, setState } = useSetState({ 
    state1: 1, 
    state2: 2 
})
setState({
    state1: state.state1 + state.state2,
    state3: 'new state'
}, (nextState) => {
    console.log(state.state1);  // => 3
    console.log(state.state3);  // => new state
})
```
### 使用说明

解决单组件状态过多问题

## useFetch promise接口处理hook

## 调用参数

* fetch：promise对象
* params：请求参数
* isRequest：是否向服务端发出请求

## 返回参数

* data：返回参数
* loading：接口loading
* fetchData：发起接口请求
* reFetchData：重新发起请求

### 使用方式

```
const { data, loading, fetchData, reFetchData } = useFetch(fetch, params)
```
