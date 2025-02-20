import logo from './logo.svg';
import './App.css';
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://palvenko-production.up.railway.app/opty", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log("Ответ от сервера:", data))
      .catch(error => console.error("Ошибка запроса:", error));
  }, []); // Пустой массив зависимостей → выполняется только при первом рендере
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => alert("Кнопка нажата!")}>Нажми меня</button>
      </header>
    </div>
  );
}

export default App;
