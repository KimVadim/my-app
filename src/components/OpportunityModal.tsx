import React from 'react';
import { DatePicker, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { FieldFormat, FieldPlaceholder, ModalTitle, OpportunityField, OpportunityFieldData, PaymentsFieldData, PaymentsType, Stage } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetData, updateOptyPayDate } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Steps, Button, Divider, Space, Card, Toast, TextArea } from 'antd-mobile'
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
  ) as unknown as PaymentsType[];

  const handleSubmit = (optyId: string) => {
    setLoading(true);
    closeOpty(optyId).then(() => {
      getSheetData(dispatch);
      setLoading(false);
      setIsModalOpen(false);
    });
  };

  const handleUpdateOpty = (values: string) => {
    setLoading(true);
    updateOptyPayDate({optyId , paymentDate: values}).then(() => {
      getSheetData(dispatch);
      setLoading(false);
      setIsModalOpen(false);
      Toast.show({content: <div><b>Готово!</b><div>Дата платежа обновлена</div></div>, icon: 'success', duration: 3000 })
    });
  };

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
            <p className="opty-card">
              <strong>{`${OpportunityField.OptyAmountLabel}: `}</strong> {Number(record?.[OpportunityFieldData.Amount])?.toLocaleString("ru-RU")}
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
              <strong>{`${OpportunityField.OptyDateLabel}: `}</strong> {optyDate.toLocaleDateString("ru-RU")}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: '10px' }}>
              <span>
                <strong>{`${OpportunityField.PayDateLabel}: `}</strong>
                <DatePicker
                  format={FieldFormat.Date}
                  inputReadOnly={true}
                  placeholder={FieldPlaceholder.Date}
                  disabledDate={(current) => current && current.isBefore(parsedDate, 'day')}
                  value={optyPayDate ? parsedDate : undefined}
                  allowClear={false}
                  needConfirm={true}
                  onChange={(value) => {
                    if (value) {
                      const day = value.date();
                      const month = value.month() + 1; // месяцы начинаются с 0
                      const year = value.year();
                      handleUpdateOpty(`${month}/${day}/${year}`);
                    }
                  }}
                />
              </span>
            </div>
            <p className="opty-card">
              <strong>{`${OpportunityField.PayPhoneLabel}: `}</strong> {formatPhoneNumber(record?.[OpportunityFieldData.PayPhone])}
            </p>
            <p className="opty-card">
              <strong>{`${OpportunityField.CommentLabel}:`}</strong>
            </p>
            <TextArea
              placeholder={OpportunityField.CommentLabel}
              value={record?.[OpportunityFieldData.Comment]}
              autoSize={{ minRows: 3, maxRows: 8 }}
            />
          </Card>
          <Divider>Платежи</Divider>
          <Steps direction='vertical'>
            {filteredQuotes && filteredQuotes.map(
              (item) => {
                const date = new Date(item[PaymentsFieldData.Created]);
                return <Step
                  key={item[PaymentsFieldData.Id]}
                  title={`
                    ${date.toLocaleDateString("ru-RU")} /
                    ${productMap[item[PaymentsFieldData.Product] as keyof typeof productMap]} /
                    ${item[PaymentsFieldData.PaymentType]} / ${Number(item[PaymentsFieldData.Amount])?.toLocaleString("ru-RU")}
                  `}
                  status={
                    item[PaymentsFieldData.Product] === Product.Deposit
                      ? STEP_STATUS.Process
                      : item[PaymentsFieldData.Product] === Product.Return
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