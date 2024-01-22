// 模仿Vuex4的源码实现

import { App, inject } from 'vue'

interface StoreOptions<S> { // 可以是单模块，所以需要定义一些模块属性
  state?: S;
  getters?: GetterTree<S, S>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, S>;
  modules?: ModuleTree<S>;
}
// getters的类型
interface GetterTree<S, R> {
  [key: string]: Getter<S, R>
}
type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}
// mutations的类型
interface MutationTree<S> {
  [key: string]: Mutation<S>
}
type Mutation<S> = (state: S, payload?: any) => void;
// actions的类型
interface ActionTree<S, R> {
  [key: string]: Action<S, R>
}
type Action<S, R> = (context: ActionContext<S, R>, payload?: any) => any;
interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  rootState: R;
  // getters: any;
  // rootGetters: any;
}
type Dispatch = (methodName: string, payload?: any) => any;
type Commit = (methodName: string, payload?: any) => any;

export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);  
  getters?: any;
  mutations?: any;
  actions?: any;
  modules?: ModuleTree<R>;
}

export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options)
}

const injectKey = 'store';
export function useStore<S=any>(): Store<S> {
  return inject(injectKey) as any; // Vue底层提供的方法，从app中获取store对象，通过同一个injectKey
}

class Store<S=any> {
  constructor(options: StoreOptions<S>) {
    console.log("Store:constructor:options: ", options)
  }
  install(app: App) {
    app.provide(injectKey, this); // 给app添加属性能访问store对象
  }
  test() {
    return "Store:test: "
  }
}
















