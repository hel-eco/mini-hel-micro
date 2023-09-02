import logo from "./logo.svg";
import "./App.css";
import react, { useEffect, useState } from "react";
// 这是为了把类型加载下来 同时提供模块占位
import zk from 'zk-remote';
import { loadRemote } from './mf';

// 模块联邦修改
function Empty() {
  return <div>...</div>;
}

function App() {
  // 模块联邦修改
  const CompRef = react.useRef(Empty);
  const [, update] = useState({});

  useEffect(() => {
    loadRemote('zk-remote').then((/** @type {import('rk-remote')['default']}*/mod) => {
      CompRef.current = mod.App;
      update({});
    });
  }, []);

  return (
    <div className="App">
      父应用
      <CompRef.current />
      {zk.helloMf()}
      <zk.App />
    </div>
  );
}

export default App;
