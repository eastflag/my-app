import {
  FileType,
  getExtension,
  getFileDirectoryByUrl,
  getFileSizeByteToMb,
  getFileTypeFromExtenstion,
} from './FileUtils';

describe('FileUtils', () => {
  describe('getExtension', () => {
    it('return ext from filename', () => {
      const result = getExtension('filename.txt');
      expect(result).toBe('txt');
    });
    it('return "" from wrong filename', () => {
      const result = getExtension('filename');
      expect(result).toBe('');
    });
  });

  describe('getFileSizeByteToMb', () => {
    it('return correct Mb', () => {
      const result = getFileSizeByteToMb(1024 * 1024);

      expect(result).toEqual(1);
    });
  });

  describe('getFileDirectoryByUrl', () => {
    it('return file directory', () => {
      const result = getFileDirectoryByUrl(
        'https://s3-an2-dev-naemo-private.s3.ap-northeast-2.amazonaws.com/preSignedUrl:mediaUrl/file.jpg'
      );

      expect(result).toEqual('preSignedUrl:mediaUrl/file.jpg');
    });

    it('return "" undefined input', () => {
      const result = getFileDirectoryByUrl(undefined);

      expect(result).toEqual('');
    });
    it('return "" short(1 length) input', () => {
      const result = getFileDirectoryByUrl('a');

      expect(result).toEqual('');
    });
  });

  describe('getFileTypeFromExtenstion', () => {
    it('get IMAGE type', () => {
      const result = getFileTypeFromExtenstion('file.jpg');

      expect(result).toBe(FileType.IMAGE);
    });
    it('get VIDEO type', () => {
      const result = getFileTypeFromExtenstion('file.mp4');

      expect(result).toBe(FileType.VIDEO);
    });
    it('get AUDIO type', () => {
      const result = getFileTypeFromExtenstion('file.mp3');

      expect(result).toBe(FileType.AUDIO);
    });
    it('get empty string', () => {
      const result = getFileTypeFromExtenstion('file.txt');

      expect(result).toBe('');
    });
  });
});
