import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { mfBus, isMaster } from './mf';

// 模块联邦修改
// 向父应用基座通知组件加载完成的信号
mfBus.emit('moudle_ready', { module: App })

// 模块联邦修改
// 如果本组件被基座加载了，就不要进行渲染了，直接为父应用提供App对象即可
if (isMaster()) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
