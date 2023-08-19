/*
 * @Author: mjh
 * @Date: 2023-08-15 20:41:30
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-19 11:31:26
 * @Description: 
 */
function sum(...args) {
    let sumList = args
    function returnSum (...curArgs) {
        sumList = [...sumList, ...curArgs]
        return returnSum
    }
    
    returnSum.valueOf = function () {
        const sumNum = sumList.reduce((pre, cur) => {
            return pre + Number(cur)
        }, 0)
        return sumNum
    }
    return returnSum
}
sum(1)(1,2,3).valueOf()