import { Button, Form, Input, Modal, Spin } from "antd";
import React from "react"
import { addContact, getSheetData } from "../service/appServiceBackend.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store.ts";
import { BUTTON_TEXT } from "../constants/dictionaries.ts";
import { AddContact, ContactField, FieldPlaceholder, FieldRules, ModalTitle } from "../constants/appConstant.ts";
import { Toast } from "antd-mobile";
import TextArea from "antd/es/input/TextArea";

interface AddContactModalProps {
  setIsAddContact: (isOpen: boolean) => void;
  isAddContact: boolean;
  setLoading: (isOpen: boolean) => void;
  loading: boolean;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({setIsAddContact, isAddContact, setLoading, loading}) => {
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();
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
          }}
        >
          <Form.Item
            label={ContactField.LastNameLabel}
            name={ContactField.LastName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={ContactField.FirstNameLabel}
            name={ContactField.FirstName}
            rules={[FieldRules.Required, FieldRules.ClientName]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={ContactField.PhoneLabel}
            name={ContactField.Phone}
            rules={[FieldRules.Required, FieldRules.PhoneNum]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={ContactField.TypeLabel}
            name={ContactField.Type}
            rules={[FieldRules.Required, FieldRules.Required]}
          >
            <Input />
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