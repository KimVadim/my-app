import React from 'react';
import { Card, Modal, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';

interface OpportunityModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const optyDate = new Date(record?.[OpportunityFieldData.OptyDate]);
  const optyPayDate = new Date(record?.[OpportunityFieldData.PaymentDate]);
  const optyId = record?.[OpportunityFieldData.Id]
  const filteredQuotes = useSelector((state: RootState) => 
    selectFilteredQuotes(state, optyId)
  );
  const columns = [
    {
      title: OpportunityField.PaymentTypeLabel,
      dataIndex: OpportunityFieldData.PaymentType, 
      key: OpportunityFieldData.PaymentType,
    }, {
      title: OpportunityField.ProductLabel,
      dataIndex: OpportunityFieldData.Product,
      key: OpportunityFieldData.Product,
      render: (product: string) => {
        const productMapping: Record<string, string> = {
          Prod_1: "Аренда 170",
          Prod_2: "Аренда 160",
          Prod_3: "Депозит",
          Prod_4:	"Депозит возврат",
        };
    
        return <Tag color="orange">{productMapping[product] || "Неизвестный продукт"}</Tag>;
      },
    }, {
      title: OpportunityField.AmountLabel,
      dataIndex: OpportunityFieldData.Amount,
      key: OpportunityFieldData.Amount,
    }, { 
      title: OpportunityField.PaymentDateLabel,
      dataIndex: OpportunityFieldData.OptyDateTime,
      key: OpportunityFieldData.OptyDateTime,
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
      <Card title={ModalTitle.OpportunityDetail} variant="outlined">
        <p className="opty-card">
          <strong>{`${OpportunityField.FullNameLabel}: `}</strong> {record?.[OpportunityFieldData.FullName]}
        </p>
        <p className="opty-card"><strong>{`${OpportunityField.PhoneLabel}: `}</strong>           
          <a 
            className="phone-link"
            href={`tel:${record?.[OpportunityFieldData.Phone]}`}
            style={{ textDecoration: "none", color: "blue" }}
          >
            {formatPhoneNumber(record?.[OpportunityFieldData.Phone])}
          </a>
        </p>
        <p className="opty-card">
          <strong>{`${OpportunityField.OptyAmountLabel}: `}</strong> {record?.[OpportunityFieldData.Amount]}
        </p>
        <p className="opty-card">
          <strong>{`${OpportunityField.OptyDateLabel}: `}</strong> {optyDate.toLocaleDateString("ru-RU")}
        </p>
        <p className="opty-card">
          <strong>{`${OpportunityField.PayDateLabel}: `}</strong> {optyPayDate.toLocaleDateString("ru-RU")}
        </p>
      </Card>
      <Table
        title={() => <strong>{ModalTitle.Expense}</strong>}
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