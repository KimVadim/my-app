import React from 'react';
import { Button, Card, Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetData } from '../service/appServiceBackend.ts';
import { Steps } from 'antd-mobile'
import { Step } from 'antd-mobile/es/components/steps/step';
import { productMap } from '../constants/dictionaries.ts';

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const filteredQuotes = useSelector((state: RootState) => 
    selectFilteredQuotes(state, optyId)
  );
  const dispatch: AppDispatch = useDispatch();
  const handleSubmit = (optyId: string) => {
    setLoading(true);
    closeOpty(optyId).then(() => {
      getSheetData(dispatch);
      setLoading(false);
      setIsModalOpen(false);
    });
  };
  return (
    <Modal 
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Spin spinning={loading}>
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
          <Button color="danger" variant="outlined" onClick={() => handleSubmit(optyId)}>Расторгнуть договор</Button>
        </p>
      </Card>
      <Steps direction='vertical'>
        {filteredQuotes && filteredQuotes.map(
          (item) => {
            const date = new Date(item['Date/Time']);
            return <Step
              key={item['ID']}
              title={`${productMap[item['Product'] as keyof typeof productMap]} / ${item['Notes']} / ${item['Amount']}`}
              status='finish'
              description={date.toLocaleDateString("ru-RU")}
            />
          }
        )}
      </Steps>
      </Spin>
    </Modal>
  );
};