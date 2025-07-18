import React from 'react';
import { DatePicker, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { FieldFormat, FieldPlaceholder, ModalTitle, OpportunityField, OpportunityFieldData, Stage } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetData } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Steps, Button, Divider, Space, Card } from 'antd-mobile'
import { Step } from 'antd-mobile/es/components/steps/step';
import { BUTTON_TEXT, MODAL_TEXT, Product, productMap, STEP_STATUS } from '../constants/dictionaries.ts';
import dayjs from 'dayjs';

interface OpportunityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
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

  const log = (value: any, mode: string) => {
    console.log(value)
    console.log(mode)
  }

  let parsedDate = optyPayDate && dayjs(optyPayDate);
  return (
    <Popup
      visible={isModalOpen}
      showCloseButton
      onClose={() => {setIsModalOpen(false);}}
      onMaskClick={() => {setIsModalOpen(false);}}
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
                style={{ width: 110, marginTop: '-5px' }}
                disabled={record?.[OpportunityFieldData.Stage] !== Stage.Signed}
                onClick={async () => {
                  const confirmed = await Dialog.confirm({
                    content: MODAL_TEXT.OptyCloseText,
                    cancelText: BUTTON_TEXT.Cancel,
                    confirmText: BUTTON_TEXT.Ok,
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
              <strong>{`${OpportunityField.OptyAmountLabel}: `}</strong> {Number(record?.[OpportunityFieldData.Amount])?.toLocaleString("ru-RU")}
            </p>
            <p className="opty-card">
              <strong>{`${OpportunityField.OptyDateLabel}: `}</strong> {optyDate.toLocaleDateString("ru-RU")}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.PayDateLabel}: `}</strong> {optyPayDate.toLocaleDateString("ru-RU")}
                <DatePicker
                  format={FieldFormat.Date} // "DD.MM.YYYY"
                  inputReadOnly={true}
                  placeholder={FieldPlaceholder.Date} // "Выберите дату"
                  disabledDate={(current) => current && current.isBefore(parsedDate, 'day')}
                  defaultValue={optyPayDate ? parsedDate : undefined}
                  //style={{ marginLeft: 8 }} // Отступ для визуального разделения
                  allowClear={false}
                  onPanelChange={(value, mode) => log(value, mode)}
                  needConfirm={true}
                />
              </span>
            </div>
          </Card>
          <Divider>Платежи</Divider>
          <Steps direction='vertical'>
            {filteredQuotes && filteredQuotes.map(
              (item) => {
                const date = new Date(item[OpportunityFieldData.OptyDateTime]);
                return <Step
                  key={item[OpportunityFieldData.Id]}
                  title={`
                    ${date.toLocaleDateString("ru-RU")} /
                    ${productMap[item[OpportunityFieldData.Product] as keyof typeof productMap]} /
                    ${item[OpportunityFieldData.PaymentType]} / ${Number(item[OpportunityFieldData.Amount])?.toLocaleString("ru-RU")}
                  `}
                  status={
                    item[OpportunityFieldData.Product] === Product.Deposit
                      ? STEP_STATUS.Process
                      : item[OpportunityFieldData.Product] === Product.Return
                        ? STEP_STATUS.Error
                        : STEP_STATUS.Finish
                  }
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