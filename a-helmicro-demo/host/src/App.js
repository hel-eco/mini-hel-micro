import React from "react"
import m from 'hel-lodash'
import { useRemoteComp } from 'hel-micro-react'
import "./App.css";

function App() {
  const [tip, setTip] = React.useState('');
  const Comp = useRemoteComp('hel-tpl-remote-react-comps', 'HelloRemoteReactComp', {
    custom: {
      host: 'http://localhost:3103'
    }
  });
  const Comp2 = useRemoteComp('localmod', 'App', {
    shadow: false,
    custom: {
      host: 'http://localhost:3000'
    }
  });
  const changeTip = () => setTip(m.myUtils.myMod.sayHelloToHel(Date.now()));

  return (
    <div className="App">
      父应用:
      <Comp />
      <Comp2 />
      <button onClick={changeTip}>tip: {tip}</button>
    </div>
  );
}

export default App;
