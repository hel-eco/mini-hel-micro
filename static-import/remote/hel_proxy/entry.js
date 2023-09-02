(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.remotecc = {}));
})(this, (function (exports) { 'use strict';

  var name2listeners = {};
  var eventBus = {
    on: (eventName, cb) => {
      let listeners = name2listeners[eventName];
      if (!listeners) {
        const arr = [];
        name2listeners[eventName] = arr;
        listeners = arr;
      }
      listeners.push(cb);
    },
    emit: (eventName, ...args) => {
      const listeners = name2listeners[eventName];
      if (listeners) {
        const listenersCopy = listeners.slice();
        listenersCopy.forEach((cb) => cb(...args));
      }
    },
    off: (eventName, cb) => {
      const listeners = name2listeners[eventName];
      if (listeners) {
        for (let i = 0, len = listeners.length; i < len; i++) {
          const cbItem = listeners[i];
          if (cbItem === cb) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    },
  };
  var modCache = {};

  var mfRoot = {
    name2listeners,
    eventBus,
    modCache,
  };

  if (!window.__MF_ROOT__) {
    window.__MF_ROOT__ = mfRoot;
  }

  // eslint-disable-next-line
  window.__MF_ROOT__.eventBus;

  /**
   * @template {any} T
   * @param {string} name 
   * @returns {T}
   */
  function exposeLib(name) {
    return window.__MF_ROOT__.modCache[name];
  }

  /*
  |--------------------------------------------------------------------------
  |
  | 组件类型导出文件，同时也作为 rollup 的打包入口文件，因只提供类型，rollup 打包后是一个
  | 仅包含 hel-lib-proxy 的空壳文件，对模块使用方的包体构建大小无影响
  | 模块使用方 通过 npm i xxx-lib 后，只要在头文件处执行过 preFetchLib
  | 则整个项目项使用本地模块一样载入提供方的组件，并可以点击到 node_modules 查看源码
  |
  |--------------------------------------------------------------------------
  */
  /**
   * 将提供给用户的lib暴露出去（同时也暴露了类型）
   */
  var lib = exposeLib('zk-remote');

  exports["default"] = lib;
  exports.lib = lib;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
