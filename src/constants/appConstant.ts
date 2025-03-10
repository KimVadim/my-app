export enum ModalTitle {
    AllOpportunity = 'Все договора',
    AddExpense = 'Добавить расход',
    AddOpportunity = 'Добавить договор',
    AddPayment = 'Добавить платеж',
    Expense = 'Платежи',
    OpportunityDetail = 'Детали договора',
};

export enum FieldPlaceholder {
    OptyName = 'Введите номер квартиры или ФИО',
    Date = 'Введите дату',
    Comment = 'Введите комментарий',
    ApartNum = 'Введите номер квартиры',
};

export enum FieldFormat {
    Date = 'DD.MM.YYYY',
    DateEN = 'MM/DD/YYYY',
};

export enum Status {
    Enter = 'Заехал'
}

export enum Stage {
    Signed = 'Заключили'
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const FieldRules = {
    Required: { required: true, message: 'Заполните поле!' },
    ApartNum: { type: 'number', min: 11, max: 39, message: 'Введите число с 11 по 39' },
    PhoneNum: { pattern: /^\+7\d{10}$/, message: 'Формат номера +7 000 000 00 00' },
    ClientName: { pattern: /^[A-Za-zА-Яа-яЁё]+$/, message: 'Только буквы!' },
    ExpenseAmount: { type: 'number', min: -300000, max: 300000, message: 'Введите сумму от -300000 до 300000' },
    PaymentAmount: { type: 'number', min: 0, max: 500000, message: 'Введите сумму от 0 до 500 000' },
} as const;

// Договора
export interface AddOpportunuty {
    firstName: string;
    lastName: string;
    phone: string;
    product: string;
    apartNum: number;
    optyDate: Date;
    paymentDate: Date;
};

export enum OpportunityFieldData {
    Id = 'ID',
    Contact = 'Contact',
    Stage = 'Stage',
    FullName = 'full_name',
    ApartNum = 'Description',
    OptyDate = 'OppoDate',
    PaymentDate = 'PaymentDate',
    PaymentType = 'Notes',
    Product = 'Product',
    Amount = 'Amount',
    Phone = 'phone',
    OptyDateTime = 'Date/Time'
}

export enum OpportunityField {
    LastNameLabel = 'Фамилия',
    FisrtNameLabel= 'Имя',
    PhoneLabel = 'Контактный телефон',
    ApartNumLabel = 'Номер квартиры',
    ProductLabel = 'Продукт',
    OptyDateLabel = 'Дата договора',
    PaymentDateLabel = 'Дата оплаты',
    PayDateLabel = 'Дата платежа',
    PaymentTypeLabel = 'Источник',
    AmountLabel = 'Сумма',
    FullNameLabel = 'ФИО',
    OptyAmountLabel = 'Сумма договора',
    OptyNameLabel = '№ / Статус / Дата договора',

    LastName = 'lastName',
    FisrtName = 'firstName',
    Phone = 'phone',
    ApartNum = 'apartNum',
    Product = 'product',
    OptyDate = 'optyDate',
    PaymentDate = 'paymentDate',
}

// Платежи
export interface AddPayment {
    optyId: string;
    amount: number;
    conId: string;
    product: string;
    paymentType: string;
};

export enum PaymentField {
    ProductLabel = 'Продукт',
    AmountLabel = 'Сумма',
    OptyNameLabel = 'Договор',
    PaymnetTypeLabel = 'Получатель',

    Product = 'product',
    Amount = 'amount',
    OptyName = 'optyName',
    PaymentType = 'paymentType',
    OptyId = 'optyId',
    ContactId = 'conId',
};

// Расходы
export interface AddExpense {
    optyId: string;
    expenseType: string;
    amount: number;
    comment: string;
    paymentType: string;
    apartNum: string;
};

export interface OptionType {
    optyId: string;
    value: string;
    label: string;
    apartNum: string;
};

export enum ExpenseField {
    ProductLabel = 'Продукт',
    AmountLabel = 'Сумма',
    OptyNameLabel = 'Договор',
    ExpenseTypeLabel = 'Тип',
    ApartNumLabel = 'Номер квартиры',
    PaymnetTypeLabel = 'Получатель',
    CommentLabel = 'Комментарий',

    Product = 'product',
    Amount = 'amount',
    OptyName = 'optyName',
    ExpenseType = 'expenseType',
    ApartNum = 'apartNum',
    PaymentType = 'paymentType',
    Comment = 'comment',
    OptyId = 'optyId',
    ContactId = 'conId',
};