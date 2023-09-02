/*
|--------------------------------------------------------------------------
|
| 这些组件暴露给使用方
|
|--------------------------------------------------------------------------
*/
import App from '../App';

const toExport = {
  App,
  helloMf(){
    console.log('call remote fn');
    return 1;
  }
};

export default toExport;
