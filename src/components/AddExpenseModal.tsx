import { AutoComplete, Button, Form, InputNumber, Modal, Select, Spin } from "antd";
import React, { useState } from "react"
import { AppDispatch, RootState } from "../store.ts";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, getExpenseData } from "../service/appServiceBackend.ts";
import TextArea from "antd/es/input/TextArea";
import { debounce } from 'lodash';
import { BUTTON_TEXT, EXPENSE_TYPE, ExpenseType, PAYMENT_TYPE, Product } from "../constants/dictionaries.ts";
import { AddExpense, ExpenseField, FieldPlaceholder, FieldRules, ModalTitle, OpportunityFieldData, OptionType } from "../constants/appConstant.ts";
import { Selector, Toast } from "antd-mobile";

interface AddExpenseModalProps {
  setIsAddExpense: (isOpen: boolean) => void;
  isAddExpense: boolean;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({setIsAddExpense, isAddExpense}) => {
    const dispatch: AppDispatch = useDispatch();
    const [form] = Form.useForm();
    const [options, setOptions] = useState<{ optyId: string; value: string; label: string; apartNum: string }[]>([]);
    const optyData = useSelector((state: RootState) => state.opportunity.opportunity)
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isHiddenItem, setHiddenItem] = React.useState<boolean>(true);

    const handleSubmit = (values: AddExpense) => {
      setLoading(true);
      addExpense(values)
        .then((expenseId) => {
          const fetchData = async () => {
            setLoading(true);
            try {
              await getExpenseData(dispatch);
            } catch (error) {
              console.error("Ошибка загрузки данных:", error);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
          setLoading(false);
          setIsAddExpense(false);
          form.resetFields();
          expenseId
            ? Toast.show({content: <div><b>Готово!</b><div>Расход № {expenseId}</div></div>, icon: 'success', duration: 3000 })
            : Toast.show({content: `Ошибка!`, icon: 'fail', duration: 3000 });
        });
    };

    const handleSearch = debounce((value: string) => {
      if (!optyData) return;

      const filteredOptions: OptionType[] = optyData
        .filter(item =>
          item[OpportunityFieldData.FullName].toLowerCase().includes(value.toLowerCase()) ||
          item[OpportunityFieldData.ApartNum].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7)
        .map(item => ({
          optyId: item[OpportunityFieldData.Id],
          apartNum: item[OpportunityFieldData.ApartNum],
          value: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]} - ${item[OpportunityFieldData.Stage]}`,
          label: `${item[OpportunityFieldData.ApartNum]} - ${item[OpportunityFieldData.FullName]} - ${item[OpportunityFieldData.Stage]}`
        }));

      setOptions(filteredOptions);
    }, 300);

    return (
      <>
        <Modal
          title={ModalTitle.AddExpense}
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
                phone: '+7',
                product: Product.Rent170
              }}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                label={ExpenseField.ExpenseTypeLabel}
                name={ExpenseField.ExpenseType}
                rules={[FieldRules.Required]}
              >
                <Select
                  style={{ width: '100%' }}
                  options={EXPENSE_TYPE}
                  onSelect={(value: string) => {
                    form.setFieldsValue({[ExpenseField.ExpenseType]: value});
                    ['Комм. Алатау', 'Расход', 'Зарплата', 'Комм. Павленко'].includes(value)
                      ? setHiddenItem(true)
                      : setHiddenItem(false)
                  }}
                />
              </Form.Item>
              <Form.Item shouldUpdate={(prev, curr) => prev.expenseType !== curr.expenseType} hidden={isHiddenItem}>
                {({ getFieldValue }) => {
                  const expenseType = getFieldValue(ExpenseField.ExpenseType);
                  switch (expenseType) {
                    /*case ExpenseType.Deposit:
                      return (
                        <Form.Item
                          name={ExpenseField.ApartNum}
                          label={ExpenseField.ApartNumLabel}
                          rules={[FieldRules.Required]}
                        >
                          <Input placeholder={FieldPlaceholder.ApartNum} />
                        </Form.Item>
                      );
                    case ExpenseType.Rent:
                    case ExpenseType.Return:*/
                    case ExpenseType.TenantUtilities:
                      return (
                        <Form.Item
                          label={ExpenseField.OptyNameLabel}
                          name={ExpenseField.OptyName}
                          rules={[FieldRules.Required]}
                        >
                          <AutoComplete
                            style={{ width: "100%" }}
                            onSearch={handleSearch}
                            placeholder={FieldPlaceholder.OptyName}
                            options={options}
                            onSelect={(value: string, option: any) => {
                              form.setFieldsValue({
                                optyId: option.optyId,
                                apartNum: option.apartNum,
                              });
                            }}
                          />
                        </Form.Item>
                      );
                    default:
                      return (<></>);
                  }
                }}
              </Form.Item>
              <Form.Item
                label={ExpenseField.PaymnetTypeLabel}
                name={ExpenseField.PaymentType}
                rules={[FieldRules.Required]}
              >
                <Selector
                  options={PAYMENT_TYPE}
                  onChange={(arr) => {
                    arr.length > 0 && form.setFieldsValue({[ExpenseField.PaymentType]: arr[0]});
                  }}
                />
              </Form.Item>
              <Form.Item
                label={ExpenseField.AmountLabel}
                name={ExpenseField.Amount}
                rules={[FieldRules.Required,FieldRules.ExpenseAmount]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label={ExpenseField.CommentLabel}
                name={ExpenseField.Comment}
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
                <Button onClick={() => setIsAddExpense(false)} style={{ marginLeft: 8,  marginTop: 10}}>
                  {BUTTON_TEXT.Cancel}
                </Button>
              </Form.Item>
              <Form.Item name={ExpenseField.OptyId} hidden={true}></Form.Item>
              <Form.Item name={ExpenseField.ApartNum} hidden={true}></Form.Item>
            </Form>
          </Spin>
        </Modal>
      </>
    )
}