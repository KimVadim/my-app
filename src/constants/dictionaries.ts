import { MenuProps } from 'antd';

export enum ExpenseType {
  Deposit = 'Депозит',
  Return = 'Возврат',
  Expense = 'Расход',
  Income = 'Пополнение',
  Removal = 'Снятие',
  TenantUtilities = 'Комм. Жильцы',
  AlatauUtilities = 'Комм. Алатау',
  PavlenkoUtilities = 'Комм. Павленко',
  Other = 'Другое',
}

export const EXPENSE_TYPE = [
  { value: ExpenseType.Expense, label: ExpenseType.Expense },
  { value: ExpenseType.Income, label: ExpenseType.Income },
  { value: ExpenseType.Removal, label: ExpenseType.Removal },
  { value: ExpenseType.TenantUtilities, label: ExpenseType.TenantUtilities },
  { value: ExpenseType.AlatauUtilities, label: ExpenseType.AlatauUtilities },
  {
    value: ExpenseType.PavlenkoUtilities,
    label: ExpenseType.PavlenkoUtilities,
  },
  { value: ExpenseType.Other, label: ExpenseType.Other },
];

export enum Product {
  RentAmount160 = 160000,
  RentAmount170 = 170000,
  RentAmount180 = 180000,
  RentAmount185 = 185000,

  Rent185Value = 'Аренда 185',
  Rent180Value = 'Аренда 180',
  Rent170Value = 'Аренда 170',
  Rent160Value = 'Аренда 160',
  DepositValue = 'Депозит',
  ReturnValue = 'Депозит возврат',
  UnknownValue = 'Неизвестный продукт',
  Rent185 = 'Rent185',
  Rent180 = 'Rent180',
  Rent170 = 'Prod_1',
  Rent160 = 'Prod_2',
  Deposit = 'Prod_3',
  Return = 'Prod_4',
}

export const PRODUCT = [
  {
    value: Product.Rent170,
    label: Product.Rent170Value,
    optyFlg: false,
    payFlg: false,
  },
  {
    value: Product.Rent180,
    label: Product.Rent180Value,
    optyFlg: true,
    payFlg: true,
  },
  {
    value: Product.Rent185,
    label: Product.Rent185Value,
    optyFlg: true,
    payFlg: true,
  },
  {
    value: Product.Deposit,
    label: Product.DepositValue,
    optyFlg: false,
    payFlg: true,
  },
  {
    value: Product.Return,
    label: Product.ReturnValue,
    optyFlg: false,
    payFlg: true,
  },
];

export const productMap = {
  [Product.Rent170]: Product.Rent170Value,
  [Product.Rent160]: Product.Rent160Value,
  [Product.Rent180]: Product.Rent180Value,
  [Product.Rent185]: Product.Rent185Value,
  [Product.Deposit]: Product.DepositValue,
  [Product.Return]: Product.ReturnValue,
};

export enum Payment {
  QRAN = 'QR Аркен',
  GoldVK = 'Gold Вадим',
  Cash = 'Налом',
}

export const PAYMENT_TYPE = [
  { value: Payment.QRAN, label: Payment.QRAN },
  { value: Payment.GoldVK, label: Payment.GoldVK },
  { value: Payment.Cash, label: Payment.Cash },
];

export const ItemsReport: MenuProps['items'] = [
  { label: 'Линия', key: 'line' },
];

export enum STEP_STATUS {
  Process = 'process',
  Finish = 'finish',
  Error = 'error',
}

export enum BUTTON_TEXT {
  Ok = 'OK',
  Cancel = 'Отмена',
  Add = 'Добавить',
}

export enum MODAL_TEXT {
  OptyCloseText = 'Подтвердите закрытие договора!',
  NotFound = 'Не найдено',
  UpdateOptyPaymentDate = 'Подтвердите изменение даты платежа',
}
