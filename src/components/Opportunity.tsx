import { useEffect, useState } from "react";
import { Button, Spin, Table, Tag } from "antd";
import React from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle } from "../constants/appConstant.ts";

export const Opportunity: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {  
    getSheetData(dispatch);
  }, [dispatch]);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
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
      <Spin spinning={loading}>
        <Table
          title={() => 
            <>
              <strong>{ModalTitle.AllOpportunity}</strong>
              <Button
                type="primary"
                onClick={() => {
                  setLoading(true)
                  getSheetData(dispatch).then(() => setLoading(false));
                }}
                style={{ marginLeft: 15 }}>Обновить</Button>
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
      </Spin>
      { isModalOpen && <OpportunityModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} record={selectedRecord} />}
    </>
  );
}
