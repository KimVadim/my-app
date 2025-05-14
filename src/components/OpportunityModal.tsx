import React from 'react';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData, Stage } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetData } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Steps, Button, Divider, Space, Card } from 'antd-mobile'
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
      <Space justify='center' block>
      <Spin spinning={loading}>
        <div
          style={{ 
            height: '55vh',
            overflowY: 'scroll',
            padding: '20px',
            marginBottom: '30px', 
            justifyContent: 'center',
            maxWidth: '360px',
            //display: 'flex',
          }}
        >
          <Card title={ModalTitle.OpportunityDetail}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.FullNameLabel}: `}</strong> {record?.[OpportunityFieldData.FullName]}
              </span>

              <Button 
                color="warning"
                size="small"
                style={{ width: 130 }}
                disabled={record?.[OpportunityFieldData.Stage] !== Stage.Signed}
                onClick={async () => {
                  const confirmed = await Dialog.confirm({
                    content: 'Подтвердите закрытие договора!',
                    cancelText: 'Отмена',
                    confirmText: 'OK',
                  });

                  if (confirmed) {
                    handleSubmit(optyId);
                  }
                }}
              >
                Расторгнуть
              </Button>
            </div>
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
          <Divider>Платежи</Divider>
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
      </Space>
    </Popup>
  );
};