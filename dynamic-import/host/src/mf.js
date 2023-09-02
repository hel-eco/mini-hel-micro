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
var cssListCache = {};
var cssStrCache = {};

var mfRoot = {
  name2listeners,
  eventBus,
  modCache, // modName: modObj --> { ver: modObj }
  // 待扩展： 下面这两个属性是用来做css缓存 和 css隔离用的  待扩展
  cssListCache, // modName: cssList --> { ver: cssList }
  cssStrCache,
};

let initSig = false;

if (!window.__MF_ROOT__) {
  window.__MF_ROOT__ = mfRoot;
  initSig = true;
}

export const mfBus = window.__MF_ROOT__.eventBus;

/**
 * 
 * @returns {typeof mfRoot}
 */
function getMfRoot() {
  return window.__MF_ROOT__;
}

/**
 * @template {any} T
 * @param {string} name
 * @returns {T}
 */
export function exposeLib(name) {
  return getMfRoot().modCache[name];
}

const locks = {};

export function getCssList(name, ver) {
  const { cssListCache } = getMfRoot();
  // todo
}

export async function loadRemote(name, options) {
  const { version = "latest", appendCss = true } = options || {};
  // reuse cache
  const modCache = getMfRoot().modCache;
  if (modCache[name]) {
    return modCache[name];
  }

  // check lock
  if (!locks[name]) {
    locks[name] = 1;
    let ver = version;
    // fetch latest ver by 404 sniff
    // 海拉是直接提前把最新版本号写入tnew配置中
    if (!version || version === "latest") {
      const sniffResult = await window.fetch(
        `https://unpkg.com/${name}/xxx/${Date.now}`
      );
      debugger;
      const nameVer = sniffResult.url
        .split("/")
        .find((str) => str.includes("@"));
      ver = nameVer.split("@")[1];
    }

    const result = await window.fetch(
      `https://unpkg.com/${name}@${ver}/build/index.html`
    );
    const htmlText = await result.text();
    // 此处不能采用 const reg = /(?<=(src="))[^"]*?(?=")/ig 写法，谨防 safari 浏览器报错
    // SyntaxError: Invalid regular expression: invalid group specifier name
    const reg = new RegExp('(?<=(src="))[^"]*?(?=")', "ig");
    const srcList = htmlText.match(reg) || [];
    const targetAssetList = [];
    srcList.forEach((v) => {
      targetAssetList.push({
        tag: "script",
        attrs: {
          src: v,
        },
      });
    });

    targetAssetList.forEach((item) => {
      if (!item.tag === "script") return;
      if (!item.attrs.src.startsWith("https://unpkg.com")) return;
      const scdom = document.createElement("script");
      scdom.src = item.attrs.src;
      document.body.appendChild(scdom);
    });

    const regCss = new RegExp('(?<=(href="))[^"]*?(?=")', "ig");
    const cssList = htmlText.match(regCss) || [];
    const targetCssList = [];
    cssList.forEach((v) => {
      if (!v.endsWith(".css")) return;
      targetCssList.push({
        tag: "link",
        attrs: {
          href: v,
        },
      });
    });

    targetCssList.forEach((item) => {
      if (!item.tag === "link") return;
      if (!item.attrs.href.startsWith("https://unpkg.com")) return;
      const linkdom = document.createElement("link");
      linkdom.href = item.attrs.href;
      linkdom.rel = "stylesheet";
      document.body.appendChild(linkdom);
    });
  }

  const bus = window.__MF_ROOT__.eventBus;
  let cb = null;
  const mod = await new Promise((resolve) => {
    cb = (AppObj) => {
      const { module: mod, name: modName } = AppObj;
      // 防止 多个组件同时加载完成被覆盖
      if (modName !== name) {
        return; // abandon
      }
      const modCache = window.__MF_ROOT__.modCache;
      modCache[name] = mod;
      resolve(mod);
    };
    bus.on("moudle_ready", cb);
  });
  bus.off("moudle_ready", cb);
  return mod;
}

export function bundReactRuntime(obj) {
  window.React = obj.React;
  window.ReactDOM = obj.ReactDOM;
}

export const isMaster = () => initSig === true;
