import { isObject, extend } from './util'
import { track, trigger } from './effect'



export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}
export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(obj) {
    // 访问obj的xxxx属性会触发 get 方法
    // 当 obj 不是一个响应式的时候 由于没有 isRecvtive属性 所以会是一个undefined 这时候用 !! 把它变成一个布尔类型
    return !!obj[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(obj) {
    // 同上
    return !!obj[ReactiveFlags.IS_READONLY]
}

export function shallowReactive(raw) {
    return createActiveObject(raw, shallowReactiveHandlers)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}


export function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}

// 缓存 get set readonlyGet 这样只有触发代理的时候才会调用函数
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
// 对 get 包一层，isReadonly 默认为 fasle
// 注意这里入参增加了 shallow 参数默认为false
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key)
        // 这里就是关键了！！！！如果不需要深度响应式 那么直接返回 res
        if (shallow) return res
        // 如果 res 是对象 那么还需要深层次的实现响应式
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}
// 对 set 包一层
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}
// 当调用 reactive 的时候传入这个 handlers
export const mutableHandlers = {
    get,
    set
}
// 当调用 readonly 的时候传入这个 handlers
export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set failed, because ${target} is readonly`)
        return true
    }
}

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}
// 分别创建getter
const shallowReactiveGet = createGetter(false, true)
const shallowReadonlyGet = createGetter(true, true)

// reactive 的 set 还是不变，只是修改 getter  extend 其实就是 Object.assign
export const shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowReactiveGet
})
// readonly 的 set 还是不变，只是修改 getter  extend 其实就是 Object.assign
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

