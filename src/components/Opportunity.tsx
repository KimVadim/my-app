import { useEffect, useState } from "react";
import { FloatButton, Table, Tag } from "antd";
import React from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setOpportunity } from "../slices/opportunitySlice.ts";
import { setQuote } from "../slices/quoteSlice.ts"
import { DollarOutlined, FileDoneOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';

export const Opportunity: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://palvenko-production.up.railway.app/sheet_data", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
          }
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }
  
        const data = await response.json();
        const opportunities = data.message?.opportunity || [];
        console.log(data)
        const quote = data.message?.quotes || [];

        dispatch(setOpportunity(opportunities));
        dispatch(setQuote(quote));
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
    };
  
    fetchData();
  }, [dispatch]);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
  const handleRowClick = (record: any) => {
    setSelectedRecord(record); // Сохраняем выбранную строку
    setIsModalOpen(true); // Открываем модальное окно
  };

  const columns = [
    { 
      title: "№ / Статус / Дата договора",
      dataIndex: "5",
      key: "5",
      render: (status: String, record: any) => {
        const date = new Date(record?.[8])

        return <>
          <Tag color={"#2db7f5"}>{record?.[3]}</Tag>
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
        title={() => <strong>Все договора</strong>}
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
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<PlusOutlined />}
      >
        <FloatButton icon={<FileDoneOutlined />} onClick={() => setIsModalOpen(true)} />
        <FloatButton icon={<DollarOutlined />} />
        <FloatButton icon={<WalletOutlined />} />
      </FloatButton.Group>
    </>
  );
}
