export class MyVue {
    constructor(config) {
        this.template = document.querySelector(config.el);
        this.data = reactive(config.data);
        for(let name in config.methods) {
            this[name] = () => {
              config.methods[name].apply(this.data);
            }
        }
        this.traversal(this.template);
    }
    // 遍历template
    traversal (node) {
        // 如果节点类型为文本
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim().match(/^{{([\s\S]+)}}$/)) {
                let name = RegExp.$1.trim(); // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串，以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
                effect(() => node.textContent = this.data[name])
            }
        }
        // 访问元素节点上的属性
        if (node.nodeType === Node.ELEMENT_NODE) {
            let attributes = node.attributes; // 包含当前node节点上的属性
            for (let attr of attributes) { // 遍历属性
                if (attr.name === 'v-model') { 
                    let name = attr.value;
                    effect(() => node.value = this.data[name]);
                    // 监听input变化，实现双向绑定
                    node.addEventListener('input', () => this.data[name] = node.value);
                }
                // v-bind 与 缩写：
                if(attr.name.match(/^v\-bind:([\s\S]+)$/) || attr.name.match(/^\:([\s\S]+)$/)) { // 给dom添加相应的属性 
                    let attrName = RegExp.$1.trim(); // 是v-bind: 后面的字符串
                    effect(() => node.setAttribute(attrName, this.data[attr.value]))
                }
                // v-on
                if(attr.name.match(/^v-on:([\s\S]+)$/)) {
                    let eventName = RegExp.$1.trim();
                    let fnName = attr.value;
                    node.addEventListener(eventName, this[fnName]);
                }
            }
        }
        // 用递归循环子节点
        if (node.childNodes && node.childNodes.length) {
            for (let child of node.childNodes) {
                this.traversal(child);
            }
        }
    }
}




// 定义effect为Map对象
let effects = new Map();
let currentEffect = null;
function effect (fn) {
    currentEffect = fn;
    fn();
    currentEffect = null;
}

// 核心Proxy
const reactive = (object) => {
    const observed = new Proxy(object, {
        get (target, key) {
            // 我们在get中做依赖收集
            if (currentEffect) {
                // 判断是否这个值
                if (!effects.has(target))
                    effects.set(target, new Map());
                if (!effects.get(target)?.get(key))
                    effects.get(target).set(key, new Array());
                // 如果想写更多的功能，方便后面删除等操作，effects可定义为Set类型，下面就不能用push用add添加  
                // 先写实现逻辑
                effects.get(target).get(key).push(currentEffect);
            }
            return target[key];
        },
        set (target, key, value) {
            target[key] = value;
            let _effects = effects?.get(target)?.get(key);
            if (_effects) {
                for (let effect of _effects) {
                    effect();
                }
            }
            return value;
        }
    })

    return observed;
}

// 我们定义两个变量和reactive，然后调用set的时候，看effect执行了几次
let dummy, dummy2;
let counter = reactive({ num: 1 });
let counter2 = reactive({ num: 1 });
effect(() => (dummy = counter.num));
effect(() => (dummy2 = counter2.num));
counter.num = 7;
