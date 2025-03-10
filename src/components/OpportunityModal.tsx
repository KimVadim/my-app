import React from 'react';
import { Button, Card, Modal, Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { paymentMeta } from './AllApplicationMeta.tsx';

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
        <p className="opty-card">
          <Button color="danger" variant="outlined">Расторгнуть договор</Button>
        </p>
      </Card>
      <Table
        title={() => <strong>{ModalTitle.Expense}</strong>}
        columns={paymentMeta}
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