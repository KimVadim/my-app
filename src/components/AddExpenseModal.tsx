import { AutoComplete, Button, Form, InputNumber, Modal, Select } from "antd";
import React, { useState } from "react"
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";

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
    const [options, setOptions] = useState<{ optyId: string; value: string; label: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity)

    const handleSubmit = (values: AddOpportunuty) => {
      console.log(values)
    };
    
    const handleSearch = (value: string) => {
      if (!optyData) return;
  
      const filteredOptions = optyData
        .filter(item => item['Stage'] === 'Заключили')
        .filter(item =>
          item['full_name'].toLowerCase().includes(value.toLowerCase()) || 
          item['Description'].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7)
        .map(item => ({
          optyId: item['ID'],
          value: `${item['Description']} - ${item['full_name']}`,
          label: `${item['Description']} - ${item['full_name']}`
        }));
  
      setOptions(filteredOptions);
    };
    
    return (
      <Modal
        title={'Добавить расход'}
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
            name="optyName"
            rules={[{ required: true, message: 'Обязтельное поле!' }]}
          >
            <AutoComplete
              style={{ width: '95%' }}
              onSearch={handleSearch}
              placeholder="Введите номер квартиры или ФИО"
              options={options}
              onSelect={(value: string, option: any) => {
                form.setFieldsValue({
                  optyId: option.optyId,
                });
              }}
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
              onSelect={(value: string) => form.setFieldsValue({'expenseType': value})}
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
          <Form.Item name="optyId" hidden={true}></Form.Item>
        </Form>
      </Modal>
    )
}