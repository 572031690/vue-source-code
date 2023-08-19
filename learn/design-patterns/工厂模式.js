/*
 * @Author: mjh
 * @Date: 2023-08-19 11:41:42
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-19 11:43:19
 * @Description: 
 */
class Product {
    constructor(name) {
      this.name = name;
    }
  
    getName() {
      return this.name;
    }
  }
  
class ProductFactory {
    static createProduct(name) {
      return new Product(name);
    }
  }
  
  // 使用示例
  const product = ProductFactory.createProduct("Example Product");
  console.log(product.getName()); // "Example Product"

// 以上代码中，Product 类表示要创建的产品，
// ProductFactory 类实现了工厂模式，
// 通过 createProduct 方法创建产品实例。
// 在使用时，可以通过工厂类创建产品实例，
// 而不需要直接调用产品类的构造函数。通过工厂模式可以将对象的创建和使用分离，
// 提高代码的灵活性和可维护性。
