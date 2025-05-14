import { setOpportunity } from "../slices/opportunitySlice.ts";
import { setQuote } from "../slices/quoteSlice.ts"
import { setContact } from "../slices/contactSlice.ts"
import { AppDispatch } from "../store.ts";
import dayjs from "dayjs";
import axios from 'axios'
import { AddExpense, AddOpportunuty, AddPayment, FieldFormat, Stage, Status } from "../constants/appConstant.ts";
import { Product } from "../constants/dictionaries.ts";
import { setMonthPayments } from "../slices/monthPaymentsSlice.ts";
import { setExpense } from "../slices/expenseSlice.ts";

export const API_URL = "https://palvenko-production.up.railway.app";

export const endpoints = {
    SHEET_DATE: `${API_URL}/sheet-data`,
    OPPORTUNITY: `${API_URL}/opty`,
    LOGIN: `${API_URL}/login`,
    PAYMENT: `${API_URL}/payment`,
    EXPENSE: `${API_URL}/expense`,
    CLOSE_OPTY: `${API_URL}/close-opty`,
    MONTH_PAYMENT: `${API_URL}/month-payments`,
    EXPENSES: `${API_URL}/expenses`,
};

export const getSheetData = async (dispatch: AppDispatch) => {
    try {
        const { data } = await axios.get(endpoints.SHEET_DATE);
        const opportunities = data.message?.opportunity || [];
        const contact = data.message?.contact || [];
        const quote = data.message?.quotes || [];

        dispatch(setOpportunity(opportunities));
        dispatch(setQuote(quote));
        dispatch(setContact(contact));

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка запроса:", error.response?.status);
        } else {
            console.error("Непредвиденная ошибка:", error);
        }
    }
};

export const addOpty = async (values: AddOpportunuty) => {
    try {
        let optyAmount = 0;
        if (values.product === Product.Rent170) {
            optyAmount = Product.RentAmount;
        } else if (values.product === Product.Rent180) {
            optyAmount = Product.RentAmount180;
        }
        const payload = {
            "firstName": values.firstName,
            "lastName": values.lastName,
            "phone": values.phone,
            "status": Status.Enter,
            "apartNum": values.apartNum,
            "product": values.product,
            "stage": Stage.Signed,
            "amount": optyAmount,
            "createBy": localStorage.getItem('login') ? localStorage.getItem('login') : "newApp",
            "optyDate": dayjs(values.optyDate).format(FieldFormat.DateEN),
            "paymentDate": dayjs(values.paymentDate).format(FieldFormat.DateEN),
        };

        const response = await axios.post(endpoints.OPPORTUNITY, payload);

        console.log('Ответ сервера:', response.data);
        return response?.data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка запроса:', error.response?.data);
        } else {
            console.error('Непредвиденная ошибка:', error);
        }
    }
};

export const loginUser = async (login: string, password: string) => {
    try {
        const payload = {
            "login": login,
            "password": password,
        };

        const response = await axios.post(endpoints.LOGIN, payload);
        if (!response?.data['access_token']) {
            throw new Error(`Ошибка пустой token`);
        }
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('login', login);
        return response;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка запроса:', error.response?.data);
        } else {
            console.error('Непредвиденная ошибка:', error);
        }
    }
};

export const addPayment = async (values: AddPayment) => {
    try {
        const payload = {
            "optyId": values.optyId,
            "conId": values.conId,
            "product": values.product,
            "paymentType": values.paymentType,
            "amount": values.amount,
            "createBy": localStorage.getItem('login') ? localStorage.getItem('login') : "newApp",
            "paymentDate": dayjs(values.paymentDate).format(FieldFormat.DateEN),
            "comment": values?.comment ? values?.comment : Product.ReturnValue,
        };

        const response = await axios.post(endpoints.PAYMENT, payload);

        console.log('Ответ сервера:', response.data);
        return response?.data?.message?.payment_id
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка запроса:', error.response?.data);
        } else {
            console.error('Непредвиденная ошибка:', error);
        }
    }
};

export const addExpense = async (values: AddExpense) => {
    try {
        const payload = {
            "optyId": values.optyId,
            "expenseType": values.expenseType,
            "paymentType": values.paymentType,
            "amount": ['Комм. Алатау', 'Возврат', 'Расход', 'Зарплата', 'Комм. Павленко'].includes(values.expenseType) 
                ? -values.amount 
                : values.amount,
            "createBy": localStorage.getItem('login') ? localStorage.getItem('login') : "newApp",
            "expenseDate": dayjs().format(FieldFormat.DateEN),
            "comment": values.comment,
            "apartNum": values.apartNum,
            "invoice": values.expenseType === 'Комм. Алатау'
                ? 'Выставить Комм'
                : ''
        };

        const response = await axios.post(endpoints.EXPENSE, payload);

        console.log('Ответ сервера:', response.data);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка запроса:', error.response?.data);
        } else {
            console.error('Непредвиденная ошибка:', error);
        }
    }
};

export const closeOpty = async (optyId: String) => {
    try {
        const payload = {
                optyId
            };

        const response = await axios.post(endpoints.CLOSE_OPTY, payload);

        console.log('Ответ сервера:', response.data);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка запроса:', error.response?.data);
        } else {
            console.error('Непредвиденная ошибка:', error);
        }
    }
};

export const getMonthPaymentData = async (dispatch: AppDispatch) => {
    try {
        const { data } = await axios.get(endpoints.MONTH_PAYMENT);
        
        const monthPayments = data.message?.monthpayments || [];

        dispatch(setMonthPayments(monthPayments));

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка запроса:", error.response?.status);
        } else {
            console.error("Непредвиденная ошибка:", error);
        }
    }
};

export const getExpenseData = async (dispatch: AppDispatch) => {
    try {
        const { data } = await axios.get(endpoints.EXPENSES);
        
        const expense = data.message?.expenses || [];

        dispatch(setExpense(expense));

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка запроса:", error.response?.status);
        } else {
            console.error("Непредвиденная ошибка:", error);
        }
    }
};