import React from 'react';
import { Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { selectFilteredQuotes } from '../selector/selectors.tsx';
import { ModalTitle, OpportunityField, OpportunityFieldData, PaymentsFieldData, PaymentsType, UpdateOpty } from '../constants/appConstant.ts';
import { formatPhoneNumber } from '../service/utils.ts';
import { closeOpty, getSheetDataParam, updateOpty } from '../service/appServiceBackend.ts';
import { Dialog, Popup, Steps, Divider, Space, Card, Toast, AutoCenter } from 'antd-mobile'
import { Step } from 'antd-mobile/es/components/steps/step';
import { BUTTON_TEXT, MODAL_TEXT, Product, productMap, STEP_STATUS } from '../constants/dictionaries.ts';
import { StopOutline } from 'antd-mobile-icons';
import { ButtonChangeModal } from './ButtonChangeModal.tsx';
import { useLocation } from "react-router-dom";
import { setOpportunity } from '../slices/opportunitySlice.ts';
import { setQuote } from '../slices/quoteSlice.ts';
import { setContact } from '../slices/contactSlice.ts';

interface OpportunityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  record: any;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ isModalOpen, setIsModalOpen, record }) => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const optyDate = new Date(record?.[OpportunityFieldData.OptyDate]);
  const optyPayDay = record?.[OpportunityFieldData.PaymentDay];
  const optyId = record?.[OpportunityFieldData.Id]
  const filteredQuotes = useSelector((state: RootState) =>
    selectFilteredQuotes(state, optyId)
  ) as unknown as PaymentsType[];
  let locationPath;
  const totalAmount = filteredQuotes
  .filter(item => item[PaymentsFieldData.Product] !== 'Prod_3')
  .reduce(
    (sum, item) => sum + Number(item[PaymentsFieldData.Amount] || 0),
    0
  );
  switch (location.pathname) {
    case "/opportunities":
      locationPath = "Renter";
      break;

    case "/storage":
      locationPath = "Storage";
      break;

    default:
      locationPath = "Renter";
  }

  const actions = {
    handleSubmit: (optyId: string) => {
      setLoading(true);
      closeOpty(optyId).then(() => {
        getSheetDataParam(locationPath).then((response) => {
            dispatch(setOpportunity(response?.opportunities));
            dispatch(setQuote(response?.quote));
            dispatch(setContact(response?.contact));
        })
        setLoading(false);
        setIsModalOpen(false);
      });
    },
    handleUpdateOpty: (values: UpdateOpty) => {
      setLoading(true);
      updateOpty({
        optyId,
        PayPhone: values?.phone,
        Comment: values?.comment,
        OptySum: values?.optySum,
        PaymentDay: values?.paymentDay
      }).then(() => {
        getSheetDataParam(locationPath).then((response) => {
            dispatch(setOpportunity(response?.opportunities));
            dispatch(setQuote(response?.quote));
            dispatch(setContact(response?.contact));
        })
        setLoading(false);
        setIsModalOpen(false);
        Toast.show({content: <div><b>Готово!</b><div>Договор обновлен</div></div>, icon: 'success', duration: 3000 })
      });
    },
  };

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
            height: '60vh',
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
            </div>
            <p>
              <strong>{`${OpportunityField.OptyAmountLabel}: `}</strong> {Number(record?.[OpportunityFieldData.Amount])?.toLocaleString("ru-RU")}
            </p>
            <p>
              <strong>{`${OpportunityField.OptySumLabel} `}</strong> {Number(record?.[OpportunityFieldData.OptySum])?.toLocaleString("ru-RU")} / {totalAmount?.toLocaleString("ru-RU")}
            </p>
            <p><strong>{`${OpportunityField.PhoneLabel}: `}</strong>
              <a
                className="phone-link"
                href={`tel:${record?.[OpportunityFieldData.Phone]}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                {formatPhoneNumber(record?.[OpportunityFieldData.Phone])}
              </a>
            </p>
            <p>
              <strong>{`${OpportunityField.OptyDateLabel}: `}</strong> {optyDate.toLocaleDateString("ru-RU")}
            </p>
            <p>
              <strong>{`${OpportunityField.PaymentDayLabel}: ${optyPayDay} чис.`}</strong>
            </p>
            {record?.[OpportunityFieldData.PayPhone] && record?.[OpportunityFieldData.PayPhone] !== 'Нет информации' && <p className="opty-card">
              <strong>{`${OpportunityField.PayPhoneLabel}: `}</strong> {formatPhoneNumber(record?.[OpportunityFieldData.PayPhone])}
            </p>}
            <p>
              <strong>{`${OpportunityField.CommentLabel}: `}</strong>
              {record?.[OpportunityFieldData.Comment]}
            </p>
            <AutoCenter style={{ marginTop: '20px' }}>
              <Button
                icon={<StopOutline fontSize={40} />}
                variant="filled"
                onClick={async () => {
                  const confirmed = await Dialog.confirm({
                    content: MODAL_TEXT.OptyCloseText,
                    confirmText: BUTTON_TEXT.Ok,
                    cancelText: BUTTON_TEXT.Cancel,
                  });

                  if (confirmed) {
                    actions.handleSubmit(optyId);
                  }
                }}
                size='large'
                style={{ height: 55, width: 55 }}
                color="primary"
              />
              <ButtonChangeModal
                record={record}
                updateData={actions.handleUpdateOpty}
              />
            </AutoCenter>
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