import * as remoteModLogic from './remoteModLogic.mjs';
import * as remoteModShell from './remoteModShell.mjs';

(async function () {
  // const modLogic = await import('./remoteModLogic.mjs');
  // remoteModShell.setMod(modLogic);
  remoteModShell.setMod(remoteModLogic);
  await import('./entry.mjs');
})();
