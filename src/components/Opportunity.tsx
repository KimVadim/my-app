import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import React from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";

export const Opportunity: React.FC = () => {
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sortedInfo, setSortedInfo] = useState(
    {
      columnKey: "5",
      field: "5",
      order: "ascend"
    }
  );

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
        setData(data.message);
      })
      .catch(error => console.error("Ошибка запроса:", error));
  }, []);
  
  const statusPriority = { "Заключили": 1, "Расторгли": 2 }; 
  
  const handleRowDoubleClick = (record: any) => {
    setSelectedRecord(record); // Сохраняем выбранную строку
    setIsModalOpen(true); // Открываем модальное окно
  };

  const columns = [
    {
      title: "#",
      dataIndex: "3",
      key: "3",
      width: 35, // Уменьшаем ширину колонки
    }, { 
      title: "ФИО",
      dataIndex: "phone", 
      key: "phone",
      ellipsis: true,
      render: (phone: string, record: any) => (
        <p>
          <strong className="full-name">{record.full_name}</strong> <br />
        </p>
      ),
    }, { 
      title: "Статус",
      dataIndex: "5",
      key: "5",
      render: (status: String) => (
        <Tag color={status === "Заключили" ? "green" : "red"}>{status}</Tag>
      ),
      sorter: (a, b) => statusPriority[a['5']] - statusPriority[b['5']],
      sortOrder: sortedInfo.columnKey === '5' ? sortedInfo.order : null,
      ellipsis: true,
      width: 100, // Уменьшаем ширину колонки
    }, { 
      title: "Дата договора",
      dataIndex: "8",
      key: "8",
      render: (startDt: string) => {
        const date = new Date(startDt);
        return <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>;
      },
      width: 100, // Уменьшаем ширину колонки
    }
  ];

  return (
    <>
      <h2>Все договора</h2>
      <Table 
        columns={columns}
        dataSource={data}
        size='small'
        pagination={{
          position: ['bottomCenter'],
          pageSize: 27
        }}
        onRow={(record) => ({
          onClick: () => handleRowDoubleClick(record),
        })}
      />
      { isModalOpen && <OpportunityModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} record={selectedRecord} />}
    </>
  );
}
