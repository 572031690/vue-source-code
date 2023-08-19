/*
 * @Author: mjh
 * @Date: 2023-08-19 11:44:47
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-19 11:44:58
 * @Description: 
 */
class Subject {
    constructor() {
      this.observers = [];
    }
  
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    removeObserver(observer) {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
  
    notify(data) {
      this.observers.forEach(observer => observer.update(data));
    }
  }
  
  class Observer {
    update(data) {
      console.log(`Received data: ${data}`);
    }
  }
  
  // 使用示例
  const subject = new Subject();
  const observer1 = new Observer();
  const observer2 = new Observer();
  
  subject.addObserver(observer1);
  subject.addObserver(observer2);
  
  subject.notify("Hello World!");
  