// 基类 调度
class Vue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        // 判断根元素是否存在
        if (this.$el) {
            // 数据劫持 把数据全部转化用Object.defineProperty来定义
            new Observer(this.$data);
            // 把数据获取操作vm上的取值都代理到vm.$data
            this.proxyVm(this.$data);
            // 编译模板
            new Compiler(this.$el, this);
        }
    }
    proxyVm(data) {
        for (let key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]; // 进行了转化操作
                }
            })
        }
    }
}

// 编译工具
const CompilerUtil = {
    // 根据表达式取到对应的数据
    getVal(vm, expr) {
        let value = expr.split('.').reduce((data, current) => {
            return data[current];
        }, vm.$data);
        return value;
    },
    setValue(vm, expr, value) {
        let newValue = expr.split('.').reduce((data, current, index, arr) => {
            if (index == arr.length - 1) {
                return data[current] = value;
            }
            return data[current];
        }, vm.$data)
        return newValue;
    },
    getContentValue(vm, expr) {
        // 遍历表达式将内容重新特换成一个完整的内容，返回回去
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVal(vm, args[1]);
        })
    },
    text(node, expr, vm) {
        let fn = this.updater['textUpdater'];
        // 给表达时中的每个{{}}都替换成文本
        // let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        //     return this.getVal(vm, args[1]);
        // });
        // 给表达式每个{{}}都加上观察者
        let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            new Watcher(vm, args[1], newVal => {
                // 返回了一个全的字符串
                fn(node, this.getContentValue(vm, expr));
            })
            return this.getVal(vm, args[1]);
        })
        fn(node, content);
    },
    model(node, expr, vm) {
        let fn = this.updater['modelUpdater'];
        // 给输入框加一个观察者，如果稍后数据更新了触发此方法，会拿新值给输入框赋值
        new Watcher(vm, expr, (newVal) => {
            fn(node, newVal);
        });
        node.addEventListener('input', (e) => {
            // 获取用户输入的内容
            let value = e.target.value; 
            this.setValue(vm, expr, value);
        });
        let value = this.getVal(vm, expr);
        fn(node, value);
    },
    updater: {
        // 处理文本节点
        textUpdater(node, value) {
            node.textContent = value;
        },
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}

class Compiler {
    constructor(el, vm) {
        // 判断el属性是不是一个属性，如果不是元素，那就获取它
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 把当前节点中的元素获取放到内存中
        let fragment = this.nodefragment(this.el);
        // 把节点中的内容进行替换
        this.compiler(fragment);
        // 把内容从内存再塞到页面中
        this.el.appendChild(fragment);
    }
    // 判断是不是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
    // 将节点放入内存当中
    nodefragment(node) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = node.firstChild) {
            // appendChild具有移动性
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    // 编译数据
    compiler(node) {
        // 用来编译内存中的dom节点
        let childNodes = node.childNodes;
        // 类数组转化成数组
        [...childNodes].forEach(child => {
            // 判断是不是元素节点
            if (this.isElementNode(child)) {
                this.compilerElement(child);
                // 如果是元素的话还需要把自己传进去，再去遍历子节点
                this.compiler(child);
            } else {
                this.compilerText(child);
            }
        })
    }
    // 编译元素
    compilerElement(node) {
        let attributes = node.attributes; // 类数组
        [...attributes].forEach(attr => {
            let {name, value:expr} = attr;
            if(this.isDirective(name)) {
                let [, directive] = name.split('-');
                let [directiveName, eventName] = directive.split(':'); // v-model v-bind:xxx
                // 需要根据调用不同的指令来处理
                CompilerUtil[directiveName](node, expr, this.vm, eventName);
            }
        })
    }
    // 判断是不是指令
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }
    // 编译文本
    compilerText(node) {
        let content = node.textContent;
        // 判断当前文本节点是否包含{{}}
        if(/\{\{(.+?)\}\}/.test(content)) {
            CompilerUtil['text'](node, content, this.vm);
        } 
    }
}

// 实现数据劫持的功能
class Observer {
    constructor(data) {
        this.observer(data);
    }
    observer(data) {
        // 如果是对象才观察
        if(data && typeof data == 'object') {
            for (let key in data) {
                this.defineReactive(data, key, data[key])
            }
        }
    }
    defineReactive(obj, key, value) {
        this.observer(value);
        // 给每个属性都加上一个具有发布订阅的功能
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                // 创建watcher时会取到对应的内容，并且把watcher放到了全局上
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newVal) => {
                if (newVal != value) {
                    this.observer(newVal);
                    value = newVal;
                    dep.notify();// 通知相应的节点更新
                }
            }
        })
    }
}

// 观察者 vm是当前实例 exper是数据 cb是回调函数
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 默认先存放一个老值
        this.oldValue = this.get();
    }
    get() {
        Dep.target = this; // 取值 把这个观察者和数据关联起来
        let value = CompilerUtil.getVal(this.vm, this.expr);
        Dep.target = null; // 不取消，任何值取值都会添加watcher
        return value;
    }
    // 更新操作或数据变化后，会调用观察这的updata方法
    update() {
        let newVal = CompilerUtil.getVal(this.vm, this.expr);
        if (newVal !== this.oldValue) {
            this.cb(newVal)
        }
    }
}

// 订阅器
class Dep {
    constructor() {
        // 存放所有的watcher
        this.subs = []; 
    }
    // 订阅
    addSub(watcher) {
        // 添加watcher
        this.subs.push(watcher);
    }
    // 发布
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

