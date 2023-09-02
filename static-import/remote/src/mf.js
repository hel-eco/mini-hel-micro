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


let initRoot = false;

if (!window.__MF_ROOT__) {
  window.__MF_ROOT__ = mfRoot;
  initRoot = true;
}

export const mfBus = window.__MF_ROOT__.eventBus;

/**
 * @template {any} T
 * @param {string} name 
 * @returns {T}
 */
export function exposeLib(name) {
  return window.__MF_ROOT__.modCache[name];
}

export const isMaster = () => initRoot === true;
