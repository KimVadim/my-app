import React from 'react';
import { Button, Card, Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetData } from '../service/appServiceBackend.ts';
import { Popup, Steps } from 'antd-mobile'
import { Step } from 'antd-mobile/es/components/steps/step';
import { productMap } from '../constants/dictionaries.ts';

interface OpportunityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const optyDate = new Date(record?.[OpportunityFieldData.OptyDate]);
  const optyPayDate = new Date(record?.[OpportunityFieldData.PaymentDate]);
  const optyId = record?.[OpportunityFieldData.Id]
  const filteredQuotes = useSelector((state: RootState) => 
    selectFilteredQuotes(state, optyId)
  );
  const handleSubmit = (optyId: string) => {
    setLoading(true);
    closeOpty(optyId).then(() => {
      getSheetData(dispatch);
      setLoading(false);
      setIsModalOpen(false);
    });
  };

  return (
    <Popup
      visible={isModalOpen}
      showCloseButton
      onClose={() => {
        setIsModalOpen(false);
      }}
      onMaskClick={() => {
        setIsModalOpen(false);
      }}
    >
      <Spin spinning={loading}>
        <div
          style={{ height: '55vh', overflowY: 'scroll', padding: '20px' }}
        >
          <Card title={ModalTitle.OpportunityDetail} variant="outlined">
            <p className="opty-card">
              <strong>{`${OpportunityField.FullNameLabel}: `}</strong> {record?.[OpportunityFieldData.FullName]}
              {'  '}
              <Button color="danger" variant="outlined" onClick={() => handleSubmit(optyId)}>Расторгнуть</Button>
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
          <Steps direction='vertical'>
            {filteredQuotes && filteredQuotes.map(
              (item) => {
                const date = new Date(item['Date/Time']);
                return <Step
                  key={item['ID']}
                  title={`
                    ${date.toLocaleDateString("ru-RU")} / 
                    ${productMap[item['Product'] as keyof typeof productMap]} / 
                    ${item['Notes']} / ${item['Amount']}
                  `}
                  status={item['Product'] === 'Prod_3' ? 'process' : 'finish'}
                />
              }
            )}
          </Steps>
        </div>
      </Spin>
    </Popup>
  );
};