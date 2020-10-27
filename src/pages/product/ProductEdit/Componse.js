
const setData = (arr, originVal) => {
    console.log(originVal)
    let newArrVal=[]
    for (var key in originVal) {
        var newArr = []
        originVal[key].map(item => {
            newArr.push({[key]: item})
        })
        console.log('newArr',newArr)
        newArrVal.push(newArr)
    }
    console.log('排列数据', newArrVal)
    return doExchange(newArrVal)
}

const doExchange = (arr) => {
    let newArrList = arr.concat([])
    var len = newArrList.length;
    // 当数组大于等于2个的时候
    if (len >= 2) {
        // 第一个数组的长度
        var len1 = newArrList[0].length;
        // 第二个数组的长度
        var len2 = newArrList[1].length;
        // 2个数组产生的组合数
        var lenBoth = len1 * len2;
        //  申明一个新数组,做数据暂存
        var items = new Array(lenBoth);
        // 申明新数组的索引
        var index = 0;
        // 2层嵌套循环,将组合放到新数组中
        //这里面要用let 不能用var var 不会保存i和j的值
        for (let i = 0; i < len1; i++) {
            for (let j = 0; j < len2; j++) {
                items[index] = {...newArrList[0][i],...newArrList[1][j]}
                index++;
            }
        }
        // 将新组合的数组并到原数组中
        var newArr = new Array(len - 1);
        newArr[0] = items;
        for (var i = 2; i < newArrList.length; i++) {
            newArr[i - 1] = newArrList[i];
        }
        // 执行回调
        return doExchange(newArr);
    } else {
        return newArrList[0];
    }
}
export {
    setData
}