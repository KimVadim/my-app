import React from 'react';
import { Modal } from 'antd';
import { Opportunity } from './Opportunity.tsx';

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

        <Opportunity />
      </Modal>
    </>
  );
};