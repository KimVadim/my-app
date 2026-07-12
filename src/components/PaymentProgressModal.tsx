import { Badge, Tag } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Card, Divider, Popup, ProgressCircle, Space } from "antd-mobile";
import { OpportunityFieldData, OpportunityType, PaymentsFieldData, PaymentsType } from "../constants/appConstant.ts";
import { MODAL_TEXT } from "../constants/dictionaries.ts";
import dayjs from "dayjs";

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
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity as unknown as OpportunityType[])
        .filter((x)=> x['Stage'] === 'Заключили');

    const paymentsAparts = payments.map((payment: PaymentsType) => {
        const opportunity = optyData.find(item => item[OpportunityFieldData.Id] === payment[PaymentsFieldData.OptyId]);
        const apartNum = opportunity?.[OpportunityFieldData.ApartNum] || MODAL_TEXT.NotFound;
        return String(apartNum);
    });

    // ↓↓↓ Новый словарь: квартира -> дата договора ↓↓↓
    const apartToContractDate = optyData.reduce((acc: Record<string, string>, item: OpportunityType) => {
        const apartNum = item[OpportunityFieldData.ApartNum];
        const contractDate = item[OpportunityFieldData.PaymentDate]; // уточни точное имя поля
        if (apartNum && contractDate) {
            acc[String(apartNum)] = contractDate;
        }
        return acc;
    }, {});

    const allAparts = optyData
        .map(item => String(item[OpportunityFieldData.ApartNum]))
        .filter(apartNum => apartNum && apartNum !== MODAL_TEXT.NotFound)
        .sort((a, b) => Number(a) - Number(b));

    const renderFloorApartments = (floorNumber: number, minRange: number, maxRange: number) => {
        const floorAparts = allAparts.filter(apartNum => {
            const num = Number(apartNum);
            return num >= minRange && num < maxRange;
        });

        return (
            <p key={floorNumber}>
                <Divider contentPosition='left' style={{ color: '#1677ff', borderColor: '#98bff6ff' }}>
                    {floorNumber} этаж плат.
                </Divider>
                {floorAparts.map((apartNum, index) => {
                    const hasPayment = paymentsAparts.includes(apartNum);
                    const counts = paymentsAparts.reduce((acc: any, item: any) => {
                        acc[item] = (acc[item] || 0) + 1;
                        return acc;
                    }, {});
                    const contractDate = apartToContractDate[apartNum];
                    const dayOfMonth = contractDate ? dayjs(contractDate).date() : null; // число месяца (1-31)
                    const formattedDate = contractDate ? dayjs(contractDate).format("DD") : null;
                    const isBefore15 = dayOfMonth !== null ? dayOfMonth <= 15 : null;

                    return (
                        <div
                            key={`${floorNumber}-${index}`}
                            style={{
                                display: "inline-flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginRight: 4,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 11,
                                    lineHeight: "12px",
                                    height: 12,
                                    marginLeft: -9,
                                    color: isBefore15 === null ? "#999" : isBefore15 ? "#4fc116" : "#497732",
                                    fontWeight: 600,
                                }}
                            >
                                {formattedDate ? `${formattedDate}` : "\u00A0"}
                            </span>
                            <Badge count={counts?.[apartNum] > 1 ? counts[apartNum] : null} size="small" offset={[-10, 0]}>
                                <Tag color={hasPayment ? "green" : "rgba(188, 179, 178, 1)"}>
                                    {apartNum}
                                </Tag>
                            </Badge>
                        </div>
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
            onClose={() => {
                setIsPaymentModal(false);
            }}
            onMaskClick={() => {
                setIsPaymentModal(false);
            }}
        >
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card>
                    {renderFloorApartments(1, 10, 20)}
                    {renderFloorApartments(2, 20, 30)}
                    {renderFloorApartments(3, 30, 40)}
                    <p>
                        <Space style={{ '--gap': '24px' }}>
                            <ProgressCircle
                                percent={(paymentsCount)/27*100}
                                style={{'--fill-color': 'var(--adm-color-success)',}}
                            >
                                {paymentsCount}/плт
                            </ProgressCircle>
                            <div style={{ marginTop: '17px' }}><b>{Math.floor((paymentsCount)/27*100)}% общ/плт</b></div>
                            <ProgressCircle
                                percent={(optyActiveCount/27)*100}
                                style={{'--fill-color': 'var(--adm-color-success)',}}
                            >
                                {optyActiveCount}/зак
                            </ProgressCircle>
                            <div style={{ marginTop: '17px' }}><b>{Math.floor((optyActiveCount/27)*100)}% общ/зак</b></div>
                        </Space>
                    </p>
                </Card>
            </div>
        </Popup>
    );
}