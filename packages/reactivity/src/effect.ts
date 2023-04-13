import { Dep, createDep } from './dep'

// Map 的 key 是 target 对象的某个属性，value 是此属性绑定的 activeEffect
// type KeyToMap = Map<any, ReactiveEffect>

// 一个 key 对应多个 effect 时，value 是一个多 activeEffect 的 Set 类型
type KeyToMap = Map<any, Dep>

// 用于缓存数据依赖关系
// key 是传入 reactive 的原对象（target），value 是一个 Map
const targetMap = new WeakMap<any, KeyToMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  // 第一次执行传入的参数函数
  _effect.run()
}

// 当前激活的 effect
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
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
  // depsMap.set(key, activeEffect) // 一个 key 对应一个 effect 时，value 是单一的 activeEffect
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

// 触发依赖（set时）
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  // 处理一个 key 对应多个 effect
  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) {
    return
  }
  triggerEffects(dep)

  // 一个 key 只对应一个 effect 时候
  // const effect = depsMap.get(key) as ReactiveEffect
  // if (!effect) {
  //   return
  // }

  // effect.fn()
}

export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    effect.fn()
  }
}
