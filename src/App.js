import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([])
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
      .then(data => {
        console.log("Ответ от сервера:", data)
        const keys = ["id", "text", "userId", "apartId", "product", "status", "amount", "email", "startDt", "endDt"]
        const formattedData = data.message.map(entry => 
          Object.fromEntries(keys.map((key, index) => [key, entry[index]]))
        )
        console.log("formattedData", formattedData)
        setData(formattedData)
      })
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
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Статус</th>
            <th className="border px-4 py-2">Сумма</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Дата начала</th>
            <th className="border px-4 py-2">Дата окончания</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border">
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.status}</td>
              <td className="border px-4 py-2">{item.amount}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.startDate}</td>
              <td className="border px-4 py-2">{item.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
