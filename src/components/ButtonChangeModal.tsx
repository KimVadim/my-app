import { Popup } from 'antd-mobile';
import React, { useState } from 'react';
import { Button, Form, InputNumber, Input } from 'antd';
import {
  FieldPlaceholder,
  FieldRules,
  FieldStyle,
  OpportunityField,
  OpportunityFieldData,
  UpdateOpty,
} from '../constants/appConstant.ts';
import { BUTTON_TEXT } from '../constants/dictionaries.ts';
import { formattedPhone } from '../service/utils.ts';
import { EditSOutline } from 'antd-mobile-icons';

interface ButtonChangeModalProps {
  record: any;
  updateData: (values: UpdateOpty) => Promise<void>;
}

const { TextArea } = Input;

export const ButtonChangeModal: React.FC<ButtonChangeModalProps> = ({
  record,
  updateData,
}) => {
  const [form] = Form.useForm<UpdateOpty>();

  const [isUserInfo, setIsUserInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('+7');

  const handleOpen = () => {
    const recordPhone =
      record?.[OpportunityFieldData.PayPhone] || '+7';

    setPhone(recordPhone);

    form.setFieldsValue({
      [OpportunityField.Phone]: recordPhone,
      [OpportunityField.OptySum]:
        record?.[OpportunityFieldData.OptySum] ?? undefined,
      [OpportunityField.Comment]:
        record?.[OpportunityFieldData.Comment] ?? '',
      [OpportunityField.PaymentDay]:
        record?.[OpportunityFieldData.PaymentDay] ?? undefined,
    });

    setIsUserInfo(true);
  };

  const handleSubmit = async (values: UpdateOpty) => {
    try {
      setLoading(true);

      await updateData(values);

      setIsUserInfo(false);
      form.resetFields();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedPhoneStr = formattedPhone(e.target.value);

    setPhone(formattedPhoneStr);

    form.setFieldsValue({
      [OpportunityField.Phone]: formattedPhoneStr,
    });
  };

  const handleClose = () => {
    if (loading) return;

    setIsUserInfo(false);
  };

  return (
    <>
      <Button
        icon={<EditSOutline fontSize={40} />}
        variant="filled"
        onClick={handleOpen}
        size="large"
        style={{
          height: 55,
          width: 55,
          marginLeft: '5px',
        }}
        color="primary"
      />

      <Popup
        visible={isUserInfo}
        showCloseButton
        onClose={handleClose}
        onMaskClick={handleClose}
        bodyStyle={{
          height: '60vh',
        }}
      >
        <div
          style={{
            width: '360px',
            maxWidth: '90%',
            margin: '20px auto',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label={OpportunityField.PayPhoneLabel}
              name={OpportunityField.Phone}
              rules={[
                FieldRules.Required,
                FieldRules.PhoneFormat,
              ]}
            >
              <Input
                value={phone}
                placeholder="+7 (777) 123-45-67"
                onChange={handlePhoneChange}
                maxLength={18}
                style={FieldStyle.InputStyle}
              />
            </Form.Item>

            <Form.Item
              label={OpportunityField.PaymentDateLabel}
              name={OpportunityField.PaymentDay}
              rules={[FieldRules.Required]}
            >
              <InputNumber
                min={1}
                max={31}
                style={{ width: '80%' }}
              />
            </Form.Item>

            <Form.Item
              label={OpportunityField.AmountLabel}
              name={OpportunityField.OptySum}
              rules={[
                FieldRules.Required,
              ]}
            >
              <InputNumber
                style={FieldStyle.InputStyle}
              />
            </Form.Item>

            <Form.Item
              label={OpportunityField.CommentLabel}
              name={OpportunityField.Comment}
              rules={[FieldRules.Required]}
            >
              <TextArea
                showCount
                maxLength={200}
                placeholder={FieldPlaceholder.Comment}
                autoSize={{
                  minRows: 3,
                  maxRows: 7,
                }}
                style={FieldStyle.AreaStyle}
              />
            </Form.Item>

            <Form.Item
              style={{
                textAlign: 'center',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {BUTTON_TEXT.Save}
              </Button>

              <Button
                onClick={handleClose}
                disabled={loading}
                style={{
                  marginLeft: 8,
                  marginTop: 10,
                }}
              >
                {BUTTON_TEXT.Cancel}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Popup>
    </>
  );
};