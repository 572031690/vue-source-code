const data = {
    a: 1,
    b: 2
}

let activeEffect
const effectStach = []
function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStach.push(effectFn)
        fn()
        effectStach.pop()
        activeEffect = effectStach[effectStach.length - 1]
    }
    effectFn.deps = []
    effectFn()
  }
  

const reactiveMap = new WeakMap()

const obj = new Proxy(data, {
    get (targetObj, key) {
        let depsMap = reactiveMap.get(targetObj)
        if (!depsMap) {
          reactiveMap.set(targetObj, (depsMap = new Map()))
        }
        let deps = depsMap.get(key)
        if (!deps) {
          depsMap.set(key, (deps = new Set()))
        }
        deps.add(activeEffect)
        activeEffect.deps.push(deps)
        return targetObj[key]
    },
    set(targetObj, key, newVal) {
        targetObj[key] = newVal
    
        const depsMap = reactiveMap.get(targetObj)
    
        if (!depsMap) return
    
        const effects = depsMap.get(key)
        // effects && effects.forEach(fn => fn())
        const effectToRun = new Set(effects)
        effectToRun.forEach(effectFun => effectFun())
        return true // set 必须返回一个boolean，true代表成功 如果不返回或者返回false会在严格模式下报错
    }
    
})

function cleanup(effectFn) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

// effect(() => { // 此处调用 proxy的get收集依赖
//     console.log(obj.a);
// });
// effect(() => { // 此处调用 proxy的get收集依赖
//     console.log(obj.a ? obj.b : 'nothing');
// });
// console.log(obj);
// obj.a = undefined;
// obj.b = 3;
// obj.a = 2
// obj.b = 4;
// obj.a = undefined
effect(() => {
    console.log('effect1');
    effect(() => {
        console.log('effect2');
        obj.b;
    });
    obj.a;
});
obj.a = 3;


export default  obj