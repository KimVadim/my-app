import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import React from "react"
import dayjs from 'dayjs';
import { addOpty } from "../service/appServiceBackend.ts";

interface AddPaymentModalProps {
  setIsAddPayment: (isOpen: boolean) => void;
  isAddPayment: boolean;
}

export interface AddPayment {
  optyId: string;
  amount: number;
  paymentType: string;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({setIsAddPayment, isAddPayment}) => {
    const [form] = Form.useForm();
    const handleSubmit = (values: AddPayment) => {
      console.log(values)
      //addOpty(values).then(() => setIsAddPayment(false));
    };
    
    return (
      <Modal 
        open={isAddPayment}
        onCancel={() => setIsAddPayment(false)}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Сумма"
            name="amount"
            rules={[
              { required: true, message: 'Обязательное поле!' },
              { type: 'number', min: 0, max: 500000, message: 'Введите сумму от 0 до 500 000' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Договор"
            name="optyId"
            rules={[{ required: true, message: 'Обязтельное поле!' }]}
          >
            <Select
              style={{ width: '95%' }}
              options={[
                { value: '3dbeb0bd', label: '27 - Даниил Цай' },
              ]}
              onSelect={(value: string) => form.setFieldsValue({'product': value})}
            />
          </Form.Item>
          <Form.Item
            label="Получатель"
            name="paymentType"
            rules={[{ required: true, message: 'Обязтельное поле!' }]}
          >
            <Select
              style={{ width: '95%' }}
              options={[
                { value: 'QR Аркен', label: 'QR Аркен' },
                { value: 'Gold Вадим', label: 'Gold Вадим' },
                { value: 'Налом', label: 'Налом' },
              ]}
              onSelect={(value: string) => form.setFieldsValue({'paymentType': value})}
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
        </Form>
      </Modal>
    )
}