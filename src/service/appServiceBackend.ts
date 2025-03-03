import { setOpportunity } from "../slices/opportunitySlice.ts";
import { setQuote } from "../slices/quoteSlice.ts"
import { setContact } from "../slices/contactSlice.ts"
import { AppDispatch } from "../store.ts";
import { AddOpportunuty } from "../components/AddOpportunityModal.tsx";

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
        const optyDate = values.optyDate;
        const payDate = values.paymentDate;
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
                "optyDate": `${optyDate['$D']}/${optyDate['$M']}/${optyDate['$y']}`,
                "paymentDate": `${payDate['$D']}/${payDate['$M']}/${payDate['$y']}`,
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