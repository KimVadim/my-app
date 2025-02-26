import React from 'react';
import { Card, Modal, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';

interface OpportunityModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  record: any;
}

const formatPhoneNumber = (phone: String) => {
  if (!phone) return "";
  return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
};

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const optyDate = new Date(record?.["8"]);
  const optyPayDate = new Date(record?.["9"]);
  const optyId = record?.[0]
  const filteredQuotes = useSelector((state: RootState) => 
    selectFilteredQuotes(state, optyId)
  );
  
  const columns = [
    {
      title: "Источник",
      dataIndex: "5", 
      key: "5",
    }, {
      title: "Продукт",
      dataIndex: "4",
      key: "4",
    }, {
      title: "Сумма",
      dataIndex: "6",
      key: "6",
    }, { 
      title: "Дата платежа",
      dataIndex: "7",
      key: "7",
      render: (dateStr: Date) => {
        const date = new Date(dateStr)
        return <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
      },
    }
  ];

  return (
    <>
      <Modal 
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Card title="Детали договора" variant="outlined">
          <p className="opty-card"><strong>ФИО:</strong> {record?.full_name}</p>
          <p className="opty-card"><strong>Телефон: </strong>           
            <a className="phone-link" href={`tel:${record?.phone}`} style={{ textDecoration: "none", color: "blue" }}>
              {formatPhoneNumber(record?.phone)}
            </a>
          </p>
          <p className="opty-card"><strong>Сумма договора:</strong> {record?.["6"]}</p>
          <p className="opty-card"><strong>Дата договора:</strong> {optyDate.toLocaleDateString("ru-RU")}</p>
          <p className="opty-card"><strong>Дата оплаты:</strong> {optyPayDate.toLocaleDateString("ru-RU")}</p>
        </Card>
        <Table
          title={() => <strong>Платежи</strong>}
          columns={columns}
          dataSource={filteredQuotes}
          size='small'
          pagination={{
            position: ['bottomCenter'],
            pageSize: 5
          }}
        />
      </Modal>
    </>
  );
};