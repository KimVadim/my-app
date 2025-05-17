import { Tag } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Card, Popup } from "antd-mobile";

interface PaymentProgreesProps {
  setIsPaymentModal: (isOpen: boolean) => void;
  isPaymentModal: boolean;
  payments: any;
  paymentsCount: number;
}

export const PaymentProgreesModal: React.FC<PaymentProgreesProps> = ({
    setIsPaymentModal,
    isPaymentModal,
    payments,
    paymentsCount
}) => {
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
    const apartsNum = payments.map(payment => {
        const opportunity = optyData.find(item => item['ID'] === payment['Opportunity']);
        const apartNum = opportunity?.['Description'] || "Не найдено";
        return { apartNum };
    }).sort((a, b) => a.apartNum.localeCompare(b.apartNum, 'ru'));

    return (
        <Popup
            visible={isPaymentModal}
            showCloseButton
            position='top'
            bodyStyle={{ height: '27vh' }}
            onClose={() => {
                setIsPaymentModal(false);
            }}
            onMaskClick={() => {
                setIsPaymentModal(false);
            }}
        >
            <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
            <Card title={'Платежи за текущий месяц'}>
                <p>
                    <Tag color="#2db7f5" key='1'>1</Tag>
                    {apartsNum && apartsNum
                        .filter(x => {
                            const num = Number(x.apartNum);
                            return num > 10 && num < 20;
                        })
                        .map((item, index) => (
                            <Tag color="green" key={index}>{item.apartNum}</Tag>
                        ))
                    }
                </p>
                <p>
                    <Tag color="#2db7f5" key='2'>2</Tag>
                    {apartsNum && apartsNum
                        .filter(x => {
                            const num = Number(x.apartNum);
                            return num > 20 && num < 30;
                        })
                        .map((item, index) => (
                            <Tag color="green" key={index}>{item.apartNum}</Tag>
                        ))
                    }
                </p>
                <p>
                    <Tag color="#2db7f5" key='3'>3</Tag>
                    {apartsNum && apartsNum
                        .filter(x => {
                            const num = Number(x.apartNum);
                            return num > 30;
                        })
                        .map((item, index) => (
                            <Tag color="green" key={index}>{item.apartNum}</Tag>
                        ))
                    }
                </p>
                <p>Всего платежей: {paymentsCount} из 27</p>
            </Card>
            </div>
        </Popup>
    );
}