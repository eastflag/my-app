import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const toDateFormat = (yyyyMMdd: string, divider: string) => {
  if (yyyyMMdd.length !== 8) return '';

  const year = yyyyMMdd.substring(0, 4);
  const month = yyyyMMdd.substring(4, 6);
  const day = yyyyMMdd.substring(6, 8);

  return year + divider + month + divider + day;
};

export const toPascalCase = (value: string) => {
  return value.replace(/\w+/g, function (w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  });
};

export const getImagePath = (folderPath: string, fileName: string, extension: string): string => {
  return '/images/' + folderPath + '/' + fileName + '.' + extension;
};

export const getLocalDatetime = (utcData: string, showType: 'toDate' | 'toHour' | 'toMinute' | 'toSecond') => {
  // TODO: sysadmin에서는 dayjs(utcData).locale('ko');을 사용하므로, env에 따라 구현 필요?
  const datetimeInfo = dayjs(utcData).utc();
  if (showType === 'toDate') {
    return datetimeInfo.format('YYYY-MM-DD');
  } else if (showType === 'toHour') {
    return datetimeInfo.format('YYYY-MM-DD HH');
  } else if (showType === 'toMinute') {
    return datetimeInfo.format('YYYY-MM-DD HH:mm');
  } else {
    return datetimeInfo.format('YYYY-MM-DD HH:mm:ss');
  }
};

export const getNumberFormat = (input: number) => {
  const parts = input.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const getNumberToFixed = (input: number, fractionDigits: number, method: 'round' | 'ceil' | 'floor') => {
  let result = input;

  result *= Math.pow(10, fractionDigits);
  switch (method) {
    case 'round':
      result = Math.round(result);
      break;
    case 'ceil':
      result = Math.ceil(result);
      break;
    case 'floor':
      result = Math.floor(result);
      break;
  }
  result /= Math.pow(10, fractionDigits);

  return result;
};

export const shorten = (str: string) => {
  if (str.length <= 8) return str;
  return str.substring(0, 4) + '...' + str.substring(str.length - 4);
};
