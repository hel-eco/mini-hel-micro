import { loadRemote, bundReactRuntime } from "./mf";
import React from "react";
import ReactDOM from "react-dom/client";

(async function () {
  bundReactRuntime({ React, ReactDOM });
  // 预加载
  const mod = await loadRemote("zk-remote");
  console.log('mod ', mod);
  await import("./loadApp");
})();
