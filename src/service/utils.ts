import { NotificationType } from '../constants/appConstant';
import { NotificationInstance } from 'antd/es/notification/interface';

export const formatPhoneNumber = (phone: String) => {
  if (!phone) return '';
  return phone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
};

export const openNotification = (
  api: NotificationInstance,
  type: NotificationType,
  message: string,
  description?: string
) => {
  api[type]({
    message,
    duration: 2,
    description,
  });
};

export const formattedPhone = (phone: string) => {
  let value = phone.replace(/\D/g, '');

  if (value.startsWith('7') || value.startsWith('8')) {
    if (value.length > 1) {
      value = '7' + value.substring(1);
    } else {
      value = '7';
    }
  } else if (value.length > 0) {
    value = '7' + value;
  }

  let formattedPhone = '+7';
  if (value.length > 1) {
    formattedPhone += ' (' + value.substring(1, 4);
  }
  if (value.length >= 5) {
    formattedPhone += ') ' + value.substring(4, 7);
  }
  if (value.length >= 8) {
    formattedPhone += '-' + value.substring(7, 9);
  }
  if (value.length >= 10) {
    formattedPhone += '-' + value.substring(9, 11);
  }

  return formattedPhone.substring(0, 18);
};
