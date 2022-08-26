export function extend(target,...rest) {
    return Object.assign(target, ...rest)
}

export function isObject(val) {
    return typeof val === 'object'
}