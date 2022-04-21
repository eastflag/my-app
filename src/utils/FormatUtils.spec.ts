import {
  getImagePath,
  getLocalDatetime,
  getNumberFormat,
  getNumberToFixed,
  shorten,
  toDateFormat,
  toPascalCase,
} from './FormatUtils';

describe('FormatUtils', () => {
  describe('toDateFormat', () => {
    it('convert yyyyMMdd format to date format with divider', () => {
      expect(toDateFormat('2021', '/')).toEqual('');
      expect(toDateFormat('20210930', '/')).toEqual('2021/09/30');
      expect(toDateFormat('20210930', '-')).toEqual('2021-09-30');
      expect(toDateFormat('20210930', '.')).toEqual('2021.09.30');
    });
  });

  describe('toPascalCase', () => {
    it('convert other format to pascal case', () => {
      const result = 'Double-Barrel';
      expect(toPascalCase('double-barrel')).toEqual(result);
      expect(toPascalCase('DOUBLE-BARREL')).toEqual(result);
      expect(toPascalCase('DoUbLE-BaRRel')).toEqual(result);
    });
  });

  describe('getImagePath', () => {
    it('return image path', () => {
      expect(getImagePath('folder', 'name', 'jpg')).toEqual('/images/folder/name.jpg');
    });
  });

  describe('getLocalDatetime', () => {
    it('return local datetime', () => {
      expect(getLocalDatetime('2022-03-29T10:59:08Z', 'toSecond')).toEqual('2022-03-29 10:59:08');
      expect(getLocalDatetime('2022-03-29T10:59:08Z', 'toHour')).toEqual('2022-03-29 10');
      expect(getLocalDatetime('2022-03-29T10:59:08Z', 'toMinute')).toEqual('2022-03-29 10:59');
      expect(getLocalDatetime('2022-03-29T10:59:08Z', 'toDate')).toEqual('2022-03-29');
    });
  });

  describe('shorten', () => {
    it('return shortened string', () => {
      expect(shorten('0x884a98d7564deFB4D1f2E60bd7Ab231d0227CAe5')).toEqual('0x884a...CAe5');
      expect(shorten('0x884a2asdfasdfasdfas7CAab')).toEqual('0x884a...aaaa');
      expect(shorten('0x884a27CAeaaaaaaa')).toEqual('0x884a...aaaa');
      expect(shorten('0x884a27CAe5')).toEqual('0x884a...CAe5');
      expect(shorten('0x884aCAe5')).toEqual('0x884aCAe5');
      expect(shorten('0x884a')).toEqual('0x884a');
    });
  });

  describe('getNumberFormat', () => {
    it('return number format', () => {
      expect(getNumberFormat(1000000)).toEqual('1,000,000');
    });
  });

  describe('getNumberToFixed', () => {
    it('return fixed number with ceil', () => {
      expect(getNumberToFixed(1234.1233, 3, 'ceil')).toEqual(1234.124);
    });

    it('return fixed number with floor', () => {
      expect(getNumberToFixed(1234.1236, 3, 'floor')).toEqual(1234.123);
    });

    it('return fixed number with round', () => {
      expect(getNumberToFixed(1234.1235, 3, 'round')).toEqual(1234.124);
    });
  });
});
