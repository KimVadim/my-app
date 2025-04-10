import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Spin } from "antd";
import React from "react"
import dayjs from 'dayjs';
import { addOpty, getSheetData } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { Product, PRODUCT } from "../constants/dictionaries.ts";
import { AddOpportunuty, FieldFormat, FieldPlaceholder, FieldRules, ModalTitle, OpportunityField } from "../constants/appConstant.ts";

interface AddOpportunutyModalProps {
  setIsAddOpty: (isOpen: boolean) => void;
  isAddOpty: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
}

export const AddOpportunutyModal: React.FC<AddOpportunutyModalProps> = ({setIsAddOpty, isAddOpty, setLoading, loading}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const handleSubmit = (values: AddOpportunuty) => {
      setLoading(true);
      addOpty(values).then(() => {
        getSheetData(dispatch);
        setLoading(false);
        setIsAddOpty(false);
      });
    };
    
    return (
      <Modal
        title={ModalTitle.AddOpportunity}
        open={isAddOpty}
        onCancel={() => {
          setIsAddOpty(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            variant: 'filled',
            phone: '+7',
            product: Product.Rent170
          }}
          onFinish={handleSubmit}
        >
          <Form.Item 
            label={OpportunityField.LastNameLabel}
            name={OpportunityField.LastName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label={OpportunityField.FisrtNameLabel}
            name={OpportunityField.FisrtName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label={OpportunityField.PhoneLabel}
            name={OpportunityField.Phone}
            rules={[FieldRules.Required, FieldRules.PhoneNum]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={OpportunityField.ApartNumLabel}
            name={OpportunityField.ApartNum}
            rules={[FieldRules.Required, FieldRules.ApartNum]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={OpportunityField.ProductLabel}
            name={OpportunityField.Product}
            rules={[FieldRules.Required]}
          >
            <Select
              style={{ width: '100%' }}
              options={PRODUCT}
              onSelect={(value: string) => form.setFieldsValue({[OpportunityField.Product]: value})}
            />
          </Form.Item>
          <Form.Item
            label={OpportunityField.OptyDateLabel}
            name={OpportunityField.OptyDate}
            rules={[FieldRules.Required]}
          >
            <DatePicker
              style={{ width: '100%' }} 
              format={FieldFormat.Date}
              inputReadOnly={true}
              placeholder={FieldPlaceholder.Date}
              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
            />
          </Form.Item>
          <Form.Item
            label={OpportunityField.PaymentDateLabel}
            name={OpportunityField.PaymentDate}
            rules={[FieldRules.Required]}
          >
            <DatePicker
              style={{ width: '100%' }} 
              format={FieldFormat.Date}
              inputReadOnly={true}
              placeholder={FieldPlaceholder.Date}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              Добавить
            </Button>
            <Button onClick={() => setIsAddOpty(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              Отмена
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    )
}