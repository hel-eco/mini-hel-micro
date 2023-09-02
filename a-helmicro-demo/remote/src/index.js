import React from 'react';
import ReactDOM from 'react-dom';
import { isMasterApp } from 'hel-iso';
import { libReady } from 'hel-lib-proxy';
import './index.css';
import App from './App';

libReady('localmod', { App });

// 模块联邦修改
// 如果本组件被基座加载了，就不要进行渲染了，直接为父应用提供App对象即可
if (isMasterApp()) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
