// 模仿Vuex4的源码实现

import { App, inject } from 'vue'

interface StoreOptions<S> { // 可以是单模块，所以需要定义一些模块属性
  state?: S;
  getters?: GetterTree<S, S>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, S>;
  modules?: ModuleTree<S>; // 多模块管理属性
}
// getters的类型
interface GetterTree<S, R> {
  [key: string]: Getter<S, R>
}
type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
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

// 多模块相关
// module的类型
interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}
export interface Module<S, R> {
  namespaced?: boolean;
  state?: S;  
  getters?: GetterTree<S, R>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, R>;
  modules?: ModuleTree<R>;
}

// 给外部使用
export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options)
}

const injectKey = 'store';
export function useStore<S=any>(): Store<S> {
  return inject(injectKey) as any; // Vue底层提供的方法，从app中获取store对象，通过同一个injectKey
}

// Store类
class Store<S=any> {
  // 从根模块开始管理所有模块，建立关联
  moduleCollection: ModuleCollection<S>;
  mutations: Record<string, any> = {};
  actions: Record<string, any> = {};
  commit: Commit;
  dispatch: Dispatch;

  constructor(options: StoreOptions<S>) { 
    this.moduleCollection = new ModuleCollection<S>(options);

    // 对commit优化处理，即可属性访问也可以方法访问
    const commit = this.commit_;
    this.commit = function(methodName: string, payload: any) {
      commit.call(this, methodName, payload)
    }
    // 对dispatch优化处理，即可属性访问也可以方法访问
    const dispatch = this.dispatch_;
    this.dispatch = function(methodName: string, payload: any) {
      dispatch.call(this, methodName, payload)
    }
  }
  install(app: App) {
    app.provide(injectKey, this); // 给app添加属性能访问store对象
  }
  test() {
    return "Store:test: "
  }
  commit_(methodName: string, payload: any) {
    const fn = this.mutations[methodName];
    if(!fn) return console.error('[vuex] unknown mutation type: ' + methodName);
    fn(payload);
  }
  dispatch_(methodName: string, payload: any) {
    const fn = this.actions[methodName];
    if(!fn) return console.error('[vuex] unknown action type: ' + methodName);
    fn(payload);
  }
}

// ModuleWrapper类：封装和管理某一个模块
class ModuleWrapper<S, R> {
  // 保存当前模块的子模块
  children: Record<string, ModuleWrapper<any, R>> = {};
  // 保存当前模块
  rawModule: Module<any, R>;
  // 保存当前模块state
  state: S;
  // 判断当前模块是否是命名空间模块
  namespaced: boolean;

  constructor(rawModule_: Module<any, R>) {
    this.rawModule = rawModule_;
    this.state = rawModule_.state || Object.create(null);
    this.namespaced = rawModule_.namespaced || false;
  }

  // 添加子模块
  addChild(key: string, moduleWrapper: ModuleWrapper<any, R>) {
    this.children[key] = moduleWrapper;
  }
  // 获取子模块
  getChild(key: string) {
    return this.children[key];
  }

}

// ModuleCollection类：管理所有模块
class ModuleCollection<R> {
  root!: ModuleWrapper<any, R>;
  // options: StoreOptions<R>这么写可以但是与模块管理名称不太匹配，所以我们换个名字，因为类型兼容的，Module<any, R>和StoreOptions<R>
  constructor(options: Module<any, R>) {
    this.register([], options);
  }
  // 添加子模块
  register(path: Array<string>, rawModule: Module<any, R>) {
    let newModule = new ModuleWrapper<any, R>(rawModule);
    if (path.length === 0) { // 根模块
      this.root = newModule
    } else { // 子模块添加到父级模块中
      const parentModule = this.getParentModule(path.slice(0, -1))
      parentModule.addChild(path[path.length - 1], newModule)
    }
    // 递归
    if (rawModule.modules) {
      const sonModules = rawModule.modules;
      /* Object.keys(sonModules).forEach(key => {
        this.register(path.concat(key), sonModules[key]);
      }) */ // 优化代码
      Util.forEach(sonModules, (key: string, module: Module<any, R>) => {
        this.register(path.concat(key), module);
      })
    }
  }
  // 获取父级模块
  getParentModule(path: string[]) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }
}

// 工具类
class Util {
  static forEach(obj: Record<string, any>, fn: Function) {
    Object.keys(obj).forEach(key => fn(key, obj[key]))
  }
}













