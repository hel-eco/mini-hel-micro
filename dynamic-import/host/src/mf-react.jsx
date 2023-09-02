import { mfBus } from './mf';
import react, { useEffect, useState } from 'react';

// 模块联邦修改
function Empty() {
  return <div>...</div>;
}

// 模块联邦修改
async function loadRemoteMod() {
  const result = await window.fetch(`http://localhost:3000/`);
  const htmlText = await result.text();
  // 此处不能采用 const reg = /(?<=(src="))[^"]*?(?=")/ig 写法，谨防 safari 浏览器报错
  // SyntaxError: Invalid regular expression: invalid group specifier name
  const reg = new RegExp('(?<=(src="))[^"]*?(?=")', 'ig');
  const srcList = htmlText.match(reg) || [];
  const bodyAssetList = [];
  srcList.forEach((v) => {
    bodyAssetList.push({
      tag: 'script',
      attrs: {
        src: v,
      },
    });
  });

  bodyAssetList.forEach((item) => {
    if (!item.tag === 'script') return;
    if (!item.attrs.src.startsWith('http://localhost')) return;
    const scdom = document.createElement('script');
    scdom.src = item.attrs.src;
    document.body.appendChild(scdom);
  });
  console.log(bodyAssetList);
}

export function useRemoteComp() {
  const CompRef = react.useRef(Empty);
  const [, update] = useState({});

  useEffect(() => {
    loadRemoteMod();
    mfBus.on('moudle_ready', (AppObj) => {
      CompRef.current = AppObj.module;
      update({});
    });
  }, []);

  return CompRef.current;
}
