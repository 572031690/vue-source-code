/*
 * @Author: mjh
 * @Date: 2023-08-15 16:21:28
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-15 16:21:36
 * @Description: 
 */
const person = {
    name: 'Zhang San',
    sayHi() {
      console.log(`Hi, my name is ${this.name}.`);
    },
  };
  
  person.sayHi(); // 输出 "Hi, my name is Zhang San."
  
  const otherPerson = {
    name: 'Zhang San1',
  };
  
  person.sayHi.call(otherPerson); // 输出 "Hi, my name is Zhang San."
  
  Function.prototype.myCall = function(context, ...args) {
    context = context || window;
    context.fn = this;
    const result = context.fn(...args);
    delete context.fn;
    return result;
  };
  person.sayHi.myCall(otherPerson); // 输出 "Hi, my name is Zhang San."
  