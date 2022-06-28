import { useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  return (
    <div className="overlay">
      <div className="App">
        <NavBar accounts={accounts} setAccounts={setAccounts}/>
        <MainPage accounts={accounts} setAccounts={setAccounts} />
      </div>
    </div>
  );
}

export default App;
