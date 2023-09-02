import 'hel-iso';
import { preFetchLib } from 'hel-micro';

(async function () {
  await preFetchLib('hel-lodash');
  await import('./loadApp');
})();