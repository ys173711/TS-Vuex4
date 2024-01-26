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
  getters: GetterTree<any, S> = {};

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

    // 注册多模块state
    const rootModule = this.moduleCollection.root;
    const rootModuleState = rootModule.state;
    console.log('开始注册模块installModule')
    installModule(this, rootModuleState, [], rootModule)
    console.log('注册模块installModule结束，rootState: ', rootModuleState)
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
  // 
  
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
  // 注册store.getters
  forEachGetter(fn: GetterToKey<R>) {
    this.rawModule.getters && Util.forEach(this.rawModule.getters, (key, getter) => {
      fn(getter, key);
    })
  } 
  // 注册store.mutations
  forEachMutation(fn: MutationToKey<S>) {
    this.rawModule.mutations && Util.forEach(this.rawModule.mutations, (key, mutation) => {
      fn(mutation, key);
    })
  }
  // 注册store.actions
  forEachAction(fn: ActionToKey<S, R>) {
    this.rawModule.actions && Util.forEach(this.rawModule.actions, (key, action) => {
      fn(action, key);
    })
  }
}
type GetterToKey<R> = (getter: Getter<any, R>, key: string) => any;
type MutationToKey<R> = (mutation: Mutation<R>, key: string) => any;
type ActionToKey<S,R> = (action: Action<S, R>, key: string) => any;

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
    if (!path.length) { // 根模块
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
      Util.forEach(sonModules, (key, module: Module<any, R>) => {
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
  // 
  getNamespace(path: Array<string>) {
    let moduleWrapper = this.root;
    return path.reduce((namespace, key) => {
      moduleWrapper = moduleWrapper.getChild(key);
      return namespace + (moduleWrapper.namespaced ? key + '/' : '');
    }, '')
  }
}

// 工具类
class Util {
  static forEach(obj: Record<string, any>, fn: (key: string, value: any) => void) {
    Object.keys(obj).forEach(key => fn(key, obj[key]))
  }
}

// 注册多模块state
function installModule<R>(store: Store<R>, rootState: R, path: Array<string>, module: ModuleWrapper<any, R>) {
  if(!path.length) { // 根模块
    
  } else { // 子模块
    // 获取父级模块的state
    const parentState: any = getParentState(rootState, path.slice(0, -1));
    parentState[path[path.length - 1]] = module.state;
  }

  

  // 注册store.getters
  const namespace = store.moduleCollection.getNamespace(path);
  // console.log('namespace: ', namespace)
  module.forEachGetter((getter, key) => {
    // 完整getter方法名
    const namespaceType = namespace + key;
    // store.getters[namespaceType] = getter // 考虑到外部使用时访问方法名就执行
    Object.defineProperty(store.getters, namespaceType, {
      get: () => getter(module.state, store.getters, rootState, store.getters)
    })
  })

  // 注册store.mutations
  module.forEachMutation((mutation, key) => {
    // 完整mutation方法名
    const namespaceType = namespace + key;
    store.mutations[namespaceType] = (payload: any) => mutation.call(store, module.state, payload) // mutation(module.state, payload)也可以，call保证外部使用mutations方法内部可通过this访问store对象
  })

  // 
  let actionContext: ActionContext<any, R> = localContext(store, namespace);
  // 注册store.actions
  module.forEachAction((action, key) => {
    // 完整action方法名
    const namespaceType = namespace + key;
    store.actions[namespaceType] = (payload: any) => action.call(store, {
      dispatch: actionContext.dispatch,
      commit: actionContext.commit,
      state: actionContext.state,
      rootState: actionContext.rootState
    }, payload)
  })
  

  // 递归
  Util.forEach(module.children, (key, subModule: ModuleWrapper<any, R>) => {
    installModule(store, rootState, path.concat(key), subModule)
  })

  function getParentState<R>(rootState: R, path: Array<string>) {
    return path.reduce((curState, val) => {
      return (curState as any)[val]
    }, rootState)
  }

  function localContext<R>(store: Store<R>, namespace: string) {
    const noNamespace = namespace === ''; // 判断是否是根模块
    return {
      dispatch: noNamespace ? store.dispatch : (type: string, payload: any) => {
        type = namespace + type;
        return store.dispatch(type, payload)
      },
      commit: noNamespace ? store.commit : (type: string, payload: any) => {
        type = namespace + type;
        return store.commit(type, payload)
      },
      state: module.state,
      rootState: store.moduleCollection.root.state
    }
  }
  
}

// 最后功能：引入Vue3 reactive对state进行响应式处理










