import React from 'react';
import { Modal, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const optyDate = new Date(record?.["8"]);
  const optyPayDate = new Date(record?.["9"]);
  const quoteData = useSelector((state: RootState) => state.quote.quote)
  const columns = [
    {
      title: "Источник",
      dataIndex: "5", 
      key: "5",
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
        title="Детали договора" 
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <p><strong>ФИО:</strong> {record?.full_name}</p>
        <p><strong>Телефон: </strong>           
          <a className="phone-link" href={`tel:${record?.phone}`} style={{ textDecoration: "none", color: "blue" }}>
            {formatPhoneNumber(record?.phone)}
          </a>
        </p>
        <p><strong>Сумма договора:</strong> {record?.["6"]}</p>
        <p><strong>Дата договора:</strong> {optyDate.toLocaleDateString("ru-RU")}</p>
        <p><strong>Дата оплаты:</strong> {optyPayDate.toLocaleDateString("ru-RU")}</p>
        <h2>Платежи</h2>
        <Table 
          columns={columns}
          dataSource={quoteData}
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