import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import React from "react"
import dayjs from 'dayjs';
import { addOpty } from "../service/appServiceBackend.ts";

interface AddExpenseModalProps {
  setIsAddExpense: (isOpen: boolean) => void;
  isAddExpense: boolean;
}

export interface AddOpportunuty {
  optyId: string;
  expenseType: string;
  amount: number;
  comment: string;
  paymentType: string;
  optyDate: Date;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({setIsAddExpense, isAddExpense}) => {
    const [form] = Form.useForm();
    const handleSubmit = (values: AddOpportunuty) => {
      //addOpty(values).then(() => setIsAddExpense(false));
    };
    
    return (
      <Modal 
        open={isAddExpense}
        onCancel={() => setIsAddExpense(false)}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            variant: 'filled',
            phone: '+7',
            product: 'Prod_1' 
          }}
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
            label="Тип"
            name="expenseType"
            rules={[{ required: true, message: 'Обязтельное поле!' }]}
          >
            <Select
              style={{ width: '95%' }}
              options={[
                { value: 'Аренда', label: 'Аренда' },
                { value: 'Депозит', label: 'Депозит' },
                { value: 'Возврат', label: 'Возврат' },
                { value: 'Расход', label: 'Расход' },
                { value: 'Зарплата', label: 'Зарплата' },
                { value: 'Комм. Жильцы', label: 'Комм. Жильцы' },
                { value: 'Комм. Алатау', label: 'Комм. Алатау' },
                { value: 'Комм. Павленко', label: 'Комм. Павленко' },
              ]}
              onSelect={(value: string) => form.setFieldsValue({'paymentType': value})}
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
            <Button onClick={() => setIsAddExpense(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
}