import { Toast } from 'native-base';

export const _toast = (message: string, type: any = 'danger') => {
  Toast.show({
    text: message,
    duration: 3000,
    type: type,
  });
};
