import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import React from "react"
import dayjs from 'dayjs';
import { addOpty } from "../service/appServiceBackend.ts";

interface AddOpportunutyModalProps {
  setIsAddOpty: (isOpen: boolean) => void;
  isAddOpty: boolean;
}

export interface AddOpportunuty {
  firstName: string;
  lastName: string;
  phone: string;
  product: string;
  apartNum: number;
  optyDate: Date;
  paymentDate: Date;
}

export const AddOpportunutyModal: React.FC<AddOpportunutyModalProps> = ({setIsAddOpty, isAddOpty}) => {
    const [form] = Form.useForm();
    const handleSubmit = (values: AddOpportunuty) => {
      addOpty(values).then(() => setIsAddOpty(false));
    };
    
    return (
      <Modal
        title={'Добавить договор'}
        open={isAddOpty}
        onCancel={() => setIsAddOpty(false)}
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
            label="Фамилия"
            name="lastName"
            rules={[
              { required: true, message: 'Обязтельное поле!' },
              { pattern: /^[A-Za-zА-Яа-яЁё]+$/, message: 'Только буквы!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Имя"
            name="firstName"
            rules={[
              { required: true, message: 'Обязтельное поле!' },
              { pattern: /^[A-Za-zА-Яа-яЁё]+$/, message: 'Только буквы!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Контактный телефон"
            name="phone"
            rules={[
              { required: true, message: 'Обязательное поле!' },
              { pattern: /^\+7\d{10}$/, message: 'Введите номер в формате +7 000 000 00 00' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Номер квартиры"
            name="apartNum"
            rules={[
              { required: true, message: 'Обязательное поле!' },
              { type: 'number', min: 11, max: 39, message: 'Введите число с 11 по 39' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Продукт"
            name="product"
            rules={[{ required: true, message: 'Обязтельное поле!' }]}
          >
            <Select
              style={{ width: '95%' }}
              options={[
                { value: 'Prod_1', label: 'Аренда 170' },
              ]}
              onSelect={(value: string) => form.setFieldsValue({'product': value})}
            />
          </Form.Item>
          <Form.Item
            label="Дата договора"
            name="optyDate"
            rules={[
              { required: true, message: "Обязательное поле!" }
            ]}
          >
            <DatePicker
              style={{ width: '95%' }} 
              format="DD.MM.YYYY"
              inputReadOnly={true}
              placeholder="Введите дату"
              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
            />
          </Form.Item>
          <Form.Item
            label="Дата оплаты"
            name="paymentDate"
            rules={[
              { required: true, message: 'Обязательное поле!' }
            ]}
          >
            <DatePicker
              style={{ width: '95%' }} 
              format="DD.MM.YYYY"
              inputReadOnly={true}
              placeholder="Введите дату"
              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
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
      </Modal>
    )
}