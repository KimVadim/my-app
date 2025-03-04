import { AutoComplete, Button, Form, InputNumber, Modal, Select, Spin } from "antd";
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store.ts";
import { addPayment, getSheetData } from "../service/appServiceBackend.ts";

interface AddPaymentModalProps {
  setIsAddPayment: (isOpen: boolean) => void;
  isAddPayment: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
}

export interface AddPayment {
  optyId: string;
  amount: number;
  paymentType: string;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({setIsAddPayment, isAddPayment, setLoading, loading}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [options, setOptions] = useState<{ optyId: string; value: string; label: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity)

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
        title={'Добавить платеж'}
        open={isAddPayment}
        onCancel={() => setIsAddPayment(false)}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
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
            <Form.Item name="optyId" hidden={true}></Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
}