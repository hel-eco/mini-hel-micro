import "./App.css";
import { useRemoteComp } from './mf-react'

function App() {
  const Comp = useRemoteComp();

  return (
    <div className="App">
      父应用
      <Comp />
    </div>
  );
}

export default App;
