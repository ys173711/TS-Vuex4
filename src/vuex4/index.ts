// 模仿Vuex4的源码实现

interface StoreOptions<S> {
  state?: S;
  getters?: any;
  mutations?: any;
  actions?: any;
  modules?: ModuleTree<S>;
}
interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}
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


















