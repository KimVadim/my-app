import { setOpportunity } from "../slices/opportunitySlice.ts";
import { setQuote } from "../slices/quoteSlice.ts"
import { setContact } from "../slices/contactSlice.ts"
import { AppDispatch } from "../store.ts";
import { AddOpportunuty } from "../components/AddOpportunityModal.tsx";
import { AddPayment } from "../components/AddPaymentModal.tsx";
import dayjs from "dayjs";
import { AddExpense } from "../components/AddExpenseModal.tsx";

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
                "status": "Заехал",
                "apartNum": values.apartNum,
                "product": values.product,
                "stage": "Заключили",
                "amount": 170000,
                "createBy": "newApp",
                "optyDate": dayjs(values.optyDate).format("MM/DD/YYYY"),
                "paymentDate": dayjs(values.paymentDate).format("MM/DD/YYYY"),
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
                "product": "Prod_1",
                "paymentType": values.paymentType,
                "amount": values.amount,
                "createBy": "vkim",
                "paymentDate": dayjs().format("MM/DD/YYYY")
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
                "amount": values.amount,
                "createBy": "vkim",
                "expenseDate": dayjs().format("MM/DD/YYYY"),
                "comment": values.comment,
                "apartNum": values.apartNum,
                "invoice": ""
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