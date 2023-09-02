import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import sharedMod from './entrance/libProperties';
import { isMaster, mfBus } from "./mf";
import pkg from '../package.json';

// 模块联邦修改
// 向父应用基座通知组件加载完成的信号
const { name } = pkg;
mfBus.emit("moudle_ready", { module: sharedMod, name });

// 模块联邦修改
// 如果本组件被基座加载了，就不要进行渲染了，直接为父应用提供App对象即可
if (isMaster()) {
  console.lor('render App');
  ReactDOM.render(<App />, document.getElementById('root'));
}
