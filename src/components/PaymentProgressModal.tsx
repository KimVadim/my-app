import { Badge, Tag } from "antd";
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
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity).filter((x)=> x['Stage'] === 'Заключили');

    const paymentsAparts = payments.map(payment => {
        const opportunity = optyData.find(item => item[OpportunityFieldData.Id] === payment['Opportunity']);
        const apartNum = opportunity?.[OpportunityFieldData.ApartNum] || MODAL_TEXT.NotFound;
        return apartNum;
    });
    const allAparts = optyData
        .map(item => item[OpportunityFieldData.ApartNum])
        .filter(apartNum => apartNum && apartNum !== MODAL_TEXT.NotFound)
        .sort((a, b) => Number(a) - Number(b));

    const renderFloorApartments = (floorNumber: number, minRange: number, maxRange: number) => {
        const floorAparts = allAparts.filter(apartNum => {
            const num = Number(apartNum);
            return num >= minRange && num < maxRange;
        });

        return (
            <p key={floorNumber}>
                <Tag color="#2db7f5">{floorNumber}</Tag>
                {floorAparts.map((apartNum, index) => {
                    const hasPayment = paymentsAparts.includes(apartNum);
                    const counts = paymentsAparts.reduce((acc, item) => {
                        acc[item] = (acc[item] || 0) + 1;
                        return acc;
                    }, {});
                    return (
                        <Badge count={counts?.[apartNum] > 1 ? counts[apartNum] : null} size="small" offset={[-10, 0]}>
                            <Tag
                                color={hasPayment ? "green" : "rgba(188, 179, 178, 1)"}
                                key={`${floorNumber}-${index}`}
                            >
                                {apartNum}
                            </Tag>
                        </Badge>
                    );
                })}
            </p>
        );
    };

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
                    {renderFloorApartments(1, 10, 20)}
                    {renderFloorApartments(2, 20, 30)}
                    {renderFloorApartments(3, 30, 40)}

                    <p>Всего платежей: {paymentsCount} из {optyActiveCount}</p>
                    <p>
                        <Space style={{ '--gap': '24px' }}>
                            <ProgressCircle
                                percent={(optyActiveCount/27)*100}
                                style={{'--fill-color': 'var(--adm-color-success)',}}
                            >
                                {optyActiveCount}/зак
                            </ProgressCircle>
                            <div style={{ marginTop: '17px' }}><b>{Math.floor((optyActiveCount/27)*100)}% общ/зак</b></div>
                            <ProgressCircle
                                percent={(optyAllCount-optyActiveCount)/optyAllCount*100}
                                style={{'--fill-color': 'var(--adm-color-danger)',}}
                            >
                                {optyAllCount - optyActiveCount}/рас
                            </ProgressCircle>
                            <div style={{ marginTop: '17px' }}><b>{Math.floor((optyAllCount-optyActiveCount)/optyAllCount*100)}% общ/рас</b></div>
                        </Space>
                    </p>
                </Card>
            </div>
        </Popup>
    );
}