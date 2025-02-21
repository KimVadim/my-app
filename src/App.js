import './App.css';
import { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";

function App() {
  const [data, setData] = useState([])
  const [sortedInfo, setSortedInfo] = useState(
    {
      columnKey: "status",
      field: "status",
      order: "ascend"
    }
  );
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, sorter);
    setSortedInfo(sorter);
  };

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
        const keys = ["id", "text", "userId", "apartId", "product", "status", "amount", "email", "startDt", "endDt"]
        const formattedData = data.message.map((entry, index) => ({
          key: index,
          ...Object.fromEntries(keys.map((key, idx) => [key, entry[idx]])),
        }));
        setData(formattedData)
      })
      .catch(error => console.error("Ошибка запроса:", error));
  }, []); // Пустой массив зависимостей → выполняется только при первом рендере
  
  const statusPriority = { "Заключили": 1, "Расторгли": 2 }; 

  const columns = [
    { 
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Заключили" ? "green" : "red"}>{status}</Tag>
      ),
      sorter: (a, b) => statusPriority[a.status] - statusPriority[b.status],
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      ellipsis: true,
    }, { 
      title: "Сумма",
      dataIndex: "amount", 
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
      ellipsis: true, 
    }, { 
      title: "Дата начала",
      dataIndex: "startDt",
      key: "startDt" 
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Договора</h2>
      <Table 
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        size='small'
        pagination={{
          position: ['None', 'bottomCenter'],
          pageSize: 15
        }}
      />
      <Button type="primary" style={{ marginTop: 20 }}>Обновить данные</Button>
    </div>
  );
}

export default App;
