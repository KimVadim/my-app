import { Button, Form, Input, Modal, Spin } from "antd";
import React, { useState } from "react"
import { addContact, getSheetData } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { BUTTON_TEXT } from "../constants/dictionaries.ts";
import { AddContact, ContactField, FieldPlaceholder, FieldRules, FieldStyle, ModalTitle } from "../constants/appConstant.ts";
import { Toast } from "antd-mobile";
import TextArea from "antd/es/input/TextArea";
import { formattedPhone } from "../service/utils.ts";

interface AddContactModalProps {
  setIsAddContact: (isOpen: boolean) => void;
  isAddContact: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({setIsAddContact, isAddContact, setLoading, loading}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
    const [phone, setPhone] = useState("+7");
    const handleSubmit = (values: AddContact) => {
      setLoading(true);
      addContact(values).then((conId) => {
        getSheetData(dispatch);
        setLoading(false);
        setIsAddContact(false);
        conId
          ? Toast.show({content: <div><b>Готово!</b><div>Контакт № {conId}</div></div>, icon: 'success', duration: 3000 })
          : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
      });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedPhoneStr = formattedPhone(e.target.value);

      setPhone(formattedPhoneStr);
      form.setFieldsValue({ phone: formattedPhoneStr });
    };

    return (
      <Modal
        title={ModalTitle.AddOpportunity}
        open={isAddContact}
        onCancel={() => {
          setIsAddContact(false);
          form.resetFields();
        }}
        style={{ maxWidth: '80%' }}
        footer={null}
      >
        <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            phone: '+7',
            lastName: 'Service',
          }}
        >
          <Form.Item name={ContactField.LastName} hidden={true} ></Form.Item>
          <Form.Item
            label={ContactField.FirstNameLabel}
            name={ContactField.FirstName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={ContactField.PhoneLabel}
            name={ContactField.Phone}
            rules={[FieldRules.Required, FieldRules.PhoneFormat]}
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
            label={ContactField.TypeLabel}
            name={ContactField.Type}
            rules={[FieldRules.Required, FieldRules.Required]}
          >
            <Input style={FieldStyle.InputStyle} />
          </Form.Item>
          <Form.Item
            label={ContactField.DescriptionLabel}
            name={ContactField.Description}
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
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              {BUTTON_TEXT.Add}
            </Button>
            <Button onClick={() => setIsAddContact(false)} style={{ marginLeft: 8,  marginTop: 10}}>
              {BUTTON_TEXT.Cancel}
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    )
}