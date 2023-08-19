/*
 * @Author: mjh
 * @Date: 2023-08-19 11:48:15
 * @LastEditors: mjh
 * @LastEditTime: 2023-08-19 11:52:26
 * @Description: 
 */
interface Component {
    operation(): void;
  }
  
  class ConcreteComponent implements Component {
    public operation(): void {
      console.log("ConcreteComponent: operation.");
    }
  }
  
  class Decorator implements Component {
    protected component: Component;
  
    constructor(component: Component) {
      this.component = component;
    }
  
    public operation(): void {
      console.log("Decorator: operation.");
      this.component.operation();
    }
  }
  
  class ConcreteDecoratorA extends Decorator {
    public operation(): void {
      super.operation();
      console.log("ConcreteDecoratorA: operation.");
    }
  }
  
  class ConcreteDecoratorB extends Decorator {
    public operation(): void {
      super.operation();
      console.log("ConcreteDecoratorB: operation.");
    }
  }
  
  // 使用示例
  const concreteComponent = new ConcreteComponent();
  const concreteDecoratorA = new ConcreteDecoratorA(concreteComponent);
  const concreteDecoratorB = new ConcreteDecoratorB(concreteDecoratorA);
  
  concreteDecoratorB.operation();
  