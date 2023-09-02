import React from 'react';
import ReactDOM from 'react-dom';
import { bundReactRuntime } from "./mf";
import './index.css';
import App from './App';

// 父应用如果不引用cdn react，则主动bind以下透传react运行时给子模块（子模块已设置externals）
// bundReactRuntime({ React, ReactDOM })

ReactDOM.render(<App />, document.getElementById('root'));