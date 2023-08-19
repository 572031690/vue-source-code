/*
 * @Author: mjh
 * @Date: 2023-08-15 19:22:28
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-15 20:41:21
 * @Description: 
 */
var listTree=[
    {parentId:0,id:1,title:"节点1"},
    {parentId:0,id:2,title:"节点2"},
    {parentId:0,id:3,title:"节点3"},
    {parentId:1,id:4,title:"节点1-4"},
    {parentId:4,id:5,title:"节点1-4-5"},
    {parentId:5,id:6,title:"节点1-4-5-6"},
    {parentId:2,id:7,title:"节点2-7"},
    {parentId:3,id:8,title:"节点3-8"},
    
]
function getTreeList(list, id) {
    return list.filter(item => {
        return (item["parentId"] == id)
    }).map(item => { 
        let children = getTreeList(list, item.id);
        if (children.length < 1) {
            return { ...item }
        } else {
            return { ...item, children }
        }
    })
}
console.log(getTreeList(listTree, 0))

