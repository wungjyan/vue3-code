import { track, trigger } from './effect'

function createGetter() {
  return function get(target: object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    // get 时收集依赖
    track(target, key)

    // 返回 boolean
    return res
  }
}

function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {
    const res = Reflect.set(target, key, value, receiver)
    // set 时触发依赖
    trigger(target, key, value)

    // 返回 boolean
    return res
  }
}

const get = createGetter()
const set = createSetter()

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
}
