import { AutoComplete, Button, DatePicker, Form, InputNumber, Modal, Select, Spin } from "antd";
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store.ts";
import { addPayment, getSheetData } from "../service/appServiceBackend.ts";
import { PAYMENT_TYPE, PRODUCT } from "../constants/dictionaries.ts";
import { AddPayment, FieldFormat, FieldPlaceholder, FieldRules, ModalTitle, OpportunityFieldData, PaymentField, Stage } from "../constants/appConstant.ts";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

interface AddPaymentModalProps {
  setIsAddPayment: (isOpen: boolean) => void;
  isAddPayment: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
      setIsAddPayment,
      isAddPayment,
      setLoading,
      loading
  }) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [options, setOptions] = useState<{ optyId: string; value: string; label: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
    const [isHiddenItem, setHiddenItem] = React.useState<boolean>(false);

    const handleSubmit = (values: AddPayment) => {
      setLoading(true)
      addPayment(values).then(() => {
        getSheetData(dispatch);
        setLoading(false)
        setIsAddPayment(false)
      });
    };
    
    const handleSearch = (value: string) => {
      if (!optyData) return;
  
      const filteredOptions = optyData
        .filter(item => item[OpportunityFieldData.Stage] === Stage.Signed)
        .filter(item =>
          item[OpportunityFieldData.FullName].toLowerCase().includes(value.toLowerCase()) || 
          item[OpportunityFieldData.ApartNum].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7)
        .map(item => ({
          optyId: item[OpportunityFieldData.Id],
          conId: item[OpportunityFieldData.Contact],
          value: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`,
          label: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`
        }));
  
      setOptions(filteredOptions);
    };
    
    console.log(form.getFieldValue(PaymentField.PaymentDate))
    return (
      <Modal
        title={ModalTitle.AddPayment}
        open={isAddPayment}
        onCancel={() => {
          setIsAddPayment(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              [PaymentField.PaymentDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
            }}
          >
            <Form.Item
              label={PaymentField.ProductLabel}
              name={PaymentField.Product}
              rules={[FieldRules.Required]}
            >
              <Select
                style={{ width: '100%' }}
                options={PRODUCT}
                onSelect={(value: string) => {
                  form.setFieldsValue({[PaymentField.Product]: value});
                  console.log(value);
                  value && ['Prod_4'].includes(value)
                      ? setHiddenItem(true)
                      : setHiddenItem(false);
              }}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.AmountLabel}
              name={PaymentField.Amount}
              rules={[FieldRules.Required, FieldRules.PaymentAmount]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={PaymentField.OptyNameLabel}
              name={PaymentField.OptyName}
              rules={[FieldRules.Required]}
            >
              <AutoComplete
                style={{ width: '100%' }}
                onSearch={handleSearch}
                placeholder={FieldPlaceholder.OptyName}
                options={options}
                onSelect={(value: string, option: any) => {
                  form.setFieldsValue({
                    optyId: option.optyId,
                    conId: option.conId
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.PaymnetTypeLabel}
              name={PaymentField.PaymentType}
              rules={[FieldRules.Required]}
            >
              <Select
                style={{ width: '100%' }}
                options={PAYMENT_TYPE}
                onSelect={(value: string) => form.setFieldsValue({[PaymentField.PaymentType]: value})}
              />
            </Form.Item>
            {isHiddenItem && (<Form.Item
                label={PaymentField.CommentLabel}
                name={PaymentField.Comment}
                rules={[FieldRules.Required]}
              >
                <TextArea 
                  showCount 
                  maxLength={300} 
                  placeholder={FieldPlaceholder.Comment}
                  autoSize={{ minRows: 2, maxRows: 4 }} 
                />
            </Form.Item>)}
            <Form.Item
              label={PaymentField.PaymentDateLabel}
              name={PaymentField.PaymentDate}
              rules={[FieldRules.Required]}
            >
              <DatePicker
                style={{ width: '100%' }} 
                format={FieldFormat.Date}
                inputReadOnly={true}
                placeholder={FieldPlaceholder.Date}
                defaultValue={dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date)}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Добавить
              </Button>
              <Button onClick={() => setIsAddPayment(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                Отмена
              </Button>
            </Form.Item>
            <Form.Item name={PaymentField.OptyId} hidden={true}></Form.Item>
            <Form.Item name={PaymentField.ContactId} hidden={true}></Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
}