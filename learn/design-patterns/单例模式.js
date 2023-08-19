/*
 * @Author: mjh
 * @Date: 2023-08-19 11:33:22
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-19 11:39:28
 * @Description: 
 */
// 单例模式示例代码
class Singleton {
    constructor() {
      if (!Singleton.instance) {
        Singleton.instance = this;
      }
      return Singleton.instance;
    }
  
    createInstance() {
      const object = { name: "example" };
      return object;
    }
  
    getInstance() {
      if (!Singleton.instance) {
        Singleton.instance = this.createInstance();
      }
      return Singleton.instance;
    }
}
  
  // 使用示例
  const instance1 = new Singleton();
  const instance2 = new Singleton();
  
  console.log(instance1.getInstance() === instance2.getInstance()); // true
