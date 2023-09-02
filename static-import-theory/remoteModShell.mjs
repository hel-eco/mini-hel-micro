
/** @type {import('./remoteModLogic.mjs')} */
const mod = {};

export function setMod(modImpl) {
  Object.assign(mod, modImpl);
}

/** @type {import('./remoteModLogic.mjs')} */
export default mod;
