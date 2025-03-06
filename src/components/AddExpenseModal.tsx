import { AutoComplete, Button, Form, Input, InputNumber, Modal, Select, Spin } from "antd";
import React, { useState } from "react"
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { addExpense } from "../service/appServiceBackend.ts";
import TextArea from "antd/es/input/TextArea";
import { debounce } from 'lodash';

interface AddExpenseModalProps {
  setIsAddExpense: (isOpen: boolean) => void;
  isAddExpense: boolean;
}

interface OptionType {
  optyId: string;
  value: string;
  label: string;
  apartNum: string;
}

export interface AddExpense {
  optyId: string;
  expenseType: string;
  amount: number;
  comment: string;
  paymentType: string;
  apartNum: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({setIsAddExpense, isAddExpense}) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<{ optyId: string; value: string; label: string; apartNum: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSubmit = (values: AddExpense) => {
      console.log(values);
      setLoading(true);
      addExpense(values)
        .then(() => {
          setLoading(false);
          setIsAddExpense(false);
          form.resetFields();
        })
        .catch((error) => {
          setLoading(false);
          console.error('Ошибка при добавлении расхода:', error);
          Modal.error({
            title: 'Ошибка',
            content: 'Не удалось добавить расход. Попробуйте снова.',
          });
        });
    };
    
    const handleSearch = debounce((value: string) => {
      if (!optyData) return;
  
      const filteredOptions: OptionType[] = optyData
        .filter(item =>
          item['full_name'].toLowerCase().includes(value.toLowerCase()) || 
          item['Description'].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7)
        .map(item => ({
          optyId: item['ID'],
          apartNum: item['Description'],
          value: `${item['Description']} - ${item['full_name']} - ${item['Stage']}`,
          label: `${item['Description']} - ${item['full_name']} - ${item['Stage']}`
        }));
  
      setOptions(filteredOptions);
    }, 300);

    return (
      <Modal
        title={'Добавить расход'}
        open={isAddExpense}
        onCancel={() => {
          setIsAddExpense(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            initialValues={{
              variant: 'filled',
              phone: '+7',
              product: 'Prod_1' 
            }}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Тип"
              name="expenseType"
              rules={[{ required: true, message: 'Обязтельное поле!' }]}
            >
              <Select
                style={{ width: '100%' }}
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
            <Form.Item shouldUpdate={(prev, curr) => prev.expenseType !== curr.expenseType}>
              {({ getFieldValue }) => {
                const expenseType = getFieldValue("expenseType");
                return (
                  <>
                    {expenseType === "Депозит" ? (
                      <Form.Item
                        name="apartNum"
                        label="Номер квартиры"
                        rules={[{ required: true, message: "Обязательное поле!" }]}
                      >
                        <Input placeholder="Введите номер квартиры" />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label="Договор"
                        name="optyName"
                        rules={[{ required: true, message: "Обязательное поле!" }]}
                      >
                        <AutoComplete
                          style={{ width: "100%" }}
                          onSearch={handleSearch}
                          placeholder="Введите номер квартиры или ФИО"
                          options={options}
                          onSelect={(value: string, option: any) => {
                            form.setFieldsValue({
                              optyId: option.optyId,
                              apartNum: option.apartNum,
                            });
                          }}
                        />
                      </Form.Item>
                    )}
                  </>
                );
              }}
            </Form.Item>
            <Form.Item
              label="Получатель"
              name="paymentType"
              rules={[{ required: true, message: 'Обязтельное поле!' }]}
            >
              <Select
                style={{ width: '100%' }}
                options={[
                  { value: 'QR Аркен', label: 'QR Аркен' },
                  { value: 'Gold Вадим', label: 'Gold Вадим' },
                  { value: 'Налом', label: 'Налом' },
                ]}
                onSelect={(value: string) => form.setFieldsValue({'paymentType': value})}
              />
            </Form.Item>
            <Form.Item
              label="Сумма"
              name="amount"
              rules={[
                { required: true, message: 'Обязательное поле!' },
                { type: 'number', min: -100000, max: 500000, message: 'Введите сумму от -100000 до 500000' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              label="Комментарий"
              name="comment"
              rules={[{ required: true, message: 'Обязтельное поле!' }]}
            >
              <TextArea 
                showCount 
                maxLength={300} 
                placeholder="Введите комментарий" 
                autoSize={{ minRows: 2, maxRows: 4 }} 
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
            <Form.Item name="apartNum" hidden={true}></Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
}