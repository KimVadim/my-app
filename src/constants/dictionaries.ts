import { MenuProps } from "antd";

export enum ExpenseType {
    Rent = 'Аренда',
    Deposit = 'Депозит',
    Return = 'Возврат',
    Expense = 'Расход',
    Salary = 'Зарплата',
    TenantUtilities = 'Комм. Жильцы',
    AlatauUtilities = 'Комм. Алатау',
    PavlenkoUtilities = 'Комм. Павленко',
}

export const EXPENSE_TYPE = [
    { value: ExpenseType.Rent, label: ExpenseType.Rent },
    { value: ExpenseType.Deposit, label: ExpenseType.Deposit },
    { value: ExpenseType.Return, label: ExpenseType.Return },
    { value: ExpenseType.Expense, label: ExpenseType.Expense },
    { value: ExpenseType.Salary, label: ExpenseType.Salary },
    { value: ExpenseType.TenantUtilities, label: ExpenseType.TenantUtilities },
    { value: ExpenseType.AlatauUtilities, label: ExpenseType.AlatauUtilities },
    { value: ExpenseType.PavlenkoUtilities, label: ExpenseType.PavlenkoUtilities },
];

export enum Product {
    RentAmount160 = 160000,
    RentAmount = 170000,
    RentAmount180 = 180000,

    Rent180Value = 'Аренда 180',
    Rent170Value = 'Аренда 170',
    Rent160Value = 'Аренда 160',
    DepositValue = 'Депозит',
    ReturnValue = 'Депозит возврат',
    UnknownValue = 'Неизвестный продукт',
    Rent180 = 'Rent180',
    Rent170 = 'Prod_1',
    Rent160 = 'Prod_2',
    Deposit = 'Prod_3',
    Return = 'Prod_4',
}

export const PRODUCT = [
    { value: Product.Rent180, label: Product.Rent180Value },
    { value: Product.Rent170, label: Product.Rent170Value },
    { value: Product.Deposit, label: Product.DepositValue},
    { value: Product.Return, label: Product.ReturnValue },
];

export const productMap = {
    [Product.Rent170]: Product.Rent170Value,
    [Product.Rent160]: Product.Rent160Value,
    [Product.Rent180]: Product.Rent180Value,
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