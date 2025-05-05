import { Modal, Tag } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Item from "antd/es/list/Item";

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
    });
    console.log('1', optyData)
    console.log('2', payments)
    console.log('3', apartsNum)
    return (
        <Modal
            open={isPaymentModal}
            onCancel={() => setIsPaymentModal(false)}
            title="Платежей за текущий месяц"
            footer={null}
        >
            <p>1 этаж</p>
            {apartsNum && apartsNum
                .filter(x => {
                    const num = Number(x.apartNum);
                    return num > 10 && num < 20;
                })
                .map((item, index) => (
                    <Tag color="blue" key={index}>{item.apartNum}</Tag>
                ))
            }
            <p>2 этаж</p>
            {apartsNum && apartsNum
                .filter(x => {
                    const num = Number(x.apartNum);
                    return num > 20 && num < 30;
                })
                .map((item, index) => (
                    <Tag color="blue" key={index}>{item.apartNum}</Tag>
                ))
            }
            <p>3 этаж</p>
            {apartsNum && apartsNum
                .filter(x => {
                    const num = Number(x.apartNum);
                    return num > 30;
                })
                .map((item, index) => (
                    <Tag color="blue" key={index}>{item.apartNum}</Tag>
                ))
            }
            <p>Всего платежей: {paymentsCount} из 27</p>
        </Modal>
    );
}