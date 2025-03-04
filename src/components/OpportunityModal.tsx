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

  const optyDate = new Date(record?.["OppoDate"]);
  const optyPayDate = new Date(record?.["PaymentDate"]);
  const optyId = record?.["ID"]
  const filteredQuotes = useSelector((state: RootState) => 
    selectFilteredQuotes(state, optyId)
  );
  console.log(optyDate)
  const url = process.env.REACT_APP_API_URL
  console.log(url)

  const columns = [
    {
      title: "Источник",
      dataIndex: "Notes", 
      key: "Notes",
    }, {
      title: "Продукт",
      dataIndex: "Product",
      key: "Product",
    }, {
      title: "Сумма",
      dataIndex: "Amount",
      key: "Amount",
    }, { 
      title: "Дата платежа",
      dataIndex: "Date/Time",
      key: "Date/Time",
      render: (dateStr: Date) => {
        const date = new Date(dateStr)
        return <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
      },
    }
  ];

  return (
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
        <p className="opty-card"><strong>Сумма договора:</strong> {record?.["Amount"]}</p>
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
  );
};