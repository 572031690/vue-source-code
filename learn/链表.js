/*
 * @Author: mjh
 * @Date: 2023-08-15 13:59:41
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-15 14:15:52
 * @Description: 
 */
var reverseList = function(head) {
    var p1 = head
    var p2 = null
    while (p1) {
         var temp = p1.next
         p1.next = p2
         p2 = p1
         p1 = temp
     }
     return p2
};
 
let p1 = {
    next: null,
    value: 0
}
let startP = null
new Array(6).fill().forEach((item, index) => {
    if(!index) startP = p1
    const currP = {
        next: null,
        value: index + 1
    }
    p1.next = currP
    p1 = currP
})
function consoleList(head) {
    let p1 = head
    const outList = []
    while (p1) {
        outList.push(p1.value)
        var temp = p1.next
        p1 = temp
    }
}

consoleList(startP)

consoleList(reverseList(startP))
