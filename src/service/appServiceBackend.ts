import { setOpportunity } from '../slices/opportunitySlice.ts';
import { setQuote } from '../slices/quoteSlice.ts';
import { setContact } from '../slices/contactSlice.ts';
import { AppDispatch } from '../store.ts';
import dayjs from 'dayjs';
import axios from 'axios';
import {
  AddContact,
  AddExpense,
  AddOpportunity,
  AddPayment,
  FieldFormat,
  Stage,
  Status,
  UpdateOpty,
} from '../constants/appConstant.ts';
import { Product } from '../constants/dictionaries.ts';
import { setMonthPayments } from '../slices/monthPaymentsSlice.ts';
import { setExpense } from '../slices/expenseSlice.ts';
import { setAccessGroup } from '../slices/accessGroupSlice.ts';

export const API_URL = 'https://palvenko-production.up.railway.app';

export const endpoints = {
  SHEET_DATE: `${API_URL}/endpoints/sheet-data`,
  OPPORTUNITY: `${API_URL}/endpoints/opty`,
  LOGIN: `${API_URL}/endpoints/login`,
  PAYMENT: `${API_URL}/endpoints/payment`,
  EXPENSE: `${API_URL}/endpoints/expense`,
  CLOSE_OPTY: `${API_URL}/endpoints/close-opty`,
  MONTH_PAYMENT: `${API_URL}/endpoints/month-payments`,
  EXPENSES: `${API_URL}/endpoints/expenses`,
  CONTACT: `${API_URL}/endpoints/contact`,
  UPDATE_OPTY: `${API_URL}/endpoints/update-opty`,
  ACCESS_GROUP: `${API_URL}/endpoints/access-group`,
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
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getSheetDataParam = async (type: string) => {
  try {
    const { data } = await axios.get(endpoints.SHEET_DATE, {
      params: { type },
    });
    const opportunities = data.message?.opportunity || [];
    const contact = data.message?.contact || [];
    const quote = data.message?.quotes || [];

    return { opportunities, quote, contact };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addOpty = async (values: AddOpportunity) => {
  try {
    let optyAmount = 0;
    if (values.product === Product.Rent185) {
      optyAmount = Product.RentAmount185;
    } else if (values.product === Product.Rent180) {
      optyAmount = Product.RentAmount180;
    } else if (values.product === Product.StorageS) {
      optyAmount = Product.StorageSAmount;
    } else if (values.product === Product.StorageM) {
      optyAmount = Product.StorageMAmount;
    } else if (values.product === Product.StorageL) {
      optyAmount = Product.StorageLAmount;
    }
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      status: Status.Enter,
      apartNum: values.apartNum,
      product: values.product,
      stage: Stage.Signed,
      amount: optyAmount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      optyDate: dayjs(values.optyDate).format(FieldFormat.DateEN),
      paymentDate: dayjs(values.paymentDate).format(FieldFormat.DateEN),
      payPhone: values.payPhone,
      comment: values.comment,
    };

    const response = await axios.post(endpoints.OPPORTUNITY, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.opty_id;
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
      optyId: values.optyId,
      conId: values.conId,
      product: values.product,
      paymentType: values.paymentType,
      amount: values.amount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      paymentDate: dayjs(values.paymentDate).format(FieldFormat.DateEN),
      comment: values?.comment,
      apartNum: values?.apartNum,
    };

    const response = await axios.post(endpoints.PAYMENT, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.payment_id;
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
      optyId: values.optyId,
      expenseType: values.expenseType,
      paymentType: values.paymentType,
      amount: ['Комм. Алатау', 'Снятие', 'Расход', 'Комм. Павленко'].includes(
        values.expenseType
      )
        ? -values.amount
        : values.amount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      expenseDate: dayjs().format(FieldFormat.DateEN),
      comment: values.comment,
      apartNum: values.apartNum,
      invoice: values.expenseType === 'Комм. Алатау' ? 'Выставить Комм' : '',
    };

    const response = await axios.post(endpoints.EXPENSE, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.expense_id;
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
      login: login,
      password: password,
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

export const closeOpty = async (optyId: String) => {
  try {
    const payload = {
      optyId,
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
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getExpenseData = async (
  year: number,
  month: number,
  dispatch: AppDispatch
) => {
  try {
    const { data } = await axios.get(endpoints.EXPENSES, {
      params: { year, month },
    });

    const expense = data.message?.expenses || [];

    dispatch(setExpense(expense));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getAccessGroupData = async (
  dispatch: AppDispatch,
  login: string
) => {
  try {
    const { data } = await axios.get(endpoints.ACCESS_GROUP, {
      params: { login },
    });
    const accessGroup = data.message?.access_group || [];

    dispatch(setAccessGroup(accessGroup));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addContact = async (values: AddContact) => {
  try {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      type: values.type,
      description: values.description,
    };

    const response = await axios.post(endpoints.CONTACT, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.con_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const updateOpty = async (values: UpdateOpty) => {
  try {
    const payload = {
      optyId: values.optyId,
      PaymentDate: values?.PaymentDate,
      Comment: values?.Comment,
      PayPhone: values?.PayPhone,
    };

    const response = await axios.post(endpoints.UPDATE_OPTY, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.con_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};
