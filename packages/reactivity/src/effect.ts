// Map 的 key 是 target 对象的某个属性，value 是此属性绑定的 activeEffect
type KeyToMap = Map<any, ReactiveEffect>

// 用于缓存数据依赖关系
// key 是传入 reactive 的原对象（target），value 是一个 Map
const targetMap = new WeakMap<any, KeyToMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  // 第一次执行传入的参数函数
  _effect.run()
}

// 当前激活的 effect
let activeEffect: ReactiveEffect | undefined

class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

// 收集依赖（get时）
export function track(target: object, key: unknown) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  depsMap.set(key, activeEffect)
}

// 触发依赖（set时）
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const effect = depsMap.get(key) as ReactiveEffect
  if (!effect) {
    return
  }

  effect.fn()
}
