import { Button, DatePicker, Form, Input, InputNumber, Modal, Spin } from "antd";
import React, { useState } from "react"
import dayjs from 'dayjs';
import { addOpty, getSheetDataParam } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { BUTTON_TEXT, Product, PRODUCT } from "../constants/dictionaries.ts";
import { AddOpportunity, FieldFormat, FieldPlaceholder, FieldRules, FieldStyle, ModalTitle, OpportunityField } from "../constants/appConstant.ts";
import { Selector, Switch, Toast } from "antd-mobile";
import TextArea from "antd/es/input/TextArea";
import { formattedPhone } from "../service/utils.ts";
import { setQuote } from "../slices/quoteSlice.ts";
import { setContact } from "../slices/contactSlice.ts";
import { setOpportunity } from "../slices/opportunitySlice.ts";
//import { CloudOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
//import { Flex, Segmented } from 'antd';
//import type { SegmentedProps } from 'antd';

interface AddOpportunityModalProps {
  setIsAddOpty: (isOpen: boolean) => void;
  isAddOpty: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
  view?: string;
}

/*const options: SegmentedProps['options'] = [
  {
    label: '2 недели',
    value: '2_week',
    icon: <RocketOutlined />,
  },
  {
    label: '1 месяц',
    value: '1_month',
    icon: <ThunderboltOutlined />,
  },
  {
    label: '3 месяца',
    value: '3_month',
    icon: <CloudOutlined />,
  },
];*/

export const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({setIsAddOpty, isAddOpty, setLoading, loading, view}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [phone, setPhone] = useState("+7");
    const [payPhone, setPayPhone] = useState("+7");
    const [isHiddenItem, setHiddenItem] = React.useState<boolean>(false);
    const handleSubmit = (values: AddOpportunity) => {
      setLoading(true);
      addOpty(values).then((optyId) => {
        getSheetDataParam(view==='Storage' ? 'Storage' : 'Renter').then((response) => {
            dispatch(setOpportunity(response?.opportunities));
            dispatch(setQuote(response?.quote));
            dispatch(setContact(response?.contact));
        })
        setLoading(false);
        setIsAddOpty(false);
        optyId
          ? Toast.show({content: <div><b>Готово!</b><div>Договор № {optyId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
      });
    };
    const actions = {
      handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneStr = formattedPhone(e.target.value);

        setPhone(formattedPhoneStr);
        form.setFieldsValue({ phone: formattedPhoneStr });
      },
      handlePayPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneStr = formattedPhone(e.target.value);

        setPayPhone(formattedPhoneStr);
        form.setFieldsValue({ payPhone: formattedPhoneStr });
      }
    }


    //const segmentedSharedProps: SegmentedProps = {
    //  options
    //};
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
            payPhone: '+7',
            product: view === 'Storage' ? Product.StorageS : Product.Rent180,
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
            <Input style={FieldStyle.InputStyle}/>
          </Form.Item>
          <Form.Item
            label={OpportunityField.FisrtNameLabel}
            name={OpportunityField.FisrtName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={OpportunityField.PhoneLabel}
            name={OpportunityField.Phone}
            rules={[FieldRules.Required, FieldRules.PhoneFormat]}
          >
            <Input
              value={phone}
              placeholder="+7 (777) 123-45-67"
              onChange={actions.handlePhoneChange}
              maxLength={18}
              style={FieldStyle.InputStyle}
            />
          </Form.Item>
          <Form.Item
            label={OpportunityField.PayPhoneFlgLabel}
            name={OpportunityField.PayPhoneFlg}
          >
            <Switch onChange={(value) => setHiddenItem(value)}/>
          </Form.Item>
          <Form.Item hidden={!isHiddenItem}>
            {isHiddenItem && (
              <Form.Item
                label={OpportunityField.PayPhoneLabel}
                name={OpportunityField.PayPhone}
                rules={[FieldRules.Required, FieldRules.PhoneFormat]}
              >
                <Input
                  value={payPhone}
                  placeholder="+7 (777) 123-45-67"
                  onChange={actions.handlePayPhoneChange}
                  maxLength={18}
                  style={FieldStyle.InputStyle}
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item
            label={view==='Storage' ? OpportunityField.StorageNumLabel: OpportunityField.ApartNumLabel}
            name={OpportunityField.ApartNum}
            rules={[FieldRules.Required, view==='Storage' ? FieldRules.StorageNum : FieldRules.ApartNum]}
          >
            <InputNumber style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={OpportunityField.ProductLabel}
            name={OpportunityField.Product}
            rules={[FieldRules.Required]}
          >
            <Selector
              options={view==='Storage' ? PRODUCT.filter((x: any)=> x.storageFlg === true) : PRODUCT.filter((x: any)=> x.optyFlg === true)}
              defaultValue={view==='Storage' ? [Product.StorageS] : [Product.Rent180]}
              onChange={(arr) => arr.length > 0 && form.setFieldsValue({[OpportunityField.Product]: arr[0]})}
            />
          </Form.Item>
          {//<Form.Item style={{ textAlign: "center" }} hidden={!(view==='Storage')} label={OpportunityField.PeriodLabel} rules={[FieldRules.Required]}>
            //<Flex vertical gap="middle">
              //<Segmented {...segmentedSharedProps} />
            //</Flex>
          //</Form.Item>
          }
          <Form.Item
            label={view==='Storage' ? OpportunityField.CommentStorageLabel : OpportunityField.CommentLabel}
            name={OpportunityField.Comment}
            rules={[FieldRules.Required]}
          >
            <TextArea
              showCount
              maxLength={300}
              placeholder={FieldPlaceholder.Comment}
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={FieldStyle.AreaStyle}
            />
          </Form.Item>
          <Form.Item
            label={OpportunityField.OptyDateLabel}
            name={OpportunityField.OptyDate}
            rules={[FieldRules.Required]}
          >
            <DatePicker
              style={FieldStyle.InputStyle}
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
            hidden={view && view==='Storage' ? true : false}
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
            <Button onClick={() => setIsAddOpty(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              {BUTTON_TEXT.Cancel}
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    )
}