import { NotificationType } from "../constants/appConstant";
import { NotificationInstance } from "antd/es/notification/interface";

export const formatPhoneNumber = (phone: String) => {
    if (!phone) return "";
    return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
};

export const openNotification = (
        api: NotificationInstance,
        type: NotificationType,
        message: string,
        description?: string,
    ) => {
    api[type]({
        message,
        duration: 2,
        description,
    });
};