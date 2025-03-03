import { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import React from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { useNavigate } from "react-router-dom";

export const Opportunity: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }; 
  useEffect(() => {  
    getSheetData(dispatch);
  }, [dispatch]);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
  const handleRowClick = (record: any) => {
    setSelectedRecord(record); // Сохраняем выбранную строку
    setIsModalOpen(true); // Открываем модальное окно
  };

  const columns = [
    { 
      title: "№ / Статус / Дата договора",
      dataIndex: "Stage",
      key: "Stage",
      render: (status: String, record: any) => {
        const date = new Date(record?.['OppoDate'])

        return <>
          <Tag color={"#2db7f5"}>{record?.['Description']}</Tag>
          <Tag color={status === "Заключили" ? "green" : "red"}>{status}</Tag>
          <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
        </>
      },
      width: 235,
    }, {
      title: "ФИО",
      dataIndex: "full_name", 
      key: "full_name",
      ellipsis: true,
      render: (full_name: String, record: any) => {
        return <>
          <strong className="full-name">{full_name}</strong> <br />
        </>
      },
    }
  ];

  return (
    <>
      <Table
        title={() => 
          <>
            <strong>Все договора</strong>
            <Button type="primary" onClick={() => getSheetData(dispatch)} style={{ marginLeft: 15 }}>Обновить</Button>
            <Button onClick={() => handleLogout()} style={{ marginLeft: 15 }}>Выйти</Button>
          </>
        }
        columns={columns}
        dataSource={optyData}
        size='middle'
        pagination={{
          position: ['bottomCenter'],
          pageSize: 27
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      { isModalOpen && <OpportunityModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} record={selectedRecord} />}
    </>
  );
}
