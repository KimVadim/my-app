import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import React from 'react';
import { PhoneOutlined } from "@ant-design/icons";

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
};

function Opportunity() {
  const [data, setData] = useState([])
  const [sortedInfo, setSortedInfo] = useState(
    {
      columnKey: "5",
      field: "5",
      order: "ascend"
    }
  );
  const handleChange = (pagination, filters, sorter) => {
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
        setData(data.message);
      })
      .catch(error => console.error("Ошибка запроса:", error));
  }, []);
  
  const statusPriority = { "Заключили": 1, "Расторгли": 2 }; 

  const columns = [
    { 
      title: "Статус",
      dataIndex: "5",
      key: "5",
      render: (status: String) => (
        <Tag color={status === "Заключили" ? "green" : "red"}>{status}</Tag>
      ),
      sorter: (a, b) => statusPriority[a['5']] - statusPriority[b['5']],
      sortOrder: sortedInfo.columnKey === '5' ? sortedInfo.order : null,
      ellipsis: true,
    }, { 
      title: "ФИО, Телефон",
      dataIndex: "phone", 
      key: "phone",
      ellipsis: true,
      render: (phone: string, record: any) => (
        <p>
          <strong className="full-name">{record.full_name}</strong> <br />
          <a className="phone-link" href={`tel:${phone}`} style={{ textDecoration: "none", color: "blue" }}>
            {formatPhoneNumber(phone)}
          </a>
        </p>
      ),
    }, { 
      title: "Дата договора",
      dataIndex: "8",
      key: "8",
      render: (startDt: string) => {
        const date = new Date(startDt);
        return <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>;
      },
    }
  ];

  return (
      <Table 
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        size='small'
        pagination={{
          position: ['None', 'bottomCenter'],
          pageSize: 27
        }}
      />
  );
}

export default Opportunity;
