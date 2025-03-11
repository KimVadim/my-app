import { setOpportunity } from "../slices/opportunitySlice.ts";
import { setQuote } from "../slices/quoteSlice.ts"
import { setContact } from "../slices/contactSlice.ts"
import { AppDispatch } from "../store.ts";
import dayjs from "dayjs";
import { AddExpense, AddOpportunuty, AddPayment, FieldFormat, Stage, Status } from "../constants/appConstant.ts";
import { Product } from "../constants/dictionaries.ts";

export const getSheetData = async (dispatch: AppDispatch) => {
    try {
        const response = await fetch("https://palvenko-production.up.railway.app/sheet_data", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }

        const data = await response.json();
        const opportunities = data.message?.opportunity || [];
        const contact = data.message?.contact || [];
        const quote = data.message?.quotes || [];

        dispatch(setOpportunity(opportunities));
        dispatch(setQuote(quote));
        dispatch(setContact(contact));
    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
};

export const addOpty = async (values: AddOpportunuty) => {
    try {
        const response = await fetch("https://palvenko-production.up.railway.app/opty", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify({
                "firstName": values.firstName,
                "lastName": values.lastName,
                "phone": values.phone,
                "status": Status.Enter,
                "apartNum": values.apartNum,
                "product": values.product,
                "stage": Stage.Signed,
                "amount": Product.RentAmount,
                "createBy": "newApp",
                "optyDate": dayjs(values.optyDate).format(FieldFormat.DateEN),
                "paymentDate": dayjs(values.paymentDate).format(FieldFormat.DateEN),
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }

        return await response.json(); // Возвращаем ответ сервера

    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
};

export const loginUser = async (login: string, password: string) => {
    try {
        const response = await fetch("https://palvenko-production.up.railway.app/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify({
                "login": login,
                "password": password,
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        return data; // Возвращаем ответ сервера

    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
};

export const addPayment = async (values: AddPayment) => {
    try {
        const response = await fetch("https://palvenko-production.up.railway.app/payment", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify({
                "optyId": values.optyId,
                "conId": values.conId,
                "product": values.product,
                "paymentType": values.paymentType,
                "amount": values.amount,
                "createBy": "vkim",
                "paymentDate": dayjs().format(FieldFormat.DateEN)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
};

export const addExpense = async (values: AddExpense) => {
    try {
        const response = await fetch("https://palvenko-production.up.railway.app/expense", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify({
                "optyId": values.optyId,
                "expenseType": values.expenseType,
                "paymentType": values.paymentType,
                "amount": ['Комм. Алатау', 'Возврат', 'Расход', 'Зарплата', 'Комм. Павленко'].includes(values.expenseType) 
                    ? -values.amount 
                    : values.amount,
                "createBy": "vkim",
                "expenseDate": dayjs().format(FieldFormat.DateEN),
                "comment": values.comment,
                "apartNum": values.apartNum,
                "invoice": values.expenseType === 'Комм. Алатау'
                    ? 'Выставить Комм'
                    : ''
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}, Ответ: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
};