import { Button, notification, Spin, Table } from "antd";
import React, { useEffect, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getSheetData } from "../service/appServiceBackend.ts";
import { ModalTitle } from "../constants/appConstant.ts";
import { openNotification } from "../service/utils.ts";
import { opportunityMeta } from "./AllApplicationMeta.tsx";

export const Opportunity: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [api, contextNotification] = notification.useNotification();
  
  useEffect(() => {  
    getSheetData(dispatch);
  }, [dispatch]);
  
  const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <>
      {contextNotification}
      <Spin spinning={loading}>
        <Table
          title={() => 
            <>
              <strong>{ModalTitle.AllOpportunity}</strong>
              <Button
                type="primary"
                onClick={() => {
                  setLoading(true)
                  getSheetData(dispatch).then(() => {
                    setLoading(false)
                    openNotification(api, 'success', 'Данные обновлены', 'Договора и платежи');
                  });
                }}
                style={{ marginLeft: 15 }}>Обновить</Button>
            </>
          }
          columns={opportunityMeta}
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
      {isModalOpen && 
        <OpportunityModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen} 
          record={selectedRecord} 
        />
      }
    </>
  );
}
