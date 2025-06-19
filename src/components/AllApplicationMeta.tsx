import { Space, Table, Tag } from "antd";
import { ContactField, ContactFieldData, ExpenseField, ExpenseFieldData, OpportunityField, OpportunityFieldData, Stage } from "../constants/appConstant.ts"
import React from 'react';
import { Product } from "../constants/dictionaries.ts";

export const opportunityMeta = [{
  title: OpportunityField.OptyNameLabel,
  dataIndex: OpportunityFieldData.Stage,
  key: OpportunityFieldData.Stage,
  render: (status: String, record: any) => {
    const date = new Date(record?.[OpportunityFieldData.PaymentDate])

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

export const contactMeta = [{
  title: ContactField.ContactLabel,
  dataIndex: ContactFieldData.FirstName,
  key: ContactFieldData.FirstName,
  render: (status: String, record: any) => {
    return <>
      <Tag color={"#2db7f5"}>{record?.[ContactFieldData.Type]}</Tag>
      <Tag color="blue">{`${record?.[ContactFieldData.FirstName]} ${record?.[ContactFieldData.LastName]}`}</Tag>
    </>
  },
  width: 200,
}, {
  title: 'Дейст.',
  key: 'action',
  width: 30,
  render: (_, record) => (
    <Space size="middle">
      <a
        className="phone-link"
        href={`tel:${record?.[ContactFieldData.Phone]}`}
        style={{ textDecoration: "none", color: "blue" }}
      >
        Звонок
      </a>
    </Space>
  ),
}, Table.EXPAND_COLUMN];