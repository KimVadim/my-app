import { Button, DatePicker, Form, Input, InputNumber, Modal, Spin } from "antd";
import React from "react"
import dayjs from 'dayjs';
import { addOpty, getSheetData } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { BUTTON_TEXT, Product, PRODUCT } from "../constants/dictionaries.ts";
import { AddOpportunuty, FieldFormat, FieldPlaceholder, FieldRules, ModalTitle, OpportunityField } from "../constants/appConstant.ts";
import { Selector, Toast } from "antd-mobile";

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
      addOpty(values).then((optyId) => {
        getSheetData(dispatch);
        setLoading(false);
        setIsAddOpty(false);
        optyId
          ? Toast.show({content: <div><b>Готово!</b><div>Договор № {optyId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
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
            phone: '+7',
            product: Product.Rent170,
            [OpportunityField.PaymentDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
            [OpportunityField.OptyDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
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
            <Selector
              options={PRODUCT.filter((x: any)=> x.value === Product.Rent170 || x.value === Product.Rent180)}
              defaultValue={[Product.Rent180]}
              onChange={(arr) => arr.length > 0 && form.setFieldsValue({[OpportunityField.Product]: arr[0]})}
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
              defaultValue={dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date)}
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
              defaultValue={dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date)}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              {BUTTON_TEXT.Add}
            </Button>
            <Button onClick={() => setIsAddOpty(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              {BUTTON_TEXT.Cancel}
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    )
}