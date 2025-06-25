import { Tag } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Card, Popup, ProgressCircle, Space } from "antd-mobile";
import { ModalTitle, OpportunityFieldData } from "../constants/appConstant.ts";
import { MODAL_TEXT } from "../constants/dictionaries.ts";

interface PaymentProgreesProps {
  setIsPaymentModal: (isOpen: boolean) => void;
  isPaymentModal: boolean;
  payments: any;
  paymentsCount: number;
  optyActiveCount: number;
  optyAllCount: number;
}

export const PaymentProgreesModal: React.FC<PaymentProgreesProps> = ({
    setIsPaymentModal,
    isPaymentModal,
    payments,
    paymentsCount,
    optyActiveCount,
    optyAllCount,
}) => {
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity);
    const apartsNum = payments.map(payment => {
        const opportunity = optyData.find(item => item[OpportunityFieldData.Id] === payment['Opportunity']);
        const apartNum = opportunity?.[OpportunityFieldData.ApartNum] || MODAL_TEXT.NotFound;
        return { apartNum };
    }).sort((a, b) => a.apartNum.localeCompare(b.apartNum, 'ru'));

    return (
        <Popup
            visible={isPaymentModal}
            showCloseButton
            position='top'
            bodyStyle={{ height: '33vh' }}
            onClose={() => {
                setIsPaymentModal(false);
            }}
            onMaskClick={() => {
                setIsPaymentModal(false);
            }}
        >
            <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
            <Card title={ModalTitle.PaymentsMonthProgress}>
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
                <p>Всего платежей: {paymentsCount} из {optyActiveCount}</p>
                <p>
                    <Space style={{ '--gap': '24px' }}>
                        <ProgressCircle
                            percent={27/optyActiveCount*100}
                            style={{'--fill-color': 'var(--adm-color-success)',}}
                        >
                            {optyActiveCount}/зак
                        </ProgressCircle>
                        <ProgressCircle
                            percent={(optyAllCount-optyActiveCount)/optyAllCount*100}
                            style={{'--fill-color': 'var(--adm-color-danger)',}}
                        >
                            {optyAllCount - optyActiveCount}/рас
                        </ProgressCircle>
                    </Space>
                </p>
            </Card>
            </div>
        </Popup>
    );
}