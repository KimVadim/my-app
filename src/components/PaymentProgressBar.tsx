import { Col } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { ProgressBar } from "antd-mobile";
import { OpportunityFieldData, OpportunityType, PaymentsFieldData, PaymentsType } from "../constants/appConstant.ts";
import { PaymentProgreesModal } from "./PaymentProgressModal.tsx";

interface PaymentProgreesBarProps {
  setIsPaymentModal: (isOpen: boolean) => void;
  isPaymentModal: boolean;
}

export const PaymentProgreesBar: React.FC<PaymentProgreesBarProps> = ({
    setIsPaymentModal,
    isPaymentModal,
}) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity) as unknown as OpportunityType[];
    const quotesData = useSelector((state: RootState) => state.quote.quote) as unknown as PaymentsType[];
    const currentMonthPayments = quotesData?.filter(item => {
        const payDate = new Date(PaymentsFieldData.Created);
        return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear && ['Prod_1', 'Rent180'].includes(item[PaymentsFieldData.Product]);
    }) || [];
    const currentMonthPaymentsCount = currentMonthPayments.length;
    const optyActiveCount = optyData.filter(x => x[OpportunityFieldData.Stage] === 'Заключили').length;
    const optyAllCount = optyData.length;

    return (
        <Col flex="auto">
            {currentMonthPaymentsCount > 0 && <div onClick={() => setIsPaymentModal(true)} style={{ cursor: 'pointer' }}>
            <ProgressBar
                percent={(currentMonthPaymentsCount/optyActiveCount)*100}
                text={`${Math.floor(((currentMonthPaymentsCount/optyActiveCount)*100) * 10) / 10}% плат. ${currentMonthPaymentsCount}/${optyActiveCount}`}
                style={{
                '--text-width': '120px',
                '--fill-color': 'linear-gradient(to right, var(--adm-color-warning), var(--adm-color-success))',
                }}
            />
            </div>}
            <PaymentProgreesModal
                setIsPaymentModal={setIsPaymentModal}
                isPaymentModal={isPaymentModal}
                payments={currentMonthPayments}
                paymentsCount={currentMonthPaymentsCount}
                optyActiveCount={optyActiveCount}
                optyAllCount={optyAllCount}
            />
        </Col>
    );
}