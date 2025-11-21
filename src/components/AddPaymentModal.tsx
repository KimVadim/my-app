import { AutoComplete, Button, DatePicker, Form, InputNumber, Modal, Spin } from "antd";
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store.ts";
import { addPayment, getSheetData } from "../service/appServiceBackend.ts";
import { BUTTON_TEXT, PAYMENT_TYPE, Product, PRODUCT } from "../constants/dictionaries.ts";
import {
  AddPayment,
  FieldFormat,
  FieldPlaceholder,
  FieldRules,
  FieldStyle,
  ModalTitle,
  OpportunityFieldData,
  OpportunityType,
  PaymentField,
  Stage } from "../constants/appConstant.ts";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { Selector, Toast } from "antd-mobile";

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
    const [options, setOptions] = useState<{ apartNum: String; optyId: string; value: string; label: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity) as unknown as OpportunityType[];
    const [isHiddenItem, setHiddenItem] = React.useState<boolean>(false);

    const actions = {
      handleSearch: (value: string) => {
        if (!optyData) return;
        const selectedProduct = form.getFieldValue(PaymentField.Product);
        const filteredOptions = optyData
          .filter(item => {
            if ([Product.Return].includes(selectedProduct)) {
              return true;
            }
            // иначе — только Signed
            return item[OpportunityFieldData.Stage] === Stage.Signed;
          })
          .filter(item =>
            item[OpportunityFieldData.FullName].toLowerCase().includes(value.toLowerCase()) ||
            item[OpportunityFieldData.ApartNum].toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 7)
          .map(item => ({
            optyId: item[OpportunityFieldData.Id],
            apartNum: item[OpportunityFieldData.ApartNum],
            conId: item[OpportunityFieldData.Contact],
            value: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`,
            label: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]}`
          }));

        setOptions(filteredOptions);
      },
      handleSubmit: (values: AddPayment) => {
        setLoading(true)
        addPayment(values).then((paymentId) => {
          paymentId && getSheetData(dispatch);
          setLoading(false);
          setIsAddPayment(false);
          form.resetFields();
          paymentId
            ? Toast.show({content: <div><b>Готово!</b><div>Платеж № {paymentId}</div></div>, icon: 'success', duration: 3000 })
            : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
        });
      },
    }
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
            onFinish={actions.handleSubmit}
            onFinishFailed={(e) => {
              const fieldName = e?.['errorFields']?.[0]?.['name']?.[0];
              fieldName === 'optyId' && Toast.show({content: `Неверный договор!`, icon: 'fail', duration: 2000 });
            }}
            layout="vertical"
            initialValues={{
              [PaymentField.Product]: Product.Rent180,
              [PaymentField.PaymentDate]: dayjs(dayjs().format(FieldFormat.Date), FieldFormat.Date),
            }}
          >
            <Form.Item
              label={PaymentField.ProductLabel}
              name={PaymentField.Product}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PRODUCT.filter((item) => item.payFlg === true)}
                defaultValue={[Product.Rent180]}
                onChange={(arr) => {
                  arr.length > 0 && form.setFieldsValue({[PaymentField.Product]: arr[0]});
                  arr.length > 0 && [Product.Return, Product.Deposit].includes(arr[0]) ? setHiddenItem(true) : setHiddenItem(false);
                }}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.AmountLabel}
              name={PaymentField.Amount}
              rules={[FieldRules.Required, FieldRules.PaymentAmount]}
            >
              <InputNumber style={FieldStyle.InputStyle} />
            </Form.Item>
            <Form.Item
              label={PaymentField.OptyNameLabel}
              name={PaymentField.OptyName}
              rules={[FieldRules.Required]}
            >
              <AutoComplete
                onSearch={actions.handleSearch}
                placeholder={FieldPlaceholder.OptyName}
                options={options}
                onSelect={(value: string, option: any) => {
                  form.setFieldsValue({
                    optyId: option.optyId,
                    conId: option.conId,
                    apartNum: option.apartNum,
                  });
                }}
                style={FieldStyle.InputStyle}
              />
            </Form.Item>
            <Form.Item
              label={PaymentField.PaymnetTypeLabel}
              name={PaymentField.PaymentType}
              rules={[FieldRules.Required]}
            >
              <Selector
                options={PAYMENT_TYPE}
                onChange={(arr) => {
                  arr.length > 0 && form.setFieldsValue({[PaymentField.PaymentType]: arr[0]});
                }}
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
                  style={FieldStyle.AreaStyle}
                />
            </Form.Item>)}
            <Form.Item
              label={PaymentField.PaymentDateLabel}
              name={PaymentField.PaymentDate}
              rules={[FieldRules.Required]}
            >
              <DatePicker
                style={FieldStyle.InputStyle}
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
              <Button onClick={() => setIsAddPayment(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                {BUTTON_TEXT.Cancel}
              </Button>
            </Form.Item>
            <Form.Item name={PaymentField.OptyId} hidden={true} rules={[FieldRules.Required]}></Form.Item>
            <Form.Item name={PaymentField.ApartNum} hidden={true} ></Form.Item>
            <Form.Item name={PaymentField.ContactId} hidden={true}></Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
}