import { Table, Tag } from "antd";
import { ExpenseField, ExpenseFieldData, OpportunityField, OpportunityFieldData, Stage } from "../constants/appConstant.ts"
import React from 'react';
import { Product } from "../constants/dictionaries.ts";

export const opportunityMeta = [{ 
  title: OpportunityField.OptyNameLabel,
  dataIndex: OpportunityFieldData.Stage,
  key: OpportunityFieldData.Stage,
  render: (status: String, record: any) => {
    const date = new Date(record?.[OpportunityFieldData.OptyDate])

    return <>
      <Tag color={"#2db7f5"}>{record?.[OpportunityFieldData.ApartNum]}</Tag>
      <Tag color={status === Stage.Signed ? "green" : "red"}>{status}</Tag>
      <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
    </>
  },
  width: 235,
  }, {
    title: OpportunityField.FullNameLabel,
    dataIndex: OpportunityFieldData.FullName, 
    key: OpportunityFieldData.FullName,
    ellipsis: true,
    render: (full_name: String, record: any) => {
      return <><strong className="full-name">{full_name}</strong><br/></>
  },
}];

export const paymentMeta = [
  {
    title: OpportunityField.PaymentTypeLabel,
    dataIndex: OpportunityFieldData.PaymentType, 
    key: OpportunityFieldData.PaymentType,
  }, {
    title: OpportunityField.ProductLabel,
    dataIndex: OpportunityFieldData.Product,
    key: OpportunityFieldData.Product,
    render: (product: string) => {
      const productMapping: Record<string, string> = {
        [Product.Rent170]: 'Аренда 170',
        [Product.Rent160]: 'Аренда 160',
        [Product.Deposit]: 'Депозит',
        [Product.Return]:	'Депозит возврат',
      };
  
      return <Tag color="orange">{productMapping[product] || Product.UnknownValue}</Tag>;
    },
  }, {
    title: OpportunityField.AmountLabel,
    dataIndex: OpportunityFieldData.Amount,
    key: OpportunityFieldData.Amount,
  }, { 
    title: OpportunityField.PaymentDateLabel,
    dataIndex: OpportunityFieldData.OptyDateTime,
    key: OpportunityFieldData.OptyDateTime,
    render: (dateStr: Date) => {
      const date = new Date(dateStr)
      return <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
    },
  }
];

export const expenseMeta = [{
  title: ExpenseField.ExpenseLabel,
  dataIndex: ExpenseFieldData.ApartNum,
  key: ExpenseFieldData.ApartNum,
  render: (status: String, record: any) => {
    const date = new Date(record?.[ExpenseFieldData.ExpenseDate]);
    const apartNum = record?.[ExpenseFieldData.ApartNum];

    return <>
      <Tag color={"#2db7f5"}>{record?.[ExpenseFieldData.Type]}</Tag>
      {apartNum && <Tag color={"red"}>{apartNum}</Tag>}
      <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
      <strong className="full-name">{record?.[ExpenseFieldData.Sum]}</strong>
    </>
  },
  width: 200,
}, Table.EXPAND_COLUMN];